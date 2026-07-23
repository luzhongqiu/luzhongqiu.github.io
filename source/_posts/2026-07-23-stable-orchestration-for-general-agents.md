---
title: "在松散智能体中寻找稳定控制：调度与动态工作流方案追踪"
date: 2026-07-23 10:30:00
updated: 2026-07-23 11:06:49
categories:
  - 智能体工程
tags:
  - 通用智能体
  - 智能体调度
  - 工作流
  - Agentic Workflow
---

> 这是一篇长期维护的方案追踪文档。首版研究截止到 2026-07-23，只采用官方文档、官方工程博客、官方仓库与论文原文。

我想解决的并不是“如何让智能体每次走完全相同的路径”，而是一个更现实的问题：

> 当任务路径必须由模型临场决定时，怎样让系统仍然拥有可恢复、可审计、可限额、可中止、可验证的确定性外壳？

为了避免把产品宣传、工程经验和本文结论混在一起，下文使用三种标记：

- **官方事实**：官方文档或源码明确描述的机制。
- **一方主张**：厂商或作者根据自身实验给出的经验判断，不自动视作普遍规律。
- **本文推断**：基于多个一手来源形成的设计结论，仍需在具体业务中验证。

## 一、问题定义：稳定不是固定路径，而是受控的不确定性

Anthropic 把 agentic system 分为两类：workflow 的执行路径由代码预先定义，agent 则由模型动态决定过程与工具使用；前者更可预测，后者更灵活。它同时建议从最简单的方案开始，只在必要时增加复杂度。[官方事实；来源：Anthropic《Building effective agents》](https://www.anthropic.com/engineering/building-effective-agents)

这组区分很有用，但生产系统通常不会停留在二选一。真正可用的通用智能体更像一个混合体：

- 允许模型决定“下一步做什么、调用谁、是否改计划”；
- 不允许模型决定“权限边界、状态提交方式、重试语义、预算上限、验收标准”；
- 让模型拥有策略自由，让运行时掌握机制控制。

**本文推断：** 稳定控制的目标不是消灭随机性，而是把随机性收敛到几个显式决策点。只要状态转移、外部副作用和停止条件仍由确定性系统接管，模型可以在边界内保持松散和灵活。

### 需要分别控制的四种“不稳定”

| 不稳定来源 | 典型表现 | 应落在哪一层控制 |
| --- | --- | --- |
| 推理不稳定 | 同一任务产生不同计划、路由或答案 | 结构化决策、候选约束、外部评测 |
| 执行不稳定 | 进程崩溃、网络失败、重复调用工具 | checkpoint、event log、幂等、重试与补偿 |
| 权限不稳定 | 越权写入、误删、被工具输出提示注入 | capability、deny-first 策略、sandbox、审批 |
| 组织不稳定 | 子智能体重复劳动、互相覆盖、无限讨论 | 任务依赖、租约、隔离工作区、预算与终止条件 |

这里最容易犯的错误，是用“记住对话”代替“记住执行”。会话历史回答的是“模型看过什么”，执行状态回答的是“哪些动作已经可靠完成、哪些副作用可能已经发生”。两者必须分开。

## 二、分层控制模型：把自由放在中间，把硬约束放在上下两端

### 第 0 层：触发与租约

定时器、Webhook、事件总线只负责产生一次 run。每次 run 必须有稳定的 `run_id`、输入快照、版本号和互斥租约，防止同一任务被重复并发消费。

**本文推断：** cron 不是工作流引擎。它只解决“何时开始”，不解决重入、恢复、重复副作用和发布一致性。

### 第 1 层：目标、验收与预算

任务开始前固定：

- 目标与不变量；
- 可接受的最终状态；
- 最大轮数、模型调用数、工具调用数、墙钟时间、费用；
- 最大递归深度、并发数、失败次数；
- 哪些动作必须人工批准。

预算不能只设一个 token 上限。某个代理可能 token 很少，却创建大量子任务、发起高风险写操作，或在网络重试中挂很久。

### 第 2 层：类型化状态与结构化决策

模型不直接返回“下一步随便做什么”，而是返回一个有限联合类型，例如：

```text
Decision =
  | Plan(steps, assumptions)
  | CallTool(tool, args, expected_effect)
  | Delegate(role, task, budget)
  | AskHuman(question, risk)
  | Finish(answer, evidence)
  | Abort(reason)
```

业务状态、执行状态、消息历史、产物引用分别存储。结构化输出只保证“形状正确”，并不保证“语义正确”；因此还需要不变量校验和权限检查。

### 第 3 层：动态规划与受限路由

这一层可以让模型自由发挥：动态拆解、选择工具、选择专家、循环修订。但可达节点集合、递归深度、并发度、终止条件仍由代码限定。

Anthropic 的 orchestrator-workers 模式就是典型例子：中央 LLM 动态拆分任务、委派给 worker，再汇总结果，适合无法预先知道子任务数量和性质的任务，如代码修改。[官方事实；来源：Anthropic《Building effective agents》](https://www.anthropic.com/engineering/building-effective-agents)

### 第 4 层：显式状态机与持久化执行

将一次自由决策编译成一个显式状态转移：

```text
READY -> DECIDING -> POLICY_CHECK -> WAITING_APPROVAL
                     |                 |
                     v                 v
                  EXECUTING ------> VERIFYING
                     |                 |
                     v                 v
                  RETRYING       COMMITTED / COMPENSATING
```

运行时负责 checkpoint、replay、超时、取消、重试和版本迁移。模型不能通过一句自然语言改变这些语义。

### 第 5 层：副作用网关

所有有副作用的工具都必须经过统一网关：

- 使用稳定的幂等键；
- 先记录意图，再执行动作；
- 区分可安全重试、需查询结果、需补偿、禁止自动重试；
- 按风险做静态策略检查或人工审批；
- 把凭据留在网关或 vault，不交给模型和执行沙箱。

Temporal 明确建议把 API/LLM 等易失败或非确定操作放入 Activity，Workflow 本身保持可重放的确定性；Activity 默认会重试，因此 Activity 代码应按可能重复执行来设计幂等性。[官方事实；来源：Temporal Retry Policies](https://docs.temporal.io/encyclopedia/retry-policies)

### 第 6 层：可观测与评测

每次 run 至少记录：

- 决策与状态转移；
- 模型、prompt/agent/workflow 版本；
- 工具入参摘要、结果摘要、幂等键；
- 权限判定、审批者和依据；
- token、费用、轮数、耗时、重试与补偿；
- 最终环境状态和验收结果。

Anthropic 将完整试验记录称为 transcript/trace/trajectory，并区分“代理声称完成”与“环境中是否真的完成”的 outcome；其建议是组合代码、模型和人工 grader，并同时维护能力评测与接近 100% 通过率的回归评测。[官方事实与一方主张；来源：Anthropic《Demystifying evals for AI agents》](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)

## 三、Claude Code 式动态工作流：它稳定在哪里，又没有稳定什么

Claude Code 很适合作为“动态工作流”的观察对象，因为它不是先画完整 DAG，再让模型填空，而是让模型边探索边决定下一步。

### 1. 官方 Dynamic Workflows：把易漂移的编排计划移进可读脚本

2026 年 Claude Code 已提供正式的 Dynamic Workflows 能力：Claude 针对任务生成一段 JavaScript 编排脚本，独立 workflow runtime 在后台执行它，用 `agent()` 和 `pipeline()` 批量调度 subagent。循环、分支和中间结果保存在脚本与脚本变量中，主会话只接收最终结果。[官方事实；来源：Claude Code Dynamic Workflows](https://code.claude.com/docs/en/workflows)

官方对四种扩展方式的区分非常清楚：

| 方式 | 谁决定下一步 | 中间结果在哪里 | 可复用的是什么 |
| --- | --- | --- | --- |
| Subagent | Claude 逐轮决定 | Claude 上下文 | worker 定义 |
| Skill | Claude 按说明执行 | Claude 上下文 | 指令 |
| Agent team | lead agent 逐轮决定 | 共享任务表 | team 定义 |
| Dynamic workflow | JavaScript 脚本 | 脚本变量 | 完整编排 |

[官方事实；来源：Claude Code Dynamic Workflows](https://code.claude.com/docs/en/workflows)

一个保存后的 workflow 大致是这样：

```javascript
export const meta = {
  name: "audit-routes",
  description: "逐文件审计并交叉验证",
};

const found = await agent("列出所有 route 文件", {
  schema: {
    type: "object",
    required: ["files"],
    properties: { files: { type: "array", items: { type: "string" } } },
  },
});

const audits = await pipeline(found.files, file =>
  agent(`审计 ${file}，只报告有证据的问题`, { label: file }),
);

const verified = await pipeline(audits.filter(Boolean), finding =>
  agent(`对抗性复核这条发现：${finding}`),
);

return verified.filter(result => result.confirmed);
```

脚本可保存到项目的 `.claude/workflows/` 或个人的 `~/.claude/workflows/`，以后作为命令复用。每次 run 的实际脚本也写入 session 目录，可查看、diff、修改后重跑。[官方事实；来源：Claude Code Dynamic Workflows](https://code.claude.com/docs/en/workflows)

它提供了三种很具体的稳定性：

1. **控制流稳定**：loop、branch、fan-out/fan-in 不再依赖主模型每一轮都记得原计划，而由代码执行。
2. **上下文稳定**：大量中间结果留在脚本变量中，避免所有 worker transcript 挤进主上下文。
3. **重复与检查稳定**：同一审计、迁移或交叉验证模式可以保存、阅读和复跑，而不是每次临场生成。

runtime 还施加硬上限：最多 16 个并发 agent（低 CPU 机器可能更少），每个 run 最多 1,000 个 agent。它可以暂停、停止或重启单个 agent，并显示各阶段 agent 数、token 与耗时。[官方事实；来源：Claude Code Dynamic Workflows](https://code.claude.com/docs/en/workflows)

但它的恢复边界同样明确：

- 同一 Claude Code session 内暂停再恢复时，已完成 agent 直接返回缓存结果；
- 暂停时仍在运行的 agent 不保存，恢复时会从头重启；
- 退出 Claude Code 后，新 session 会把 workflow 从头启动；
- workflow 中途不接受普通用户输入，只有权限 prompt 可以暂停；需要阶段签字时，应拆成多个 workflow；
- workflow 脚本本身没有直接文件系统或 shell 权限，副作用由 subagent 工具调用执行；
- workflow subagent 固定运行在 `acceptEdits` mode 并继承 tool allowlist，文件编辑自动批准；未在 allowlist 中的 shell、Web 和 MCP 调用仍可能触发权限 prompt，并继续受 sandbox 约束。

[官方事实；来源：Claude Code Dynamic Workflows](https://code.claude.com/docs/en/workflows)

**本文推断：** 这是一种“session 内可恢复的脚本化多 agent 编排”，不是跨进程、跨 session 的 durable execution。它缓存的是已完成 agent result，而没有公开承诺外部工具的幂等、事务、补偿或结果不明时的 reconcile。对代码审计、研究、可重跑迁移很有价值；对付款、发布、工单写入等业务副作用，仍需要外部执行账本和 durable orchestrator。

### 2. 内核仍是动态 agent loop

Claude Code 官方把循环描述为三个交织阶段：收集上下文、采取行动、验证结果。每次工具结果都会返回上下文，影响下一个决策。[官方事实；来源：How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)

这意味着流程图通常在运行后才完整显现：

```text
用户目标
  -> 搜索代码
  -> 读取文件
  -> 形成局部假设
  -> 编辑
  -> 测试失败
  -> 再搜索
  -> 修复
  -> 再验证
  -> 完成
```

**本文推断：** Claude Code 的关键不是“无工作流”，而是工作流被延迟到运行期生成；其稳定性来自循环外壳和工具边界，而不是来自预先固定的路径。

### 3. `CLAUDE.md`、skills 与工具描述构成软控制面

项目规则、上下文、skills 和工具 schema 会影响模型决策。skills 按需加载，subagent 拥有独立上下文并只把结果摘要返回主会话，可减轻主上下文膨胀。[官方事实；来源：How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)

但这些仍是“模型会尽量遵守”的软约束，不能代替权限系统和状态机。

### 4. hooks、permissions 与 sandbox 构成硬控制面

Claude Code 的 hooks 可在 `PreToolUse`、`PostToolUse`、`PermissionRequest`、`Stop`、`SubagentStart/Stop` 等生命周期点运行确定性代码；`PreToolUse` 可以阻止、修改或要求确认工具调用，deny/ask 规则仍具有优先权。[官方事实；来源：Hooks reference](https://code.claude.com/docs/en/hooks)、[Configure permissions](https://code.claude.com/docs/en/permissions)

Anthropic 还把 sandbox 描述为文件系统与网络两条边界。它不是让分类器“更相信模型”，而是限制模型即使做错时能够造成的最大损害。[官方事实；来源：Anthropic《Beyond permission prompts》](https://www.anthropic.com/engineering/claude-code-sandboxing)

Anthropic 2026 年的工程复盘进一步主张：频繁人工确认会造成 approval fatigue，纯概率分类器也必然有漏判，因此 containment 应作为纵深防御，而不是由模型判断替代环境隔离。[一方主张；来源：Anthropic《How we contain Claude across products》](https://www.anthropic.com/engineering/how-we-contain-claude)

### 5. subagents、agent teams 与 worktrees 控制任务组织和冲突

subagent 在独立上下文中执行聚焦任务并回报摘要；agent team 则由 lead、独立 teammate、共享任务表和 mailbox 构成，任务依赖完成后可自动解锁。[官方事实；来源：Claude Code Agent Teams](https://code.claude.com/docs/en/agent-teams)

worktree 为并行 session 或 subagent 提供独立文件树，避免编辑互相覆盖。[官方事实；来源：Claude Code Worktrees](https://code.claude.com/docs/en/worktrees)

但 agent teams 目前仍被官方标记为 experimental，并明确存在 session resume、task coordination 和 shutdown 的已知限制。[官方事实；来源：Claude Code Agent Teams](https://code.claude.com/docs/en/agent-teams)

**本文推断：** 多智能体不是稳定性的默认来源。只有在任务可以清晰分区、产物可合并、依赖可显式表达时，并行才增加吞吐；否则它只是把单代理的不确定性乘以参与者数量。

### 6. session 与 checkpoint 提供“可回看、可撤销”，不是通用 durable execution

Claude Code 把消息、工具调用和结果持续写入本地 JSONL session，并在编辑前快照受影响文件，因此可 resume、fork、rewind。[官方事实；来源：How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)、[Manage sessions](https://code.claude.com/docs/en/sessions)

但 checkpoint 只跟踪其文件编辑工具造成的修改；Bash 命令和外部进程改动不在回滚范围内，官方也明确说它不能替代 Git。[官方事实；来源：Claude Code Checkpointing](https://code.claude.com/docs/en/checkpointing)

因此：

- session persistence 是对话与事件留存；
- file checkpoint 是局部撤销；
- Git/worktree 是代码版本与隔离；
- durable execution 才是崩溃后按明确语义恢复未完成步骤。

四者不能互换。

### 7. budget 与 telemetry 提供止损和复盘

Claude Code 非交互模式提供 `--max-turns` 和 `--max-budget-usd`，并支持 JSON Schema 约束最终输出。[官方事实；来源：Claude Code CLI reference](https://code.claude.com/docs/en/cli-usage)

Claude Code 也可通过 OpenTelemetry 导出指标、事件和 beta traces；trace 层级可以把一次用户交互关联到模型请求、工具调用、权限等待和 hook 执行。[官方事实；来源：Claude Code Monitoring](https://code.claude.com/docs/en/monitoring-usage)

### 8. 长时任务真正依赖“结构化交接产物”

Anthropic 的长时 coding harness 实验发现，仅靠 compaction 不足以让代理跨多个上下文窗口持续可靠工作。其做法是让 initializer 建立 feature list、进度文件、启动脚本和 Git 基线，再让后续 coding agent 每次只推进一个增量，并留下可验证的干净状态。[一方主张；来源：Anthropic《Effective harnesses for long-running agents》](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

2026 年的后续实验又加入 planner、generator、evaluator，把生成与验收分离，并通过可测试的 sprint contract 推进长时任务；作者同时提醒，harness 对模型能力的假设会随模型升级而过时，需要做消融和持续调整。[一方主张；来源：Anthropic《Harness design for long-running application development》](https://www.anthropic.com/engineering/harness-design-long-running-apps)

**本文推断：** Claude Code 式动态工作流最可复用的部分，不是某个 prompt，而是这组组合：

> 动态工具循环 + 脚本化编排 + 显式任务账本 + 独立工作区 + 生命周期拦截器 + 风险边界 + 外部验证 + 可恢复交接产物。

## 四、方案对照：它们解决的不是同一层问题

| 方案 | 主要控制形态 | 动态性 | 恢复语义 | 人工/权限 | 观测与评测 | 适合承担的角色 |
| --- | --- | --- | --- | --- | --- | --- |
| Claude Code / Claude Agent SDK | 模型驱动工具循环、JS Dynamic Workflows、hooks、subagents | 高 | workflow 同 session 缓存已完成 agent；session resume、file rewind；均不等于通用 durable execution | permissions、hooks、sandbox、审批 | workflow 阶段进度、OTel、transcript、工具事件 | 交互式编码 agent、脚本化多 agent 编排与动态 harness |
| LangGraph | 显式 graph/state + 条件边/函数式入口 | 中高 | 每步 checkpoint、interrupt、replay/fork；Graph API 在节点边界恢复 | interrupt/HITL，权限需应用层补齐 | LangSmith tracing/eval 生态 | 状态化 agent 图与可检查执行 |
| Temporal | 确定性 Workflow + Activities + event history | 中；模型动态决策需封装为 Activity/数据 | 确定性 replay、默认 Activity retry、长时 timers/signals | 人工等待可建模；权限策略需应用层实现 | Event History、Visibility、OTel 集成 | 最强的业务级 durable execution 外壳 |
| Google ADK 2.0 | graph、语言原生 dynamic workflow、agent nodes | 高 | dynamic node 自动 checkpoint；恢复时跳过成功子节点 | human input、tool confirmation、callbacks | logging、tracing、eval | “代码控制流 + agent 节点”的新桥接层 |
| OpenAI Agents SDK | Runner loop、handoffs、agents-as-tools | 高 | session 是对话记忆；`RunState` 支持审批暂停/序列化/恢复 | tool approval、input/output/tool guardrails | 内建 tracing，与 eval 平台衔接 | 轻量多 agent loop 与 HITL |
| AutoGen AgentChat/Core | 群聊、selector、swarm、event runtime | 高 | agent/team `save_state`/`load_state`；运行中保存可能不一致 | UserProxy/Handoff、终止条件 | logging、OpenTelemetry | 多 agent 协作实验与消息型运行时 |
| Semantic Kernel | sequential/concurrent/handoff/group chat/magentic | 中高 | 旧 orchestration 不是 durable engine | callbacks/企业集成，具体策略自行实现 | OTel logs/metrics/traces | 既有 SK 项目；新项目应评估其继任者 |

### LangGraph：agent-native 的显式状态与 checkpoint

LangGraph 在每个 super-step 保存 graph state checkpoint，可支持 HITL、memory、time travel 和失败恢复；同一 super-step 中已成功节点的 pending writes 可保留，恢复时不必重跑它们。[官方事实；来源：LangGraph Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)

它的 Graph API 通常从失败节点的开头恢复；Functional API 则从 entrypoint 重放，但读取已缓存的 task 结果。因此官方要求把随机性和外部副作用封装进 task，并让外部调用具备幂等性。[官方事实；来源：LangGraph Functional API](https://docs.langchain.com/oss/python/langgraph/functional-api)

需要注意，time travel 的 replay 会重新执行 checkpoint 之后的节点，包括 LLM、API 和 interrupt，并不等同于读取旧缓存。[官方事实；来源：LangGraph Time Travel](https://docs.langchain.com/oss/python/langgraph/use-time-travel)

另一个生产边界是版本升级：LangGraph 默认让暂停线程恢复到最新 graph 代码，不会自动把 run 固定到启动时版本；删节点、改 state schema 或改变 task 顺序可能破坏恢复。[官方事实；来源：LangGraph Backward Compatibility](https://docs.langchain.com/oss/python/langgraph/backward-compatibility)

### Temporal：把 agent 当作不确定 Activity，把流程当作可重放程序

Temporal 通过 Event History 重放 Workflow；发生故障时从最后记录事件恢复。Workflow 要满足确定性约束，外部 API、LLM 和其他非确定操作应放入 Activity。[官方事实；来源：Temporal Workflow Execution](https://docs.temporal.io/workflow-execution)

Activity 默认按声明式 Retry Policy 指数退避重试，Workflow 默认不整体重试。Temporal 的保证不是神奇的“外部世界 exactly-once”，所以支付、发布、发信等 Activity 仍必须使用业务幂等键，必要时用 Saga/补偿动作恢复业务一致性。[官方事实；来源：Temporal Retry Policies](https://docs.temporal.io/encyclopedia/retry-policies)、[Temporal Saga 技术指南](https://pages.temporal.io/rs/250-WIU-007/images/tech-guide-saga-pattern-made-easy.pdf)

**本文推断：** 当 agent 要跨小时或天运行，并会触达钱、库存、发布、工单等真实业务状态时，Temporal 更适合作为 agent runtime 外面的“可靠骨架”，而不是让 LLM 本身承担恢复协议。

### Google ADK 2.0：当前最值得跟踪的桥接方案

Google ADK 2.0 的 Dynamic Workflows 支持 Python 与 Go。它允许用 `while`、条件、递归、`async/await` 等普通语言结构组织 node，而不是把所有复杂路径硬塞进静态图；同时会跟踪每个 node 执行，恢复时自动跳过已成功子节点。[官方事实；来源：ADK Dynamic Workflows](https://adk.dev/graphs/dynamic/)

其 re-entry 语义很接近轻量 durable function：动态 orchestrator 在恢复时从函数开头重入，但通过 checkpoint 返回已完成 child activation 的结果；叶子节点也可配置为把恢复载荷直接 handoff 给后继节点。[官方事实；来源：ADK Dynamic Workflows](https://adk.dev/graphs/dynamic/)

ADK 早期的 resumability 文档同时明确警告：工具在恢复时是 at-least-once，可能执行多次；对购买等重复有害的工具，调用者必须自行去重。修改已经暂停的 workflow 后再 resume 也不受支持。[官方事实；来源：ADK Resume Agents](https://adk.dev/runtime/resume/)

**本文推断：** ADK 2.0 正在填补 LangGraph 的图式可检查性和 Temporal 的语言原生 durable orchestration 之间的空档，但仍需验证生产存储、版本迁移、并发恢复、补偿与运维工具是否达到关键业务要求。

### OpenAI Agents SDK：轻量 loop 很完整，durability 边界要看清

OpenAI Agents SDK 的 Runner 执行“模型调用—工具/交接—再调用”的循环，并通过 `max_turns` 停止过长 run；Agent 可声明 handoffs、structured `output_type` 和 guardrails。[官方事实；来源：Running agents](https://openai.github.io/openai-agents-python/running_agents/)、[Agents](https://openai.github.io/openai-agents-python/agents/)

Sessions 负责跨 run 保存对话历史，不是通用 workflow checkpoint。HITL 的 `RunState` 则可序列化到数据库或队列，在工具审批后恢复，是一个明确但范围有限的 durable pause/resume 边界。[官方事实；来源：Sessions](https://openai.github.io/openai-agents-python/sessions/)、[Human-in-the-loop](https://openai.github.io/openai-agents-python/human_in_the_loop/)

SDK 默认追踪模型生成、工具、handoff 和 guardrail；tool guardrail 目前主要覆盖 `function_tool`，对 hosted tools、内建执行工具与 handoff 并非统一生效。[官方事实；来源：OpenAI Agents SDK Tracing](https://openai.github.io/openai-agents-python/tracing/)、[Guardrails](https://openai.github.io/openai-agents-python/guardrails/)

### AutoGen：强在协作拓扑，弱在默认持久化语义

AutoGen 的 `SelectorGroupChat` 可由模型动态选择下一位 speaker，`Swarm` 可由当前 agent 通过 handoff 局部决定下一位；termination condition 支持消息数、token、timeout、handoff、外部停止等组合。[官方事实；来源：Selector Group Chat](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/selector-group-chat.html)、[Termination](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/termination.html)

`GraphFlow` 提供顺序、并行、条件和循环，但官方仍标为 experimental。Agent/team 可 `save_state`/`load_state`，然而官方 API 警告：团队运行中保存可能得到不一致状态。[官方事实；来源：GraphFlow](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/graph-flow.html)、[Teams API](https://microsoft.github.io/autogen/stable/reference/python/autogen_agentchat.teams.html)

**本文推断：** AutoGen 适合研究 agent 之间如何协作，不应仅因“能保存状态”就被当作 durable workflow engine。

### Semantic Kernel：需要把历史能力与当前产品路线分开

Semantic Kernel Agent Orchestration 支持 concurrent、sequential、handoff、group chat、magentic，但官方文档把这些能力标为 experimental。[官方事实；来源：Semantic Kernel Agent Orchestration](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/)

截至本次追踪，Microsoft 官方仓库已说明 Microsoft Agent Framework 是 Semantic Kernel 的继任者；官方维护者也明确建议原 SK Process Framework 用户转向 Agent Framework Workflows。[官方事实；来源：Semantic Kernel 官方仓库](https://github.com/microsoft/semantic-kernel)、[官方仓库讨论 #12270](https://github.com/microsoft/semantic-kernel/discussions/12270)

**本文推断：** 对存量 SK 项目，可继续利用其 agent 与 OTel 能力；对新建的稳定编排层，不宜再把旧 Process Framework 作为长期押注，应单独评估 Microsoft Agent Framework。

## 五、可复用控制模式

### 模式 1：确定性外壳，非确定性内核

只让模型输出决策，不让模型直接提交状态：

```text
model decides -> schema validates -> policy authorizes
              -> runtime executes -> verifier checks
              -> state store commits
```

任何一步失败，都能回答“失败前最后一个已提交状态是什么”。

### 模式 2：双账本

至少维护两本账：

1. **执行账本**：step、attempt、status、input hash、output ref、idempotency key、错误和补偿状态。
2. **认知账本**：计划、假设、证据、进度摘要、未解决问题。

前者由运行时写，后者允许 agent 更新。认知账本丢失会让模型变笨；执行账本丢失会让系统重复扣款、重复发布或无法恢复。

### 模式 3：副作用采用“至少一次 + 幂等”，不要幻想端到端 exactly-once

推荐协议：

1. 生成 `action_id = hash(run_id, logical_step, canonical_args)`；
2. 持久化 `PENDING` 意图；
3. 通过 policy/approval；
4. 带 `action_id` 调用工具；
5. 工具端记录并去重；
6. 查询或写回结果，提交 `SUCCEEDED`；
7. 若结果未知，先 reconcile，再决定是否重试。

对无法幂等的操作，必须设计补偿，或强制人工确认。

### 模式 4：按失败类型分层重试

| 失败 | 默认策略 |
| --- | --- |
| 429、短暂网络错误 | 有界指数退避 + jitter |
| schema 不合法 | 把校验错误返回模型，限制修复次数 |
| 业务前置条件不满足 | 不重试，重新规划或请求人工 |
| 权限拒绝 | 不用换表达方式绕过；终止或升级审批 |
| 结果未知 | 查询幂等记录或外部状态，不盲目重放 |
| 不变量破坏 | 停止新动作，执行补偿并报警 |

### 模式 5：风险分级审批，而不是每步都点“允许”

建议将动作分为：

- L0：纯读取，自动允许；
- L1：工作区内可逆写入，sandbox 内自动允许；
- L2：外部可逆写入，策略检查后自动或批量批准；
- L3：发布、付款、删库、通知用户等高影响动作，必须审批；
- L4：策略禁止，任何 prompt 都不能解锁。

人工批准时展示的是“即将发生的副作用、目标、diff、幂等键和回滚办法”，而不是整段思维过程。

### 模式 6：把预算视为状态机不变量

每次转移前检查：

```text
turns <= max_turns
cost <= max_cost
wall_time <= deadline
tool_calls[tool] <= quota[tool]
depth <= max_depth
active_children <= max_concurrency
retries[step] <= retry_limit
```

预算耗尽时进入 `PAUSED_BUDGET` 或 `FAILED_BUDGET`，不能让模型自行宣布“再做最后一次”。

### 模式 7：生成者与验证者分离

验证优先级应是：

1. 环境/数据库/文件的真实 outcome；
2. 单元测试、类型检查、静态分析、策略断言；
3. 独立 evaluator 的 rubric；
4. 生成 agent 的自我评价。

Anthropic 的长时 harness 实验观察到 agent 对自身产物的评价偏宽松，独立 evaluator 更容易被调成怀疑式验收。[一方主张；来源：Anthropic《Harness design for long-running application development》](https://www.anthropic.com/engineering/harness-design-long-running-apps)

### 模式 8：版本化所有恢复边界

checkpoint 至少携带：

- workflow/graph version；
- state schema version；
- prompt、tool schema、policy version；
- model family 与关键参数；
- code artifact/commit；
- migration function 或“不支持恢复”的明确标志。

恢复前先做兼容性检查，不要把旧状态静默塞给新流程。

## 六、参考架构与最小实现

### 参考架构

```text
Trigger / API / User
        |
        v
Run Registry ---- lease / deadline / version
        |
        v
Dynamic Planner/Router <---- cognitive ledger / evidence
        |
        v
Typed Decision Validator
        |
        v
Policy Engine ----> Human Approval Queue
        |
        v
Durable Orchestrator <---- event log / checkpoints / timers
        |
        v
Side-effect Gateway ---- idempotency / retry / reconcile / compensation
        |
        v
Sandboxed Tools / Agents / External APIs
        |
        v
Outcome Verifier ----> traces / metrics / eval dataset
```

模型可以放在 planner、worker、evaluator 中；Run Registry、Policy Engine、Durable Orchestrator 与 Side-effect Gateway 不应交给模型自由实现。

### 最小状态结构

```python
class RunState(TypedDict):
    run_id: str
    workflow_version: str
    phase: Literal[
        "ready", "deciding", "waiting_approval", "executing",
        "verifying", "compensating", "succeeded", "failed", "paused"
    ]
    goal: Goal
    business_state: dict
    next_decision: Decision | None
    completed_steps: dict[str, StepReceipt]
    pending_actions: dict[str, ActionIntent]
    budgets: BudgetState
    evidence_refs: list[str]
    last_checkpoint: str
```

### 最小控制循环

```python
async def run(run_id: str):
    state = store.load_for_update(run_id)
    assert_compatible(state)

    while state["phase"] not in TERMINAL:
        assert_budget(state["budgets"])
        assert_invariants(state)

        decision = await planner.decide(public_view(state))
        decision = DecisionAdapter.validate_python(decision)

        if decision.kind == "finish":
            report = await verifier.verify(state, decision)
            state = commit_finish_or_replan(state, report)
            store.checkpoint(state)
            continue

        action = compile_action(decision, state)
        action.idempotency_key = stable_key(
            state["run_id"], action.logical_step, action.canonical_args
        )

        # 先持久化意图，再触发副作用。
        store.record_intent(action)
        verdict = policy.evaluate(action, state)

        if verdict.requires_human:
            store.pause_for_approval(state, action, verdict)
            return
        if verdict.denied:
            state = replan_or_fail(state, verdict)
            store.checkpoint(state)
            continue

        try:
            receipt = await gateway.execute_idempotently(action)
            check = await verifier.verify_receipt(action, receipt)
            state = commit_receipt(state, receipt, check)
        except UnknownExternalOutcome:
            state = await reconcile_before_retry(state, action)
        except RetryableError as error:
            state = schedule_bounded_retry(state, action, error)
        except PermanentError as error:
            state = compensate_or_fail(state, action, error)

        store.checkpoint(state)
```

这段伪代码故意没有把框架写死。小型系统可用数据库事务与任务队列实现；agent 状态复杂时可用 LangGraph/ADK；有长时业务副作用时可把这个循环或每个 step 放入 Temporal。

## 七、失败模式与边界

### 1. “有 checkpoint，所以不会重复执行”

错误。大多数恢复协议都允许某一步至少执行一次。进程可能在外部动作成功后、结果写回前崩溃。没有工具端幂等或 reconcile，checkpoint 也无法判断外部世界发生了什么。

### 2. “保存会话就等于保存工作流”

错误。对话可以完整，但任务依赖、动作状态、租约、审批与补偿仍可能缺失。OpenAI Sessions、Claude Code sessions、AutoGen state 都需要结合其明确的执行语义理解，不能只看“persistent”字样。

### 3. “图天然比循环稳定”

错误。静态图让可达路径更清晰，却不能自动解决节点内部副作用、版本迁移、错误分类与幂等。反过来，语言原生循环也可以在 node/task 边界自动 checkpoint；ADK 2.0 Dynamic Workflows 和 LangGraph Functional API 都在探索这条路线。

### 4. “多 agent 会互相检查，所以更可靠”

错误。多个同源模型可能共享盲点，还会引入重复工作、消息污染、合并冲突和成本爆炸。独立 evaluator 只有在 rubric、工具和 outcome 校验独立时才真正提供新信号。

### 5. “结构化输出消除了幻觉”

错误。schema 只保证数据能被程序解析。`{"approved": true}` 完全可能格式正确但判断错误。关键字段仍要由规则、数据库或独立证据验证。

### 6. “人工审批是最终安全边界”

不充分。高频弹窗会造成疲劳，审批者也可能无法理解真实影响。硬权限、sandbox、凭据隔离和网络出口控制应先缩小 blast radius，人工只处理少量高价值决策。

### 7. “replay 会复现原来的模型结果”

通常不会。Temporal 通过历史事件确定性重建 Workflow，而 LLM/API 放在不重放的 Activity 中；LangGraph time travel 则会重新执行 checkpoint 之后的 LLM/API 节点，可能产生不同结果。必须先理解框架的 replay 单位。

### 8. “长期运行等于一直保持同一个上下文”

上下文不是可靠存储。compaction、摘要和模型变化都可能丢失细节。Anthropic Managed Agents 将 session 设计为独立于 harness 和 sandbox 的追加事件日志，并让无状态 harness 通过 session 重建上下文，这是比“把一切塞进 prompt”更稳的边界。[官方事实；来源：Anthropic《Scaling Managed Agents》](https://www.anthropic.com/engineering/managed-agents)

## 八、目前的选择建议

### 如果你在做交互式通用 agent

先采用 Claude Code / OpenAI Agents SDK 类的动态 loop，但必须加：

- typed decision；
- tool-level guardrail；
- 独立执行账本；
- 多维预算；
- 高风险审批；
- outcome verifier。

### 如果你需要可检查的状态化 agent 流程

优先评估 LangGraph 或 Google ADK 2.0：

- 图结构清晰、需要 time travel/interrupt：LangGraph；
- 希望用普通语言的循环/递归写动态编排，又要自动跳过已成功子节点：ADK 2.0 Dynamic Workflows；
- 两者都要额外补齐业务幂等、权限和版本迁移策略。

### 如果你需要跨天执行并修改关键业务状态

用 Temporal 一类 durable engine 做外层，把 LLM 决策当作 Activity 的结果，把真实动作也放在可审计 Activity 中。不要让 agent framework 单独承担订单、付款、发布等恢复责任。

### 如果你主要研究多 agent 协作

AutoGen 的 selector、swarm、GraphFlow 很有表达力，但应把生产恢复交给更明确的持久层。Semantic Kernel 存量项目可继续维护，新项目应把 Microsoft Agent Framework 纳入比较，而不是继续押注旧 Process Framework。

## 九、待验证问题

以下结论尚不能只靠文档回答，需要原型或故障注入：

1. ADK 2.0 Dynamic Workflows 在数据库持久层、多 worker 并发恢复时，node activation 的去重键和一致性边界是什么？
2. ADK 动态 workflow 在代码升级、node 重命名、循环体改变后，是否有可操作的版本迁移策略？
3. LangGraph Graph API、Functional API 与 Temporal 嵌套时，哪一层拥有重试权最不容易产生“重试放大”？
4. OpenAI `RunState` 除 HITL 外，面对进程在普通工具调用中途崩溃时能恢复到什么粒度？
5. Claude Code agent teams 的任务依赖、resume 和 shutdown 限制何时进入稳定支持？
6. 对通用编码 agent，`pass^k`、最终 outcome、成本和人工介入率如何组成一个不会鼓励保守停机的综合指标？
7. 当 planner、worker、evaluator 使用同一模型家族时，如何测量它们的相关性失败，而不是只看单次多数票？
8. 何种粒度的 checkpoint 在恢复成本、存储成本和副作用风险之间最优？
9. “工具端幂等”无法实现时，哪些动作应直接升级为人工事务，而不是自动补偿？
10. 如何用 capability token 把一次授权限制到 `run_id + resource + operation + expiry`，并让 subagent 只能进一步收窄、不能扩大权限？

## 十、更新记录

### 2026-07-23：建立首版基线

- 建立“确定性外壳 + 非确定性内核”的分层控制模型。
- 拆解 Claude Code 的 agent loop、hooks、permissions、sandbox、subagents、agent teams、worktrees、sessions、checkpoint、预算与 OTel。
- 以 Claude Code 官方 Dynamic Workflows 为主线，明确“脚本持有控制流与中间结果”的稳定性，以及仅限同 session 恢复、运行中 agent 重启和缺少副作用事务语义的边界。
- 明确区分 session/file rewind 与真正 durable execution。
- 对照 LangGraph、Temporal、Google ADK、OpenAI Agents SDK、AutoGen 与 Semantic Kernel。
- 纳入 2026 年关键进展：Google ADK 2.0 Dynamic Workflows 的语言原生控制流、自动 checkpoint 和恢复时跳过已成功子节点。
- 纳入 Anthropic 关于长时 harness、独立 evaluator、Managed Agents 事件日志与 containment 的最新工程经验。

## 一手来源

### Anthropic / Claude Code

- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)
- [Dynamic Workflows](https://code.claude.com/docs/en/workflows)
- [Hooks reference](https://code.claude.com/docs/en/hooks)
- [Configure permissions](https://code.claude.com/docs/en/permissions)
- [Checkpointing](https://code.claude.com/docs/en/checkpointing)
- [Agent teams](https://code.claude.com/docs/en/agent-teams)
- [Worktrees](https://code.claude.com/docs/en/worktrees)
- [CLI reference](https://code.claude.com/docs/en/cli-usage)
- [Monitoring with OpenTelemetry](https://code.claude.com/docs/en/monitoring-usage)
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Scaling Managed Agents: Decoupling the brain from the hands](https://www.anthropic.com/engineering/managed-agents)
- [Beyond permission prompts: making Claude Code more secure and autonomous](https://www.anthropic.com/engineering/claude-code-sandboxing)
- [How we contain Claude across products](https://www.anthropic.com/engineering/how-we-contain-claude)
- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)

### LangGraph

- [Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- [Functional API](https://docs.langchain.com/oss/python/langgraph/functional-api)
- [Time travel](https://docs.langchain.com/oss/python/langgraph/use-time-travel)
- [Backward compatibility](https://docs.langchain.com/oss/python/langgraph/backward-compatibility)

### Temporal

- [Workflow Execution](https://docs.temporal.io/workflow-execution)
- [Retry Policies](https://docs.temporal.io/encyclopedia/retry-policies)
- [Activities](https://docs.temporal.io/activities)
- [Saga Pattern guide](https://pages.temporal.io/rs/250-WIU-007/images/tech-guide-saga-pattern-made-easy.pdf)

### Google ADK

- [Dynamic Workflows](https://adk.dev/graphs/dynamic/)
- [Graph Workflows](https://adk.dev/graphs/)
- [Resume Agents](https://adk.dev/runtime/resume/)
- [Action confirmations](https://adk.dev/tools-custom/confirmation/)
- [Evaluation](https://adk.dev/evaluate/)
- [Google ADK Python repository](https://github.com/google/adk-python)

### OpenAI Agents SDK

- [Agents SDK Python](https://openai.github.io/openai-agents-python/)
- [Running agents](https://openai.github.io/openai-agents-python/running_agents/)
- [Agents and structured outputs](https://openai.github.io/openai-agents-python/agents/)
- [Human-in-the-loop and RunState](https://openai.github.io/openai-agents-python/human_in_the_loop/)
- [Sessions](https://openai.github.io/openai-agents-python/sessions/)
- [Guardrails](https://openai.github.io/openai-agents-python/guardrails/)
- [Tracing](https://openai.github.io/openai-agents-python/tracing/)

### AutoGen / Semantic Kernel

- [AutoGen Selector Group Chat](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/selector-group-chat.html)
- [AutoGen GraphFlow](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/graph-flow.html)
- [AutoGen Termination](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/termination.html)
- [AutoGen Tracing and Observability](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tracing.html)
- [Semantic Kernel Agent Orchestration](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/)
- [Semantic Kernel Observability](https://learn.microsoft.com/en-us/semantic-kernel/concepts/enterprise-readiness/observability/)
- [Semantic Kernel official repository](https://github.com/microsoft/semantic-kernel)
