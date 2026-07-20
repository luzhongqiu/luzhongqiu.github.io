---
title: JEPA 下游研究追踪 · 2026-07-20
date: 2026-07-20 10:00:00
categories:
  - JEPA研究追踪
tags:
  - JEPA
  - JEPA追踪
---

本文属于「JEPA追踪」系列，记录每日论文检索、原文核验与阶段性判断；它保留研究日志的证据密度，与经过主题化重写的原创博客区分。

# JEPA 下游研究追踪（2026-07-20）

> 检索截止：2026-07-20（Asia/Shanghai）
>
> 去重基线：已完整读取 `research/jepa/` 中 2026-07-15 至 2026-07-19 的全部记录与自动化 memory；此前已深读 BA-Future-JEPA、GeoWorld、US-JEPA、NeuroVFM/Vol-JEPA、MoP-JEPA、P-JEPA、Rabtriever、Clin-JEPA、AD-L-JEPA、CryoLVM、MJEPA、Temporal Straightening、JetParticle-JEPA、COJEPA、Market JEPA 与 DSeq-JEPA，本日不重复汇报。
>
> 纳入标准：论文须明确引用 JEPA 核心工作，并实际复用、改造或评估 latent prediction 机制来完成具体下游任务。搜索索引仅用于候选发现；实质性结论均回到论文原文、会议页或作者官方材料核验。

## 今日结论

今天新增深读三篇此前只进入候选池、尚未在本系列完整解读的实际 JEPA 工作：

1. **SALT 证明，视频 JEPA 不一定需要共同演化的 EMA 教师。** 它先用像素重建训练并冻结教师，再让学生预测教师的 masked latent。在相同 V-3.6M、相同 240k 总训练步数和冻结骨干评测下，ViT-L 六项平均准确率从 V-JEPA 2 的 79.6 提高到 81.9，并降低估算计算量；但同协议直觉物理评测并未胜过 V-JEPA 2，说明更好的分类表征不等于更好的物理预测器。[ICLR 2026 论文页](https://openreview.net/forum?id=3cB9243E9i)｜[论文原文](https://arxiv.org/html/2509.24317)
2. **CR-JEPA 把跨模态 latent prediction 直接用于遥感检索。** 它在 Sentinel-1/2、光学/SAR、全色/多光谱三组数据上同时支持同模态与跨模态检索；BEN-14K 的两项跨模态 F1@5 相对 X-JEPA 从 61.23/63.73 提高到 75.82/75.40。不过完整系统同时使用 InfoNCE、余弦对齐、SIGReg、共享 trunk 与双检索头，不能把 12～15 点提升单独归因于 JEPA loss。[论文原文](https://arxiv.org/html/2606.00706)
3. **ER-JEPA 首次把两个 I-JEPA 串成 ECG 的“通道→时间”层次。** 它先在每个时间片内聚合 12 导联，再沿时间序列预测更高层 latent；在 PTB-XL 上冻结与全量微调都优于同数据的 1D-JEPA，但 CPSC2018 已接近饱和，部分结果低于既有 ECG-JEPA。论文也报告偶发异常预训练和对 batch、维度、dropout 的敏感性，因此当前证据支持“高效分层编码”，不支持“已得到稳定临床基础模型”。[arXiv v2](https://arxiv.org/abs/2607.01145)｜[论文原文](https://arxiv.org/html/2607.01145)

今天最重要的横向判断是：**JEPA 的 teacher、预测路线与层次结构都在被模块化，但每种模块化都会引入新的归因边界。** SALT 的教师来自像素重建，CR-JEPA 的检索收益混合对比对齐，ER-JEPA 的层次收益在全量微调后明显收窄。三篇都比“只在 related work 引用 JEPA”更强，却都不能被简化成“latent prediction 单独刷新了下游指标”。

综合原创博客价值：**SALT（高） > CR-JEPA（高） > ER-JEPA（中高）**。

## JEPA 方向最新进展

### 1. Teacher 从训练状态变成可替换的数据接口

V-JEPA/V-JEPA 2 依赖 EMA teacher 与 student 共同演化，teacher 质量无法在训练前独立检查。SALT 把过程拆成 V-Pixel teacher 和 masked-latent student 两阶段，teacher 可以冻结、复用，并可小于 student。这使“teacher 产生什么 target”与“student 如何预测 target”第一次能独立扩展和计量。[SALT 方法](https://arxiv.org/html/2509.24317#S2.SS2)

代价是：SALT 的 teacher 本身由像素重建获得。它证明的是“**静态 latent target 足以训练强 student**”，不是“像素重建完全没有价值”，也不是所有动态 world model 都可以丢弃在线目标更新。

### 2. 跨模态 JEPA 开始把“预测空间”和“检索空间”分开

MJEPA 用共享 encoder 和跨模态 predictor 缓解音视频负迁移；CR-JEPA 进一步把 latent prediction 与下游检索 head 分工：模态内/跨模态 predictor 学局部 feature correspondence，统一 head 保存同模态邻域，专用 cross-modal head 承担跨传感器搜索。[CR-JEPA 架构](https://arxiv.org/html/2606.00706#S3)

这也意味着 CR-JEPA 更接近“JEPA + retrieval-specific metric learning”的组合系统。其方法没有沿用 I-JEPA 的 EMA target encoder，而是使用共享 trunk、masked latent targets 与 SIGReg 防坍塌；按本系列口径，它属于实际采用 latent prediction 的 JEPA 变体，但不应写成标准 I-JEPA 的直接复刻。

### 3. Hierarchical JEPA 从概念图进入可测的多变量时序

ER-JEPA 把 LeCun 路线图中的 H-JEPA 具体化：第一个 JEPA 只处理同一时间片的跨导联关系，第二个 JEPA 只处理聚合后的时间 token。这样既保留 attention 级跨导联建模，又避免每一层都在 `导联数 × 时间片数` 的长序列上运行。[ER-JEPA 方法](https://arxiv.org/html/2607.01145#S3)

不过层次结构也放大了坍塌风险：第二级输入本身就是第一级学习出来的 latent。论文中“早期 loss 先骤降再恢复”、偶发异常模型以及无 dropout 退化，说明 H-JEPA 还没有形成无须调参的稳定配方。[稳定性分析](https://arxiv.org/html/2607.01145#S5.SS2)

### 4. 检索范围与未纳入结果

本轮覆盖了 7 月中旬以来的 arXiv/OpenReview 更新，以及 I-JEPA、V-JEPA/V-JEPA 2、A-JEPA、跨模态检索、ECG、视频、机器人、遥感、声呐与无线方向。没有发现 2026-07-19 之后新提交、且证据强于今天三篇的一手论文，因此本日以候选池深读为主，不用低质量“新名字”凑数。

- **Mine-JEPA 不进入主解读**：其论文明确以 SIGReg 作为主体自监督 loss，未实现 context–target latent predictor；虽然名称含 JEPA，仍更接近 LeJEPA 派生的正则化 joint-embedding 方法，按本系列严格口径不与实际 predictive JEPA 混排。[MaCVi/OpenReview](https://openreview.net/forum?id=XhXKWdLX61)
- **Causal-JEPA** 实际采用对象级 masked latent intervention，并有 CLEVRER 与 PushT 结果和官方代码；arXiv v2 已明确标注 **ICML 2026 Accepted**，不再按早期工作坊状态记录。本日仍留作下一轮最高优先级机制深读。[arXiv](https://arxiv.org/abs/2602.11389)｜[ICML/OpenReview](https://openreview.net/forum?id=VMAHQDOtjp)｜[官方代码](https://github.com/galilai-group/cjepa)
- **Pokemon Red multimodal JEPA、SPACE-HOP、Emotion-JEPA** 都属于实际采用者，但分别受限于 poster/工作坊、单一航天位姿短篇或仍在 TMLR 审稿；本日不以弱证据扩成第四篇。[Pokemon Red](https://openreview.net/forum?id=8li5NOHh9S)｜[SPACE-HOP](https://openreview.net/forum?id=t9LTeubtto)｜[Emotion-JEPA](https://openreview.net/forum?id=J5TIa3f9vd)
- **Minority Sampling with JEPA-Guided Diffusion** 继续排除：它把现成 DINOv2 称作 JEPA encoder，用其 Jacobian 指导扩散采样，没有复用 context–target–predictor 训练管线。[ICML 2026 论文页](https://openreview.net/forum?id=Vn0lOKou5q)

## 新增下游论文解读

### 一、SALT：用冻结教师重写 V-JEPA 的训练生命周期

#### 基本信息

- **完整题目**：*Rethinking JEPA: Compute-Efficient Video SSL with Frozen Teachers*
- **作者与机构**：Xianhang Li、Chen Huang、Chun-Liang Li、Eran Malach、Josh Susskind、Vimal Thilak、Etai Littwin；Apple。
- **发布时间与出处**：arXiv v1 于 2025-09-29 提交；正式发表于 ICLR 2026。[ICLR/OpenReview](https://openreview.net/forum?id=3cB9243E9i)｜[arXiv](https://arxiv.org/abs/2509.24317)
- **使用的 JEPA**：直接以 V-JEPA/V-JEPA 2 的视频多块遮挡与 masked latent prediction 为基础，用静态教师替代 EMA 教师。
- **下游任务**：Kinetics-400、Something-Something-v2、COIN、Diving48、Jester、ImageNet-1K 冻结骨干分类，以及 IntPhys、GRASP、InfLevel 零样本直觉物理判断。
- **代码状态**：截至本次检索，论文、arXiv 与 OpenReview 页面未给出官方代码、权重或训练日志仓库。

#### 方法如何衔接 JEPA

**论文事实**：SALT 分两阶段训练。Stage 1 用 V-JEPA 的 multi-block masking，但以 VideoMAE 式像素重建训练一个 V-Pixel teacher；Stage 2 冻结 teacher，只让 context encoder 与 predictor 从可见视频 token 预测 teacher 的 masked latent，不使用 EMA，也不再需要额外 anti-collapse regularizer。[方法原文](https://arxiv.org/html/2509.24317#S2.SS2)

主实验以 Kinetics-710、SSv2 和 Panda70M 的 280 万子集组成约 360 万视频的 V-3.6M。matched setting 中 teacher 训练 80k steps、student 训练 160k steps，与 V-JEPA 2 的 240k steps 总预算对齐；较大的 H/g/G student 仍可复用 ViT-L teacher。[训练与规模设置](https://arxiv.org/html/2509.24317#S3)

**作者主张**：高下游准确率的 teacher 并不是强 student 的必要条件；应把绝大多数训练预算分配给 student，静态 teacher 还能让训练 loss 重新成为可解释的模型选择指标。

**本次判断**：静态 teacher 确实把 JEPA 的 target-generation 变成稳定接口，但 student 仍在拟合一个由像素重建塑造的表示空间。SALT 更像“先用便宜 generative objective 建 target，再用 predictive objective 放大语义”，而不是 JEPA 与重建的二选一。

#### 数据、指标、基线与关键结果

- 主要 frozen attentive-probe 基线包括 V-JEPA 2、VideoMAEv2、VideoPrism、InternVideo2、Perception Encoder、DINOv2 与 SigLIP2；最可信的归因比较是同 V-3.6M、同总步数的 V-JEPA 2。[评测协议](https://arxiv.org/html/2509.24317#S4)
- 同 V-3.6M、ViT-L、240k 总步数的六项 top-1：

| 方法 | IN-1K | K400 | SSv2 | COIN | Diving48 | Jester | 平均 |
|---|---:|---:|---:|---:|---:|---:|---:|
| V-JEPA 2 | 73.7 | 73.3 | 68.4 | 83.1 | 82.1 | 97.0 | 79.6 |
| SALT Stage 2 | **79.0** | **76.0** | **71.3** | **85.3** | **82.5** | **97.2** | **81.9** |

  这组控制实验的六项平均提升为 2.3 个百分点。[论文 Table 12](https://arxiv.org/html/2509.24317#A8.T12)
- 在主表的多视图设置中，同样用 V-3.6M 的 SALT ViT-L 在 SSv2/K400 为 74.9/85.4，V-JEPA 2 ViT-L 为 68.2/83.8；扩到 ViT-G 后为 76.1/87.2，但 SSv2 从 ViT-g 的 76.2 略降，已有规模平台期。[主表](https://arxiv.org/html/2509.24317#S4.T1)
- 论文计算表估算 SALT-L 总计算量约 `1.2×10^21 FLOPs`、8,263 A100 GPU-hours，V-JEPA 2-L 为 `1.9×10^21 FLOPs`、9,800 GPU-hours；SALT-g 为约 `1.8×10^21 FLOPs`，V-JEPA 2-g 为 `5.3×10^21 FLOPs`。GPU-hours 是排除数据加载与通信、用单 A100 短跑外推的估算，不等同于实际集群账单。[计算表](https://arxiv.org/html/2509.24317#A7.T11)
- 负面结果很重要：同 V-3.6M 的 IntPhys/GRASP/InfLevel 平均准确率，SALT-L 为 66.1，低于 V-JEPA 2-L 的 69.1；SALT-H 为 70.7，也略低于 V-JEPA 2-H 的 71.2。[直觉物理表](https://arxiv.org/html/2509.24317#A5.T9)

#### 创新、局限、复现条件与风险

**相对已有工作的创新**：

1. 将 EMA target encoder 替换成可独立训练、冻结、复用的小 teacher，解除 teacher/student 同构与同步更新约束。
2. 在 matched data/steps 下同时报告表示质量和训练计算，并系统改变 teacher 数据、大小、checkpoint 与预算。
3. 发现 student 的最终质量对 teacher 下游分数不敏感，使 JEPA 的模型选择问题从“跟踪共同演化系统”变成“选择静态 target source”。

**局限与风险**：

- 两阶段总成本仍包含 V-Pixel teacher；只有复用 teacher 训练多个 student 时，teacher 的摊销优势才会进一步扩大，论文没有给出完整生命周期能耗。
- 分类 probe 的改善没有转化为匹配设置下更强的直觉物理 predictor；不能把 SALT 直接外推成更好的机器人 world model。
- 最大模型达 2B 参数，主表 GPU-hours 仍以数千计；“compute-efficient”是相对 V-JEPA 2，而非低成本训练。
- 数据、参数量和 probe 与外部模型并不完全相同；因果比较应优先使用同 V-3.6M 行，不能只看跨论文榜单。
- 作者承认尚不清楚什么构成“好 teacher”，student 额外训练阶段为何有效也未解释；当前规模已出现平台期。[论文限制](https://arxiv.org/html/2509.24317#S7)
- 无公开代码与 checkpoint，V-3.6M 的精确数据清单和训练工程尚不能被独立端到端复核。

#### 博客价值判断

**高，值得单独主题化重写。** 推荐主题：《JEPA 真的需要 EMA 教师吗？SALT 把视频自监督拆成“先重建、再预测”》。文章最有价值的张力是：SALT 用一次像素重建换来稳定 latent target，分类更强且计算更少，但物理预测没有同步提高。

---

### 二、CR-JEPA：为跨传感器遥感检索同时设计预测空间与检索空间

#### 基本信息

- **完整题目**：*CR-JEPA: Cross-Modal Joint-Embedding Predictive Learning for Remote Sensing Image Retrieval*
- **作者与机构**：Md Aminur Hossain、Nitant Dube（印度空间研究组织 Space Applications Centre）；Ayush V. Patel、Biplab Banerjee（Indian Institute of Technology Bombay, Centre of Studies in Resources Engineering）。
- **发布时间与出处**：arXiv v1 2026-05-30，v2 2026-06-06；当前为预印本。[arXiv](https://arxiv.org/abs/2606.00706)
- **使用的 JEPA**：I-JEPA/REJEPA/X-JEPA 式 masked latent prediction，加上 LeJEPA 的 SIGReg 思路；实现模态内与双向跨模态预测。
- **下游任务**：同模态与跨模态遥感图像检索，覆盖 Sentinel-1↔Sentinel-2、RGB 光学↔SAR、全色↔多光谱。
- **代码状态**：截至本次检索，论文与 arXiv 页面没有官方代码或 checkpoint 链接。

#### 方法如何衔接 JEPA

**论文事实**：每种传感器有独立 patch stem 和位置编码，之后共享 Transformer trunk。模型用两个模态内 predictor 和一个共享跨模态 predictor，从可见 token 预测本模态或另一模态的 masked latent target；不重建像素。检索端另设 unified head 与 cross-modal head，并对 raw projection 施加 SIGReg。[方法原文](https://arxiv.org/html/2606.00706#S3)

训练目标并不只有 JEPA prediction：cross-modal head 使用对称 InfoNCE，unified head 使用跨模态 InfoNCE 与直接 cosine alignment，最后再叠加 SIGReg。论文方法部分未采用 I-JEPA 的 EMA target encoder；防坍塌主要依赖检索监督和 Gaussian regularization。

**作者主张**：模态专属 stem 吸收低层传感器差异，共享 trunk 学共同语义，分离的检索 head 避免同模态邻域与跨模态对齐互相牺牲。

**本次判断**：这是实际使用 latent predictor 的 JEPA 变体，但其最大跨模态收益很可能主要来自“paired InfoNCE + 专用 head + 共享 trunk + predictive routes”的协同。它不能作为“无需对比损失的 JEPA 检索”证据。

#### 数据、指标、基线与关键结果

- BEN-14K：14,832 对 Sentinel-1/2，19 个多标签地表类别，按标签重叠计算 F1@5。
- CBRSIR_VS：26,901 对 RGB 光学/SAR、10 类；DSRSID：80,000 对全色/多光谱、8 类；两者报告全库 mAP 与 P@5。[数据与指标](https://arxiv.org/html/2606.00706#S4)
- BEN-14K 对比 MAE、SatMAE/++、CROMA、DeCUR、REJEPA、X-JEPA 等公开结果；另外两个数据集由作者按相同协议重实现 REJEPA 与 X-JEPA。

| BEN-14K F1@5 | S1→S1 | S2→S2 | S1→S2 | S2→S1 | 参数量 |
|---|---:|---:|---:|---:|---:|
| REJEPA | **76.38** | 75.42 | 55.46 | 56.32 | 197.09M |
| X-JEPA | 72.98 | 82.65 | 61.23 | 63.73 | 172.86M |
| CR-JEPA | 75.11 | **82.87** | **75.82** | **75.40** | **117.93M** |

跨模态方向相对 X-JEPA 分别提升 14.59 与 11.67 点；但 S1→S1 仍低于 REJEPA 1.27 点。[BEN-14K 主表](https://arxiv.org/html/2606.00706#S5.SS1)

- CBRSIR_VS 的 RGB→SAR/SAR→RGB mAP 为 72.62/73.55，X-JEPA 为 70.11/67.87；DSRSID 的 PAN→MS/MS→PAN 为 72.15/71.24，X-JEPA 为 66.36/68.82。[跨数据集结果](https://arxiv.org/html/2606.00706#S5.SS2)
- CR-JEPA 推理约 9.6 GFLOPs、17 ms/图，X-JEPA 为 10.8 GFLOPs、20 ms/图；均在 A100 80GB 上测得。[计算开销](https://arxiv.org/html/2606.00706#S5.SS1)
- 完整四类 loss 的四方向平均 F1@5 为 77.30，最强部分组合为 75.85；共享 trunk 为 117.93M、四方向 75.11/82.87/75.82/75.40，双 trunk 为 154.77M、70.34/75.80/67.34/71.68。[损失与 trunk 消融](https://arxiv.org/html/2606.00706#S5.SS5)

#### 创新、局限、复现条件与风险

**相对已有工作的创新**：

1. 同时学习本模态与跨模态 masked latent prediction，而非只有跨模态全局对齐。
2. 用 modality-specific stems + shared semantic trunk 控制“低层不同、高层共享”的归纳偏置。
3. 将 same-modal 与 cross-modal 检索空间解耦，并用 SIGReg 控制 embedding 几何。

**局限与风险**：

- 预训练要求成对传感器观测；论文也把部分配对/非配对档案列为未来工作，当前不能直接覆盖现实中大量未对齐卫星档案。
- 主结果由 latent prediction、InfoNCE、cosine alignment、SIGReg、共享 trunk 和双 head 共同产生；虽有组合消融，仍缺“同架构、同 InfoNCE，只移除 JEPA prediction”的清晰单变量结论。
- BEN-14K 多数基线采用公开数字；另外两组强基线为作者改写实现。论文没有公开代码、训练种子、误差条或显著性检验，12～15 点提升仍需独立复现。
- 正文没有完整交代空间去重或地域隔离切分。遥感相邻 tile 的空间相关性可能让随机切分过于乐观，尤其需要 geographic-disjoint audit。
- CBRSIR_VS/DSRSID 用单一类别定义相关性，不能证明模型能检索细粒度变化、时间变化或开放词汇语义。
- 当前仅离线最近邻检索，未报告百万级索引、近似近邻 recall–latency、压缩、跨季节/跨地区/传感器漂移。

#### 博客价值判断

**高，但宜写成方法归因型文章。** 推荐主题：《卫星看的是同一片地，SAR 和光学为什么搜不到彼此？CR-JEPA 的预测空间与双检索头》。重点应解释它为何必须同时保留 same-modal 与 cross-modal geometry，并明确大幅提升不是纯 JEPA loss 的单独功劳。

---

### 三、ER-JEPA：把 12 导联 ECG 分成通道 JEPA 与时间 JEPA

#### 基本信息

- **完整题目**：*Hierarchical Self-Supervised Representation Learning Framework for Multivariate Time Series Grounded in ECG Analysis*
- **作者与机构**：Siwon Kim；Research Institute of Basic Sciences, Seoul National University（首尔大学基础科学研究院）。
- **发布时间与出处**：arXiv v1 于 2026-07-01 提交，v2 于 2026-07-15 更新；当前为预印本。[arXiv v2](https://arxiv.org/abs/2607.01145)
- **使用的 JEPA**：两个以 I-JEPA 为核心、均含 context encoder、EMA target encoder、predictor 与 masked latent loss 的子系统，串成 Hierarchical JEPA。
- **下游任务**：PTB-XL 与 CPSC2018 的 12 导联 ECG 多标签/多分类诊断；冻结 linear evaluation 与端到端 fine-tuning。
- **代码状态**：arXiv v2 注明“code will be made publicly available soon”，截至检索日尚未给出仓库链接。

#### 方法如何衔接 JEPA

**论文事实**：原始 ECG 先切成 `(导联, 时间片)` patches。channel JEPA 在同一时间片的 12 个导联之间做 masked latent prediction，再经 pooling 得到一个“事件 token”；temporal JEPA 对事件 token 序列做第二次 masked latent prediction。推理时丢弃两个 predictor，用 channel encoder、聚合层与 temporal encoder 生成整段 10 秒 ECG 表示。[架构原文](https://arxiv.org/html/2607.01145#S3)

两个 target encoder 都用 EMA 更新。论文还直接训练同环境的 1D-JEPA：它在卷积 tokenization 阶段融合导联，后续只处理时间 token，用于隔离“attention 级跨导联 JEPA”是否有价值。

**作者主张**：心脏同一电事件在 12 个导联上形成不同投影，先重建跨导联事件、再分析时间关系，既符合诊断流程，也比把所有 `(导联×时间)` token 交给每层 attention 更高效。

**本次判断**：这是目前少见的可运行 H-JEPA 实例，但“更像心脏科医生”只是设计隐喻。实验真正支持的是：channel-level latent prediction 对冻结表示和 PTB-XL 迁移有帮助；它没有证明内部事件 token 对应可解释的心电事件。

#### 数据、指标、基线与关键结果

- 预训练约 18 万条 10 秒 ECG，来自 Chapman-Shaoxing 与 CODE-15；在单张 RTX 3090 上完成。下游 PTB-XL 使用官方分层 folds，CPSC2018 按记录 ID 分批；主指标为 macro AUC。[预训练与切分](https://arxiv.org/html/2607.01145#S5)
- 基线包括 MoCo v3、ST-MEM、SimCLR、ECG-FM、KED、ECG-JEPA、Weimann–Conrad JEPA，以及作者同协议 1D-JEPA。

冻结 linear evaluation：

| 方法 | PTB-XL 多标签 | CPSC 多标签 | PTB-XL 多分类 | CPSC 多分类 |
|---|---:|---:|---:|---:|
| ECG-JEPA | 0.912 | **0.966** | 0.903 | **0.973** |
| 1D-JEPA（同协议） | 0.901±0.001 | 0.960±0.002 | 0.888±0.004 | 0.969±0.002 |
| ER-JEPA | **0.913±0.001** | 0.964±0.002 | **0.911±0.003** | 0.969±0.004 |

ER-JEPA 明显优于作者的 1D-JEPA，但只在 PTB-XL 超过 ECG-JEPA；CPSC 两项略低。[Linear 表](https://arxiv.org/html/2607.01145#S5.SS3.SSS2)

端到端 fine-tuning：

| 方法 | PTB-XL 多标签 | CPSC 多标签 | PTB-XL 多分类 | CPSC 多分类 |
|---|---:|---:|---:|---:|
| ECG-JEPA | 0.931 | 0.973 | 0.928 | 0.976 |
| 1D-JEPA（同协议） | 0.923±0.003 | 0.973±0.002 | 0.923±0.005 | 0.979±0.001 |
| ER-JEPA | **0.936±0.001** | **0.974±0.001** | **0.943±0.002** | **0.981±0.001** |

PTB-XL 多分类相对同协议 1D-JEPA 提升 0.020 AUC，最明显；CPSC 增益只有 0.001～0.002。[Fine-tuning 表](https://arxiv.org/html/2607.01145#S5.SS3.SSS3)

- 无 channel JEPA 的冻结表示在 PTB-XL 多标签/多分类从 0.913/0.911 降到 0.902/0.892；但 fine-tuning 后只从 0.936/0.943 降到 0.931/0.936，说明层次预训练的贡献在冻结协议最清楚。[消融](https://arxiv.org/html/2607.01145#S6)
- 论文报告在原 benchmark 设置下，相对多通道 ViT encoder 最高可达约 8× batch-latency speedup；统一 embedding 维度后最大约 3×，大 batch 下对照模型显存为其 2～3 倍。测试使用 RTX 3090 上的随机 tensor、关闭 `torch.compile`，不含数据加载或临床系统开销。[效率评测](https://arxiv.org/html/2607.01145#S5.SS4)

#### 创新、局限、复现条件与风险

**相对已有工作的创新**：

1. 将两个完整 JEPA 串联，在不同 scope 上分别学习跨导联和跨时间依赖。
2. 用事件 token 将多变量序列变成单变量时间序列，降低后半网络 attention 成本。
3. 不回避层次 JEPA 的稳定性，报告多次预训练、异常 loss、dropout、batch、mask、维度与无 channel JEPA 消融。

**局限与风险**：

- 当前仅一位作者的预印本，无公开代码与 checkpoint；复杂的双 EMA、mask 与训练调度尚不能独立核验。
- 论文明确观察到少量预训练试验异常，且更大 768 维模型在当前配置下反而更差；稳定性依赖 batch、dropout 与数据规模。
- CPSC2018 已接近饱和，层次结构在这里的优势很小；部分冻结结果还低于 ECG-JEPA，不能概括为四项全面 SOTA。
- fine-tuning 会明显缩小多数消融差距，说明最终成绩部分来自任务监督重新塑造 encoder，而非预训练 latent 已天然线性可分。
- 只有 PTB-XL/CPSC2018 内部基准，没有跨医院外部队列、时间外推、真实缺导联/噪声压力测试、亚组公平性、校准或前瞻临床评估。
- CPSC 按记录 ID 而非明确按患者拆分；若同一患者存在多条记录，需要进一步核对 patient-level independence。
- 宏平均 AUC 不能反映阈值下 sensitivity、specificity、PPV 或安全关键漏诊；当前不能视为诊断部署证据。

#### 博客价值判断

**中高。** 推荐主题：《把两个 JEPA 串起来读心电图：先看 12 导联，再看时间》。它适合讲 H-JEPA 如何从概念变成高效架构；若写成原创博客，应把异常预训练、CPSC 饱和、无代码和无外部临床验证放在主结论旁。

## 横向比较

| 论文 | JEPA 的实质改造 | 具体下游 | 最强证据 | 关键反证/边界 | 复现状态 |
|---|---|---|---|---|---|
| SALT | V-Pixel 静态 teacher + V-JEPA masked-latent student；取消 EMA | 视频/图像分类、直觉物理 | 同数据/总步数六项平均 79.6→81.9；SALT-L 估算 FLOPs/GPU-hours 更低 | 直觉物理 SALT-L/H 低于匹配 V-JEPA 2；teacher 仍来自像素重建 | ICLR 正式论文；无官方代码/权重 |
| CR-JEPA | 模态内/跨模态 latent predictor + SIGReg + shared trunk + 双检索 head | 三组遥感同/跨模态检索 | BEN 跨模态 F1@5 +14.59/+11.67；三数据集方向一致 | 收益混合 InfoNCE/SIGReg/head；无 seed/误差条/空间切分说明 | 预印本；无代码 |
| ER-JEPA | channel JEPA → event token → temporal JEPA | 12 导联 ECG 分类 | PTB-XL fine-tune 多分类 0.943，1D-JEPA 0.923；效率优势明显 | CPSC 近饱和；冻结结果非全面最佳；偶发异常预训练 | 7 月 15 日更新预印本；代码待发布 |

共同结论：

1. **JEPA 不再等于一套固定 teacher–student recipe。** SALT 改 teacher 生命周期，CR-JEPA 用显式分布正则替代 canonical EMA，ER-JEPA 把多个 JEPA 纵向组合。
2. **最可信的因果证据仍来自 matched ablation。** SALT 的同数据/步数比较、CR-JEPA 的 shared-vs-separate trunk、ER-JEPA 的同协议 1D-JEPA，比跨论文榜单更有解释力。
3. **下游目标正在反过来决定 latent interface。** 视频需要稳定 teacher，跨传感器检索需要多种 embedding geometry，ECG 需要把 channel 与 time 分层。
4. **更好的 representation 不是更好的 world model 或部署系统。** SALT 的物理预测反例、CR-JEPA 的离线配对检索、ER-JEPA 的临床证据缺口分别说明了这一点。

## 值得继续追的问题

1. **SALT teacher 到底需要保留哪些信息？** 应在同 compute 下比较 V-Pixel、MAE、DINO、随机/弱 teacher，并测 teacher target 的谱、时序敏感性和 student 物理预测能力。
2. **SALT 能否用于 action-conditioned V-JEPA 2-AC？** 静态 teacher 适合表征预训练，但控制中的状态分布会随 policy 改变；需要在线数据、闭环 planning 和 non-stationarity 验证。
3. **CR-JEPA 的 12～15 点提升中，latent prediction 占多少？** 需要完整表头可审计的单变量实验：固定 shared trunk、双 head、InfoNCE 与 SIGReg，只移除或替换 predictor。
4. **遥感检索能否通过 geographic-disjoint 与 temporal-disjoint 测试？** 还应评测未配对档案、跨区域/季节/传感器、真实 ANN 索引和开放词汇 relevance。
5. **ER-JEPA 的 event token 是否真的对应心电事件？** 可用 P/QRS/T 波边界、导联缺失、节律变化与可解释 probe 检验，而不是只依赖整段 AUC。
6. **H-JEPA 如何稳定扩展到更长、更稀疏的临床时序？** 应比较分层 EMA、SALT 静态 teacher、显式 variance regularization 与跨层 stop-gradient 的稳定性。
7. **下一轮优先深挖 Causal-JEPA。** 它把 target 从 patch 提升到 object-level intervention，最适合检验“JEPA 是否真的获得关系/反事实归纳偏置”；即使已被 ICML 2026 接收，仍必须把理想对象输入下的证据与真实对象发现误差分开。

## 博客价值判断

### 首选：SALT 的 teacher 生命周期

推荐标题：

> JEPA 真的需要 EMA 教师吗？SALT 用一次像素重建换来稳定的 latent target

它能把 JEPA 的工程痛点讲清楚，也包含很好的反面证据：分类 probe 更强不代表直觉物理更强。适合写成区别于追踪日报的原创方法文章。

### 次选：CR-JEPA 的双空间检索

推荐标题：

> 同一片土地，两种传感器：为什么遥感检索需要两个 embedding 空间

适合解释同模态邻域与跨模态对齐的目标冲突。成文时应把 JEPA、InfoNCE、SIGReg 和 head design 分层归因，并补 geographic split 审计。

### ER-JEPA 适合做 H-JEPA 案例

推荐标题：

> 从 12 导联到时间序列：Hierarchical JEPA 第一次真正落地了吗？

价值在于架构与效率，而不是临床 SOTA 宣传。最好等代码公开后补一次稳定性复现，再写成长文。

## 来源链接

### 今日深读

- SALT：[ICLR 2026 / OpenReview](https://openreview.net/forum?id=3cB9243E9i)｜[arXiv 摘要](https://arxiv.org/abs/2509.24317)｜[HTML 全文](https://arxiv.org/html/2509.24317)｜[ICLR 论文 PDF](https://openreview.net/pdf?id=3cB9243E9i)
- CR-JEPA：[arXiv 摘要](https://arxiv.org/abs/2606.00706)｜[HTML 全文](https://arxiv.org/html/2606.00706)｜[PDF](https://arxiv.org/pdf/2606.00706)
- ER-JEPA / H-JEPA：[arXiv v2](https://arxiv.org/abs/2607.01145)｜[HTML 全文](https://arxiv.org/html/2607.01145)｜[PDF](https://arxiv.org/pdf/2607.01145)

### 候选与排除项

- Causal-JEPA：[arXiv](https://arxiv.org/abs/2602.11389)｜[ICML/OpenReview](https://openreview.net/forum?id=VMAHQDOtjp)｜[官方代码](https://github.com/galilai-group/cjepa)
- Pokemon Red multimodal JEPA：[OpenReview](https://openreview.net/forum?id=8li5NOHh9S)
- SPACE-HOP：[OpenReview](https://openreview.net/forum?id=t9LTeubtto)
- Emotion-JEPA：[OpenReview](https://openreview.net/forum?id=J5TIa3f9vd)
- Mine-JEPA：[OpenReview](https://openreview.net/forum?id=XhXKWdLX61)
- Minority Sampling with JEPA-Guided Diffusion：[ICML 2026 / OpenReview](https://openreview.net/forum?id=Vn0lOKou5q)
