---
title: 调研了两个 AI Agent 上下文管理项目：OpenViking 和 GitAgent
date: 2026-03-15 22:00:00
categories:
  - AI
tags:
  - Agent
  - OpenViking
  - GitAgent
  - 开源
  - 上下文管理
---

最近在折腾 AI Agent 相关的项目，发现一个绕不开的痛点：如何高效管理 Agent 的上下文？

一开始做简单的单轮对话 Agent 还没感觉，等加上记忆、技能库、外部资源调用后，问题全来了：上下文稍微长一点就触发 token 上限；想回溯 Agent 为啥给出某个回答，根本不知道它读了哪些记忆；多用户场景下，每个用户的 Agent 数据怎么隔离？头疼了好几天，直到最近看到两个很有意思的项目：**OpenViking** 和 **GitAgent**。虽然名字里都带「Agent」，但它们解决的其实是完全不同层面的问题，今天就来聊聊我的观察。

---

## 先看 OpenViking：把 Agent 上下文当文件系统管

OpenViking 是字节跳动火山引擎刚开源的项目，Apache 2.0 协议，GitHub 上已经有 11K 星了。第一眼看到它的文档，就眼前一亮——它的核心定位不是某个 Agent 框架，而是专门解决「Agent 上下文存取」的基础设施，官方叫它「Context Database」。

### 核心设计：文件系统范式

最打动我的是它的设计思路：把 Agent 的 Memory（记忆）、Resource（资源）、Skill（技能）全部统一用文件系统的范式来管理，用 `viking://` 这样的 URI 寻址。比如你想存一段用户对话记忆，就像在本地创建 `viking://agent1/memory/2026-03-15/conversation.txt` 一样；调用某个技能，就访问 `viking://agent1/skill/write_email.py`。这种设计的好处是，开发者不需要重新学习一套复杂的 API，就像操作本地文件一样自然。

目录结构大概长这样：

```
viking://
├── resources/        # 知识资源（API 文档、产品手册等）
│   └── user/
├── memories/         # Agent 记忆
│   ├── agent/
│   └── session/
└── skills/           # 可调用的技能
```

### 分层加载解决 Token 爆炸

Token 上限是 Agent 开发里最常见的坑。OpenViking 做了个 L0/L1/L2 的分层加载机制：

- **L0 层**：最热的核心记忆，比如用户的基本信息、最近几条对话，控制在 100 tokens 以内，每次都加载；
- **L1 层**：次热的短期记忆，比如最近一天的对话、常用的几个技能，控制在 2K tokens 以内，按需加载；
- **L2 层**：长期记忆和海量资源，用递归检索的方式——先通过目录结构定位大概范围，再用向量语义搜索找具体内容，找到多少用多少。

把一个 100 多页的项目文档扔进去，OpenViking 会自动拆分、索引，问相关问题时，它只加载最相关的几段，不会把整个文档都塞给 LLM，token 消耗大幅下降。

### 可观测 + 自进化，告别 RAG 黑盒

之前用 RAG 做检索增强，最烦的就是「黑盒」问题：Agent 给出了一个答案，但不知道它到底读了哪些文档片段才得出的。OpenViking 专门做了可观测性，每一步检索的路径都会记录下来——先找了哪个目录，再用向量搜索匹配了哪些文件，最后加载了哪几段，一清二楚。调试的时候太有用了。

更有意思的是「自进化」功能：Agent 每次运行的经验（比如用户的反馈、成功解决问题的方法）会自动蒸馏、沉淀回记忆库。比如你第一次让 Agent 写一个 Python 脚本，它可能写得有点粗糙，你给了修改意见；第二次让它写类似的脚本，它会自动回忆之前的修改，直接写出更符合你要求的代码——这种「越用越好用」的感觉，才是 Agent 该有的样子。

### 部署简单，多租户正在路上

部署 OpenViking 也很方便：它自带一个 FastAPI HTTP Server，还有 Python SDK，一行 `pip install openviking` 就能装。官方文档里有个快速上手教程，跟着做就能跑通一个带记忆的对话 Agent。

多租户功能目前正在开发中，设计思路是 `account / user / agent` 三级隔离，还有 Admin API 来管理用户的 key。等这个功能上线后，拿来做云端的 per-user Agent 系统就太合适了——每个用户的 Agent 数据完全隔离，又能共享底层基础设施：

```python
# 每个用户注册时，创建对应的 user 并下发隔离 key
POST /api/v1/admin/accounts/my_platform/users {"user_id": "user_123"}
→ 返回 user_key

# 用户的 Agent 运行时，用 user_key 初始化客户端
client = SyncHTTPClient(url=OV_URL, api_key=user_123_key, agent_id="assistant")
# 所有 context 操作自动隔离在该用户空间内，不同用户之间完全不可见
```

---

## 再看 GitAgent：用 Git 仓库定义 Agent

GitAgent 是 Lyzr 团队刚发布的项目，MIT 协议，GitHub 上只有 145 星，发布才 3 周。虽然星星少，但它的思路特别独特——完全用 Git 原生的方式来定义和管理 Agent，官方叫它「AI Agent 的 Git 原生开放标准」。

### 核心设计：Git Repo 即 Agent

GitAgent 的核心想法很简单：一个 Git 仓库就是一个完整的 Agent 定义，只需要三个核心文件：

- **agent.yaml**：Agent 的基本配置，比如名字、使用的 LLM 模型、挂载哪些技能和工具；
- **SOUL.md**：Agent 的「灵魂」——角色设定、行为准则、沟通风格，相当于 System Prompt；
- **SKILL.md**：Agent 的技能定义，放在 `skills/` 子目录下，每个技能模块化管理。

完整的仓库结构大概长这样：

```
my-agent/
├── agent.yaml          # 配置清单
├── SOUL.md             # 身份与指令
├── RULES.md            # 行为约束
├── skills/             # 技能模块
│   └── code-review/
│       └── SKILL.md
├── tools/              # 工具声明
│   └── search.yaml
├── memory/             # 运行时记忆
│   └── runtime/
│       ├── dailylog.md
│       └── context.md
└── compliance/         # 合规配置（可选）
    └── regulatory-map.yaml
```

### 框架无关，Git 自带能力免费送

最吸引人的是它的「框架无关」特性：你用 GitAgent 定义好一个 Agent 后，可以用它的 CLI 一键导出到 Claude Code、OpenAI Assistants、CrewAI、LangChain 等不同框架里运行——相当于「定义一次，到处运行」：

```bash
# 从 GitHub 拉取 Agent 定义，以 Claude 身份运行
npx @open-gitagent/gitagent@latest run -r https://github.com/user/my-agent -a claude
```

更妙的是，因为用了 Git，你直接获得了一堆免费的能力：

- **版本回滚**：Agent 改坏了？直接 `git reset` 回上一个版本，就像回退代码一样；
- **分支部署**：用 `dev` 分支开发新技能，`staging` 分支测试，`main` 分支上线，跟发布软件一模一样；
- **PR 人工审核**：修改 Agent 的 SOUL 或者 SKILL 时，提交 PR，让同事审核后再合并，避免「教坏」Agent；
- **git blame 审计**：想知道谁改了 Agent 的某个设定、什么时候改的？直接 `git blame` 查记录。

这个思路真的挺有启发性的——以前 Agent 的 Prompt 和配置散落在各处，根本没有版本管理，出了问题都不知道是哪次改动导致的。GitAgent 把这个问题优雅地解决了。

### 只是规范 + CLI，没有运行时

不过要注意的是，GitAgent 目前**只是一个规范加上一个 CLI 工具**，它没有自己的 server、runtime 或者数据库。你用它定义好 Agent 后，还是得导出到其他框架里去运行。记忆管理也是通过 `memory/runtime/` 目录加 git commit 来实现的——这种方式适合单用户、轻量级的场景，但如果要做云端的多用户系统，可能就有点力不从心了。

---

## 核心对比：它们解决的不是同一个问题

很多人刚看到这两个项目，可能会觉得它们是竞争对手，但在我看来，它们解决的其实是完全不同层面的问题：

| 维度 | OpenViking | GitAgent |
|------|------------|----------|
| **本质定位** | 运行时基础设施（Context Database） | 定义标准（Spec / 规范） |
| **核心解决** | 上下文的高效存取、分层加载、可观测、自进化 | Agent 的标准化定义、版本控制、跨框架移植 |
| **类比** | 数据库（MySQL / PostgreSQL） | Dockerfile（容器定义标准） |
| **有没有 Server** | ✅ FastAPI HTTP Server，可独立部署 | ❌ 仅 CLI 工具 |
| **多租户 / 用户隔离** | ✅ 设计方案完整，正在实施 | ❌ 需要自己在外层实现 |
| **语义检索** | ✅ L0/L1/L2 + 向量 + 目录混合检索 | ❌ 无，靠 LLM 读 markdown 文件 |
| **框架可移植** | ❌ 绑定 OpenViking 生态 | ✅ 导出 Claude / OpenAI / CrewAI 等 |
| **版本控制 Agent 行为** | ❌ 无内建支持 | ✅ git 天然支持 |
| **成熟度** | ⭐ 11K stars，v0.2.6，60 位贡献者，字节背书 | ⭐ 145 stars，v0.1.7，发布仅 3 周 |
| **生产可用性** | 🟡 核心功能可用，多租户实施中 | 🔴 极早期，不适合生产 |

我觉得这个类比特别贴切：**OpenViking 就像数据库，负责存和取 Agent 的所有上下文数据；GitAgent 就像 Dockerfile，负责定义 Agent 是什么样子、该怎么运行。** 你完全可以用 GitAgent 定义好 Agent 的配置结构（SOUL.md、RULES.md），然后用 OpenViking 来存它的运行时上下文——两者并不冲突，甚至是互补的。

---

## 我的一点看法

这两个项目我都仔细看了一遍，OpenViking 给我的感觉是「实用」——它解决的都是 Agent 开发里实实在在的痛点，部署简单，功能也够用，拿来做生产环境的基础设施很放心。字节的团队在持续迭代，60 位贡献者，15 个正式版本，活跃度很高。

GitAgent 给我的感觉是「有趣」——用 Git 来管理 Agent 的整个生命周期，这个思路太有启发性了：PR 做 Human-in-the-Loop、分支做环境隔离、git blame 做审计，这些都是未来 Agent 开发肯定需要的能力。但它目前确实太早期了，只有 145 星、发布才 3 周、没有自己的运行时，要用到生产环境还有很长的路要走。

不过，「用 Git 管理 Agent」这个想法可能会比工具本身活得更久。Agent 的提示词、技能配置、行为规则——这些东西太需要版本管理了，以后我们定义 Agent 就像今天写 Dockerfile 一样普遍，也许并不遥远。

---

**项目地址：**
- OpenViking：https://github.com/volcengine/OpenViking
- GitAgent：https://github.com/open-gitagent/gitagent

---

**系列文章：**
- [从 kaos 到 OpenViking：云多用户 Agent 系统的文件系统隔离方案](/2026/03/15/kaos-openviking-filesystem-isolation/) — 深入 kimi-cli 的 `kaos` 抽象层，探讨如何用 OpenViking 做运行时文件隔离
- [OpenViking 有 5 个能力，kimi-cli 一个都没用上](/2026/03/15/openviking-kimi-cli-gap-analysis/) — 对比 OpenViking 的完整上下文能力（记忆、技能、蒸馏）与 kimi-cli 现状的 gap 分析
