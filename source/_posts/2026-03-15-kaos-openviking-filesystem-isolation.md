---
title: 从 kaos 到 OpenViking：云多用户 Agent 系统的文件系统隔离方案
date: 2026-03-15 14:30:00
categories:
  - Agent 系统
tags:
  - OpenViking
  - kimi-cli
  - 文件系统隔离
  - ContextVar
---

在上一篇文章里，我介绍了 OpenViking（上下文数据库）和 GitAgent（规范标准），探讨了构建一个云多用户 Agent 系统的基础。但当时我们只解决了“上下文数据存哪里”的问题，还有一个核心挑战没碰：如果 1000 个用户同时运行各自的 Agent，怎么保证用户 A 绝对看不到用户 B 的文件？

传统做法是用容器。每个用户一个容器，隔离彻底，但开销太大——1000 个容器跑起来，资源消耗惊人。那有没有更轻量的方案？

最近在研究 kimi-cli 的代码时，我发现了一个非常巧妙的设计：它的 `kaos` 文件系统抽象层。结合 OpenViking 作为存储引擎，我们可以在**同一个进程**里实现 1000 个用户的文件系统完全隔离。这篇文章就来聊聊这个技术细节。


## 1. 问题背景：云多用户 Agent 系统的文件隔离困境

先把问题说清楚。假设我们要做一个云端的 AI 助手平台，每个用户登录后都有自己专属的 Agent。这个 Agent 需要能读文件、写文件、遍历目录——就像在本地开发一样。

但在服务器上，所有用户的代码其实是跑在同一个（或少数几个）进程里的（毕竟用了 asyncio 嘛）。如果直接用本地文件系统，用户 A 的 Agent 写了 `/workspace/secret.txt`，用户 B 的 Agent 只要知道路径就能读到，这肯定不行。

OpenViking 能帮上忙吗？能，但不全能。OpenViking 本身是按用户命名空间隔离的，但它只处理“上下文数据”，不直接接管 Agent 的所有文件系统操作。Agent 用的是 kimi-cli 提供的 ReadFile、WriteFile 这些工具，这些工具默认是直接读写本地磁盘的。


## 2. 认识 kimi-cli 的 kaos：一个巧妙的文件系统抽象

这就该 `kaos` 出场了。我翻了 kimi-cli 的源码（在 `packages/kaos/` 目录下），发现它的设计非常优雅：

首先，`Kaos` 是一个 Python `Protocol`（也就是接口），定义了所有文件系统操作的标准：

```python
# 简化版的 Kaos Protocol
class Kaos(Protocol):
    async def readtext(self, path: str, ...) -> str: ...
    async def readbytes(self, path: str, ...) -> bytes: ...
    async def writetext(self, path: str, data: str, ...) -> int: ...
    async def writebytes(self, path: str, data: bytes, ...) -> int: ...
    async def mkdir(self, path: str, ...) -> None: ...
    async def iterdir(self, path: str, ...) -> list[str]: ...
    async def glob(self, pattern: str, ...) -> list[str]: ...
    async def stat(self, path: str, ...) -> StatResult: ...
    async def chdir(self, path: str) -> None: ...
    async def exec(self, *args: str, ...) -> KaosProcess: ...
```

默认实现是 `LocalKaos`，直接通过 `aiofiles` 读写本地磁盘。但关键不在这里，关键在于它是怎么让 Agent 使用这个抽象的：

```python
# 在 _current.py 中
from contextvars import ContextVar

current_kaos: ContextVar[Kaos] = ContextVar(
    "current_kaos",
    default=local_kaos  # 默认是本地文件系统
)

def get_current_kaos() -> Kaos:
    return current_kaos.get()

def set_current_kaos(kaos: Kaos) -> Token:
    return current_kaos.set(kaos)

def reset_current_kaos(token: Token) -> None:
    current_kaos.reset(token)
```

然后，所有 Agent 工具（ReadFile、WriteFile 等）内部都通过 `KaosPath` 来调用文件操作，而 `KaosPath` 最终会调用 `get_current_kaos()`：

```
Agent LLM → ReadFile 工具 → KaosPath.read_lines() → get_current_kaos().readlines(path) → LocalKaos.readlines()
```

看到这里我拍了一下大腿：这不是正好给了我们替换后端的机会吗？


## 3. 实现 OpenVikingKaos：把文件操作路由到 OpenViking

既然 `kaos` 是个抽象接口，我们只需要写一个 `OpenVikingKaos` 类来实现这个接口，把所有文件操作都转发到 OpenViking 不就行了？

说干就干，核心代码大概长这样：

```python
class OpenVikingKaos:
    name = "openviking"

    def __init__(self, ov_client, user_id: str, agent_id: str):
        self._ov = ov_client  # 这个 ov_client 已经带了用户的 user_key，天然隔离
        self._user_id = user_id
        self._agent_id = agent_id

    def _to_uri(self, path: str) -> str:
        # 把 Agent 看到的虚拟路径映射到 OpenViking 的 URI
        # 比如 Agent 认为自己在写 "/workspace/src/main.py"
        # 实际存到 OpenViking 里是 "viking://resources/workspace/src/main.py"
        # 而且因为 ov_client 带了 user_key，自动就在用户自己的命名空间里
        clean_path = str(path).lstrip("/")
        return f"viking://resources/{clean_path}"

    async def readtext(self, path: str, encoding: str = "utf-8", **kwargs) -> str:
        uri = self._to_uri(path)
        data = await self._ov.read(uri)
        return data.decode(encoding)

    async def writetext(self, path: str, data: str, encoding: str = "utf-8", **kwargs) -> int:
        uri = self._to_uri(path)
        encoded = data.encode(encoding)
        await self._ov.write(uri, encoded)
        return len(encoded)

    async def iterdir(self, path: str, **kwargs) -> list[str]:
        uri = self._to_uri(path)
        return await self._ov.list(uri)

    # 其他方法（mkdir、glob、stat 等）类似，都是转调用 _ov 的对应方法

    async def exec(self, *args: str, **kwargs) -> "KaosProcess":
        # 关键决策点：是否允许执行 shell 命令？
        # 严格模式下直接禁用，避免任何逃逸风险
        raise PermissionError("shell execution is disabled in isolated mode")
```

然后，在每个用户的 Agent 会话开始时，我们注入这个自定义的 kaos 后端：

```python
from kaos import set_current_kaos, reset_current_kaos

async def handle_user_agent_request(user_request):
    # 1. 为这个用户创建带 user_key 的 OpenViking 客户端
    ov_client = create_openviking_client(user_request.user_key)
    
    # 2. 创建该用户专属的 OpenVikingKaos 实例
    user_kaos = OpenVikingKaos(ov_client, user_request.user_id, user_request.agent_id)
    
    # 3. 注入到当前 asyncio 上下文
    token = set_current_kaos(user_kaos)
    try:
        # 4. 运行用户的 Agent 会话
        await run_agent_session(user_request)
    finally:
        # 5. 清理，恢复默认（虽然 asyncio 上下文结束后自动失效，但显式 reset 更安全）
        reset_current_kaos(token)
```


## 4. ContextVar：为什么这个方案如此优雅？

你可能注意到了，上面的代码里用了 Python 的 `ContextVar`。这才是整个方案的点睛之笔。

`ContextVar` 是 Python 3.7+ 引入的，专门用于在 asyncio 协程之间传递上下文，而且是**协程安全**的。它的特点是：

- 每个协程（以及它派生的子协程）有自己独立的变量副本
- 不需要锁，没有竞态条件
- 开销极小，比线程本地存储（TLS）还轻

在我们的场景里，1000 个用户的请求对应 1000 个并发的 asyncio 协程。每个协程都通过 `set_current_kaos()` 注入了自己的 `OpenVikingKaos` 实例。当用户 A 的协程调用 `ReadFile` 时，`get_current_kaos()` 返回的是用户 A 的 `OpenVikingKaos`；当用户 B 的协程调用同一个 `ReadFile` 时，返回的是用户 B 的实例——完全隔离，互不干扰。

而且这一切都在**同一个进程**里发生，没有容器的开销，没有进程间通信的复杂度。


## 5. 隔离覆盖范围：哪些安全，哪些要注意？

我们来列个表看看这个方案能覆盖哪些隔离场景：

| 操作 | 隔离程度 | 说明 |
|------|----------|------|
| ReadFile / WriteFile | ✅ 完全隔离 | 路径映射到用户自己的 viking:// 命名空间 |
| GlobFiles / iterdir | ✅ 完全隔离 | 只能看到自己命名空间下的文件 |
| mkdir / stat | ✅ 完全隔离 | 同上 |
| exec（执行 shell 命令） | ⚠️ 可选 | 可以直接禁用，或者路由到容器 |

唯一的“逃逸 hatch”是 `exec()`。如果允许 Agent 执行 shell 命令，那这些命令还是会在服务器上跑，可能会有风险。我的建议是：

- **严格模式**：直接让 `exec()` 抛出 `PermissionError`。对于大多数 AI 助手场景（读代码、写文档、改配置），根本不需要执行 shell 命令。
- **宽松模式**：如果确实需要执行命令，那就把 `exec()` 路由到一个独立的容器里，但容器里的文件系统 I/O 仍然通过 `OpenVikingKaos` 来走。


## 6. 完整架构图

把所有东西拼起来，整个云多用户 Agent 系统的架构大概是这样：

```
云平台（单个 asyncio 进程）
├── 1000 个并发用户请求，每个对应一个协程
├── 每个请求开始时：set_current_kaos(OpenVikingKaos(user_key))
├── Agent 运行 kimi-cli 工具（ReadFile、WriteFile、GlobFiles...）
├── 所有文件操作 → OpenVikingKaos → OpenViking HTTP 服务
│   └── OpenViking 内部存储：/local/{account}/user/{user_space}/...（按用户隔离）
└── 用户 A 和用户 B 看到完全不同的文件系统，却在同一个进程里
```


## 7. 总结：这个方案解决了什么，没解决什么？

**解决的问题**：
- 在同一个进程里实现了多用户的文件系统完全隔离
- 没有容器的沉重开销
- 利用 OpenViking 现有的用户命名空间能力，不用重复造轮子
- 代码改动小，主要是写一个 `OpenVikingKaos` 实现类

**没解决的问题**：
- `exec()` 执行 shell 命令的隔离（如果需要，还是得上容器）
- 网络隔离（Agent 能不能访问外网，访问哪些域名）
- CPU 和内存配额（怎么限制单个用户的 Agent 占用太多资源）

不过没关系，架构本来就是分层解决问题的。文件系统隔离这一层，用 `kaos` + `ContextVar` + `OpenViking` 的组合，已经是我能想到的最优雅的方案了。


## 一点个人感想

研究这个方案的时候，我最大的感受是：好的抽象真的能让复杂问题变简单。`kaos` 把文件系统操作抽象成一个接口，`ContextVar` 解决了协程间的上下文传递，OpenViking 负责底层的存储和用户隔离——三者各司其职，组合起来就产生了奇妙的化学反应。

这也提醒我，在写代码的时候，不要一开始就想着“怎么实现”，而是先想想“怎么抽象”。一个好的接口，能给未来留下无限的扩展空间。就像 `kaos` 一样，今天我们用 OpenViking 做后端，明天说不定就能用 S3，或者用 IPFS——接口不变，实现可以随便换。

这大概就是编程的乐趣之一吧。
