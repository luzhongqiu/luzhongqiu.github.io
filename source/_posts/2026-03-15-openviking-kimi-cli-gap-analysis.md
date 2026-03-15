---
title: OpenViking 有 5 个能力，kimi-cli 一个都没用上
date: 2026-03-15 23:30:00
categories:
  - AI
tags:
  - OpenViking
  - kimi-cli
  - Agent
  - 记忆系统
  - 上下文管理
---

在前两篇文章里，我分别介绍了 OpenViking 和 GitAgent 的定位，以及如何用 kimi-cli 的 `kaos` 抽象层 + OpenViking 来解决多用户文件系统隔离的问题。但那篇文章聚焦的是文件系统——OpenViking 其实不只是个存文件的地方，它的核心是一套完整的 **Agent 上下文操作系统**，包含记忆、资源、技能三大维度。

这篇来聊一个更有意思的问题：**OpenViking 那些真正核心的能力，kimi-cli 目前完全没有。**

---

## 先看 kimi-cli 的"大脑"现在存了什么

翻了一下 kimi-cli 的 `session.py` 和 `session_state.py`，它的持久化状态其实非常简单：

```python
# session_state.py —— kimi-cli 持久化的全部内容
class SessionState(BaseModel):
    approval: ApprovalStateData      # 用户批准设置（yolo 模式等）
    dynamic_subagents: list[...]     # 动态子 Agent 列表
    additional_dirs: list[str]       # 额外工作目录
    plan_mode: bool                  # 是否开启计划模式
```

然后 session 目录里还有两个文件：
- `context.jsonl` — 原始对话消息流水账
- `wire.jsonl` — wire 协议日志

**就这些。**

换个 session，上下文全部归零。用户上次说"我们项目只用 uv 不用 pip"，下次开新 session，Agent 完全不记得。Agent 上次花了 20 分钟 debug 出来的项目配置问题，经验全部蒸发。

这就是 kimi-cli 目前的"记忆"——一本流水账日记，没有任何提炼，没有跨 session 沉淀。

---

## OpenViking 的上下文体系是三个维度

对比一下 OpenViking 的 `viking://` 虚拟文件系统结构：

```
viking://
├── resources/              # 知识资源：项目文档、代码库、网页等
│   └── my_project/
│       ├── .abstract       # L0：一句话摘要（~100 tokens）
│       ├── .overview       # L1：结构概览（~2K tokens）
│       └── src/            # L2：完整内容，按需加载
│           └── auth.md
│
├── user/                   # 用户维度：偏好、习惯
│   └── memories/
│       ├── preferences/    # "我喜欢 TypeScript 不喜欢 JavaScript"
│       └── coding_habits/  # "我习惯先写测试再写实现"
│
└── agent/                  # Agent 维度：技能、任务记忆、行为规则
    ├── skills/
    │   ├── search_code     # "如何在这个项目里找代码"的经验
    │   └── debug_pattern   # "这个项目的调试套路"
    ├── memories/           # 任务执行经验
    └── instructions/       # Agent 自己的行为规则
```

这三个维度，kimi-cli 对应的状态分别是：`resources` → 靠 GlobFiles/GrepFiles 临时扫；`user` → 无；`agent/skills` → 静态预置 Markdown，不会自更新。

差距很大。逐个拆开来看：

---

## Gap 1：跨 Session 的用户记忆

**OpenViking 有**：`viking://user/memories/preferences/`、`viking://user/memories/coding_habits/`

**kimi-cli 没有**：每次 session 都是白板，用户的偏好、习惯、历史指令全部要重新告诉 Agent。

**接入后能得到什么**：用户说一次"我用 Python 3.12 + uv，项目结构是 src layout"，Agent 永久记住，下次直接用，不用重复交代。用过 Cursor 的人都知道 `.cursorrules` 有多重要——这相当于 `.cursorrules` 的动态版本，而且是跨项目的。

---

## Gap 2：会话结束后的记忆蒸馏

**OpenViking 有**：`memcommit` 机制——session 结束时异步分析整段对话，提炼：
- 用户偏好的变化
- Agent 成功解决问题的方法（"这个项目的 pytest 需要加 `--asyncio-mode=auto`"）
- 失败路径（"不要用 `requests`，这个项目用 `httpx`"）
- 自动写入 `viking://user/memories/` 和 `viking://agent/memories/`

**kimi-cli 没有**：session 结束，`context.jsonl` 就躺在那里，没有任何后处理。

**接入后能得到什么**：Agent 越用越聪明。第一次帮你 debug 一个复杂的异步并发问题，经验沉淀；第二次遇到类似问题，Agent 直接调取上次的解决思路，不用从零摸索。这是 kimi-cli 目前最大的缺失——它只有工作记录，没有经验积累。

---

## Gap 3：知识库语义检索

**OpenViking 有**：`add_resource` 对文档做全自动处理：
1. 按语义切分（不是简单 chunk）
2. 生成 L0/L1/L2 三层摘要
3. 向量化 + 目录索引双轨并行
4. 检索时：先定位目录 → 再精细向量搜索 → 返回命中片段 + 检索轨迹

**kimi-cli 有**：`GlobFiles`（按路径 glob）、`GrepFiles`（按关键词 grep）

**差距**：问"这个项目里认证逻辑在哪里实现的？"——kimi-cli 只能靠 grep 找关键词 `auth`，然后让 LLM 自己去读相关文件猜；OpenViking 可以语义理解这个问题，定位到 `src/middleware/jwt_verify.py:L23` 并给出相关上下文。对大型代码库来说，这个差距极其显著。

---

## Gap 4：动态技能积累

**OpenViking 有**：`viking://agent/skills/` 是可写入的。Agent 每次成功完成一类任务，可以把"这类任务的最佳做法"写回 skill 库，下次遇到类似任务直接复用。

**kimi-cli 有**：`src/kimi_cli/skill/` 里是开发者预置的静态 Markdown 文件，描述 Agent 该怎么处理特定场景。这些文件不会动态更新，也不会随着使用积累新内容。

**差距**：kimi-cli 的 skill 是"出厂预置"，用多少年都是这样；OpenViking 的 skill 是"边用边学"，每次成功的任务都是一次 skill 更新的机会。

---

## Gap 5：可观测的检索轨迹

**OpenViking 有**：每次检索都记录完整路径——"先找了 `viking://resources/myproject/src/`，下钻到 `auth/`，向量搜索命中 `jwt.py` 的第 42-89 行，最终加载了这 48 行"。

**kimi-cli 没有**：Agent 为什么读了 `auth.py` 而不是 `middleware.py`？你只能从对话消息里猜，没有结构化的检索记录。调试 Agent 行为的时候，这个差距特别痛苦。

---

## 最近的接入路径

好消息是 OpenViking 官方已经做了一个 [OpenCode memory plugin](https://github.com/volcengine/OpenViking/tree/main/examples/opencode-memory-plugin)，暴露了 4 个工具：

| 工具 | 作用 |
|------|------|
| `memsearch` | 跨 memories/resources/skills 统一语义搜索 |
| `memread` | 按 `viking://` URI 读取内容，支持 L0/L1/L2 层级 |
| `membrowse` | 浏览 viking:// 文件系统结构（list/tree/stat） |
| `memcommit` | 触发当前 session 的记忆蒸馏提炼 |

这个 plugin 是给 OpenCode 做的，但架构是通用的——通过 MCP 协议把这 4 个工具注入到 Agent。kimi-cli 同样支持 MCP，**直接接这个 plugin 就能补上前 3 个 gap**（语义搜索、知识库、可观测轨迹）。

对于 Gap 2（记忆蒸馏）和 Gap 4（技能积累），需要在 session 结束时额外调用 `memcommit`——在 kimi-cli 的 session cleanup 流程里加一行触发即可。

---

## 一张表总结

| OpenViking 能力 | kimi-cli 现状 | 差距严重性 | 接入难度 |
|----------------|-------------|----------|--------|
| 跨 session 用户记忆 | ❌ 每次白板 | 🔴 高 | MCP 接入 |
| 会话记忆蒸馏 | ❌ 无提炼 | 🔴 高 | session 结束触发 memcommit |
| 知识库语义检索 | ⚠️ 仅字面 grep | 🟠 中 | MCP 接入 memsearch |
| 动态技能积累 | ⚠️ 静态预置 | 🟠 中 | memcommit + skill 写入 |
| 可观测检索轨迹 | ❌ 黑盒 | 🟡 低 | MCP 接入自带 |

---

## 结语

kimi-cli 是一个很好的 Coding Agent，工具设计很扎实（`kaos` 抽象、`multiagent` 协作、`plan` 模式），但它现在的"记忆"基本上是一张白纸——每次对话结束，Agent 就回到原点。

OpenViking 补的正好是这个缺口：它不是来替代 kimi-cli 的工具层，而是给 kimi-cli 装上一个**会学习、会积累、会检索**的长期大脑。

两者结合的完整图景：

```
kimi-cli（执行层）
├── kaos → OpenVikingKaos（文件系统隔离，上篇文章讲的）
└── MCP tools → OpenViking Memory Plugin
    ├── memsearch   # Agent 需要信息时，先查知识库
    ├── memread     # 精确读取某条记忆/技能
    ├── membrowse   # 浏览知识结构
    └── memcommit   # session 结束时，沉淀经验
         ↓
    OpenViking Server（上下文数据库）
    ├── viking://user/memories/     # 用户长期偏好
    ├── viking://agent/memories/    # 任务执行经验
    ├── viking://agent/skills/      # 技能积累
    └── viking://resources/         # 知识库（代码、文档）
```

文件系统隔离解决的是"不同用户的数据不互相污染"；记忆/技能/蒸馏解决的是"同一个用户的 Agent 越用越好用"。两件事都重要，缺一不可。

---

**系列文章**：
- [调研了两个 AI Agent 上下文管理项目：OpenViking 和 GitAgent](/2026/03/15/openviking-vs-gitagent/)
- [从 kaos 到 OpenViking：云多用户 Agent 系统的文件系统隔离方案](/2026/03/15/kaos-openviking-filesystem-isolation/)
