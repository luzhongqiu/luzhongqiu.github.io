你有没有试过搭一个多用户的云端 AI 助手平台？

就是那种每个用户登录进来，都有自己专属的 Agent —— 记得他上次说“我只用 uv 不用 pip”，记得他项目里的认证逻辑在哪个文件，上次犯过的错误不会再犯，而且所有用户的数据完全隔离，不会串号。

我最近就在想这个事儿，结果今天挖了一天的 GitHub 和源码，挖到了两个宝贝项目，还从一个不起眼的工具里抠出了一个绝妙的架构方案。

今天这篇文章，就把我一整天的研究成果原封不动地分享给你。

---

## 第一部分：今天挖到的两个宝贝

早上刷 GitHub Trending，先刷到了 **OpenViking**，然后顺藤摸瓜又找到了 **GitAgent**。

一开始以为是竞品，看完才发现，这俩根本不是一个赛道的，而是完美互补的两块拼图。

### OpenViking：把 Agent 的一切都变成“文件系统”

先说说 OpenViking（字节跳动开源，11K stars，Apache 2.0）。

它的定位是 **“AI Agent 的 Context Database”**。

但最有意思的不是它是个数据库，而是它的设计思路：**文件系统范式**。

什么意思？

我们平时管理电脑文件，用的是路径，比如 `/Users/nic/Documents/project/README.md`。OpenViking 说，Agent 的记忆、资源、技能，为什么不能也用路径来管理呢？

于是它定义了一套 `viking://` URI 规范：
- 用户记忆：`viking://user/memories/2025-03-15-只用uv`
- 会话资源：`viking://resources/jwt_verify.py`
- Agent 技能：`viking://agent/skills/编写单元测试.md`

是不是瞬间觉得亲切了？

这个设计太聪明了。为什么？

因为文件系统是我们每个人都刻在 DNA 里的抽象。不用学新的 API，不用记复杂的数据结构，只要你会用电脑，就知道怎么组织 Agent 的 Context。

而且 OpenViking 还解决了几个 Agent 领域的痛点：
1. **Token 爆炸**：L0/L1/L2 分层加载，不重要的信息先不放进 Prompt
2. **RAG 黑盒**：可观测检索轨迹，你能看到它搜了什么、为什么选了这段
3. **自进化**：用得越多，积累的记忆和技能越多，Agent 越聪明

它还有 FastAPI HTTP Server，多租户三级隔离（account/user/agent）正在做。

### GitAgent：Git Repo 就是 Agent 的定义

接着说 GitAgent（Lyzr 团队开源，145 stars，MIT，3 周前刚发布）。

这个项目更激进，它的核心是 **“Git Repo 即 Agent 定义”**。

怎么定义一个 Agent？只要三个文件：
- `agent.yaml`：基础配置（模型、参数）
- `SOUL.md`：Agent 的灵魂（人设、目标、约束）
- `SKILL.md`：Agent 的技能列表

然后把这三个文件往 Git 仓库里一推，完事。

为什么有意思？

因为 Git 天生就带了一堆我们想要的功能：
- **版本回滚**：Agent 改坏了？`git reset` 回去
- **分支部署**：开发版在 dev 分支，生产版在 main
- **PR 审核**：修改 Agent 要提 PR，人工审核过了才合并
- **审计追踪**：`git blame` 一看就知道谁改了什么、为什么改

而且它是**框架无关**的。Claude 能用，OpenAI 能用，CrewAI、LangChain 都能用。

不过它现在只是个规范加 CLI，没有运行时，还是极早期。

### 核心洞察：他俩是绝配

看到这儿你可能会问：这俩到底啥关系？

我琢磨了一下：
- **OpenViking 是数据库**：负责 Agent 运行时的 Context 管理、记忆存储、资源检索
- **GitAgent 是 Dockerfile**：负责 Agent 的定义、版本控制、分发部署

根本不是竞争对手，而是可以配合起来用的。

你用 GitAgent 定义 Agent 的“灵魂”和“技能”，用 OpenViking 存储它的“记忆”和“资源”，完美。

---

## 第二部分：多用户云端 Agent 系统的架构怎么搭？

刚才说的都是静态的项目，接下来讲点硬货：我今天从源码里挖出来的架构方案。

背景是我想做一个云端 AI 助手平台，每个用户有自己的 Agent。这就带来几个问题：
1. 怎么做到每个用户的上下文完全隔离？
2. 怎么管理每个用户的记忆和资源？
3. 怎么在同一进程里跑 1000 个并发用户还不串号？

结果我在挖 **kimi-cli** 源码的时候，挖到了宝。

### 发现 1：kimi-cli 里藏着一个 kaos 文件系统抽象

kimi-cli 是月之暗面出的命令行 AI 助手工具。我本来是想看它怎么管理会话的，结果在 `packages/kaos/` 里发现了一个叫 `kaos` 的模块。

这是一个**操作系统抽象层**，定义了一个 `Kaos` Protocol：
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

厉害的地方在哪？

它用 Python 的 **`ContextVar`** 来注入当前的 Kaos 实例。

调用链是这样的：
1. Agent LLM 想读文件 → 调用 ReadFile tool
2. ReadFile tool → 拿到 KaosPath
3. KaosPath → 调用 `get_current_kaos()`
4. 默认返回 LocalKaos（直接操作本地文件系统）

### 发现 2：把 OpenViking 接进去，完美实现多租户隔离

看到这儿我眼睛一亮！

那我是不是可以自定义一个 `OpenVikingKaos` 类，实现这个 Kaos Protocol，然后把所有文件操作都路由到 OpenViking 去？

当然可以！

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

然后每次用户请求进来的时候，我们这样做：
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

这个方案最绝的就是 **ContextVar**。

想象一下：同一进程里有 1000 个并发协程，每个协程处理一个用户的请求。

如果用全局变量，肯定会串号。用锁？性能又差。

但 ContextVar 不一样，它是**协程本地存储**。每个协程都有自己独立的 `current_kaos`，互不干扰，无锁无竞态。

完美解决了同一进程内多用户隔离的问题。

唯一的小问题是 `exec()` 方法。因为执行命令是在本地操作系统跑的，会“逃逸”出 Kaos 抽象。

解决方案也简单：
- **严格模式**：直接禁用 `exec()`
- **宽松模式**：把 `exec()` 路由到容器里跑，每个用户一个容器

---

## 第三部分：kimi-cli 完全没用上 OpenViking 的 5 大核心能力

刚才一直在夸 kimi-cli 的 kaos 设计，但我读了它的 `session.py` 和 `session_state.py` 源码之后，发现了一个问题：

**kimi-cli 的“记忆”就是一本流水账日记。**

它的会话状态就是：原始对话 `context.jsonl` 加上几个布尔值。换个会话，全忘光。

但 OpenViking 有 5 个核心能力， kimi-cli 完全没用到：

### 1. 跨 Session 的用户记忆
kimi-cli 这次说“我只用 uv”，下次再问“怎么安装依赖”，它又给你推荐 pip。

OpenViking 有 `viking://user/memories/`，说一次，永久记住。

### 2. 会话记忆蒸馏
kimi-cli 的记忆就是原始对话的流水账，下次打开还得把几千字的历史全喂给 LLM。

OpenViking 有 `memcommit`，会话结束后异步提炼经验，只保留有用的。

### 3. 语义检索
kimi-cli 找文件靠 grep，你得记得文件名或 exact match。

OpenViking 有 `add_resource` + `search`，你说“帮我看看认证逻辑在哪”，它能语义定位到 `jwt_verify.py:L23`。

### 4. 动态技能积累
kimi-cli 的技能是静态预置的 Markdown 文件。

OpenViking 有 `viking://agent/skills/`，Agent 可以边用边学，比如这次你教它怎么写 pytest，下次它就会了。

### 5. 可观测检索轨迹
kimi-cli 用 RAG 就是黑盒，你不知道它搜了什么、为什么选了这段。

OpenViking 完整记录检索轨迹，一清二楚。

### 怎么接入？
其实也不难，OpenViking 官方已经做了 OpenCode memory plugin，提供 4 个工具：`memsearch`/`memread`/`membrowse`/`memcommit`。

而且 kimi-cli 支持 MCP（Model Context Protocol），直接接进去就行。

---

## 今天最大的收获是什么？

挖了一天，我最大的收获不是找到了这两个项目，也不是抠出了那个架构方案，而是一个更底层的感悟：

**好的抽象能把复杂问题变简单。**

你看：
- OpenViking 用“文件系统”这个我们最熟悉的抽象，把 Agent 的 Context 管理变简单了
- kimi-cli 的 Kaos Protocol 用“文件系统接口”这个抽象，把多租户隔离变简单了
- ContextVar 用“协程本地存储”这个抽象，把并发安全变简单了
- GitAgent 用“Git Repo”这个抽象，把 Agent 的版本控制和分发变简单了

我们做技术的，经常会陷入“炫技”的误区，喜欢用复杂的方案解决简单的问题。

但真正厉害的，是把复杂的问题，用一个大家都能理解的简单抽象给解决掉。

这就是今天这篇文章想分享给你的全部内容。

希望对你有启发。
