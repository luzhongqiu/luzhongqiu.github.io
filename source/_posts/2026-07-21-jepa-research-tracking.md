---
title: JEPA 下游研究追踪 · 2026-07-21
date: 2026-07-21 10:00:00
categories:
  - JEPA研究追踪
tags:
  - JEPA
  - JEPA追踪
---

本文属于「JEPA追踪」系列，记录每日论文检索、原文核验与阶段性判断；它保留研究日志的证据密度，与经过主题化重写的原创博客区分。

# JEPA 下游研究追踪（2026-07-21）

> 检索截止：2026-07-21（Asia/Shanghai）
>
> 去重基线：已完整读取 `research/jepa/` 中 2026-07-15 至 2026-07-20 的全部记录与 automation memory；此前已深读 BA-Future-JEPA、GeoWorld、US-JEPA、NeuroVFM/Vol-JEPA、MoP-JEPA、P-JEPA、Rabtriever、Clin-JEPA、AD-L-JEPA、CryoLVM、MJEPA、Temporal Straightening、JetParticle-JEPA、COJEPA、Market JEPA、DSeq-JEPA、SALT、CR-JEPA 与 ER-JEPA，本日不重复汇报。
>
> 纳入标准：论文须明确引用 JEPA 核心工作，并实际复用、改造或隔离评估 latent prediction 机制来完成具体下游任务。搜索索引与引用链只用于候选发现；以下实质性结论均回到 arXiv 原文、会议/机构页面、项目页或官方代码仓库核验。

## 今日结论

今天确认 3 篇此前未在本系列深读、且实际使用 JEPA 完成具体下游任务的论文。其中第一篇是**晚于上次自动化运行真正新增**的机器人论文；后两篇虽然更早发布，但分别代表对象级 world model 与文本条件视觉预训练的重要进展：

1. **Latent Imagination 把 JEPA 变成四足导航策略的训练期辅助目标。** 它让动作条件 predictor 从当前 LSTM-SRU 隐状态预测下一隐状态，部署时整条预测支路被移除。同一 SRU backbone 在动态障碍场景的成功率从 86.0% 提升到 96.2%，碰撞率从 14.0% 降到 3.8%；但去掉 SIGReg 后成功率跌到 86.0%，说明收益来自“预测 + 防坍塌”组合，不能只归功于一步 latent prediction。[arXiv 摘要](https://arxiv.org/abs/2607.17574)｜[论文 PDF](https://arxiv.org/pdf/2607.17574)
2. **Causal-JEPA（C-JEPA）把遮挡单位从 patch 提升为整条对象轨迹。** 它在历史窗口中遮掉某个对象的大部分 latent，只保留最早的身份锚点，迫使 predictor 利用其他对象、动作和本体感觉来补全历史并预测未来。在 CLEVRER 上，同架构的 counterfactual per-question accuracy 从 47.68% 提高到 68.81%；在 Push-T 上以约 1.02% 的 patch-baseline latent 输入量取得 88.67% 成功率，接近 DINO-WM 的 91.33%，规划耗时约快 8.6 倍。[arXiv 原文](https://arxiv.org/html/2602.11389)｜[ICML 2026 项目页](https://hazel-heejeong-nam.github.io/cjepa/)
3. **TC-JEPA 把文本当作仅在预训练期可见的“辅助可观测量”。** 它保留 I-JEPA 的 EMA target encoder 与 masked latent prediction，但让 predictor 在多层通过稀疏 cross-attention 读取 caption token；下游只保留视觉 encoder。相同 ImageNet-1K 训练轮数下，ViT-H 的 ImageNet linear top-1 从 I-JEPA 的 79.3 提升到 80.4，iNaturalist18 从 47.6 提升到 54.8，ADE20K linear mIoU 从 36.9 提升到 39.5。[ICML 2026 / arXiv](https://arxiv.org/html/2605.03245)｜[Apple 官方论文页](https://machinelearning.apple.com/research/text-conditional-jepa-visual-representations)

三篇论文共同推动了同一个问题：**JEPA 的关键不只是“预测 latent”，而是训练时允许 predictor 看见什么、刻意拿走什么，以及预测损失如何真正塑造下游使用的表示。** Latent Imagination 用动作约束下一状态预测；C-JEPA 通过减少对象可见性制造交互依赖；TC-JEPA 通过增加文本可见性消除视觉目标的不确定性。它们的边界分别是“单步辅助损失不等于可规划 world model”“可预测依赖不等于可识别因果”“额外文本监督不等于纯视觉自监督”。

综合原创博客价值：**Latent Imagination（高）≈ Causal-JEPA（高）≈ TC-JEPA（高）**。若优先追时效性，首选四足导航；若优先做概念审计，首选 Causal-JEPA；若讨论 privileged information 与监督预算，首选 TC-JEPA。

## JEPA 方向最新进展

### 1. JEPA 正从独立预训练器变成策略内部的训练信号

最新的四足导航工作没有先训练一个通用视觉 encoder，也不在部署时运行 predictor。它直接把策略的 512 维循环隐状态当作 JEPA 表示，以 `g(h_t, a_t)` 预测 stop-gradient 的 `h_{t+1}`；强化学习、latent prediction 与 SIGReg 三条梯度共同塑造同一个 LSTM-SRU backbone。预测支路在推理时完全丢弃。[方法原文](https://arxiv.org/pdf/2607.17574)

这拓宽了“JEPA 下游应用”的定义：latent predictor 不一定是可单独调用的 world model，也可以只是训练策略表示的辅助约束。相应地，作者称其为 latent imagination，但论文没有执行多步 imagined rollout，也没有让 actor 在推理时基于预测结果规划；更准确的定位是 **action-conditioned one-step predictive regularization**。

### 2. Masking 正从数据增强变成“可见性干预”

I-JEPA 的 block masking 主要控制视觉上下文与目标的尺度；C-JEPA 则明确把 masking 解释为对 predictor observability 的 latent intervention。它不是对真实环境执行 `do` 操作，而是在固定视频中系统地删除某个对象的历史状态，从而构造“如果看不到它自身运动，只能依据别的对象，会怎样预测”的训练问题。[方法与因果边界](https://arxiv.org/html/2602.11389#S4)

这个变化很重要，但术语必须收紧：论文自己明确说明，这里的“causal”指向在遮挡下仍有用的时间定向预测依赖，不声称恢复真实因果图，也允许未观测混杂。其 influence neighborhood 可能包含 causal parent、下游变量或仅由混杂产生的相关变量。[理论讨论](https://arxiv.org/html/2602.11389#S6)

### 3. 训练时多看一种模态，推理时反而可以少带一个模块

TC-JEPA 的文本并不进入最终视觉 encoder 推理路径。caption 只调制轻量 predictor，训练结束后 predictor、T5 text encoder 与 text conditioner 全部丢弃。这使文本更像 **privileged information**：它不要求部署时存在，却改变视觉 encoder 在预训练时被要求保留的语义。[TC-JEPA 方法](https://arxiv.org/html/2605.03245#S3.SS2)｜[推理与计算说明](https://arxiv.org/html/2605.03245#A4)

这条路线与 MJEPA/CR-JEPA 的跨模态共同表示不同。MJEPA 希望一个 encoder 在推理时继续处理音频或视频，CR-JEPA 希望 S1/S2 进入共享检索空间；TC-JEPA 的目标是让文本在训练后“退场”，留下更语义化、更局部可用的视觉 patch 表示。

### 4. 日期级新增已经出现，候选池仍保留三条补课线

本轮检索覆盖 JEPA/I-JEPA/V-JEPA/V-JEPA 2/A-JEPA、ICML 2026、vision-language、robotics/control、time series、tabular、genomics、remote sensing、wireless 与 LLM fine-tuning，并检查了 arXiv、OpenReview、官方机构页和项目/代码页。四足导航论文于 7 月 20 日 05:33 UTC 提交，晚于上次自动化运行（03:02 UTC）约 2.5 小时，是本日唯一确认的日期级高可信新增。

- **Var-JEPA / Var-T-JEPA** 实际把 JEPA 改写为带条件先验和重建项的 ELBO，并在 Adult、Covertype、Electricity、Credit Card、Bank Marketing 等表格任务评测，同时提供 latent uncertainty；它是下一轮很有价值的“预测式与生成式是否真对立”候选。[arXiv](https://arxiv.org/abs/2603.20111)
- **GenoJEPA** 在 bioRxiv 报告连续 genomic patching 与 latent semantic alignment，并覆盖 55 个下游任务；本轮只完成摘要与元数据发现，尚未逐表核验 55 项协议和代码，因此不进入主结论。[bioRxiv](https://www.biorxiv.org/content/10.64898/2026.04.02.716255v1)
- **Representation Without Reward** 直接测试 BYOL-LLM、单遍 I-JEPA-LLM 与 decoder-visible JEPA 在自然语言到正则表达式生成中的效果，得到结构化零结果；但作者明确说主实验刻意移除了完整 multi-view JEPA 架构，下一步才是测试真正的 context-target 模型。因此它属于“实际评估 JEPA 核心部件的边界证据”，不与完整 JEPA 方法论文混排。[arXiv 原文](https://arxiv.org/html/2605.15394)
- **HQ-JEPA** 确实实现 I-JEPA 式 masked latent prediction，并在 GeoBench 分类/分割评测；但所谓 quantum fidelity 完全由 PennyLane 经典模拟，额外计算使预训练只使用 237,871 对 BigEarthNet S1/S2，而且没有同容量经典非线性相似度对照与公开代码，本日不优先扩写。[arXiv 原文](https://arxiv.org/html/2605.31068)
- **HAR-JEPA** 将 context/EMA target/predictor 与 masked latent prediction 移植到 IMU 活动识别；FORTH-TRACE 上相对同架构监督训练的 Accuracy/F1 提升 1.25/3.18 个百分点，但在 SBHARPT 上并未超过监督基线。论文只写 70/5/25 split，同时窗口有 50% overlap，尚需从代码核对是否 subject-disjoint；因此列入下一轮复现候选，不挤占今天三个主解读名额。[arXiv](https://arxiv.org/abs/2607.16350)｜[作者代码](https://github.com/mohalim/JEPA_HAR/)
- **Sepsis JEPA/Federated Framework** 没有引用 I-JEPA、V-JEPA 或 LeCun 的核心 JEPA 工作，所谓 federated 实验也不用于 JEPA 分支，主结果只有 validation；按本系列的技术和引用双重标准排除。[arXiv](https://arxiv.org/abs/2607.16681)
- A-JEPA 本体没有发现比已记录 MJEPA 更高可信的新下游证据；只在 related work 引用 JEPA、实际仍是 MAE/对比学习/像素生成的工作继续排除。

## 新增下游论文解读

### 一、Latent Imagination：训练时预测下一隐状态，部署时只留下策略

#### 基本信息

- **完整题目**：*Predictive Training with Latent Imagination for Visual Quadruped Navigation*
- **作者与机构**：Yancheng Zhu、Wanli Ma、Chen Han、Irvin Haozhe Zhan、Bingfeng Qin、Yixin Xu；Anker Spatial Perception Lab。
- **发布时间与出处**：arXiv v1 于 2026-07-20 05:33:22 UTC 提交，当前为 10 页预印本，未见同行评审接收信息。[arXiv 元数据](https://arxiv.org/abs/2607.17574)
- **使用的 JEPA**：明确引用 I-JEPA、V-JEPA 2 与 JEPA 构想，但不复刻视觉遮挡预训练；它把策略自己的循环状态作为 prediction target，训练动作条件的一步 latent predictor。
- **下游任务**：Unitree Go2 四足机器人的局部目标导航，包括静态环境和 0.3–0.8 m/s 的动态障碍环境；同时给出零样本 sim-to-real 定性展示。
- **代码状态**：截至检索日，论文未给出官方代码、checkpoint 或项目页。

#### 方法如何衔接 JEPA

**论文事实**：策略把 64×40 深度特征、16 维本体/目标状态和最多 12 个障碍物的 11 维状态，经 robot-conditioned attention 融合进 LSTM-SRU，得到 512 维隐状态 `h_t`。轻量 MLP predictor 接收 `h_t` 与三维速度动作 `a_t=(v_x,v_y,ω)`，预测 stop-gradient 的下一状态 `h_{t+1}`，以均方 latent distance 训练；SIGReg 对 batch 内隐状态施加方差与去相关约束以防常数坍塌。总目标为强化学习损失、预测损失和 SIGReg 的加权和，权重分别为 1、0.03、0.003。[论文方法与公式](https://arxiv.org/pdf/2607.17574)

actor 只看真实部署可获得的观测，critic 可以看仿真 privileged information。训练结束后 predictor 与 SIGReg 支路都被删除，部署控制器仍是 observation encoder、obstacle attention、LSTM-SRU 和 actor head，没有 rollout、规划循环或 world-model query。

**作者主张**：一步 latent prediction 会迫使循环状态编码短时障碍运动，因此即使部署时移除 predictor，策略仍能更早做规避动作，而且不增加推理参数或计算。

**本次判断**：这是一个很干净的“JEPA 作为 representation-shaping loss”案例，但 `latent imagination` 容易让人误以为系统真的执行 imagined rollout。论文所有实验都只做一步训练目标，actor 从未读取预测状态；因此它证明的是训练期预测正则能改善策略，而不是已经学成可供规划的通用 world model。

#### 数据、指标、基线与关键结果

训练使用 Isaac Sim 4.5 / Isaac Lab 2.1.1、4,096 个并行环境、4 张 RTX 4090D，20,000 次迭代约 3 天；物理、低层运动控制和高层导航分别运行在 200/50/5 Hz。仿真评估覆盖 8 个环境共 107 episodes，指标是互斥且相加为 100% 的成功率（SR）、碰撞率（CR）和超时率（TO）。[论文实验设置](https://arxiv.org/pdf/2607.17574)

| 场景 / 方法 | SR | CR | TO | 可比性 |
|---|---:|---:|---:|---|
| 静态 / SRU（no WM） | 90.7% | 5.6% | 3.7% | 同 backbone、同观测、同训练协议 |
| 静态 / SRU-WM（MLP） | **94.4%** | 5.6% | **0.0%** | predictive training 带来 +3.7 点 SR |
| 动态 / SRU（no WM） | 86.0% | 14.0% | 0.0% | 最关键受控基线 |
| 动态 / SRU-WM（MLP） | **96.2%** | **3.8%** | 0.0% | SR +10.2 点，CR -10.2 点 |
| 动态 / NavRL | 52.3% | 44.9% | 2.8% | 传感器和动作空间不同，仅 system-level 参考 |
| 动态 / NavDP | 19.2% | 59.6% | 21.2% | 同上，且受实时推理预算影响 |

消融比跨系统对比更重要：静态任务中 SRU-WM 去掉 SIGReg 后只有 86.0% SR / 12.1% CR / 1.9% TO，反而差于 no-WM 的 90.7% / 5.6% / 3.7%。Transformer predictor 达 95.3% SR，略高于 0.4M 参数 MLP 的 94.4%，但 predictor 本身有 2.1M 参数。由此可见，效果不是“随便加一个下一状态预测”就会出现，稳定表示分布是必要条件。

#### 事实、作者主张与本研究推断

- **事实**：同一 SRU backbone 下，完整预测支路在静态和动态任务都提高成功率；动态场景提升更大；预测器在推理时完全丢弃。
- **作者主张**：预测梯度使循环记忆编码短时场景动力学，这种结构从仿真迁移到真实机器人。
- **本研究推断**：动态场景的 matched ablation 支持“预测训练改善闭环行为”，但实机只展示行为序列，不能证明仿真中的碰撞率改善量已经迁移。其输入还显式包含障碍物相对速度与 collision-threat descriptor，因此收益不是从原始深度中无监督发现全部动力学。

#### 相对已有工作的创新

1. 把 JEPA-style predictor 直接挂在 RL 策略的确定性循环状态上，而不是先预训练一个独立 encoder。
2. predictor 以动作作为条件，目标直接服务于“当前状态 + 动作 → 下一策略状态”。
3. 预测支路只在训练时存在，明确量化部署时零额外模型分支的取舍。
4. 用 no-WM、no-SIGReg 与不同 predictor 的受控消融，拆分额外容量、预测信号和防坍塌机制。

#### 局限、复现条件与潜在风险

- 只训练一步预测；论文提到递归多步 rollout 在架构上可行，但没有做实验，也没有用 latent 做在线规划。
- 107 个仿真 episodes 的主表没有报告多随机种子方差或置信区间；训练曲线只说明最后 10% 步的均值，统计稳健性有限。
- NavRL/NavDP 的传感器、动作空间和原生部署条件不同，作者也将其限定为 system-level comparison；不能用倍数差异宣称统一 benchmark SOTA。
- 实机是 Intel RealSense D435i + Jetson Orin + Unitree Go2 的室内/室外定性序列，没有报告试验次数、成功率、碰撞率、速度分布或失败案例。
- 仿真策略输入使用带噪 physics state 构造障碍物特征；实机依赖 depth-based YOLO detection/tracking。检测漏报、玻璃/反光、强光、人群和更高速障碍下的安全性尚未验证。
- 完整复现需 4×RTX 4090D 约 3 天，且当前无代码；“推理零额外 predictor”不等于整个系统轻量，视觉检测、跟踪和低层运动控制仍有成本。

#### 博客价值判断

**高，且是本日最具时效性的原创候选。** 推荐主题：《训练时做预测，部署时扔掉世界模型：JEPA 如何帮助四足机器人提前避障》。文章应把“辅助表示目标”与“可 rollout 的 world model”分开，并用 no-SIGReg 反例说明 latent prediction 不是自动生效的魔法。

---

### 二、Causal-JEPA：用对象级 latent masking 强迫 world model 学交互

#### 基本信息

- **完整题目**：*Causal-JEPA: Learning World Models through Object-Level Latent Masking*
- **作者与机构**：Heejeong Nam、Quentin Le Lidec、Lucas Maes、Yann LeCun、Randall Balestriero；Brown University、New York University、Mila、Université de Montréal。[官方项目页](https://hazel-heejeong-nam.github.io/cjepa/)
- **发布时间与出处**：arXiv v1 于 2026-02-11 提交，v2 于 2026-05-28 更新；arXiv 与项目页标注 ICML 2026 accepted。[arXiv 元数据](https://arxiv.org/abs/2602.11389)
- **使用的 JEPA**：冻结视觉/对象 encoder 后训练 masked latent predictor；继承 I-JEPA/V-JEPA 的非像素 latent matching，并将历史 masking 从 patch/tube 改为对象轨迹。
- **下游任务**：CLEVRER 多对象视觉问答（描述、预测、解释、反事实）与 Push-T model-predictive control。
- **代码状态**：[官方 GitHub](https://github.com/galilai-group/cjepa) 提供环境、数据准备、训练入口、Hugging Face encoder checkpoints 与预提取 slot 表示；复现材料明显强于多数新预印本。

#### 方法如何衔接 JEPA

**论文事实**：VideoSAUR 或 SAVi 将每帧编码成固定数量的 object slots。C-JEPA 在历史窗口里随机选择若干对象，把这些对象除最早时刻 identity anchor 之外的 latent 全部替换为 mask token；未来对象 token 也全部遮挡。一个 6 层、16 头的双向 Transformer predictor 同时完成 masked-history completion 与 future latent prediction，损失是预测 slot 与冻结 target slot 的 L2 距离。动作和 proprioception 作为独立 auxiliary tokens 输入，而不是拼进视觉 token。[训练目标](https://arxiv.org/html/2602.11389#S4.SS2)｜[实现细节](https://arxiv.org/html/2602.11389#A4)

<figure style="text-align:center">
  <img src="https://hazel-heejeong-nam.github.io/cjepa/image_assets/image_demo/architecture.png" alt="Causal-JEPA 训练流程：对象级历史遮挡、辅助变量与未来 latent 预测" width="820" loading="lazy">
  <figcaption>图：C-JEPA 官方项目页的训练流程图。本文限制渲染宽度并直接引用官方优化资源，不把大图复制进仓库。来源：<a href="https://hazel-heejeong-nam.github.io/cjepa/">官方项目页</a>。</figcaption>
</figure>

**作者主张**：只做未来预测时，模型容易沿单个对象自身轨迹插值；把对象历史遮掉后，若想降低误差，就必须查询与其互动的其他对象和外生变量。这种 observability intervention 为模型引入 causal inductive bias。

**本次判断**：它确实把“交互是否成为必要信息”做成了 objective-level 控制变量，并以同架构 OC-JEPA 作为干净消融。但这不是 counterfactual data generation，也不恢复结构因果模型；更准确的名称是 **interaction-forcing predictive bias**。

#### 数据集、指标、基线与关键结果

**CLEVRER**：10,000 个训练视频、5,000 个验证视频、5,000 个测试视频，每段 128 帧，包含最多 6 个可见对象。由于评测服务器不可用，论文把验证集当 held-out test，且声称不用于训练或选模。下游采用 ALOE 问答头；基线包括 SlotFormer、OCVP-Seq、只遮未来的 OC-JEPA，另分别使用 VideoSAUR 与 SAVi object encoder。[数据与评测](https://arxiv.org/html/2602.11389#A3.SS1)

| Encoder / 模型 | 历史遮挡对象数 | Overall per-question | Counterfactual per-option | Counterfactual per-question |
|---|---:|---:|---:|---:|
| VideoSAUR / OC-JEPA | 0 | 82.79 | 79.53 | 47.68 |
| VideoSAUR / C-JEPA | 3 | 87.61 | 86.49 | 63.60 |
| VideoSAUR / C-JEPA | 4 | **89.40** | **88.67** | **68.81** |
| SAVi / OC-JEPA | 0 | 77.28 | 76.69 | 41.10 |
| SAVi / C-JEPA | 2 | **83.88** | **85.16** | **60.19** |
| SAVi / C-JEPA | 4 | 73.28 | 73.55 | 34.06 |

最强增益集中在反事实问题：VideoSAUR 下 per-question 绝对提升 21.13 点，SAVi 的最优遮挡量提升 19.09 点。但 SAVi 遮 4/7 个 slots 时反而低于无遮挡，说明“拿走更多信息”不是单调有效，encoder 质量与 masking budget 强耦合。[VQA 主表](https://arxiv.org/html/2602.11389#S5.SS1)

**Push-T**：18,410 条训练轨迹、21 条验证轨迹；目标是在二维平面中把绿色 T 形块推到目标姿态。模型用 CEM 做 MPC，报告 50 条轨迹、三个种子的成功率与单张 L40S 上的总规划时间。最重要的同源基线从同一个冻结 DINOv2 表示出发，再区分 patch tokens、object slots 与 predictor/objective。[任务与基线](https://arxiv.org/html/2602.11389#S5.SS2)

| 模型 | Predictor 输入 | 成功率 | 解释 |
|---|---:|---:|---|
| DINO-WM | 196 × 384 | **91.33%** | patch-based 最佳绝对结果 |
| DINO-WM-Reg. | 196 × 384 | 88.00% | register 版本 |
| OC-DINO-WM | 6 × 128 | 60.67% | 只换 object representation 明显掉点 |
| OC-JEPA | 6 × 128 | 76.00% | JEPA predictor 恢复 15.33 点 |
| C-JEPA | 6 × 128 | **88.67%** | 再加历史对象 masking，接近 patch baseline |

C-JEPA 的 token-feature 数约为 DINO-WM 的 1.02%；50 轨迹评测平均耗时 673 秒，DINO-WM 为 5,763 秒，约快 8.56 倍。[Push-T 主表与时间](https://arxiv.org/html/2602.11389#S5.SS2.SSS3)

#### 事实、作者主张与本研究推断

- **事实**：同 predictor 架构下，历史对象 masking 在两个 object encoders 上都提高 CLEVRER 反事实问答；Push-T 中从 OC-JEPA 到 C-JEPA 的成功率提高 12.67 点，同时保持紧凑 slot 输入。
- **作者主张**：对象级 masking 通过控制可见性，使 interaction-dependent reasoning 成为最小化损失的必要条件；由此得到一种 causal inductive bias。
- **本研究推断**：最有价值的证据不是“C-JEPA 具有因果理解”，而是 **masking granularity 可以决定模型是否有机会走自动态捷径**。如果对象分解正确，整对象遮挡能删除捷径；如果 slot 把多个对象混在一起或对象漏检，所谓干预就不再对应稳定实体。

#### 相对已有工作的创新

1. 将 I/V-JEPA 的 patch/tube masking 提升到对象轨迹级，同时保留 history completion 与 future prediction。
2. 用 OC-JEPA（相同 object encoder、相同 predictor，只取消 history masking）隔离 objective 的作用。
3. 把 actions/proprioception 显式建成 auxiliary nodes，使“对象—对象”和“控制—对象”的预测依赖共用一个接口。
4. 不只报告表示 probe，还把紧凑 latent 接入 CEM/MPC，量化成功率、token budget 与规划时间。

#### 局限、复现条件与潜在风险

- CLEVRER 是合成碰撞视频，Push-T 是单一二维操作环境；还没有真实机器人、复杂接触、长程多对象操作或视觉域迁移。
- 视觉与 object-centric encoders 是预训练后冻结的，性能上限受 slot 质量制约。论文也承认尚未在带显式 temporal causal graph 的数据上验证 influence neighborhood。
- CLEVRER 主结果使用验证集代替正式测试集，尽管作者称未用于选模，仍弱于可核验的官方 test-server 结果。
- 理论结论依赖 object-aligned latent、共享转移机制与有限历史充分等假设；attention/influence neighborhood 不等于 causal parent set。
- Push-T 的 patch baseline 仍以 91.33% 高于 C-JEPA 的 88.67%；“comparable”成立，但不能写成绝对性能反超。
- 规划评测规模只有 50 条轨迹、三个种子；简单环境上的 8.6× 加速不能直接外推到真实机器人端到端延迟。
- 官方代码与 checkpoints 已公开，但复现依赖 VideoSAUR、SAVi/SlotFormer 与预提取表示等多套组件；仓库说明还要求替换旧 `pytorch-lightning` 兼容文件，环境搭建并非一键完成。

#### 博客价值判断

**高，值得主题化重写。** 推荐主题：《遮掉整个对象，JEPA 就学会因果了吗？从 Causal-JEPA 看“可见性干预”的力量与边界》。原创文章最重要的结构应是：先解释为什么普通 future prediction 会走 self-dynamics shortcut，再展示对象遮挡的 matched ablation，最后用论文自己的限定澄清“预测充分性 ≠ 因果识别”。

---

### 三、TC-JEPA：只在预训练时让视觉 predictor 读文本

#### 基本信息

- **完整题目**：*Text-Conditional JEPA for Learning Semantically Rich Visual Representations*
- **作者与机构**：Chen Huang、Xianhang Li、Vimal Thilak、Etai Littwin、Josh Susskind；Apple。[Apple 官方论文页](https://machinelearning.apple.com/research/text-conditional-jepa-visual-representations)
- **发布时间与出处**：arXiv v1 于 2026-05-05 提交；论文与 Apple 官方页面标注 ICML 2026。[arXiv 元数据](https://arxiv.org/abs/2605.03245)
- **使用的 JEPA**：直接保留 I-JEPA 的 context encoder、EMA target encoder、multi-block masking、stop-gradient 与 feature predictor，在 predictor 内加入多层 text conditioning。
- **下游任务**：ImageNet/CIFAR100/Places205/iNaturalist18 分类，COCO 检测，ADE20K/VOC 分割，以及冻结视觉 encoder 后的 COCO captioning、GQA 与 VQAv2。
- **代码状态**：截至检索日，arXiv 与 Apple 官方论文页均未给出代码、checkpoint 或训练日志链接。

#### 方法如何衔接 JEPA

**论文事实**：TC-JEPA 仍让 context encoder 看可见图像 patches，让 EMA target encoder 产生被遮挡 patches 的目标 latent；变化只发生在 predictor。每张图的 caption 先经预训练 T5 得到 word tokens，predictor 在多个层级让每个 patch query 对 word tokens 做 cross-attention，并对正 patch-word similarity 加 sparsity 与跨层 consistency regularization。每图默认随机取 8 条 captions，分别条件化后以 feature-wise MaxPool 融合。[方法原文](https://arxiv.org/html/2605.03245#S3.SS2)

训练结束后，T5、text conditioner 与 predictor 全部丢弃，只保留视觉 target encoder 做冻结 probe 或下游微调；因此下游推理不需要 caption。[评测与推理协议](https://arxiv.org/html/2605.03245#A3.SS3)｜[计算说明](https://arxiv.org/html/2605.03245#A4)

**作者主张**：当 context 看不到 bookshelf 时，仅凭位置去预测其 latent 是一对多问题；caption 提供场景组成与关系信息，降低目标不确定性。多层 patch-word correspondence 因而同时保留全局语义和局部空间细节。

**本次判断**：TC-JEPA 的核心不是“把 CLIP 换成 JEPA”，而是 **把部署时不需要的文本当作预训练期特权信息**。它的视觉迁移结果很强，但所有 I-JEPA 对比都混入额外 caption supervision、冻结 T5 与 synthetic-caption 生成模型，不能把增益只归因于更好的 latent objective。

#### 数据集、指标、基线与关键结果

**预训练数据**：

- ImageNet-1K/21K：用 ShareGPT4V 为每张图生成平均 8.3/8.7 个 caption 句子；ViT-B/L 训练 600 个 IN-1K epochs，ViT-H 训练 300 epochs。
- YFCC15M 与 CC12M：将原始 caption 与 ShareGPT4V 合成 captions 合并；ViT-B/L 训练 50 epochs。文本只服务预训练。
- 主要基线：I-JEPA、StoP、MAE、data2vec、DINO/iBOT，以及图文预训练 CLIP、BLIP、MaskCLIP、SPARC、DreamLIP、GroupViT。[实验设置](https://arxiv.org/html/2605.03245#S4)

同 ImageNet-1K、同骨干规模与训练轮数的直接比较：

| Backbone | I-JEPA IN-1K linear | TC-JEPA | 绝对提升 |
|---|---:|---:|---:|
| ViT-B/16 | 72.9 | **75.8** | +2.9 |
| ViT-L/16 | 77.5 | **79.6** | +2.1 |
| ViT-H/14 | 79.3 | **80.4** | +1.1 |

增益随模型变大而收窄，而且 TC-JEPA 使用 I-JEPA 没有的文本监督；这组表证明“文本条件版本更好”，并非纯目标函数公平对照。[ImageNet 表](https://arxiv.org/html/2605.03245#S5.SS1)

ViT-H/14、ImageNet-1K 预训练后的迁移：

| 任务/指标 | I-JEPA | TC-JEPA | 变化 |
|---|---:|---:|---:|
| iNaturalist18 linear accuracy | 47.6 | **54.8** | +7.2 |
| COCO box AP（12-epoch fine-tune） | 53.7 | **55.2** | +1.5 |
| ADE20K linear mIoU | 36.9 | **39.5** | +2.6 |
| ADE20K fine-tune mIoU | 51.2 | **55.7** | +4.5 |
| VOC linear mIoU | 64.6 | **70.4** | +5.8 |

这些结果支持 patch-level 表示改善，尤其是细粒度分类与稠密视觉。[迁移表](https://arxiv.org/html/2605.03245#S5.SS1)

在使用图文预训练数据的比较中，YFCC15M、ViT-B/16 的 TC-JEPA 在 IN-1K linear / COCO AP / ADE20K mIoU 为 77.1/54.5/55.2，使用同类合成 caption 的 SPARC 为 73.4/52.0/52.3。冻结视觉 encoder、统一训练 12 层 LiT-Decoder 后，TC-JEPA 的 COCO CIDEr、GQA、VQAv2 为 111.6/46.3/57.8，SPARC 为 109.7/45.4/56.2。[图文与稠密任务表](https://arxiv.org/html/2605.03245#S5.SS2)

#### 事实、作者主张与本研究推断

- **事实**：在相同视觉 backbone 与 epochs 下，TC-JEPA 在 ImageNet linear、细粒度分类、检测和分割上都高于 I-JEPA；冻结 encoder 的 captioning/VQA 也高于表中 CLIP/SPARC 对照。
- **作者主张**：text conditioning 降低 masked feature prediction 的不确定性，使模型学到兼具语义和空间精度的 patch features，并降低对 context/target block scale 的敏感性。
- **本研究推断**：最可信的结论是“**多 caption 条件化的 I-JEPA 管线能把文本知识蒸馏进视觉 encoder**”。它尚未证明 prediction-only 比所有 contrastive vision-language training 更优，因为 baseline 数据、合成 captions、模型大小与实现来源并非全部一致。

#### 相对已有工作的创新

1. 文本只调制 feature predictor，不进入部署时视觉 encoder，形成 train-time-only modality。
2. 不是只把全句 embedding 拼进 predictor，而是在多个 predictor 层学习 patch-word cross-attention，并加入 sparsity/consistency 约束。
3. 同时覆盖纯视觉分类/检测/分割与冻结 encoder 的 VQA/captioning，验证局部和多模态迁移。
4. 系统分析 caption 数量、caption 生成模型、mask block 尺度与多 caption pooling；结果显示约 8 条 caption 后趋于饱和，较弱 caption model 可通过更多样本缩小差距。[caption 鲁棒性分析](https://arxiv.org/html/2605.03245#A5)

#### 局限、复现条件与潜在风险

- “self-supervised”必须加限定：训练依赖 T5 与 ShareGPT4V/LLaVA/InstructBLIP 生成 captions，本质上使用了来自大模型的弱文本监督和知识蒸馏。
- 论文计算图只计入 TC-JEPA 预训练，未把为 ImageNet/CC/YFCC 生成多条 captions 的一次性推理成本纳入端到端预算。
- 对 I-JEPA 的 matched comparison 只匹配视觉数据、backbone 与 epochs，没有匹配监督信息；真正的因果问题是“同 caption、同 T5、同计算下，feature prediction 对比 image-text contrastive/captioning loss”。
- YFCC/CC 与合成 caption 继承网页数据、captioning model 的偏见、版权与幻觉风险；attention 能过滤部分噪声的实验不等于消除系统偏见。
- VQA/captioning 并非 zero-shot：视觉 encoder 冻结，但仍训练一个 12 层自回归 LiT-Decoder；数字衡量的是视觉表征对统一 decoder 的适配性。
- 论文没有单独的 limitations 章节，也未报告训练种子方差、显著性检验和完整 caption-generation 审计。
- 截至本次检索无官方代码、checkpoint 与日志；IN-21K/CC27M 的大规模复现成本和数据清洗细节尚不能独立核验。
- 文本 conditioner 只在训练时存在，意味着模型可能把 caption model 的语义盲点固化进视觉 encoder；需要测试无 caption 覆盖类别、反事实 caption、错误 caption 与跨语言 caption。

#### 博客价值判断

**高，值得主题化重写。** 推荐主题：《训练时读文字，推理时只看图：TC-JEPA 如何把 caption 变成视觉预训练的特权信息》。文章应围绕“减少目标不确定性”与“增加监督预算”这组张力写，而不是简单宣布 JEPA 击败 CLIP。

## 横向比较

| 论文 | 对 JEPA 的实质改造 | 具体下游 | 最强证据 | 关键反证/边界 | 复现状态 |
|---|---|---|---|---|---|
| Latent Imagination | 动作条件的一步循环状态预测 + SIGReg；predictor 仅训练时存在 | 四足机器人静态/动态局部导航 | 同 SRU 动态 SR 86.0%→96.2%、CR 14.0%→3.8%；部署移除 predictor | 去 SIGReg 后反而退化；只做一步预测；真机仅定性；输入含显式 obstacle state | 2026-07-20 arXiv；无代码；4×4090D 约 3 天 |
| Causal-JEPA | 对象轨迹级 history masking + future prediction；actions/proprioception 作为辅助节点 | CLEVRER VQA、Push-T MPC | 同架构 OC-JEPA 消融；counterfactual +19～21 点；1.02% latent feature 输入下 88.67% 成功率 | causal bias 非 causal identification；简单合成环境；patch baseline 仍更高；依赖 object encoder | ICML 2026；代码、checkpoint、预提取 slots 公开 |
| TC-JEPA | I-JEPA predictor 多层读取 caption tokens；patch-word 稀疏/一致性正则；下游丢弃文本模块 | 分类、检测、分割、captioning、VQA | 同 ImageNet/backbone/epochs 全尺度优于 I-JEPA；稠密任务增益大；冻结视觉 encoder 多模态迁移 | 额外 synthetic-caption/T5 监督；caption 成本未入账；跨方法数据与实现不完全匹配；无代码 | ICML 2026；论文与 Apple 页面可读，无公开代码/权重 |

共同结论：

1. **训练目标可以比部署系统更丰富。** Latent Imagination 的 predictor、C-JEPA 的 mask、TC-JEPA 的文本都只塑造训练问题，最后留下的分别是 RL policy、object predictor 和 visual encoder。
2. **可见信息是 JEPA objective 的一部分。** action conditioning、masking 和 caption conditioning 决定 predictor 被迫利用哪些依赖，不是免费的实现细节。
3. **最可信证据仍来自 matched ablation。** 四足导航的 no-WM/no-SIGReg、C-JEPA 的 OC-JEPA 对照比跨架构 leaderboard 更干净；TC-JEPA 匹配了视觉训练预算，却没有匹配文本监督，因此归因更弱。
4. **“学到世界模型”要按 downstream interface 检验。** 四足策略不消费预测 latent，C-JEPA 用 latent 做 MPC，TC-JEPA 只保留 encoder；三者对 prediction 的使用层级不同，不能混成同一种 world-model 能力。

## 值得继续追的问题

1. **一步 predictive regularization 能否变成真正的多步 world model？** 应比较只训练一步、递归 rollout、多步 teacher-forcing 和 actor 显式消费预测 latent，并测误差累积与闭环安全。
2. **四足导航收益到底来自哪些输入？** 需要去掉相对速度、collision-threat descriptor、obstacle attention，检查 JEPA predictor 是否仍能从深度时序中学到提前量。
3. **真机收益能否量化？** 至少应跨室内/室外、光照、障碍速度和检测失败模式报告 episodes、SR/CR、延迟与置信区间，而非只给成功序列。
4. **C-JEPA 的 causal claim 能否在显式图上被证伪？** 应在带 ground-truth interaction graph、可控 intervention 和 hidden confounder 的数据上比较 influence neighborhood、attention 与真实 parents，而不只看 VQA accuracy。
5. **对象发现错误如何传导到 planner？** 需要人为制造 slot merge/split、遮挡、对象进出、身份交换，再测 mask objective 是否仍优于 OC-JEPA。
6. **TC-JEPA 的收益来自文本信息还是 predictor 结构？** 需要同样 captions/T5 的 I-JEPA、SigLIP/SPARC、caption reconstruction 与 shuffled-caption 对照，并匹配 FLOPs、epochs 和数据清洗。
7. **错误或反事实 caption 会怎样改变表示？** 训练期文本虽会被丢弃，其偏见仍可能进入 encoder；应测 caption corruption、语言切换、缺失概念与对象属性冲突。
8. **下一轮优先核验 HAR-JEPA、Var-JEPA 与 GenoJEPA。** HAR-JEPA 先从代码核对 subject-disjoint split，Var-JEPA 分开审计 downstream 与 uncertainty calibration，GenoJEPA 逐项核验 55 个任务和数据同源性。

## 博客价值判断

### 首选：Latent Imagination 的“训练时预测，部署时丢弃”

推荐标题：

> 训练时做预测，部署时扔掉世界模型：JEPA 如何帮助四足机器人提前避障

这是本日真正新增、应用链条也最完整的主题。文章应以动态场景 matched ablation 为主证据，以 no-SIGReg 退化和真机仅定性为制动器，解释“让策略状态更可预测”为什么可能改善控制，又为什么不能直接等同于世界理解或安全验证。

### 次选：Causal-JEPA 的“因果”边界

推荐标题：

> 遮掉整个对象，JEPA 就学会因果了吗？

它适合写成一篇方法与术语审计并重的原创博客：对象遮挡为什么能删除 self-dynamics shortcut、为什么反事实 VQA 增益大、为什么这仍不等于 `do`-intervention 或因果图恢复。官方图、代码和 matched ablation 都足以支撑独立成文。

### 第三候选：TC-JEPA 的特权信息路线

推荐标题：

> 训练时读文字，推理时只看图：JEPA 如何把 caption 蒸馏进视觉 encoder

它能把 JEPA target uncertainty、知识蒸馏和视觉—语言预训练连接起来。成文时必须把“feature prediction only”与“并非无监督”并列：loss 没有 contrastive term，不代表训练没有外部语义监督。

本次只做追踪记录与博客价值判断，不自行创建以上主题化原创博客。

## 来源链接

### 今日深读

- Latent Imagination 四足导航：[arXiv 摘要](https://arxiv.org/abs/2607.17574)｜[论文 PDF](https://arxiv.org/pdf/2607.17574)｜[arXiv DOI](https://doi.org/10.48550/arXiv.2607.17574)
- Causal-JEPA：[arXiv 摘要](https://arxiv.org/abs/2602.11389)｜[HTML 全文](https://arxiv.org/html/2602.11389)｜[ICML 2026 / 官方项目页](https://hazel-heejeong-nam.github.io/cjepa/)｜[官方代码](https://github.com/galilai-group/cjepa)
- TC-JEPA：[arXiv 摘要](https://arxiv.org/abs/2605.03245)｜[HTML 全文](https://arxiv.org/html/2605.03245)｜[Apple 官方论文页](https://machinelearning.apple.com/research/text-conditional-jepa-visual-representations)

### 候选、边界证据与未纳入项

- Var-JEPA / Var-T-JEPA：[arXiv](https://arxiv.org/abs/2603.20111)
- GenoJEPA：[bioRxiv](https://www.biorxiv.org/content/10.64898/2026.04.02.716255v1)
- Representation Without Reward：[arXiv 摘要](https://arxiv.org/abs/2605.15394)｜[HTML 全文](https://arxiv.org/html/2605.15394)
- HQ-JEPA：[arXiv 摘要](https://arxiv.org/abs/2605.31068)｜[HTML 全文](https://arxiv.org/html/2605.31068)
- HAR-JEPA：[arXiv](https://arxiv.org/abs/2607.16350)｜[作者代码](https://github.com/mohalim/JEPA_HAR/)
- Sepsis JEPA/Federated Framework（排除）：[arXiv](https://arxiv.org/abs/2607.16681)
- JEPA-MSAC：[arXiv](https://arxiv.org/abs/2603.29796)
- FF-JEPA：[arXiv](https://arxiv.org/abs/2606.09311)
- Emotion-JEPA：[OpenReview](https://openreview.net/forum?id=J5TIa3f9vd)
- 仅将 DINOv2 称为 JEPA encoder、没有 context-target-predictor 训练的 Minority Sampling：[ICML/OpenReview](https://openreview.net/forum?id=Vn0lOKou5q)
