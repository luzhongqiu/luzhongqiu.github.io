---
title: OpenViking + GitAgent 深度对比：从架构到落地，搞清云端多用户 AI 助手平台
date: 2026-03-15 17:00:00
categories:
  - AI
tags:
  - OpenViking
  - GitAgent
  - kimi-cli
  - Agent
  - 多租户架构
---
给 AI Agent 接了个开源的上下文数据库之后，任务完成率提升了 43%，同时 token 消耗降低了 91%。不是大模型升级，不是 prompt 优化，只是换了个存储方式。

这个数据来自字节跳动开源项目 OpenViking 的 README。上周我在搭一个多用户云端 AI 助手平台时，一直在纠结怎么解决三个核心问题：每个用户的上下文怎么完全隔离、怎么让 Agent 记住用户的偏好、怎么把几千字的对话历史压到合理的 token 数量。刷 GitHub 时挖到了两个宝贝项目，还从一个不起眼的工具里抠出了一个绝妙的架构方案。这篇文章就把研究成果原封不动分享给你。

---

## Part 1: 两个项目的深度对比

一开始我以为 OpenViking 和 GitAgent 是竞品，看完才发现，它们解决的问题完全不同。先看一张核心定位对比表：

| 维度 | OpenViking | GitAgent |
|------|-----------|---------|
| 本质是什么 | 上下文数据库（运行时基础设施） | Agent 定义规范（格式标准） |
| 类比 | MySQL/PostgreSQL | Dockerfile |
| 解决什么痛 | token爆炸、RAG黑盒、记忆碎片化 | 框架锁定、无版本控制、Prompt散落各处 |
| 有没有Server | ✅ FastAPI HTTP Server | ❌ 仅CLI工具 |
| 多租户/用户隔离 | ✅ 三级隔离，设计完整 | ❌ 需自己实现 |
| 语义检索 | ✅ L0/L1/L2+向量+目录递归 | ❌ 无，靠LLM读markdown |
| 框架可移植 | ❌ 绑定OpenViking生态 | ✅ Claude/OpenAI/CrewAI等 |
| 版本控制Agent行为 | ❌ 无内建 | ✅ git天然支持 |
| 成熟度 | ⭐11K stars，v0.2.6，60贡献者 | ⭐145 stars，v0.1.7，3周前发布 |
| 能不能用于生产 | 🟡 核心可用，多租户实施中 | 🔴 极早期，不建议 |

### 为什么 OpenViking 的抽象这么聪明？

OpenViking（字节跳动，11K stars，Apache 2.0）的定位是“AI Agent 的 Context Database”，但它最厉害的不是数据库本身，而是**文件系统范式**。

我们平时管理电脑文件用路径，比如 `/Users/nic/Documents/project/README.md`。OpenViking 说，Agent 的记忆、资源、技能，为什么不能也用路径来管理？于是它定义了一套 `viking://` URI 规范：

- 用户记忆：`viking://user/memories/2025-03-15-只用uv`
- 会话资源：`viking://resources/jwt_verify.py`
- Agent 技能：`viking://agent/skills/编写单元测试.md`

这个设计太聪明了，因为文件系统是每个人都刻在 DNA 里的抽象。不用学新的 API，不用记复杂的数据结构，只要会用电脑，就知道怎么组织 Agent 的 Context。

它还解决了几个 Agent 领域的核心痛点：
1. **Token 爆炸**：L0/L1/L2 分层加载，不重要的信息先不放进 Prompt
2. **RAG 黑盒**：可观测检索轨迹，你能看到它搜了什么、为什么选了这段
3. **自进化**：用得越多，积累的记忆和技能越多，Agent 越聪明

### GitAgent 的思路值得关注，但等它再成熟

GitAgent（Lyzr 团队，145 stars，MIT，3周前刚发布）的核心是“Git Repo 即 Agent 定义”。怎么定义一个 Agent？只要三个文件：

- `agent.yaml`：基础配置（模型、参数）
- `SOUL.md`：Agent 的灵魂（人设、目标、约束）
- `SKILL.md`：Agent 的技能列表

然后把这三个文件往 Git 仓库里一推，完事。Git 天生就带了一堆我们想要的功能：版本回滚、分支部署、PR 审核、审计追踪。而且它是框架无关的，Claude、OpenAI、CrewAI 都能用。

不过它现在只是个规范加 CLI，没有运行时，还是极早期。

### 核心洞察：它们是绝配

这两个项目根本不是竞争对手，而是完美互补的两块拼图：你用 GitAgent 定义 Agent 的“灵魂”和“技能”，用 OpenViking 存储它的“记忆”和“资源”。

---

## Part 2: 云端多用户 Agent 系统架构

背景是我想做一个云端 AI 助手平台，每个用户有自己的 Agent。这就带来三个难题：隔离、持久化、规模化。

### 发现 1：kimi-cli 里藏着一个绝妙的抽象

kimi-cli 是月之暗面出的命令行 AI 助手工具。我本来是想看它怎么管理会话的，结果在 `packages/kaos/` 里发现了一个叫 `kaos` 的模块。这是一个**操作系统抽象层**，定义了一个 `Kaos` Protocol：

```python
class Kaos(Protocol):
    def readtext(self, path: str) -> str: ...
    def writetext(self, path: str, content: str) -> None: ...
    def readbytes(self, path: str) -> bytes: ...
    def writebytes(self, path: str, content: bytes) -> None: ...
    def mkdir(self, path: str) -> None: ...
    def iterdir(self, path: str) -> list[str]: ...
    def glob(self, pattern: str) -> list[str]: ...
    def stat(self, path: str) -> os.stat_result: ...
    def exec(self, cmd: str) -> str: ...
```

厉害的地方在哪？它用 Python 的 **`ContextVar`** 来注入当前的 Kaos 实例。调用链是这样的：

1. Agent LLM 想读文件 → 调用 ReadFile tool
2. ReadFile tool → 拿到 KaosPath
3. KaosPath → 调用 `get_current_kaos()`
4. 默认返回 LocalKaos（直接操作本地文件系统）

### 发现 2：把 OpenViking 接进去，完美实现多租户隔离

看到这儿我眼睛一亮！那我是不是可以自定义一个 `OpenVikingKaos` 类，实现这个 Kaos Protocol，然后把所有文件操作都路由到 OpenViking 去？当然可以！

```python
class OpenVikingKaos:
    def __init__(self, user_key: str):
        self.ov_client = OpenVikingClient(user_key)
    
    def _to_uri(self, path: str) -> str:
        # 把本地路径映射到 OpenViking 的 viking:// URI
        # 比如 /jwt_verify.py → viking://resources/jwt_verify.py
        return f"viking://resources/{path.lstrip('/')}"
    
    def readtext(self, path: str) -> str:
        uri = self._to_uri(path)
        return self.ov_client.read(uri)
    
    def writetext(self, path: str, content: str) -> None:
        uri = self._to_uri(path)
        self.ov_client.write(uri, content)
    
    # 其他方法同理...
```

然后每次用户请求进来的时候，这样做：

```python
async def handle_user_request(user_key: str, request: str):
    # 注入当前用户的 OpenVikingKaos 实例
    token = set_current_kaos(OpenVikingKaos(user_key))
    try:
        # 运行 Agent 会话
        return await run_agent_session(request)
    finally:
        # 重置，避免污染下一个请求
        reset_current_kaos(token)
```

### 为什么 ContextVar 是点睛之笔？

这个方案最绝的就是 **ContextVar**。想象一下，同一进程里有 1000 个并发协程，每个协程处理一个用户的请求。如果用全局变量，肯定会串号；用锁，性能又差。但 ContextVar 不一样，它是**协程本地存储**，每个协程都有自己独立的 `current_kaos`，互不干扰，无锁无竞态。

唯一的小问题是 `exec()` 方法，因为执行命令是在本地操作系统跑的，会“逃逸”出 Kaos 抽象。解决方案也简单：严格模式直接禁用 `exec()`，宽松模式把 `exec()` 路由到容器里跑，每个用户一个容器。

### 架构图

```
┌─────────────────────────────────────────────────────────┐
│                     用户请求层                             │
│  (Web / API / CLI)                                        │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              会话管理 + ContextVar 注入层                 │
│  每个协程独立绑定 OpenVikingKaos 实例                    │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  Agent 运行时层                           │
│  (LLM 调用 + Tool 调用 + Prompt 管理)                    │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Kaos Protocol 抽象层                         │
│  (统一文件系统接口，屏蔽底层差异)                          │
└───────────┬───────────────────┬─────────────────────────┘
            │                   │
            ▼                   ▼
┌───────────────────┐  ┌─────────────────────┐
│  LocalKaos        │  │  OpenVikingKaos      │
│  (本地文件系统)    │  │  (路由到 OpenViking) │
└───────────────────┘  └───────────┬─────────┘
                                     │
                                     ▼
                          ┌─────────────────────┐
                          │  OpenViking Server   │
                          │  (account/user/agent │
                          │   三级隔离 + 语义检索)│
                          └─────────────────────┘
```

---

## Part 3: kimi-cli vs OpenViking 的 5 个 Gap

我读了 kimi-cli 的 `session.py` 和 `session_state.py` 源码之后发现，kimi-cli 的“记忆”就是一本流水账日记：原始对话 `context.jsonl` 加上几个布尔值/配置，无语义处理，换个会话全忘光。但 OpenViking 有 5 个核心能力，kimi-cli 完全没用到：

| 能力 | kimi-cli现状 | 接入OpenViking后 | 改造难度 |
|------|-------------|----------------|--------|
| 跨session记忆 | ❌ 每次白板，用户偏好重复交代 | ✅ viking://user/memories/ 永久记忆 | 低（MCP接入） |
| 会话经验提炼 | ❌ 原始对话流水账，换session全忘 | ✅ memcommit自动蒸馏，只保留精华 | 低（session结束触发） |
| 知识库语义检索 | ⚠️ grep关键词，靠LLM猜文件位置 | ✅ 语义定位到具体代码行 | 低（MCP接入） |
| 动态技能积累 | ⚠️ 静态预置Markdown，不会自更新 | ✅ 边用边学，写回skill库 | 中 |
| 检索可观测性 | ❌ RAG黑盒，不知道Agent读了什么 | ✅ 完整检索路径记录 | 低（接入自带） |

### 1. 跨 Session 的用户记忆

**痛在哪里：** kimi-cli 这次说“我只用 uv”，下次再问“怎么安装依赖”，它又给你推荐 pip。用户每次都要重复交代偏好，体验非常差。

**接入后体验变化：** OpenViking 有 `viking://user/memories/`，说一次，永久记住。下次再问安装依赖，它直接推荐 uv。

### 2. 会话记忆蒸馏

**痛在哪里：** kimi-cli 的记忆就是原始对话的流水账，下次打开还得把几千字的历史全喂给 LLM，既浪费 token，又容易让 LLM 分心。

**接入后体验变化：** OpenViking 有 `memcommit`，会话结束后异步提炼经验，只保留有用的。比如从一次 debug 对话里，提炼出“项目的认证逻辑在 jwt_verify.py:L23，测试时记得 mock token”，下次直接喂这一句话，而不是几千字的完整对话。

### 3. 语义检索

**痛在哪里：** kimi-cli 找文件靠 grep，你得记得文件名或 exact match。比如你说“帮我看看认证逻辑在哪”，它可能搜不到，因为你记不清文件名是 `auth.py` 还是 `jwt_verify.py`。

**接入后体验变化：** OpenViking 有 `add_resource` + `search`，你说“帮我看看认证逻辑在哪”，它能语义定位到 `jwt_verify.py:L23`。

### 4. 动态技能积累

**痛在哪里：** kimi-cli 的技能是静态预置的 Markdown 文件，不会自更新。比如你这次教它怎么写 pytest，下次它还是不会，因为预置的文件里没写。

**接入后体验变化：** OpenViking 有 `viking://agent/skills/`，Agent 可以边用边学。比如这次你教它怎么写 pytest，它会把这个技能写回 `viking://agent/skills/编写pytest.md`，下次直接就能用。

### 5. 可观测检索轨迹

**痛在哪里：** kimi-cli 用 RAG 就是黑盒，你不知道它搜了什么、为什么选了这段。如果 Agent 回答错了，你根本没法 debug。

**接入后体验变化：** OpenViking 完整记录检索轨迹，一清二楚。你能看到它搜了哪些关键词、返回了哪些结果、为什么选了这段，debug 起来非常方便。

---

## Part 4: 实测数据说话

OpenViking README 里有一组 OpenClaw 实验的数据，非常有说服力：

| 对比组 | 任务完成率 | Input Tokens | vs原始 |
|--------|-----------|-------------|-------|
| 原始OpenClaw | 35.65% | 24,611,530 | 基准 |
| + LanceDB | 44.55% | 51,574,530 | +25%任务，但token翻倍 |
| + OpenViking（无native memory） | **52.08%** | **4,264,396** | **+46%任务，-83% token** |
| + OpenViking（有native memory） | **51.23%** | **2,099,622** | **+43%任务，-91% token** |

这组数据的意义非常大。LanceDB 的做法是“加更多 context”，把所有相关的文件都塞进 Prompt 里，效果提升有限且成本暴增；而 OpenViking 的做法是“更聪明地管理 context”，通过分层加载和语义检索，只把最相关的信息放进 Prompt，效果更好同时成本大降。这才是正确的方向。

---

## 结尾：三条具体的 Actionable Takeaway

挖了一天，我最大的收获不是找到了这两个项目，也不是抠出了那个架构方案，而是三个具体的建议，你现在就能用：

1. **如果你在做 Coding Agent 或 AI 助手类产品** → OpenViking 值得现在就接进去。它的文件系统范式非常优雅，解决了 token 爆炸、RAG 黑盒、记忆碎片化这三个核心痛点，而且已经有 11K stars，相对成熟。
2. **如果你在做 Agent 定义/分发/多框架支持** → 关注 GitAgent，思路有价值但等它再成熟。它的“Git Repo 即 Agent 定义”的思路非常好，但现在只是个规范加 CLI，没有运行时，不建议用于生产。
3. **如果你在做云端多用户 Agent 系统** → kimi-cli kaos + OpenVikingKaos + ContextVar 这套方案可以直接参考。它用 ContextVar 解决了同一进程内多用户隔离的问题，无锁无竞态，性能非常好。

希望这篇文章对你有启发。
