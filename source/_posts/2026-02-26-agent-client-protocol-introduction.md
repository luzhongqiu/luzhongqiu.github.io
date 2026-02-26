---
title: Agent Client Protocol（ACP）：AI 编码世界的 LSP
date: 2026-02-26 10:00:00
categories:
  - AI
tags:
  - ACP
  - Agent
  - Protocol
  - MCP
  - IDE
---

# 写在前面

如果你用过 VS Code + Copilot、Zed + Claude、Cursor 等工具，你可能已经注意到一个现象：每个 AI Coding Agent 都需要跟编辑器深度集成，而每次集成都是各搞各的，互不兼容。

换一个 Agent，就得在编辑器里重新配置一遍；换一个编辑器，原来的 Agent 不一定能用。

**Agent Client Protocol（ACP）** 就是为了解决这个问题诞生的。

---

# 一、它是什么？

ACP（Agent Client Protocol）是一个**标准化 AI Coding Agent 与代码编辑器（IDE）之间通信**的开放协议。

类比来说：

> ACP 之于 AI Agent，就像 **LSP（Language Server Protocol）** 之于语言工具。

LSP 出现之前，每个编辑器都要为每种编程语言单独实现代码补全、跳转、诊断。LSP 出现之后，语言服务器只需实现一次，任何支持 LSP 的编辑器都可以直接用。

ACP 要解决的是同样的 N×M 问题：

![ACP 解决 N×M 问题](/img/acp/nm-problem.svg)


---

# 二、整体架构

## 两个角色：Client 和 Agent

ACP 定义了两个核心角色：

**Client（客户端）**：通常是代码编辑器（Zed、VSCode、JetBrains 等），也可以是其他 UI。负责：
- 管理用户交互
- 控制文件系统访问
- 提供终端能力
- 渲染 Agent 的输出

**Agent（代理）**：AI 编码代理（Claude、Copilot、Cline、Kimi Code 等），负责：
- 接收用户 prompt
- 调用 LLM 推理
- 执行工具调用（读写文件、运行命令）
- 流式返回结果

## 通信方式

目前 ACP 支持两种传输：

| 场景 | 传输方式 |
|------|---------|
| 本地 Agent | JSON-RPC over **stdio**（Agent 作为编辑器子进程启动） |
| 远程 Agent | HTTP / WebSocket（**草案阶段**，尚未正式支持） |

本地场景下，编辑器直接 spawn 一个 Agent 子进程，双方通过标准输入输出通信。这个设计极其简单，几乎任何语言都能实现。

## Session 模型

一个连接可以承载多个并发 **Session**，每个 Session 有自己独立的对话上下文。用户可以同时开多条"思路线"而互不干扰。

![ACP Session 模型](/img/acp/session-model.svg)


---

# 三、一次完整的交互流程

下面用时序图描述一次典型的 prompt 交互：

![ACP 交互时序图](/img/acp/sequence-diagram.svg)


整个流程用 **JSON-RPC 2.0** 编码，双向通信：

- **Methods**：有 request/response 的调用（如 `initialize`、`session/prompt`）
- **Notifications**：单向推送，不需要响应（如 `session/update`，用于流式输出）

Agent 通过密集的 `session/update` notification 实现实时流式 UI 更新，用户能看到 Agent 在逐步思考、执行。

---

# 四、协议的核心特性

## 4.1 双向能力暴露

ACP 不是单向的"Client 问 Agent 答"，而是**真正双向**的：

**Agent 可以调用 Client 提供的方法：**

| 方法 | 作用 |
|------|------|
| `fs/read_text_file` | 读取文件内容 |
| `fs/write_text_file` | 写入文件内容 |
| `terminal/create` | 创建终端 |
| `terminal/output` | 获取终端输出 |
| `session/request_permission` | 执行工具前请求用户授权 |

这意味着 Agent 可以主动读写用户的代码文件、运行命令，而不需要编辑器预先把所有内容塞给它。

## 4.2 原生 Diff 支持

ACP 内置了专为代码变更设计的 **diff 内容类型**：

```json
{
  "type": "diff",
  "path": "/project/src/main.py",
  "oldText": "def hello():\n    print('hi')",
  "newText": "def hello(name: str):\n    print(f'hi {name}')"
}
```

编辑器收到这个消息后，可以直接渲染成漂亮的 diff 视图，让用户清楚看到 Agent 改了什么，再决定是否接受。

## 4.3 工具调用权限控制

Agent 执行工具（写文件、运行脚本）前，必须向用户请求授权：

```json
{
  "method": "session/request_permission",
  "params": {
    "toolCall": { "title": "修改 config.py" },
    "options": [
      { "optionId": "allow-once", "name": "允许（仅此次）", "kind": "allow_once" },
      { "optionId": "allow-always", "name": "始终允许", "kind": "allow_always" },
      { "optionId": "reject", "name": "拒绝", "kind": "reject_once" }
    ]
  }
}
```

用户可以精细控制 Agent 的操作权限，不用担心 Agent "悄悄"改了东西。

## 4.4 Agent Plan

Agent 可以在开始执行前发布一个**执行计划**：

```json
{
  "sessionUpdate": "plan",
  "entries": [
    { "content": "读取当前实现", "status": "pending" },
    { "content": "分析性能瓶颈", "status": "pending" },
    { "content": "重写核心函数", "status": "pending" },
    { "content": "运行测试确认", "status": "pending" }
  ]
}
```

编辑器可以把这个计划实时渲染给用户，每个步骤完成后更新状态，让用户清楚知道 Agent 在干什么。

## 4.5 与 MCP 的集成

ACP 和 MCP（Model Context Protocol）是互补的：

- **MCP**：解决 Agent 如何访问外部工具和数据源（数据库、API、文件系统等）
- **ACP**：解决 Agent 如何与编辑器交互

编辑器在创建 Session 时，可以把用户配置的 MCP Server 信息传给 Agent，Agent 直接连接这些 MCP Server 获取工具能力：

![ACP 与 MCP 集成架构](/img/acp/mcp-integration.svg)


---

# 五、当前生态

ACP 由 Zed 编辑器团队发起，目前已经有相当规模的生态：

**支持 ACP 的 Agent（部分）：**

| Agent | 说明 |
|-------|------|
| GitHub Copilot | 公开预览阶段 |
| Claude Agent | 通过 Zed 的 SDK adapter |
| Gemini CLI | Google 官方 |
| Kimi CLI | 月之暗面 |
| Cline | 开源，社区热门 |
| OpenHands | 开源，多步骤 Agent |
| Goose | Block（Square 母公司）出品 |
| Qwen Code | 阿里通义千问 |
| OpenCode | SST 出品 |

**支持 ACP 的 Client（部分）：**

- **编辑器**：Zed、VSCode（插件）、JetBrains、Neovim（多个插件）、Emacs
- **其他**：Obsidian、marimo notebook、Chrome 扩展、iOS App

---

# 六、优点与局限

## 优点

**1. 打破 N×M 集成困境**
一套协议打通所有 Agent × Editor 组合，开发者可以自由选工具。

**2. UX 原生设计**
内置 diff、tool call 状态、agent plan、slash commands，天然适配编码场景，而不是把聊天界面硬套进去。

**3. 双向通信**
Agent 可以主动请求 Client 能力，不只是被动回答问题。

**4. 与 MCP 兼容**
复用 MCP 的类型定义，跟整个 AI 工具生态共生共长。

**5. 生态已初具规模**
30+ Agents、30+ Clients，覆盖主流工具。

## 局限

**1. 远程 Agent 支持尚未完成**
HTTP/WebSocket 传输还是草案，目前主要靠 stdio（本地子进程），云端 Agent 接入受限。

**2. 聚焦编码场景**
专为 IDE + Coding Agent 设计，通用 AI Agent 应用无法直接套用。

**3. 信任模型较简单**
文档明确说"ACP 工作在你信任该 Agent 的前提下"，缺乏精细的权限沙箱。

**4. 与 MCP 边界模糊**
两者都在解决 AI 与环境集成的问题，有一定概念重叠，社区存在混淆。

**5. 协议尚年轻**
RFD（Request for Dialog，类似 RFC）列表中有大量未完成提案，核心功能仍在演进。

---

# 七、与相关协议对比

| | ACP | MCP | LSP |
|-|-----|-----|-----|
| **解决问题** | Agent ↔ 编辑器通信 | Agent ↔ 工具/数据源 | 语言服务 ↔ 编辑器 |
| **通信方向** | 双向（编辑器也可被 Agent 调用） | 主要单向 | 双向 |
| **传输** | stdio 为主 | stdio / HTTP | stdio / TCP |
| **适用场景** | Coding Agent UX | 工具调用/资源访问 | 代码补全/跳转/诊断 |
| **成熟度** | 较新，活跃演进 | 较成熟（Anthropic 主导） | 非常成熟（微软主导） |

---

# 总结

ACP 想做的事很清晰：**让任意 AI Coding Agent 在任意编辑器里开箱即用**，就像 LSP 让任意语言在任意编辑器里开箱即用一样。

协议本身设计得很务实——用成熟的 JSON-RPC 2.0，复用 MCP 的数据类型，把编码 UX 所需的原语（diff、permission、plan、tool call）都内置进来。

生态已经跑起来了，GitHub Copilot、Claude、Gemini、Kimi 这些主流 Agent 都在接入。对于开发者来说，现在了解 ACP 正是时候：它不是遥远的未来标准，而是正在成为现实的基础设施。

---

# 参考资料

- [ACP 官方文档](https://agentclientprotocol.com/get-started/introduction)
- [ACP 架构说明](https://agentclientprotocol.com/get-started/architecture)
- [ACP 协议概览](https://agentclientprotocol.com/protocol/overview)
- [LSP 协议（对比参考）](https://microsoft.github.io/language-server-protocol/)
- [MCP 协议（对比参考）](https://modelcontextprotocol.io)
