---
title: JEPA 下游研究追踪 · 2026-07-26
date: 2026-07-26 10:00:00
categories:
  - JEPA研究追踪
tags:
  - JEPA
  - JEPA追踪
---

> 本文属于「JEPA追踪」系列，记录每日论文检索、原文核验与阶段性判断；它保留研究日志的证据密度，与经过主题化重写的原创博客区分。

# JEPA 下游研究追踪（2026-07-26）

> 检索增量窗口：自上次运行截止 `2026-07-25 03:04:58 UTC` 起，至 2026-07-26 本次运行。
> 去重范围：自动化 memory，以及 `research/jepa/` 中 2026-07-15 至 2026-07-24 的全部既有记录；仓库中没有 `2026-07-25.md`。
> 纳入标准：论文必须实际复用、改造或直接评估 JEPA，并进入明确下游任务；只在 related work 引用 JEPA 的工作不算。搜索索引只用于发现，实质性结论回到论文原文、作者项目页、会议页或正式 proceedings 核验。
> 今日类型：**严格截止后无高可信新增；深读 2 篇此前只进入候选池或完全漏记的高价值历史回补。**

## 今日结论

1. **今日无高可信严格新增。** 截至本次检索，arXiv 的 `cs.LG`、`cs.CV`、`cs.RO`、`cs.AI`、`eess.SP`、`eess.IV`、`cs.MM`、`cs.SD` 最新列表仍是 2026-07-24（周五）批次，晚于 `2026-07-25 03:04:58 UTC` 的新公告窗口为空；这些列表中的 JEPA 显式命中只有已在 7 月 24 日记录过的 ER-JEPA v3 replacement，没有新的下游 JEPA 主稿。[cs.LG new](https://arxiv.org/list/cs.LG/new) · [cs.CV new](https://arxiv.org/list/cs.CV/new) · [cs.RO new](https://arxiv.org/list/cs.RO/new) · [cs.AI new](https://arxiv.org/list/cs.AI/new) · [eess.SP new](https://arxiv.org/list/eess.SP/new)
2. **Demo-JEPA 是今天最重要的历史漏记。** 它真正使用 V-JEPA 2.1 的 action-conditioned world model，把源机器人视频转成目标机器人可执行的 latent subgoal，再用 CEM 在目标动力学中规划。仿真 zero-shot 平均成功率为 0.36，对 VPP/XSkill 的 0.04/0.03；真机 zero-shot 为 0.25，对照为 0.00/0.05。不过，“one-shot”只描述测试时输入一条新示范，不表示训练是 one-shot：Stage I 在仿真使用 retargeted replay 生成时序匹配的 Sawyer–Franka 成对轨迹，真机使用 GTCC 做 UR5e–Franka 进度对齐。[论文方法与实验](https://arxiv.org/html/2605.20811)
3. **WiFi-JEPA 是“mask 设计即领域假设”的强案例。** 它把 I-JEPA 式 context encoder、EMA target encoder 和 predictor 移植到 WiFi-CSI，并一次遮掉 9 条天线链路中的 5 条，用剩余链路预测目标 latent。相同骨干和 PETR decoder 下，多人 MPJPE 从无预训练的 102.4 mm 降到真实 CSI 预训练的 97.1 mm，再由真实+模拟预训练降到 93.5 mm；link mask 也优于 random、multi-block 和 time mask。[论文方法与消融](https://arxiv.org/html/2607.11064)
4. **两篇都不是“只引用 JEPA”。** Demo-JEPA 把 JEPA predictor 扩展成跨本体目标翻译器；WiFi-JEPA 改写 tokenization、masking 和 target 几何。两篇的共同启示是：下游 JEPA 的关键已经从“latent 而非 pixel”进一步转向 **预测接口如何编码任务中的可迁移关系**。
5. **原创博客优先级：WiFi-JEPA 高，Demo-JEPA 高但需以边界审计为主。** WiFi-JEPA 有 ECCV 2026 接收信息、较干净的同架构消融和较低复现算力；Demo-JEPA 的问题更有思想性，但仍是预印本、训练成本高、无可核验代码，并依赖训练期轨迹对齐。

## JEPA 方向最新进展

### 2.1 严格增量：周末窗口没有新公告，不用弱结果凑数

本轮以用户给出的真实截止线 `2026-07-25 03:04:58 UTC` 为准。各核心类别的 arXiv 最新列表仍停留在 7 月 24 日批次；在这些页面中搜索 `JEPA`，`cs.CV`、`cs.RO`、`cs.AI`、`eess.IV`、`cs.MM`、`cs.SD` 没有新命中，`cs.LG`/`eess.SP` 只有 ER-JEPA v3 replacement。ER-JEPA v3 的“修订速度 benchmark、增加下游任务、代码 soon”已在 7 月 24 日追踪中登记，因此今天不重复计作新论文。[ER-JEPA 版本页](https://arxiv.org/abs/2607.01145)

这一判断只表示“截止线之后没有新的 arXiv 公告”，不等于 JEPA 研究停滞。今天的工作重点转为补齐两个已存在但尚未完整审计的下游分支：跨本体机器人模仿与 WiFi-CSI 人体感知。

### 2.2 Predictor 正从未来状态模型变成“接口翻译器”

V-JEPA 2 的 action-conditioned predictor 通常回答“给定当前观察和动作，目标本体下一步会到哪里”。Demo-JEPA 新增 Dreamer Predictor，回答的是另一个问题：**源本体这段视觉变化，对目标本体意味着哪个可实现的未来 latent？** 它先用 source current/source future 与 target current 做两路 cross-attention，再用 Conv3D 和 Transformer 生成 target-compatible goal，最后交给目标本体的 action-conditioned world model 与 CEM。[Demo-JEPA 方法](https://arxiv.org/html/2605.20811)

这使 predictor 从预训练阶段的遮挡预测附件，变成跨本体系统的语义接口。不过，接口仍靠成对轨迹学出：论文自己在限制章节承认训练仍需要 temporal 或 progress-aware alignment，尚未实现 fully unaligned learning。[Demo-JEPA 限制](https://arxiv.org/html/2605.20811#S5)

### 2.3 Masking 正从通用策略变成物理可观测性假设

WiFi-JEPA 不把 CSI 强行摊平成普通图像。它保留 `(C,T,L)` 中 subcarrier、time、link 的物理轴，让每个 token 对应一个明确的 `(time, link)` 坐标；link masking 整列遮掉一组 Tx–Rx 观测，用其他空间视角预测被遮链路。这相当于把“不同天线链路观察同一人体运动”写进自监督任务。[WiFi-JEPA tokenization 与 link masking](https://arxiv.org/html/2607.11064#S4)

这一趋势与此前追踪的 WirelessJEPA 相呼应：对无线数据，mask 的几何不是普通数据增强，而是模型对空间、时间或天线冗余结构的假设。WiFi-JEPA 的同架构消融给出更直接的证据：link mask 的 MPJPE 为 97.10 mm，优于 multi-block 102.06、time 104.24 和 random 105.14 mm。[WiFi-JEPA Table 7](https://arxiv.org/html/2607.11064#S5.SS4)

### 2.4 “仿真是否逼真”开始让位于“变化是否足够多样”

WiFi-JEPA 用 NVIDIA Sionna ray tracing 生成约 90K 帧模拟 CSI。出人意料的是，随机弹跳几何体 `sim-object` 的预训练结果为 100.1 mm，优于外观更接近人体的 `sim-human` 110.3 mm；真实数据预训练为 97.1 mm。作者据此主张动态多样性比散射体几何逼真度更重要。[模拟数据实验](https://arxiv.org/html/2607.11064#S5.SS3)

这里应保留归因边界：`sim-object` 和 `sim-human` 除几何外，轨迹生成机制也不同——前者使用随机物理轨迹，后者使用固定 motion-capture clips。因此，表格支持“这套随机几何体管线更有效”，但还不能把差异唯一归因于 dynamics diversity。

### 2.5 候选筛选与未纳入原因

- **seq-JEPA** 是本轮引用链回溯发现的高价值历史漏项，已正式发表于 NeurIPS 2025 Main Track。它用 view–action 序列聚合与 action-conditioned next-view latent prediction，同时服务 invariant 分类和 equivariant 变换解码，确实属于预测式 JEPA；因今天已对两篇更贴近具体部署的工作做完整审计，将其列为下一轮优先，而不在未逐表复核前压缩成第三篇。[NeurIPS 官方页面](https://proceedings.neurips.cc/paper_files/paper/2025/hash/2f63d2963526bdd9ff1b8bcc2dc9905a-Abstract-Conference.html) · [arXiv 版本页](https://arxiv.org/abs/2505.03176)
- **JHU-VPT(JEPA) / A Vision Foundation Model for Cataract Surgery Using JEPA** 已进入 PMLR/MIDL 2026，确实把视频 JEPA 用于白内障手术步骤识别、反馈与技能评估；既有记录只登记候选，尚未完整深读。它是下一轮最高优先级之一，但今天两篇已覆盖更明显的新机制，不为达到三篇上限而压缩审计。[PMLR 正式页面](https://proceedings.mlr.press/v301/shah26b.html)
- **JEPA-MSAC** 确实把 temporal block-masked multimodal JEPA 用于定位、波束和 RSSI，但既有审计发现其连续序列先切重叠窗口、再随机 70/30 切分，存在时间相邻样本跨集合的风险；在 split 复核前不升格为强证据。[论文原文](https://arxiv.org/html/2603.29796)
- **HAR-JEPA** 是真实 JEPA 下游方法，但公开仓库未提供从原始数据生成 subject-disjoint split 的完整脚本，且 50% overlap window 会放大切分不清的风险；继续排除出今日主解读。[论文](https://arxiv.org/abs/2607.16350) · [官方仓库](https://github.com/mohalim/JEPA_HAR)
- **FF-JEPA** 进入 action-free subgoal planning，但当前主要证据仍集中在单一 PushT preliminary setting，且部分基线协议不同；价值低于今天的 RLBench+真机 Demo-JEPA。[论文原文](https://arxiv.org/html/2606.09311)
- **Cross4D-JEPA、AV-JEPA、Emotion-JEPA、SPACE-HOP、Pokemon Red multimodal JEPA** 已在既有记录中分别标注为固定教师蒸馏边界、LeJEPA/SIGReg 对照、under-review 或工作坊/poster 证据；本轮没有新版本或新实验足以改变排序。

## 新增下游论文解读

### 3.1 Demo-JEPA：把跨本体示范翻译成目标机器人可执行的 latent goal

#### 基本信息

- 完整题目：*Demo-JEPA: Joint-Embedding Predictive Architecture for One-shot Cross-Embodiment Imitation*
- 作者：Jingyang He、Guangrun Li、Jieyu Zhang、Chengkai Hou、Zhengping Che、Shanghang Zhang
- 机构：北京大学多媒体信息处理全国重点实验室/计算机学院、University of Washington、北京人形机器人创新中心
- 时间与出处：arXiv v1，2026-05-20；截至检索时仍为预印本，未见正式录用信息
- 使用的 JEPA：V-JEPA 2.1 action-conditioned world model，加上作者提出的 embodiment-aware Dreamer Predictor
- 下游任务：一次视觉示范驱动的跨本体机器人模仿；仿真 Sawyer→Franka，真机 UR5e→Franka

[arXiv 摘要与版本](https://arxiv.org/abs/2605.20811) · [论文 HTML](https://arxiv.org/html/2605.20811) · [作者项目页](https://log2r.github.io/Demo-JEPA/)

#### 它如何衔接 JEPA

Demo-JEPA 不是把冻结 V-JEPA 特征接到一个行为克隆头，而是完整使用 latent prediction 与 latent planning：

1. **Stage 0：目标本体 world model。** JEPA encoder 将目标机器人图像编码成 latent；V-JEPA 2.1 风格的 frame-causal dynamics predictor 根据当前 latent、目标机器人 state 和 action 预测未来 latent。
2. **Stage 1：Dreamer Predictor。** 输入目标机器人当前观察、源示范当前帧和源示范未来帧。两路 cross-attention 分别建模 embodiment correspondence 与 source motion，再经 Conv3D 和 Transformer 预测目标本体未来 latent，以真实目标未来 latent 做 L2 监督。
3. **Stage 2：action co-training。** 冻结 Dreamer Predictor，继续训练目标 world-model predictor，使其 action-conditioned rollout 对齐 Dreamer 输出的目标 latent。
4. **推理：CEM + 自适应进度。** CEM 搜索能让目标 rollout 靠近 latent goal 的动作序列；只有当执行后的目标 latent 与当前 goal 距离低于阈值，系统才推进到示范的下一片段，避免机器人尚未完成子目标就继续播放提示。[训练与推理流程](https://arxiv.org/html/2605.20811#S3)

直接使用源示范未来 latent 作为 V-JEPA 2.1 规划目标的 `Naive` 方案在所有任务失败；使用部署时不可获得的目标本体真实未来轨迹作为 `Oracle` 才能工作。这组对照表明，**共享 V-JEPA latent 并不自动产生跨本体兼容性，Dreamer Predictor 才是关键桥梁**。[Goal reference comparison](https://arxiv.org/html/2605.20811#S4.SS2)

#### “one-shot”与“无需 action correspondence”的准确边界

**可核对事实**

- 测试时，策略接收一条 held-out 的源机器人视觉 prompt，不需要源机器人的 action。
- 但 Stage I 训练需要源/目标两侧的成对视觉轨迹和 frame-level 对齐：仿真通过 retargeted replay 把 end-effector pose trajectory 转到 Sawyer/Franka；真机独立采集 UR5e/Franka 演示后，用 GTCC progress features 对齐。
- Stage II 仍需要目标 Franka 的 observation、state、action trajectory，仿真来自 RLBench motion planner，真机来自 teleoperation。

因此，“one-shot”应解释为 **测试时一条新视觉示范**，而不是“一条样本训练”；“无 action correspondence”应解释为源与目标之间不需要逐动作对应，而不是整个训练过程无配对、无对齐、无目标动作数据。[训练数据协议](https://arxiv.org/html/2605.20811#S4)

#### 数据、指标、基线与关键结果

| 设置 | Stage I：成对视觉轨迹 | Stage II：目标 action 轨迹 | 源→目标 |
|---|---:|---:|---|
| RLBench 仿真 | 86 个任务，13,444 条轨迹 | 39 个任务，8,324 条轨迹 | Sawyer→Franka |
| 真机 | 22 个任务，4,508 条轨迹 | 19 个任务，3,903 条轨迹 | UR5e→Franka |

论文将评测分成三档：

- Behavior Grounding：Stage I/II 都见过的熟悉情形；
- Cross-Embodiment Bridging：Stage I 见过语义，但没有对应 target action supervision；
- Zero-Shot Generalization：任务配置未见。

指标是任务成功率；每个仿真场景 30 次 rollout，每个真机场景 20 次。核心基线是 VPP 和 XSkill，另有 V-JEPA 2.1 naive/oracle reference、Diffusion Policy 与 Demo-DP 消融。[评测协议](https://arxiv.org/html/2605.20811#S4)

| 设置 | 方法 | Behavior Grounding | Bridging | Zero-shot |
|---|---|---:|---:|---:|
| 仿真 | VPP | **0.47** | 0.28 | 0.04 |
| 仿真 | XSkill | 0.39 | 0.17 | 0.03 |
| 仿真 | Demo-JEPA | 0.31 | **0.45** | **0.36** |
| 真机 | VPP | **0.65** | 0.53 | 0.00 |
| 真机 | XSkill | 0.45 | 0.40 | 0.05 |
| 真机 | Demo-JEPA | 0.43 | **0.55** | **0.25** |

结果的模式很清楚：Demo-JEPA **不是熟悉任务最强方法**，但分布偏移越大，优势越明显。真机 bridging 对 VPP 只有 0.02 的平均优势（0.55 vs. 0.53），而 zero-shot 才是 0.25 vs. 0.00/0.05 的强差异。[主结果表](https://arxiv.org/html/2605.20811#S4.SS1)

执行器消融也给出重要边界：真机 Demo-DP 在 behavior grounding/bridging 为 0.65/0.73，高于 Demo-JEPA 的 0.43/0.55；但 zero-shot 为 0.15，低于 Demo-JEPA 的 0.25。预测目标本身有价值，但是否用 CEM world-model planning 仍决定 OOD 稳健性和域内性能的折中。[Demo-DP 对照](https://arxiv.org/html/2605.20811#S4.SS2)

#### 事实、作者主张与我的判断

**可直接核对的事实**

- Demo-JEPA 真正建立在 V-JEPA 2.1 action-conditioned world model 上，Dreamer Predictor 和 latent-space CEM 是系统核心。
- 在论文定义的 bridging/zero-shot 套件中，Demo-JEPA 的平均成功率高于 VPP 和 XSkill；在 behavior grounding 中低于 VPP，仿真也低于 XSkill。
- 训练需要大规模成对视觉轨迹与 temporal/progress alignment；作者在限制章节明确承认这一点。
- 真机每个场景只有 20 次 rollout，表中没有置信区间、显著性检验或多训练种子方差。

**作者主张**

- 把 demonstration 当作未来 goal specification，而不是动作序列，可将意图与本体执行解耦；
- JEPA latent 比 pixel/action space 更容易抑制外观、本体形态和背景等无关差异；
- Dreamer Predictor 能把源示范翻译为目标本体兼容的 future latent，并在未见任务配置上泛化。

**我的判断**

- 论文最有说服力的不是“一次示范就能跨机器人”，而是 **source latent 不能直接规划，必须先做 target-compatible goal translation**；naive 全失败与 oracle/Dreamer 的差距把这个接口问题暴露得很清楚。
- zero-shot 增益很大，但它建立在 86/22 个 Stage I 任务和大规模 paired trajectories 上，应定位为“广泛对齐训练后的 one-prompt adaptation”，不是人类式零基础模仿。
- 真机 bridging 的平均提升很小，20 次试验的分辨率为 0.05；在没有置信区间和重复训练的情况下，不宜把 0.55 vs. 0.53 写成稳定优势。真机 zero-shot 的差距更值得关注，但绝对成功率 0.25 仍不足以部署。

#### 相对已有工作的创新

- 将 V-JEPA 2.1 的 action-conditioned latent world model 从“本体内未来预测”扩展为“跨本体目标翻译 + 本体内执行”；
- Dreamer Predictor 显式分开 embodiment correspondence 和 source motion，再输出目标本体 latent goal；
- 用 adaptive goal updating 把示范推进速度与目标机器人实际完成进度解耦；
- 同时在 RLBench 和物理 UR5e→Franka 上验证，并按分布偏移强度拆分评测，而不是只报一个总体成功率。

#### 局限、复现条件与潜在风险

- **对齐依赖。** Stage I 不是无配对训练；仿真依赖 retargeted replay，真机依赖 GTCC frame alignment。对齐错误可能被 Dreamer Predictor 学成系统偏差。
- **算力高。** Stage 0/1/2 分别使用 `8×A100` 训练 7/2.5/1 天，总计约 2,016 A100 GPU-hours；论文未提供小模型或低算力复现曲线。[计算预算](https://arxiv.org/html/2605.20811#S10.SS4)
- **复现材料不足。** 截至检索时，arXiv 页面和作者项目页没有可核验的官方代码仓库；paired trajectory 生成、GTCC 对齐、真实机器人数据与 checkpoint 也未见公开入口。
- **基线范围有限。** 主表主要对照 VPP 与 XSkill，没有同预算的大规模 VLA、多本体策略或其他现代 observation-only imitation 系统；跨范式最优性仍未建立。
- **统计不充分。** 仿真 30 次、真机 20 次/场景，没有训练种子、置信区间或显著性检验；真机 0.05 的成功率步长会放大小差异的不确定性。
- **受 world model 上限约束。** 作者承认当前 action-conditioned world model 在复杂、高精度任务上是瓶颈。
- **安全风险。** 论文只在受控仿真和实验室验证，没有碰撞率、异常恢复、置信度或安全约束。作者也明确指出，在 safety-critical deployment 前需要额外 safeguards 和 validation。[Broader Impact](https://arxiv.org/html/2605.20811#S12)

**复现判断：低到中等。** RLBench 可获得，方法和超参数描述较完整；但 8×A100 长训练、未公开代码、跨本体配对数据管线和真实硬件数据是主要障碍。

**博客价值：高。** 最适合的原创主题不是“Demo-JEPA 实现 one-shot 跨机器人模仿”，而是：

> 为什么共享 V-JEPA latent 仍不能跨本体：从 source future 到 target-compatible goal，中间缺了一层什么？

写作时应把测试时 one-shot、训练时大规模对齐、源动作无对应、目标动作仍必需这四件事彻底分开。

### 3.2 WiFi-JEPA：用天线链路遮挡学习 WiFi-CSI 三维人体姿态

#### 基本信息

- 完整题目：*WiFi-JEPA: Self-supervised Learning for WiFi-CSI 3D Human Pose Estimation*
- 作者：Doeon Kim、Jungyoon Lee、Seongsin Kim、Seong-heum Kim
- 机构：韩国崇实大学（Soongsil University）的 Intelligent Semiconductors、AI Convergence Security 与 AI Software 相关院系
- 时间与出处：arXiv v1，2026-07-13；作者与官方项目页标注 ECCV 2026
- 使用的 JEPA：I-JEPA 风格 context encoder、EMA target encoder、latent predictor，结合 CSI-specific tokenization 和 link masking
- 下游任务：WiFi-CSI 单人/多人 3D 人体姿态估计，以及跨室内环境迁移

[arXiv 摘要与版本](https://arxiv.org/abs/2607.11064) · [论文 HTML](https://arxiv.org/html/2607.11064) · [官方项目页](https://wifi-jepa.github.io/) · [作者页面的 ECCV 2026 记录](https://kimdoeon.github.io/)

#### 它如何衔接 JEPA

WiFi-JEPA 保留 JEPA 的三组件：

- context encoder 只处理未被遮挡的 CSI tokens；
- predictor 在 mask token 和位置编码条件下预测被遮链路的 latent；
- target encoder 看完整输入，以 EMA `0.996→1.0` 更新；
- 目标是 layer-normalized target latent 上的 Smooth L1，不重建原始 CSI。

它的领域改造集中在输入结构和 mask：

1. 将 amplitude + 去噪 phase 组织为 60 个 subcarrier channels、20 个 time steps、9 条 antenna links；
2. 不把 time/link 展平成普通 spectrogram，而是令每个 token 对应明确的 `(time, link)`；
3. 预训练时随机遮掉 60% 链路，即 9 条中的 5 条，用剩余 4 条预测整段被遮链路；
4. 微调时把预训练 encoder 接到 PETR-style decoder，输出每个人 14 个三维关键点；encoder 学习率为主 head 的 0.1 倍。[方法](https://arxiv.org/html/2607.11064#S4)

<figure>
  <img src="https://arxiv.org/html/2607.11064v1/x5.png" alt="WiFi-JEPA 的链路遮挡预训练与三维姿态微调架构" style="display:block;max-width:720px;width:100%;height:auto;margin:0 auto;" loading="lazy">
  <figcaption>WiFi-JEPA Figure 5：先在 (time, link) 网格上做 link masking 与 latent prediction，再将 context encoder 微调到三维人体姿态。图片来自 arXiv 官方 HTML，原图 718×307、224,523 bytes（约 219 KB）。</figcaption>
</figure>

#### 数据、指标、基线与关键结果

PiW3D 是论文使用的公开多人 WiFi-CSI 3D pose benchmark：

- 3 个约 `4 m × 3.5 m` 环境：office、classroom、corridor；
- 1 个 transmitter、3 个 Intel 5300 receiver，每个 receiver 3 根天线，共 9 条 link；
- 5.64 GHz、30 个 subcarrier；
- 7 名志愿者、8 类日常动作；
- 训练 89,946 帧，测试 7,824 帧，其中单人 2,586、双人 3,184、三人 2,054。

主指标是 MPJPE；另报去除全局平移/旋转/尺度的 PA-MPJPE，以及 PCK@20/PCK@50。主系统基线包括 WiPose、HPE-Li、MetaFi++、DT-Pose 和 PiW3D；同架构 SSL 对照包括 SimMIM、MAE、BYOL、MoCoV3 与 scratch。[数据与指标](https://arxiv.org/html/2607.11064#S5.SS1) · [PiW3D 官方项目与数据入口](https://aiotgroup.github.io/Person-in-WiFi-3D/)

**系统级结果**

| 方法 | 单人 MPJPE ↓ | 单人 PCK@20 ↑ | 多人 MPJPE ↓ | 多人 PCK@20 ↑ |
|---|---:|---:|---:|---:|
| DT-Pose | 90.0 | 72.1 | — | — |
| PiW3D baseline | 91.7 | 69.3 | 107.2 | 58.1 |
| WiFi-JEPA（real） | 78.2 | 74.5 | 97.1 | 59.3 |
| WiFi-JEPA（real+sim） | **76.8** | **75.9** | **93.5** | **61.5** |

[官方项目页结果表](https://wifi-jepa.github.io/#results)

**更能隔离 JEPA 贡献的同架构结果**

| 预训练/设置 | 多人 MPJPE ↓ | PA-MPJPE ↓ | PCK@20 ↑ | PCK@50 ↑ |
|---|---:|---:|---:|---:|
| 无预训练 | 102.4 | **65.1** | 57.8% | 91.8% |
| WiFi-JEPA，90K real | **97.1** | 67.2 | **59.3%** | **93.0%** |
| MAE，90K real | 130.3 | 77.4 | 47.6% | 87.4% |
| SimMIM，90K real | 145.6 | 84.0 | 41.5% | 84.3% |

这里有一个不能忽略的反例：WiFi-JEPA 改善绝对 3D 定位 MPJPE 和 PCK，但 PA-MPJPE 从 scratch 的 65.1 变为 67.2，略有退化。论文也承认收益主要在 global localization，而不是相对关节形状。[同架构 SSL 对照](https://arxiv.org/html/2607.11064#S5.SS4)

**mask、tokenization 与仿真消融**

- link mask 97.10 mm，优于 multi-block 102.06、time 104.24、random 105.14；
- CSI-specific tokenization 97.10 mm，优于展平为 2D spectrogram 的 111.85；
- scratch 102.4，`sim-object` 100.1，`sim-human` 110.3，real-only 97.1，90K real + 90K sim-object 93.5；
- 90K simulated frames 约需单张 RTX 4090 10 GPU-hours；完整预训练与微调也在单张 RTX 4090 完成。[消融与仿真](https://arxiv.org/html/2607.11064#S5.SS3)

**跨环境结果**

leave-one-environment-out 时，预训练和微调都排除测试环境；WiFi-JEPA 在 office/classroom/corridor 的 MPJPE 为 248.4/428.2/296.0 mm，均值 324.2，对 PiW3D baseline 的 626.4 mm 降低 48.2%。有 10% 目标环境标签的 few-shot setting 中，WiFi-JEPA 为 171.3 mm，Supervised+DANN 为 208.6 mm。[跨环境实验](https://arxiv.org/html/2607.11064#S5.SS2)

#### 事实、作者主张与我的判断

**可直接核对的事实**

- WiFi-JEPA 使用 context/predictor/EMA target 的 JEPA pipeline，不是只引用 I-JEPA。
- 同骨干、同 PETR decoder 下，real-only JEPA 预训练把多人 MPJPE 从 102.4 降至 97.1；再加入模拟数据降至 93.5。
- link mask 与 CSI-specific tokenization 分别有独立消融支持。
- PA-MPJPE 没有随 JEPA 预训练改善；跨环境 MPJPE 虽近乎减半，绝对值仍为 324.2 mm。
- 四种 vision-native SSL 对照都低于 scratch，但论文没有证明这些方法已针对 CSI 做到同等充分的 augmentation/超参数适配。

**作者主张**

- 预测 latent 可减少原始 CSI 中硬件噪声对表示的干扰；
- link masking 强迫模型使用跨天线空间相关性，因此更适合 3D pose；
- 多样的简单几何体 ray tracing 可提供与真实 CSI 相近且互补的预训练信号。

**我的判断**

- 最强机制证据是“同一 JEPA 内，link mask 优于 I-JEPA 式 multi-block；结构化 token 优于图像化 flatten”，而不是跨论文 SOTA 表本身。
- MAE/BYOL/MoCoV3 全部大幅退化说明“直接移植 vision SSL”不可靠，但也可能说明这些基线的 CSI adaptation 不充分；不能写成 latent prediction 在所有无线任务上已被普遍证明优于重建/对比学习。
- `sim-object > sim-human` 同时改变了形状和运动轨迹分布，支持工程选择，不足以单独证明“动态多样性一定比几何真实性重要”。
- WiFi 不保存相机图像不等于没有隐私风险。系统能够隔墙恢复多人三维姿态，反而带来不可见感知与非自愿监测风险；这是面向部署必须补充的治理问题，而非论文实验已经解决的结论。

#### 相对已有工作的创新

- 把 JEPA 的 target/context masking 重新定义为跨 Tx–Rx link 预测，直接编码无线空间多视角结构；
- 用 `(C,T,L)` tokenization 保留 subcarrier、time、link 三轴语义；
- 将 ray-traced CSI 用于 self-supervised pretraining，而不是只做监督 channel/beam prediction；
- 同时报告多人、跨环境、不同人数组合、手/肘误差、SSL objective、masking、tokenization 和 synthetic-data 消融。

#### 局限、复现条件与潜在风险

- **单数据集、固定硬件。** 只有 PiW3D、Intel 5300、固定 1Tx×3Rx/9-link 与 5.64 GHz；跨频段、天线数、芯片、安装位置和建筑材料尚未验证。
- **跨主体证据不足。** 数据包含 7 名志愿者，但论文没有报告 leave-one-subject-out；不能从现有结果推断对新人体型、动作习惯或辅助器具的泛化。
- **跨环境绝对误差仍高。** 324.2 mm 不适合直接外推到跌倒检测、康复评估等安全/医疗应用。
- **PA-MPJPE 反例。** 预训练主要改善全局定位，没有改善相对骨架形状。
- **基线适配风险。** vision-native SSL 可能因图像增强和 mask 不符合 CSI 物理结构而被低估；需要 CSI-native 的强 MAE/对比学习控制。
- **仿真混杂。** `sim-object` 与 `sim-human` 同时改变散射体几何和运动分布，没有正交消融。
- **代码状态。** 官方项目页截至检索时仍标注 `Code (soon)`；PiW3D 数据可下载，但 WiFi-JEPA tokenizer、Sionna scene generator、训练脚本和 checkpoint 尚无公开仓库。
- **隐私与滥用。** 穿墙、多人物姿态感知可用于健康与安全，也可能成为不可见监控工具；部署需明确同意、访问控制、数据最小化和审计机制。

**复现判断：中等。** 公共 PiW3D、有完整训练超参数、单卡 4090 预算可接受；主要缺口是官方代码、ray-tracing generator、数据处理细节和 checkpoint。

**博客价值：高。** 最适合的原创主线是：

> JEPA 迁移到新传感器时，真正决定效果的不是“latent 比 pixel 高级”，而是 mask 是否对应这个传感器的物理可观测性。

可用 WirelessJEPA 作为对照，比较 time/antenna/link mask 如何分别编码通信、定位与人体感知假设。

## 横向比较

| 维度 | Demo-JEPA | WiFi-JEPA |
|---|---|---|
| 今日身份 | 历史漏记回补；arXiv 预印本 | 已登记候选的首次深读；ECCV 2026 |
| JEPA 来源 | V-JEPA 2.1 action-conditioned world model | I-JEPA 风格 masked latent prediction |
| JEPA 使用强度 | world model、跨本体 predictor、latent CEM 全链路 | context/predictor/EMA target + 领域 mask |
| Predictor 的新角色 | 把源本体 motion 翻译为目标本体 goal | 从可见天线链路推断被遮链路 latent |
| 下游任务 | 跨本体机器人模仿与规划 | WiFi-CSI 单/多人 3D pose |
| 最强证据 | 分布偏移越大，成功率优势越明显 | 同架构 scratch/SSL 与 mask/token 消融 |
| 最关键反例 | behavior grounding 低于 VPP/XSkill；训练仍需配对对齐 | PA-MPJPE 不改善；跨环境绝对误差仍高 |
| 数据门槛 | 数万 paired/action trajectories | 约 90K real + 90K simulated CSI |
| 算力 | 约 2,016 A100 GPU-hours | 单张 RTX 4090；模拟 90K 帧约 10 GPU-hours |
| 代码/复现 | 无可核验代码，低到中 | Code soon，数据公开，中等 |
| 原创博客价值 | 高：审计 one-shot 与 unaligned 的边界 | 高：masking 作为物理假设 |

两篇共同否定了一个简单叙事：只要把数据编码进“共享 JEPA latent”，迁移就会自动发生。Demo-JEPA 的 naive source latent 在跨本体规划中完全失败；WiFi-JEPA 的通用 multi-block mask 明显落后 link mask。**共享 latent 只是起点，真正可迁移的是被任务结构约束过的预测关系。**

## 值得继续追的问题

1. **Demo-JEPA 能否真正去掉 paired trajectory？** 需要比较无对齐训练、弱序列级对齐、GTCC frame alignment 和 oracle alignment，并报告对齐误差如何传导到成功率。
2. **“one-shot”随 Stage I 任务数量如何变化？** 当前 scaling study已显示任务多样性比每任务轨迹量更重要；下一步应画出新本体/新语义的样本效率曲线，而不是只报测试时单 prompt。
3. **Demo-JEPA 的优势来自 JEPA latent 还是 planner？** 需要相同 Dreamer Predictor 分别接 V-JEPA 2.1、DINO-WM/MAE latent，以及相同 encoder 下的 CEM、Diffusion Policy、MPC 对照。
4. **真机小样本差异是否稳定？** 每场景 20 次意味着 0.05 的分辨率；应补多训练种子、bootstrap interval、失败类型与执行时间。
5. **WiFi-JEPA 能否跨硬件、频段和阵列拓扑？** 最有价值的下一步不是再加一个房间，而是 Intel 5300→新 NIC、5.64 GHz→2.4/6 GHz、9-link→不同链路数的迁移。
6. **WiFi-JEPA 是否跨主体？** 应做 leave-one-subject-out，并报告身高、体型、移动辅助器具、衣物和动作速度的分层误差。
7. **link mask 的优势能否与 CSI-native 强基线公平比较？** 需要为 MAE/对比学习重新设计物理合理的增强和 mask，保持 backbone、预训练预算、decoder 与超参搜索范围一致。
8. **模拟数据的两个变量如何拆开？** 至少需要 `几何真实性 × 运动多样性` 的 2×2 设计，才能判断 sim-object 的收益到底来自随机动力学、房间材质、路径覆盖还是几何简化。
9. **无线人体感知如何建立隐私边界？** 需要设备侧最小化、不可逆特征、授权/撤销机制、空间访问控制与滥用审计；“不用摄像头”本身不是充分隐私保证。
10. **JHU-VPT(JEPA) 是否能补上医学视频中的正式证据？** 下一轮应完整核对其多中心切分、步骤识别/反馈/技能评估协议，以及 JEPA 相对监督/MAE 的独立贡献。[PMLR](https://proceedings.mlr.press/v301/shah26b.html)
11. **seq-JEPA 能否把 invariant/equivariant 平衡带到真实控制？** 它在短 view–action 序列和视觉变换任务上机制清楚，但还需检查对未知变换、长序列和真实相机运动的外推。[NeurIPS 官方页面](https://proceedings.neurips.cc/paper_files/paper/2025/hash/2f63d2963526bdd9ff1b8bcc2dc9905a-Abstract-Conference.html)

## 博客价值判断

### 首选：WiFi-JEPA 的“masking 就是物理假设”

**优先级：高。** 它有正式 ECCV 2026 身份、方法图清楚、同架构消融完整、算力相对可控，并给出了少见的负结果：四种 vision-native SSL 比 scratch 更差、PA-MPJPE 没有改善、跨环境绝对误差仍高。

原创文章可围绕三个问题展开：

1. 为什么把 CSI 摊平成图像会破坏物理轴；
2. 为什么 link mask 对 3D 空间关系比 multi-block/time mask 更合适；
3. 为什么“模拟几何不逼真但动态更多”仍可能有迁移价值，以及现有消融还缺什么。

这会是一篇区别于追踪日报的机制文章，而不是结果汇编。

### 次选：Demo-JEPA 的“one-shot 并不等于 unaligned”

**优先级：高，但必须以归因审计为主。** 它提出了很好的系统分层：source intent → target-compatible latent goal → target dynamics → action。但标题中的 one-shot 容易让读者误以为模型只看一次示范就从零学会跨机器人技能。

原创文章最有价值的主线应是：

1. 测试时一条 prompt 与训练时数万 paired trajectories 的区别；
2. 为什么 V-JEPA 2.1 naive shared latent 不能跨本体；
3. Dreamer Predictor、alignment 和 planner 分别承担什么；
4. 为什么熟悉任务更弱、zero-shot 更强；
5. fully unaligned learning 距离当前系统还有多远。

在代码、paired data 与统计重复公开前，不建议写成“跨本体模仿已解决”。

### 暂缓单篇：JHU-VPT(JEPA)

**优先级：下一轮高。** 正式 PMLR/MIDL 2026 与多中心手术视频使它有潜力成为医学 JEPA 的强案例；但今天没有在两篇完整审计之外压缩第三篇。下一轮应把“基础表征”“步骤识别”“自动反馈”“技能评估”四层贡献拆开。

## 来源链接

### 严格增量检索

- [arXiv cs.LG new](https://arxiv.org/list/cs.LG/new)
- [arXiv cs.CV new](https://arxiv.org/list/cs.CV/new)
- [arXiv cs.RO new](https://arxiv.org/list/cs.RO/new)
- [arXiv cs.AI new](https://arxiv.org/list/cs.AI/new)
- [arXiv eess.SP new](https://arxiv.org/list/eess.SP/new)
- [arXiv eess.IV new](https://arxiv.org/list/eess.IV/new)
- [arXiv cs.MM new](https://arxiv.org/list/cs.MM/new)
- [arXiv cs.SD new](https://arxiv.org/list/cs.SD/new)
- [ER-JEPA arXiv 版本页](https://arxiv.org/abs/2607.01145)

### Demo-JEPA

- [arXiv 摘要与版本记录](https://arxiv.org/abs/2605.20811)
- [arXiv HTML 全文](https://arxiv.org/html/2605.20811)
- [作者项目页](https://log2r.github.io/Demo-JEPA/)
- [官方 Figure 1 直接地址](https://arxiv.org/html/2605.20811v1/x1.png)：793×398、586,985 bytes（约 573 KB）；若单独写 Demo-JEPA，建议显示宽度不超过 760px 并 lazy-load。今日追踪优先使用体积更小、方法信息更集中的 WiFi-JEPA Figure 5。

### WiFi-JEPA

- [arXiv 摘要与版本记录](https://arxiv.org/abs/2607.11064)
- [arXiv HTML 全文](https://arxiv.org/html/2607.11064)
- [ECCV 2026 官方项目页](https://wifi-jepa.github.io/)
- [作者主页的 ECCV 2026 记录](https://kimdoeon.github.io/)
- [PiW3D 官方项目与数据入口](https://aiotgroup.github.io/Person-in-WiFi-3D/)
- [官方 Figure 5 直接地址](https://arxiv.org/html/2607.11064v1/x5.png)：718×307、224,523 bytes（约 219 KB）；本记录以 `max-width:720px;height:auto;loading=lazy` 引用，不复制图片到仓库。

### 今日未纳入的高价值候选

- [seq-JEPA（NeurIPS 2025 Main Track）](https://proceedings.neurips.cc/paper_files/paper/2025/hash/2f63d2963526bdd9ff1b8bcc2dc9905a-Abstract-Conference.html)
- [A Vision Foundation Model for Cataract Surgery Using JEPA（PMLR/MIDL 2026）](https://proceedings.mlr.press/v301/shah26b.html)
- [JEPA-MSAC](https://arxiv.org/html/2603.29796)
- [HAR-JEPA](https://arxiv.org/abs/2607.16350)
- [FF-JEPA](https://arxiv.org/html/2606.09311)
