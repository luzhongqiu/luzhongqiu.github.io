---
title: OpenViking、GitAgent 与 kimi-cli：一次关于云端 Agent 上下文管理的深度调研
date: 2026-03-15 22:00:00
categories:
  - AI
tags:
  - OpenViking
  - GitAgent
  - kimi-cli
  - Agent
  - 多租户架构
  - 上下文管理
---

给 AI Agent 接了个开源的上下文数据库之后，任务完成率提升了 43%，同时 token 消耗降低了 91%。不是大模型升级，不是 prompt 优化，只是换了个存储方式。

这个数据来自字节跳动开源项目 OpenViking 的 README。最近在搭一个多用户云端 AI 助手平台，一直在纠结怎么解决三个核心问题：每个用户的上下文怎么完全隔离、怎么让 Agent 记住用户的偏好、怎么把几千字的对话历史压到合理的 token 数量。今天挖了一整天 GitHub 和源码，挖到了两个宝贝项目，还从一个不起眼的工具里抠出了一个绝妙的架构方案。这篇文章把所有研究成果整合在一起。

---

## 一、两个项目：解决的根本不是同一个问题

先看一张对比表，把两个项目的定位说清楚：

| 维度 | OpenViking | GitAgent |
|------|-----------|---------|
| 本质是什么 | 上下文数据库（运行时基础设施） | Agent 定义规范（格式标准） |
| 类比 | MySQL / PostgreSQL | Dockerfile |
| 解决什么痛 | token 爆炸、RAG 黑盒、记忆碎片化 | 框架锁定、无版本控制、Prompt 散落各处 |
| 有没有 Server | ✅ FastAPI HTTP Server | ❌ 仅 CLI 工具 |
| 多租户 / 用户隔离 | ✅ 三级隔离，设计完整 | ❌ 需自己实现 |
| 语义检索 | ✅ L0/L1/L2 + 向量 + 目录递归 | ❌ 无，靠 LLM 读 markdown |
| 框架可移植 | ❌ 绑定 OpenViking 生态 | ✅ Claude/OpenAI/CrewAI 等 |
| 版本控制 Agent 行为 | ❌ 无内建支持 | ✅ git 天然支持 |
| 成熟度 | ⭐ 11K stars，v0.2.6，60 贡献者，字节背书 | ⭐ 145 stars，v0.1.7，3 周前发布 |
| 能不能用于生产 | 🟡 核心可用，多租户实施中 | 🔴 极早期，不建议 |

一句话总结：**OpenViking 是数据库，GitAgent 是 Dockerfile。** 不是竞争关系，是互补关系。

### OpenViking：把 Agent 的一切都变成"文件系统"

OpenViking（字节跳动，Apache 2.0）最厉害的不是它是个数据库，而是它的核心设计思路：**文件系统范式**。

我们平时管理文件用路径，比如 `/Users/nic/Documents/project/README.md`。OpenViking 说，Agent 的记忆、资源、技能，为什么不能也用路径来管理？于是它定义了一套 `viking://` URI 规范：

```
viking://
├── resources/          # 知识资源（项目文档、代码库、网页）
│   └── my_project/
│       ├── .abstract   # L0：一句话摘要（~100 tokens）
│       ├── .overview   # L1：结构概览（~2K tokens）
│       └── src/        # L2：完整内容，按需加载
├── user/               # 用户维度：偏好、习惯
│   └── memories/
│       ├── preferences/    # "我喜欢 TypeScript"
│       └── coding_habits/  # "我习惯先写测试"
└── agent/              # Agent 维度：技能、任务记忆
    ├── skills/
    │   └── debug_pattern   # "这个项目的调试套路"
    └── memories/           # 任务执行经验
```

这个设计聪明在哪里？文件系统是每个人都刻在 DNA 里的抽象，不用学新的 API，不用记复杂的数据结构，就像操作本地文件一样管理 Agent 的全部上下文。

它还顺手解决了几个 Agent 领域的老大难：

**Token 爆炸**：L0/L1/L2 分层加载。L0 是一句话摘要（~100 tokens），每次都带；L1 是结构概览（~2K tokens），按需加载；L2 是完整内容，只有真的需要深读才加载。把一个 100 多页的项目文档扔进去，问问题时只加载最相关的几段，token 消耗大幅下降。

**RAG 黑盒**：可观测检索轨迹。每次检索都记录完整路径——先找了哪个目录、下钻到哪里、向量搜索命中了哪几行——一清二楚，调试 Agent 行为再也不抓瞎。

**自进化**：用得越多越聪明。Agent 的每次成功经验会自动蒸馏沉淀回记忆库，下次遇到类似任务直接复用。

部署也很简单：`pip install openviking`，启动 FastAPI HTTP Server，跟着文档走就能跑通一个带记忆的对话 Agent。

### GitAgent：Git Repo 就是 Agent 的定义

GitAgent（Lyzr 团队，MIT，3 周前发布）的核心是"Git Repo 即 Agent 定义"。怎么定义一个 Agent？只要三个文件：

- `agent.yaml`：基础配置（用什么模型、挂什么技能）
- `SOUL.md`：Agent 的灵魂——人设、目标、约束，相当于 System Prompt
- `SKILL.md`：技能定义，放在 `skills/` 子目录下，每个技能模块化管理

把这三个文件往 Git 仓库里一推，你直接获得了一堆免费的能力：

- **版本回滚**：Agent 改坏了？`git reset` 回上一个版本，就像回退代码
- **分支部署**：`dev → staging → main` 环境晋升，跟发布软件一模一样
- **PR 人工审核**：修改 SOUL 或 SKILL 时提交 PR，人工审核后才合并，避免"教坏"Agent
- **审计追踪**：`git blame` 一看就知道谁改了什么、什么时候改的

而且它是**框架无关**的，定义一次，导出到 Claude Code、OpenAI、CrewAI、LangChain 等各框架运行。

不过它现在只是规范加 CLI，没有自己的运行时和数据库，目前不适合用于生产。

---

## 二、效果数据：换个存储方式能有多大差距？

OpenViking README 里有一组 OpenClaw 实验数据，非常有说服力：

| 对比组 | 任务完成率 | Input Tokens | vs 原始 |
|--------|-----------|-------------|--------|
| 原始 OpenClaw | 35.65% | 24,611,530 | 基准 |
| + LanceDB | 44.55% | 51,574,530 | +25% 任务，但 **token 翻倍** |
| + OpenViking（有 native memory） | **51.23%** | **2,099,622** | **+43% 任务，-91% token** |
| + OpenViking（无 native memory） | **52.08%** | **4,264,396** | **+46% 任务，-83% token** |

LanceDB 的做法是"加更多 context"——把所有相关文件都塞进 Prompt，效果提升有限且成本暴增。

OpenViking 的做法是"更聪明地管理 context"——分层加载 + 语义检索，只把最相关的信息放进 Prompt，效果更好，成本反而大降。

这才是正确的方向。

---

## 三、从 kimi-cli 源码里挖出的架构方案

背景：我想做一个云端 AI 助手平台，每个用户有自己的 Agent，三个难题：隔离、持久化、规模化。

在研究 kimi-cli（月之暗面，7.2K stars）源码时，在 `packages/kaos/` 里发现了一个绝妙的设计。

### kimi-cli 的 kaos 抽象层

`kaos` 是一个**操作系统抽象层**，定义了 `Kaos` Protocol：

```python
class Kaos(Protocol):
    async def readtext(self, path: str, ...) -> str: ...
    async def writetext(self, path: str, data: str, ...) -> int: ...
    async def readbytes(self, path: str, ...) -> bytes: ...
    async def writebytes(self, path: str, data: bytes, ...) -> int: ...
    async def mkdir(self, path: str, ...) -> None: ...
    async def iterdir(self, path: str, ...) -> AsyncGenerator: ...
    async def glob(self, path: str, pattern: str, ...) -> AsyncGenerator: ...
    async def stat(self, path: str, ...) -> StatResult: ...
    async def chdir(self, path: str) -> None: ...
    async def exec(self, *args: str, ...) -> KaosProcess: ...
```

关键是它用 Python 的 **`ContextVar`** 来注入当前实现：

```python
# _current.py
current_kaos = ContextVar[Kaos]("current_kaos", default=local_kaos)
```

完整调用链：

```
Agent LLM → ReadFile tool → KaosPath.read_lines()
  → get_current_kaos().readlines(path)
    → LocalKaos.readlines()（默认，直接读本地磁盘）
```

`get_current_kaos()` 这里，就是我们的切入点。

### OpenVikingKaos：把文件操作路由到 OpenViking

自定义一个 `OpenVikingKaos` 类，实现 Kaos Protocol，把所有文件操作路由到 OpenViking：

```python
class OpenVikingKaos:
    name = "openviking"

    def __init__(self, ov_client, user_id: str, agent_id: str):
        self._ov = ov_client  # 已持有 user_key，天然隔离

    def _to_uri(self, path: str) -> str:
        # Agent 以为在写 "/workspace/src/main.py"
        # 实际存到用户自己的命名空间：
        #   viking://resources/workspace/src/main.py
        return f"viking://resources/{str(path).lstrip('/')}"

    async def readtext(self, path, encoding="utf-8", **kwargs) -> str:
        return (await self._ov.read(self._to_uri(path))).decode(encoding)

    async def writetext(self, path, data, **kwargs) -> int:
        await self._ov.write(self._to_uri(path), data.encode())
        return len(data)

    async def exec(self, *args, **kwargs) -> KaosProcess:
        # 严格模式：禁止执行 shell 命令，消除逃逸风险
        raise PermissionError("exec disabled in isolated mode")
```

每次用户请求进来时注入：

```python
async def handle_user_request(user_key, request):
    user_kaos = OpenVikingKaos(ov_client_with_user_key, user_id, agent_id)
    token = set_current_kaos(user_kaos)  # 注入到当前协程上下文
    try:
        return await run_agent_session(request)
    finally:
        reset_current_kaos(token)  # 协程结束清理
```

### 为什么 ContextVar 是点睛之笔

同一进程里有 1000 个并发协程，每个处理一个用户的请求：

- 全局变量 → 必然串号
- 加锁 → 性能差
- **ContextVar → 协程本地存储**，每个协程有独立的 `current_kaos`，无锁无竞态

1000 个用户，同一个进程，完全隔离，不需要容器。

### 完整架构图

```
用户请求层（Web / API / CLI）
          │
          ▼
会话管理 + ContextVar 注入层
（每个协程独立绑定 OpenVikingKaos(user_key)）
          │
          ▼
    Agent 运行时层
    （LLM 调用 + Tool 调用）
          │
          ▼
    Kaos Protocol 抽象层
    （统一文件系统接口）
       ┌──┴──┐
       ▼     ▼
  LocalKaos  OpenVikingKaos
  （本地）   （路由到 OpenViking）
                  │
                  ▼
         OpenViking Server
         account/user/agent 三级隔离
         语义检索 + 分层加载
```

文件读写（ReadFile/WriteFile/GlobFiles/mkdir）全部隔离。唯一的逃逸点是 `exec()`——执行 shell 命令时会绕过 Kaos 层。严格模式直接禁用；如果必须支持，路由到独立容器即可。

---

## 四、kimi-cli 没用上 OpenViking 的 5 个核心能力

读了 kimi-cli 的 `session.py` 和 `session_state.py` 源码，发现它的"记忆"就是：**原始对话 `context.jsonl` + 4 个布尔值**。换个 session 全忘光，无任何语义处理。

| 能力 | kimi-cli 现状 | 接入 OpenViking 后 | 改造难度 |
|------|-------------|-----------------|--------|
| 跨 session 用户记忆 | ❌ 每次白板，偏好重复交代 | ✅ `viking://user/memories/` 永久记忆 | 低（MCP 接入） |
| 会话经验蒸馏 | ❌ 原始对话流水账，换 session 全忘 | ✅ `memcommit` 自动提炼精华 | 低（session 结束触发） |
| 知识库语义检索 | ⚠️ grep 关键词，靠 LLM 猜文件位置 | ✅ 语义定位到具体代码行 | 低（MCP 接入） |
| 动态技能积累 | ⚠️ 静态预置 Markdown，不自更新 | ✅ 边用边学，写回 skill 库 | 中 |
| 检索可观测性 | ❌ RAG 黑盒，不知道读了什么 | ✅ 完整检索路径记录 | 低（接入自带） |

逐个展开：

**Gap 1：跨 Session 用户记忆**

kimi-cli 这次说"我只用 uv"，下次再问"怎么安装依赖"，它又推荐 pip。用户每次都要重新交代偏好。

OpenViking 有 `viking://user/memories/`，说一次永久记住。相当于动态版的 `.cursorrules`，而且跨项目生效。

**Gap 2：会话记忆蒸馏**

kimi-cli 的记忆是原始对话流水账，几千字的历史每次都要全喂给 LLM，既浪费 token，又容易让模型分心。

OpenViking 的 `memcommit` 在 session 结束时异步分析整段对话，从一次 debug 对话里提炼出"认证逻辑在 `jwt_verify.py:L23`，测试时记得 mock token"这一句精华，下次直接用这一句，不是几千字的完整记录。

**Gap 3：知识库语义检索**

kimi-cli 找文件靠 grep，你得记得文件名或关键词。说"帮我看看认证逻辑在哪"，可能搜不到。

OpenViking 的 `add_resource` 对文档做语义分析和向量化索引，递归检索策略——先定位目录，再精细向量搜索——能直接定位到 `src/middleware/jwt_verify.py:L23`。对大型代码库来说，这个差距极其显著。

**Gap 4：动态技能积累**

kimi-cli 的 `skills/` 是开发者预置的静态 Markdown，出厂是什么样就是什么样，不会自我更新。

OpenViking 的 `viking://agent/skills/` 可以写入。Agent 成功完成一类任务后，把"最佳做法"写回 skill 库，下次遇到类似任务直接复用。一个越用越聪明的 Agent，和一个永远从零开始的 Agent，体验差距不用多说。

**Gap 5：可观测检索轨迹**

kimi-cli 的 RAG 完全黑盒——Agent 为什么给了这个答案？读了哪些文件？你只能从对话消息里猜。出了问题没法 debug。

OpenViking 记录每次检索的完整路径：先找了哪个目录 → 下钻到哪里 → 向量搜索命中哪几行 → 最终加载了哪些内容。一清二楚。

**接入路径**

OpenViking 官方已经做了 OpenCode memory plugin，暴露 4 个工具：

| 工具 | 作用 |
|------|------|
| `memsearch` | 跨 memories/resources/skills 统一语义搜索 |
| `memread` | 按 `viking://` URI 读取内容，支持 L0/L1/L2 层级 |
| `membrowse` | 浏览 viking:// 文件系统结构 |
| `memcommit` | 触发当前 session 的记忆蒸馏 |

kimi-cli 支持 MCP，直接把这 4 个工具接进去就能补上前 3 个 gap。Gap 2（蒸馏）和 Gap 4（技能积累）需要在 session cleanup 流程里额外触发 `memcommit`，改动很小。

---

## 五、总结：三条具体建议

挖了一天，给三个 actionable 的建议：

**1. 在做 Coding Agent 或 AI 助手类产品？**
→ OpenViking 值得现在就接进去。文件系统范式解决了 token 爆炸、RAG 黑盒、记忆碎片化三个核心痛点，11K stars 相对成熟，通过 MCP 接入改造成本很低。实测任务完成率 +43%，token -91%。

**2. 在做 Agent 定义 / 分发 / 多框架支持？**
→ 关注 GitAgent，思路有价值但等它再成熟。"Git Repo 即 Agent 定义"的思路非常好，但现在只有规范加 CLI，没有运行时，不建议用于生产。

**3. 在做云端多用户 Agent 系统？**
→ `kimi-cli kaos` + `OpenVikingKaos` + `ContextVar` 这套方案可以直接参考。用 ContextVar 解决同一进程内多用户隔离，无锁无竞态，1000 个并发用户同一进程，数据完全隔离。

两个项目的组合图景是这样的：用 GitAgent 定义 Agent 的灵魂和技能（`SOUL.md`、`SKILL.md`），用 OpenViking 存储它的运行时记忆和知识库，用 kimi-cli 的 kaos 层做文件操作隔离——三者各司其职，正好覆盖了"定义 Agent"、"管理上下文"、"多用户隔离"三个不同层次的问题。

最后一个更底层的感悟：这三个项目最让我印象深刻的，其实是它们各自的**抽象选择**——OpenViking 选了"文件系统"，kimi-cli 选了"OS Protocol + ContextVar"，GitAgent 选了"Git Repo"。每一个都是把复杂的新问题，映射到了开发者最熟悉的已有抽象上，然后事情就变简单了。

这大概是做技术产品最难也最值钱的能力：不是"我能实现什么"，而是"我能用什么已有的抽象来表达它"。

---

**项目地址**
- OpenViking：https://github.com/volcengine/OpenViking
- GitAgent：https://github.com/open-gitagent/gitagent
- kimi-cli：https://github.com/MoonshotAI/kimi-cli
