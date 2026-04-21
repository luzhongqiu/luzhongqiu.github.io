---
title: 拆解 Claude Code：一个 AI 编程助手的硬核源码解析
date: 2026-04-02 10:00:00
categories:
  - AI
tags:
  - Claude Code
  - 源码解析
  - AI Agent
  - 架构设计
  - TypeScript
---

# 引言：从 35 行代码的状态管理说起

当我第一次翻开 Claude Code 的源码时，最让我意外的不是那个复杂的 QueryEngine 循环，也不是那 51 个工具的庞大目录结构，而是它用仅仅 **35 行 TypeScript** 实现了一个完整的状态管理库，替代了 Zustand 这类第三方库。

这不是一个玩具级的状态管理，它支撑着整个包含 60+ 顶级字段的巨大状态树，覆盖了从对话历史到推测执行状态的全部子系统。这种"不引入不必要依赖"的工程哲学，贯穿了整个 Claude Code 代码库。

在这篇文章中，我将带你深入这个代码库的 8 个核心模块，从 QueryEngine 的状态机到多 Agent 系统的协作机制，从权限系统的安全设计到自定义终端渲染器的性能优化。我们不仅看"它是怎么做的"，更要理解"为什么要这样设计"。

---

# 整体架构鸟瞰

在深入细节之前，先让我们看一下 Claude Code 的整体架构：

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          UI Layer (React + Custom Renderer)             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│  │  REPL.tsx    │  │PromptInput   │  │VirtualList   │                 │
│  │  (5061 行)   │  │(2338 行)     │  │              │                 │
│  └──────────────┘  └──────────────┘  └──────────────┘                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                        AppState (35 行 Store)                           │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  DeepImmutable<AppState>  - 类型级不可变性                        │  │
│  │  useSyncExternalStore + selector  - 精确订阅                      │  │
│  │  onChangeAppState  - 集中副作用处理                               │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
          ▲                               ▲
          │                               │
┌──────────────────────┐    ┌─────────────────────────────────────────┐
│   QueryEngine        │    │          Tools System                   │
│   (核心大脑)         │    │          (51 个工具)                    │
│  ┌────────────────┐ │    │  ┌───────────────────────────────────┐  │
│  │ while(true)    │ │    │  │ StreamingToolExecutor              │  │
│  │ 状态机循环     │ │    │  │ concurrencySafe 并发控制           │  │
│  │ 7 Continue     │ │    │  └───────────────────────────────────┘  │
│  │ 9 Terminal     │ │    │  ┌───────────────────────────────────┐  │
│  │ reasons        │ │    │  │ 工具分组:                          │  │
│  └────────────────┘ │    │  │ - 只读可并发 (Glob/Grep/Read)     │  │
│  ┌────────────────┐ │    │  │ - 写入独占 (Bash/Edit)             │  │
│  │ Token 预算     │ │    │  └───────────────────────────────────┘  │
│  │ 5 层上下文压缩 │ │    │  ┌───────────────────────────────────┐  │
│  └────────────────┘ │    │  │ 7 步执行管线                       │  │
└──────────────────────┘    └─────────────────────────────────────────┘
          │                               │
          └───────────────┬───────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
    ┌────▼────┐    ┌─────▼─────┐   ┌─────▼─────┐
    │ Services│    │Multi-Agent│   │Permissions│
    │  Layer  │    │  System   │   │  System   │
    └─────────┘    └───────────┘   └───────────┘
```

这个架构图展示了 Claude Code 的 8 个核心模块之间的关系。接下来，让我们逐个模块深入分析。

---

# 1. QueryEngine — 核心大脑

QueryEngine 是 Claude Code 的核心，它代表了一段对话的完整生命周期。整个引擎的核心就是一个 `while(true)` 主循环状态机，位于 `query.ts` 的第 1729 行。

## 状态机设计

```typescript
// 简化的 QueryEngine 主循环
async function query() {
  let state: QueryState = initialState;
  
  while (true) {
    const result = await step(state);
    
    if (result.type === 'terminal') {
      return result;
    }
    
    state = result.nextState;
  }
}
```

这个状态机有 **7 种 Continue 原因**（状态转移）和 **9 种 Terminal 原因**（终止）：

| 类型 | 原因 |
|------|------|
| Continue | userInput, toolCall, agentMessage, nudge, confirmation, speculation, fork |
| Terminal | userStop, error, maxTurns, maxTime, budgetExhausted, complete, explicitExit, crash, timeout |

这种设计的好处是**可测试性极强**——你可以 mock 任意 step 的输出，验证状态机的转移逻辑，而不需要真的调用 LLM。

## Token 预算与上下文压缩

QueryEngine 的另一个核心设计是 **Token 预算机制**：自然停止≠真正停止。如果 budget 未达 90%，引擎会自动注入 nudge 让 LLM 继续工作。

为了在有限的 Token 预算内容纳更多上下文，Claude Code 设计了 **5 层上下文压缩策略**：

```
snipCompact (轻量)
    ↓
selectCompact
    ↓
microCompact
    ↓
macroCompact
    ↓
reactiveCompact (重量)
```

每一层都比上一层更激进，也更消耗计算资源。这种分层设计让系统可以根据当前 Token 使用情况动态选择压缩策略。

## 依赖注入

QueryEngine 采用了依赖注入设计，关键组件如 `callModel`、`microcompact` 等都可以被替换，这使得：

1. **测试变得简单**——你可以用 mock 函数替换真实的 LLM 调用
2. **功能扩展灵活**——你可以注入自定义的压缩算法或模型调用逻辑

---

# 2. Tools 工具系统 — 手和脚

如果说 QueryEngine 是大脑，那么 Tools 系统就是手和脚。Claude Code 有 **51 个工具**，组成了一个完整的工具生态。

## Tool 接口设计

每个 Tool 都实现了完整的接口：

```typescript
interface Tool {
  name: string;
  description: string;
  
  // 核心方法
  call(input: ToolInput): Promise<ToolResult>;
  
  // 权限相关
  checkPermissions(input: ToolInput): Promise<PermissionCheckResult>;
  
  // 渲染相关
  renderInput(input: ToolInput): React.ReactNode;
  renderResult(result: ToolResult): React.ReactNode;
  renderError(error: Error): React.ReactNode;
  
  // 钩子
  preHooks?: ToolHook[];
  postHooks?: ToolHook[];
}
```

## 并发控制策略

Tools 系统的一个亮点是 `StreamingToolExecutor` 的并发控制策略。系统会根据 `concurrencySafe` 判断工具是否可以并发执行：

- **只读可并发**：Glob、Grep、Read 等只读工具可以同时运行
- **写入独占**：Bash、Edit 等写入工具必须串行执行

这种设计既保证了性能，又避免了竞态条件。

## 工具执行管线

每个工具的执行都经过 **7 步管线**：

```
validateInput
    ↓
preHooks
    ↓
canUseTool (权限检查)
    ↓
call (实际执行)
    ↓
postHooks
    ↓
processResult
    ↓
返回结果
```

这种管线设计使得横切关注点（如日志、审计、权限检查）可以统一处理，而不需要每个工具都重复实现。

---

# 3. AppState — 全局状态管理

回到文章开头提到的那个 35 行的状态管理实现。让我们看看它是怎么做到的：

## 极简 Store 实现

```typescript
// 简化的 AppState Store 实现
function createStore<T>(initialState: T) {
  let state = initialState;
  const listeners = new Set<(state: T) => void>();
  
  return {
    getState: () => state,
    setState: (newState: T | ((prev: T) => T)) => {
      state = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(state) 
        : newState;
      listeners.forEach(listener => listener(state));
    },
    subscribe: (listener: (state: T) => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
```

就是这么简单。没有复杂的中间件，没有花哨的 API，但它足够解决问题。

## 类型级不可变性

Claude Code 使用 `DeepImmutable<T>` 类型来实现类型级的不可变性：

```typescript
type DeepImmutable<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepImmutable<T[P]> 
    : T[P];
};
```

这意味着在编译期就能捕获意外的状态修改，而不需要运行时的 Immutable.js 这类库。

## 精确订阅

结合 React 18 的 `useSyncExternalStore` 和 selector 模式，UI 组件可以精确订阅状态的某一部分：

```typescript
function useAppState<Selected>(selector: (state: AppState) => Selected) {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(initialState)
  );
}
```

这样，只有当 selector 返回的值变化时，组件才会重新渲染，性能得到了保证。

---

# 4. UI Layer — 终端渲染器

Claude Code 的 UI 层是一个技术奇迹：它用 React 来渲染终端界面，而且性能还非常好。

## 渲染管线

整个渲染管线是这样的：

```
React 组件树
    ↓
自定义 React Reconciler
    ↓
自定义 DOM 树
    ↓
Yoga 布局引擎 (Flexbox)
    ↓
Screen Buffer (双缓冲)
    ↓
Diff 算法计算变化
    ↓
输出 ANSI 控制序列到终端
```

这种设计的好处是你可以用熟悉的 React 思维来写终端 UI，同时还能获得原生终端的性能。

## 双缓冲渲染 + Blit 优化

为了减少终端闪烁，Claude Code 使用了双缓冲技术：

1. 后台缓冲区绘制新一帧
2. 与前台缓冲区比较，计算差异
3. 只把变化的部分输出到终端

更进一步，对于未变化的节点，系统会直接从上一帧 copy 数据（Blit 操作），避免重新计算。

## 对象池减少 GC

终端渲染会产生大量临时对象（字符、样式、超链接等）。为了减少 GC 压力，Claude Code 实现了对象池：

- `CharPool`
- `StylePool`
- `HyperlinkPool`

对象复用让 GC 暂停时间大幅降低，终端响应更流畅。

## PromptInput — 2338 行的编辑器

PromptInput 组件是 UI 层最复杂的组件之一，有 2338 行代码。它支持：

- **Vim/Emacs 双模式**：可以切换不同的编辑模式
- **自动补全**：实时提示可用的工具和命令
- **Ghost text**：显示 LLM 推测的后续输入

这种级别的交互体验，在终端应用中是非常罕见的。

---

# 5. Services 层 — 外部交互

Services 层负责 Claude Code 与外部世界的交互，包括 LLM 调用、上下文压缩、MCP 协议等。

## 多 Provider 抽象

Claude Code 支持多种 LLM Provider：

- Direct (直接调用 Anthropic API)
- Bedrock (AWS Bedrock)
- Vertex (Google Cloud Vertex AI)
- Foundry
- OAuth

这种抽象使得切换 Provider 变得非常简单，不需要修改核心逻辑。

## withRetry 重试引擎

网络请求总会失败，所以 Claude Code 实现了强大的重试引擎 `withRetry`：

- **前台/后台区分**：前台请求更激进地重试，后台请求更保守
- **FOREGROUND_529_RETRY_SOURCES**：白名单机制，只有特定来源的 529 错误才重试

## 5 层压缩架构

Services 层实现了 QueryEngine 中提到的 5 层压缩策略。关键的一点是：**压缩用 Forked Agent 独立进程，不阻塞主 UI**。

这样即使用户选择了最激进的压缩策略，终端界面也不会卡顿。

## 类型安全遥测

Claude Code 的遥测系统有一个非常有意思的类型定义：

```typescript
type AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS = {
  // 字段定义...
};
```

这个类型名本身就是一种文档——它提醒开发者，这里不能包含代码或文件路径，避免敏感信息泄露。

---

# 6. Multi-Agent 系统

Multi-Agent 系统是 Claude Code 最强大的功能之一。它让 Claude 可以从"实现者"变成"指挥者"，协调多个 Agent 一起工作。

## Agent = Mini QueryEngine

一个 Agent 本质上就是一个迷你的 QueryEngine，它直接复用了 `query()` 函数。这种设计极大地减少了代码重复。

## 三种隔离模式

Agent 有三种隔离模式：

| 模式 | 说明 |
|------|------|
| worktree | 共享文件系统，但有独立的状态 |
| remote | 完全独立的远程 Agent |
| 共享 | 完全共享状态（最少隔离） |

## 自动转后台

为了避免长时间阻塞用户，前台 Agent 超过 120 秒会自动转后台执行。

## Team/Swarm 系统

对于更复杂的协作，Claude Code 实现了 Team/Swarm 系统：

- **Mailbox 文件通信**：Agent 之间通过文件传递消息
- **权限委派协议**：主 Agent 可以把部分权限委派给子 Agent
- **任务看板**：`~/.claude/tasks/` 目录下的文件 + `blockedBy` 依赖图

这种设计让多个 Agent 可以像真正的团队一样协作。

---

# 7. Bootstrap & 扩展性

Claude Code 的启动过程和扩展性设计也非常值得学习。

## CLI 快速路径分发

CLI 入口有 14 个分支，对于 `--version` 这类简单命令，实现了**零模块加载**：

```typescript
// 简化的 CLI 分发
if (process.argv.includes('--version')) {
  console.log(VERSION);
  process.exit(0);
}

// 其他命令才加载模块
// ...
```

这种优化让 `--version` 命令的响应时间降到最低。

## 5 层命令来源

Claude Code 的命令有 5 层来源，按优先级排序：

```
硬编码
    ↓
feature-gated (功能开关控制)
    ↓
bundled (内置)
    ↓
disk (磁盘上的文件)
    ↓
plugin (插件)
```

这种分层设计使得功能扩展非常灵活，用户可以用插件覆盖内置命令。

## Hooks 系统

Hooks 系统有 5022 行代码，支持 10+ 事件类型。Hook 通过 shell stdout JSON 协议与主程序通信，这意味着你可以用任何语言写 Hook。

## Context 系统

Context 系统负责加载 `CLAUDE.md` 这类上下文文件。它有两个特点：

1. **搜索路径**：按特定顺序搜索 `CLAUDE.md` 文件
2. **memoized**：只计算一次，避免重复加载

---

# 8. Permissions 权限系统

最后但同样重要的是权限系统。Claude Code 的权限设计非常谨慎，毕竟它要在你的电脑上执行代码。

## 17 步权限判定管线

每次工具调用都会经过 **17 步权限判定**：

```
1. 检查是否 bypassPermissions
2. 检查 Auto Mode AI 分类器
3. 检查用户预设规则
4. 检查策略设置
5. ... (共 17 步)
```

即使你开启了 `bypassPermissions`，有些安全检查也绕不过去——这就是 **Bypass-immune 安全检查**。

## Auto Mode AI 分类器

Auto Mode 使用 AI 来自动决定是否允许某个操作：

- **Stage 1**：64 tokens 快速判定（低成本）
- **Stage 2**：4096 tokens 推理链（高准确率）

为了防止分类器失控，系统有防护机制：连续 3 次/总计 20 次拒绝 → 回退到用户确认。

## 沙箱系统

对于高危操作，Claude Code 会使用沙箱：

- **macOS**：`sandbox-exec`
- **Linux**：`bubblewrap`

沙箱限制了工具可以访问的资源，即使工具被利用，造成的损害也有限。

## Windows 攻击路径检测

在 Windows 上，系统会检测 7 种 NTFS 攻击路径，提供全平台防护。

---

# 几个令人印象深刻的工程细节

在阅读源码的过程中，有几个跨模块的设计洞见让我印象深刻：

## 1. 类型系统的创造性使用

Claude Code 的 TypeScript 类型定义不是事后补充的，而是设计的一部分。从 `DeepImmutable` 到 `AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS`，类型系统被用来表达约束、文档和安全检查。

## 2. 性能优化无处不在

从对象池到双缓冲，从 selector 精确订阅到 Forked Agent 压缩，性能优化贯穿了整个代码库。更难得的是，这些优化没有以牺牲可维护性为代价。

## 3. 安全是设计出来的，不是补上去的

权限系统的 17 步管线、Auto Mode 的防护机制、沙箱系统——这些都不是事后加上去的补丁，而是从一开始就设计好的。

## 4. 依赖最小化

35 行实现状态管理，而不是用 Zustand；自定义 React reconciler，而不是用现成的终端 UI 库。这种"不引入不必要依赖"的哲学，使得代码库更容易理解和维护。

---

# 总结：这个代码库能教会我们什么

Claude Code 是一个非常优秀的代码库，值得每个工程师深入阅读。它教会我们：

1. **简单的方案往往更好**——35 行的状态管理比复杂的第三方库更可靠
2. **类型系统是强大的设计工具**——不要只把 TypeScript 当 JavaScript 用
3. **性能优化需要贯穿始终**——但不要过度优化，要在可维护性和性能之间取得平衡
4. **安全是设计出来的**——从第一天起就要考虑安全问题
5. **好的架构让扩展变得简单**——依赖注入、分层设计、管线模式，这些都是好架构的基石

如果你也对 AI Agent 的架构设计感兴趣，我强烈推荐你去读一读 Claude Code 的源码。相信我，你会收获很多。

---

**文章路径确认**：`/Users/nic/Documents/workspace/luzhongqiu.github.io/source/_posts/2026-04-02-claude-code-source-code-deep-dive.md`
