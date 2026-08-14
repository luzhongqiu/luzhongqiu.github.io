---
title: JEPA 下游研究追踪 · 2026-08-14
date: 2026-08-14 10:00:00
categories:
  - JEPA研究追踪
tags:
  - JEPA
  - JEPA追踪
---

本文属于「JEPA追踪」系列，记录每日论文检索、原文核验与阶段性判断；它保留研究日志的证据密度，与经过主题化重写的原创博客区分。

# JEPA 下游研究追踪（2026-08-14）

> 检索截止：2026-08-14 11:10（Asia/Shanghai，03:10 UTC）
>
> 严格增量起点：2026-08-13T03:32:14.177Z
>
> 去重范围：`/Users/nic/.codex/automations/jepa/memory.md` 与 `research/jepa/` 全部既有记录、候选池和排除项。
>
> 证据口径：Google Scholar、OpenAlex、Crossref 等只负责发现候选；题目、版本、作者、方法、实验和代码状态均回到 arXiv 原文、官方仓库或第一方 API 核验。本文严格区分 method direct-use、evaluation-only direct-use、teacher-supervision direct-use 与 related-work-only。

## 今日结论

1. **严格时间窗内确认 3 篇真正把 JEPA 用进具体下游任务的新论文。** arXiv 严格窗口共返回三项：CardioState-JEPA（2608.12944）、ACPC 诊断（2608.12939）和 DreamX-Phi 1.0（2608.13489）；三者均为 2026-08-13 提交的 v1，不是旧稿版本更新。[arXiv 严格窗口](https://export.arxiv.org/api/query?search_query=submittedDate%3A%5B202608130332%20TO%20202608140310%5D%20AND%20%28all%3AJEPA%20OR%20all%3A%22joint-embedding%20predictive%22%20OR%20all%3A%22joint%20embedding%20predictive%22%29&start=0&max_results=100&sortBy=submittedDate&sortOrder=descending)
2. **今日最强方法证据来自 CardioState-JEPA。** 它明确引用 I-JEPA，把 masked online encoder、EMA teacher 和 latent predictor 移到 ECG、PPG、PCG 的共享心脏状态空间，再用可学习 delay aligner 处理电活动、心音和脉搏之间的生理时延。统一冻结 encoder 覆盖 25 项下游任务；更关键的是，在相同数据和架构下把目标换成 SimCLR、BYOL、Barlow Twins 或 MAE，JEPA 版本的 ECG/PPG/PCG 综合结果仍总体最好。[方法](https://arxiv.org/html/2608.12944v1#S3) · [Table 4](https://arxiv.org/html/2608.12944v1#S4.T4)
3. **ACPC 是高价值 evaluation-only direct-use，而不是 JEPA 新训练法。** 它冻结 LeWorldModel（LeWM）与 PLDM 两类 joint-embedding dynamics models，让干净历史与视觉扰动历史在同一动作序列下向前 rollout；ACPC 衡量两条预测轨迹的分离，IR 汇总扰动敏感度，SR 防止“表示坍塌也得到低距离”的假好结果。八步 ACPC 相对 encoder distance + 一步 ACPC 的基线，把误差漂移预测 MAE 平均降低 `55.9±4.7%`；加入 planner-horizon ACPC 后，跨任务预测 CEM selection regret 的 MAE 再降 `15.2±2.0%`。[实验](https://arxiv.org/html/2608.12939v1#S4) · [代码](https://github.com/Anguo-star/acpc-diagnostics)
4. **DreamX-Phi 1.0 确实使用冻结 V-JEPA teacher，但只能给出系统级证据。** 论文引用指向 V-JEPA 2，却没有披露实际 teacher 的具体版本或 checkpoint。它用 SAM3 object mask 选择 token，再让视频生成器的对象特征 Gram matrix 对齐 teacher 的时空关系；该分支属于训练期 teacher-supervision direct-use。WorldArena 2.0 固定快照中 Track 1 `EWMScore-P=60.65`、31 项第一，Track 2 Adjust Bottle 成功率 `67.19%`、并列第二；但系统同时包含 Wan2.2、PRoPE、光流、depth、SAM3、V-JEPA 和 DMD，论文没有 matched ablation，因此不能把榜单优势归因给 V-JEPA。[V-JEPA loss](https://arxiv.org/html/2608.13489v1#S4.SS4) · [WorldArena 2.0 结果](https://arxiv.org/html/2608.13489v1#S5.SS3)
5. **今日没有 related-work-only 候选挤占三篇名额，也没有额外的实质版本更新。** 按 `lastUpdatedDate` 排序时，严格起点之后只有上述三个 v1；OpenAlex 的 I-JEPA、V-JEPA、V-JEPA 2 日期引用链尚未索引到它们，说明引用图谱存在时延，不能把“0 条”解释成方向没有新工作。bioRxiv/medRxiv 8 月 13–14 日官方列表也没有命中 JEPA 或完整术语。紧邻窗口的 [*Scaling Representation Diversity*](https://arxiv.org/abs/2608.12748) 实际使用 text-conditioned JEPA auxiliary stream，但提交于 `2026-08-13T02:57:21Z`，比严格起点早 34 分 53 秒，本次登记为历史漏项而不计入今日新增。

## JEPA 方向最新进展

### 1. JEPA 的下游角色进一步分化为“模型、诊断器、教师”

今天三篇论文恰好对应三种不同生命周期：

- **CardioState-JEPA：method direct-use。** online/EMA target/predictor 是预训练目标本身，冻结 encoder 再进入分类和回归。
- **ACPC：evaluation-only direct-use。** 不改变 LeWM/PLDM 的训练目标，而是把已训练 predictor 当作可审计对象。
- **DreamX-Phi：teacher-supervision direct-use。** 冻结 V-JEPA teacher 只在训练期给视频生成器提供对象关系约束，部署时不带 teacher；其引用指向 V-JEPA 2，具体版本/checkpoint 未披露。

这三类不能合并成一句“JEPA 用于下游”：第一类回答 JEPA 能否学到可迁移表示，第二类回答现有 JEPA 是否稳健，第三类回答 JEPA 表征能否作为另一个系统的监督接口。

### 2. CardioState-JEPA 把 cross-modal correspondence 写成生理时延问题

普通跨模态对齐常默认同一时间戳就是同一语义事件；心脏信号不满足这个假设。ECG 的电激活先发生，PCG 的机械/瓣膜声音稍后，PPG 的外周脉搏还要经过传播。CardioState-JEPA 因此先用大量单模态数据做 intra-modal masked latent prediction，再在稀缺同步数据上预测另一模态经 delay aligner 对齐后的 teacher codes。[两阶段框架](https://arxiv.org/html/2608.12944v1#S3.F2)

这使 masking 之外又多出一个决定性 inductive bias：**什么时刻才是正确 target**。从通用 JEPA 角度看，这是今日最值得保留的设计信号；跨传感器、音视频、机器人本体与视觉之间，只要存在系统性时延，都可能需要显式 correspondence model，而不是直接对齐 timestamp。

### 3. ACPC 把 JEPA 评估从“预测准不准”推进到“决策会不会变”

ACPC 的核心不是再做一个 encoder robustness score，而是比较同一动作条件下的预测后果。论文证明 ACPC 上界约束扰动前后多步预测误差的变化；在固定候选池条件下，也能约束 planner cost 的变化。checkpoint 级 IR 越低表示同一状态的扰动 rollout 越近，但单独追求低 IR 会奖励常量表示，因此必须同时用 SR 检查不同状态是否仍分开。[ACPC/IR/SR 定义](https://arxiv.org/html/2608.12939v1#S3)

最直观的反例来自 TwoRoom：去掉 SIGReg 后，median latent distance 从 `17.2–18.7` 坍到 `0.006`，clean success 从 `96.3–99.3%` 降到 `33.3%`；此时 raw IR 反而最低（`0.048`），但 SR 只有 `0.066`，非坍塌模型为 `0.967–0.984`。[collapse 检验](https://arxiv.org/html/2608.12939v1#A3.T3)

### 4. V-JEPA 开始以“关系教师”进入生成式世界模型

DreamX-Phi 没有让 V-JEPA 生成视频，也没有直接拿其 latent 做 planner state。它先用 SAM3 找到被操纵对象 token，再对 student/teacher 特征归一化，匹配二者的 Gram matrix；这保留对象 token 之间的关系，而不要求 student 复制 teacher 的坐标基。该设计说明 V-JEPA 还可以作为生成模型的 **object-relational teacher**；论文引用对应 V-JEPA 2，但未给出 teacher 版本或 checkpoint。[公式与训练门控](https://arxiv.org/html/2608.13489v1#S4.SS4)

但今日证据只能证明完整系统表现强，不能证明 V-JEPA relational loss 必不可少。论文结论也明确承认仍需 matched ablations；因此它是值得追的接口信号，不是“V-JEPA 提升 WorldArena”的独立因果结论。[限制](https://arxiv.org/html/2608.13489v1#S6)

## 新增下游论文解读

### 1. CardioState-JEPA：带生理时延对齐的 ECG–PPG–PCG 共享表征

#### 基本信息

- **完整题目**：[*CardioState-JEPA: Delay-Aware Cross-Modal Learning of a Shared Cardiac Representation*](https://arxiv.org/abs/2608.12944)
- **作者**：Hamza Shafiq、Hung Manh Pham、Bin Zhu、Pan Zhou、Jun Hu、Aaqib Saeed。
- **机构**：Eindhoven University of Technology（荷兰）与 Singapore Management University（新加坡）；以官方 PDF 题名页为准。[PDF](https://arxiv.org/pdf/2608.12944v1)
- **时间与出处**：arXiv:2608.12944 v1，2026-08-13 08:21:06 UTC；`cs.LG` 预印本，当前未见会议或期刊接收声明。[提交记录](https://arxiv.org/abs/2608.12944)
- **JEPA 血缘**：明确引用 I-JEPA 原始论文与 temporal JEPA；继承 masked context、无掩码 EMA teacher、stop-gradient target 和 predictor，并增加跨模态 delay-aware target gathering。
- **下游任务**：ECG 心律/形态/节律分类，PPG 心房颤动、活动、压力与呼吸分类，以及心率、血压、SpO2、HRV 回归，PCG 杂音与异常心音检测，共 25 项。

#### 方法如何衔接 JEPA

**事实：** ECG、PPG、PCG 先经各自的轻量 1D tokenizer 映射到相同 token rate，再进入一个共享 ViT-B encoder。Stage I 对每种单模态信号做连续块 masking，online encoder/predictor 用 Huber loss 对齐完整信号 EMA teacher 的 masked latent codes；Stage II 从 Stage I warm-start，在同步配对数据上让一种模态预测另一种模态经生理时延校正后的 teacher codes。[架构](https://arxiv.org/html/2608.12944v1#S3.F2) · [Stage I](https://arxiv.org/html/2608.12944v1#S3.SS4) · [Stage II](https://arxiv.org/html/2608.12944v1#S3.SS5)

delay head 预测 source→target 的相对偏移，目标端用以该偏移为中心的 Gaussian kernel 软采样；R-peak→第一心音和 pulse arrival time 提供可用时的监督 anchor。总目标还包括 cross-modal VICReg state alignment 与 cardiac-cycle phase supervision。测试时丢弃 predictor、teacher 和 delay head，只冻结共享 encoder/projector，训练线性 head。

**作者主张：** 不同心脏传感器是同一隐含生理过程的不同观测；预测对齐后的 latent cardiac state 比重建各自波形更能保留共享生理结构。

**本研究推断：** 最有迁移价值的不是“把三种波形放进一个 Transformer”，而是把跨模态 target identity 拆成“共享状态 + 可学习时延”。这比直接 timestamp 对齐更接近实际传感器系统。

#### 数据、指标、基线与复现协议

**预训练数据（事实）：** Stage I 使用 MIMIC-IV-ECG（710,560 train / 78,951 valid）、PPG-EXT（4,611,607 / 512,401）和 BMD-HS（3,436 / 382）；Stage II 使用 PPG-EXT、VitalDB 的 ECG–PPG 对、EPHNOGRAM 的 ECG–PCG 对和 SensSmartTech 三模态记录。原文没有在统计表中给出四类 paired/trimodal corpus 的实际纳入条数。[数据与任务](https://arxiv.org/html/2608.12944v1#S4.SS1) · [Table 5](https://arxiv.org/html/2608.12944v1#A1.T5)

**下游数据与指标（事实）：** ECG 使用 PTB-XL 四组任务、CPSC 2018、CSN；PPG 使用 PulseLM 预处理的 17 项任务；PCG 使用 CirCor DigiScope 与 CinC2016。分类报 macro-AUROC×100，回归报 MAE，所有下游使用 patient-disjoint split。[评测协议](https://arxiv.org/html/2608.12944v1#S4.SS2)

**主要基线（事实）：** ECG 自监督基线包括 SimCLR、BYOL、Barlow Twins、MoCo-v3、SimSiam、TS-TCC、CLOCS、ASTCL、CRT、ST-MEM；另把 ECGFounder 及 ECG-FM、HeartLang、AnyChat、ESI、MERL、D-BETA 作为使用监督标签或临床文本的非等价参考。PPG 对比 PaPaGei、AnyPPG、PulsePPG、ChronosBolt；PCG 对比 CLAP、AudioMAE、StethoLM。

**训练（事实）：** 共享 ViT-B 为 12 层、12 heads、hidden 768；Stage I 300K steps、batch 196、peak LR `1.2e-4`，Stage II 200K steps、batch 64、peak LR `6e-5`；EMA momentum 从 `0.998` 线性升到 `0.9999`，全部预训练在单张 NVIDIA H100 上完成。[附录配置](https://arxiv.org/html/2608.12944v1#A1.SS2)

#### 关键实验结果

| 评测 | 最强同类基线 | CardioState-JEPA | 变化 |
|---|---:|---:|---:|
| PPG 6 项分类平均 AUROC | AnyPPG 72.2 | **80.4** | `+8.2 pp` |
| PPG 11 项回归平均 MAE | AnyPPG 10.9 | **9.1** | `-1.8` |
| ECG 18 个 dataset×label-fraction 设置平均 AUROC | MoCo-v3 68.5 | **84.1** | `+15.6 pp`（展示值直接相减；摘要写 `+15.5 pp`） |
| PCG CirCor murmur AUROC | AudioMAE 79.1±2.7 | **97.9±0.1** | `+18.8 pp` |
| PCG CinC2016 AUROC | AudioMAE 62.4±0.7 | **66.8±0.4** | `+4.4 pp` |

[PPG Table 1](https://arxiv.org/html/2608.12944v1#S3.T1) · [ECG Table 2](https://arxiv.org/html/2608.12944v1#S4.T2) · [PCG Table 3](https://arxiv.org/html/2608.12944v1#S4.T3)

matched objective-family 消融更能说明 JEPA 的独立价值：相同数据和架构下，`ECG Avg / PPG Cls / PPG Reg / PCG Avg` 分别为 SimCLR `89.5/70.1/11.1/80.0`、BYOL `89.3/66.7/11.0/80.3`、Barlow Twins `88.6/64.1/11.3/78.8`、MAE `84.4/62.0/11.8/78.1`、CardioState-JEPA `90.9/80.4/9.1/82.3`。[Table 4](https://arxiv.org/html/2608.12944v1#S4.T4)

组件消融也不是全都单向支持：完整三模态模型 ECG Avg `90.9`，略低于 ECG+PPG 的 `91.4`；PPG classification `80.4` 也略低于 ECG+PPG 的 `80.6`。完整模型的优势更清楚地落在 PPG regression（`9.1` 最低）与 PCG（`82.3` 最高），不能写成“加第三模态对所有任务都提升”。

#### 相对已有工作的创新

1. 用一个共享 encoder 覆盖 ECG、PPG、PCG，而不是三个独立 foundation models。
2. 把 I-JEPA 式 masked latent prediction扩展为“同模态预测 + 跨模态预测”的两阶段课程。
3. 用 learned delay aligner 和生理 landmark supervision 定义跨模态 target，而不是按原始 timestamp 硬对齐。
4. 给出相同架构/数据下 JEPA、contrastive、self-distillation 与 reconstruction objective 的 matched comparison。

#### 事实、作者主张与本研究推断

- **事实**：完整模型在 25 项冻结 encoder 下游任务上总体强；matched objective ablation 中 JEPA 版本四个聚合指标总体最好；三模态并非每项都胜双模态。
- **作者主张**：异构心脏信号可以互相监督，形成一个 modality-invariant 但 task-relevant 的 shared cardiac representation。
- **本研究推断**：这篇论文最强的科学贡献是“target correspondence 需要领域模型”。生理时延不是预处理细节，而是 JEPA 预测目标的一部分。
- **归因边界**：完整收益同时来自大量多源数据、共享 encoder、delay supervision、VICReg state alignment、phase supervision 与 JEPA loss；Table 4 的 objective replacement 很有价值，但还不能把所有跨模态收益归给 EMA predictor 本身。

#### 局限、复现条件与潜在风险

1. **paired data 披露不足**：论文列出同步数据源，但未给实际进入 Stage II 的 pair 数、患者数、过滤标准和各配对比例。
2. **数据重叠风险**：PPG-EXT 同时参与预训练与跨模态配对；需要公开 subject IDs、去重 manifest 和时间切分，确认与 PulseLM 下游预处理集没有患者或记录泄漏。
3. **模态不平衡**：PPG 预训练条数约 461 万，PCG 只有 3,436 条；PCG 的大幅收益可能高度依赖跨模态 transfer，外部 PCG 语料上的稳定性未知。
4. **评测只到 linear probe**：原文没有 full fine-tuning、端到端临床工作流、校准、亚组公平性、设备外/医院外验证或 prospective study。
5. **生理 anchor 假设**：delay supervision 依赖可检测的 R peak/心音/脉搏事件；噪声大、心律不规则或传感器错位时会退回无监督对齐。
6. **统计与训练预算**：PCG 和聚合消融报告 3 seeds，但主表大部分逐任务数字没有置信区间；单 H100 说明设备数量，却没有 GPU-hours、峰值显存和预处理成本。
7. **代码状态**：截至本次检索，论文和 arXiv 页面未给官方代码、checkpoint、环境锁或数据 manifest；目前只能复核论文协议，不能端到端重跑。
8. **预印本状态**：没有第一方会议/期刊接收记录，不能把完整度或排版当作同行评审证明。

#### 是否值得写成区别于追踪日报的原创技术博客

**很值得，今日第一优先级。** 最合适的原创角度是《跨模态 JEPA 最难的不是对齐模态，而是找到同一个“生理时刻”》。Table 4 的 matched objectives、三模态不总胜双模态的反例和 delay aligner 的领域假设足以支撑一篇有观点的技术文章；若要写临床落地或复现教程，应等待代码与 patient-level manifest。

### 2. Diagnosing JEPA World Models with Action-Conditioned Predictive Consistency：面向控制后果的 JEPA 诊断

#### 基本信息

- **完整题目**：[*Diagnosing JEPA World Models with Action-Conditioned Predictive Consistency*](https://arxiv.org/abs/2608.12939)
- **作者**：Guo An、Zijing Wu、Honghua Dong、Yuhao Yan、Zixuan Gui、Haochong Chen、Shanzhao Ruan、Xiang Wang、Yurong Ling、Qi Tian。
- **机构**：Huawei、University of Science and Technology of China、Zhejiang University、Tsinghua University、Harbin Institute of Technology、Guangdong Laboratory of Artificial Intelligence and Digital Economy (SZ)。[PDF 题名页](https://arxiv.org/pdf/2608.12939v1)
- **时间与出处**：arXiv:2608.12939 v1，2026-08-13 08:18:41 UTC；`cs.LG` 预印本，当前无会议/期刊接收声明。[提交记录](https://arxiv.org/abs/2608.12939)
- **JEPA 血缘**：引用 JEPA 路线、I-JEPA、V-JEPA、V-JEPA 2；实际评估 LeWorldModel（LeWM）与 PLDM 两类 action-conditioned joint-embedding dynamics models，属于 evaluation-only direct-use。
- **下游任务**：TwoRoom 视觉导航、PushT 平面操作、Reacher 控制、OGBench-Cube 三维操作；冻结 world model 后用 CEM 做五步动作规划。

#### 方法如何衔接 JEPA

**事实：** 给定干净历史 `h`、保持状态不变的视觉扰动历史 `h̃` 和同一动作序列，冻结 encoder 与 predictor，分别 rollout 八步。ACPC 是两条 predicted latent trajectories 的距离；IR 取 checkpoint 上高敏感 anchor 的汇总；SR 统计不同 endpoint-state labels 的 rollout 是否仍超过 `raw IR + margin`。[方法定义](https://arxiv.org/html/2608.12939v1#S3)

**作者主张：** encoder distance 和一步预测都看不到扰动在多步 dynamics 中被放大还是收缩；ACPC 通过同动作 rollout 更贴近 bisimulation 的“后果相同才是同状态”。IR 与 SR 必须联合使用，才不会把表示坍塌误判成 invariance。

**本研究推断：** ACPC 把 JEPA predictor 从训练组件变成测量仪器。它不回答“哪个 representation benchmark 分更高”，而是回答“相同动作下，视觉变化是否会让预测后果和 planner 选择改变”。

#### 数据、指标、基线与实验协议

- LeWM 与 PLDM 各自覆盖 4 个任务、9 个 Gaussian-noise training conditions（无增强 + `σmax=0.01…0.08`）和 3 个独立训练 seeds（3072/3073/3074）。
- 每个 checkpoint 用 3 个 evaluation seeds（42/43/44），每 seed 100 episodes；训练 run 才是重复单位，evaluation seeds 只刻画单次训练内变异。
- 主扰动为 Gaussian noise `σ=0.08`，外推还测 blur `k=15` 与 resize `scale=0.25`。
- IR 使用 100 logged anchors、每 anchor 5 个 noise draws、8-step rollout 和 q90 汇总；SR 使用预先定义的 endpoint-state labels。
- 主要对照是 encoder-history distance、一步 ACPC，以及同样 rollout 八步但把 action zero/swap/shuffle 的 destroyed-action controls；另以 PLDM 检查跨架构定性迁移。[评测协议](https://arxiv.org/html/2608.12939v1#S4.SS1)

#### 关键实验结果

| 证据问题 | 主要结果 | 能说明什么 |
|---|---|---|
| 八步 ACPC 能否解释 prediction error drift | 相对 Base MAE 降 `55.9±4.7%`；相对最强 destroyed-action control 降 `51.3±3.5%`；12/12 task-run cells 最优 | 多步、真实 recorded action 都带来额外信息 |
| 能否解释 CEM 选中不同 plan 的额外模型成本 | 加入五步 planner-horizon ACPC 后，跨任务 MAE 降 `15.2±2.0%`；12/12 tests 改善 | 与 planner horizon 对齐的 diagnostic 比一步量更有信息 |
| 跨任务 checkpoint screening | 两/三 source tasks 时 balanced accuracy `0.900`，precision/recall `0.913/0.953`；recovery onset 平均相差 0.5 个 grid step、最多 1 个 | 固定 IR/SR 规则可在未参与阈值选择的任务上识别恢复区间 |
| blur/resize 外推 | 24 对中 22 对方向一致；balanced accuracy `0.889`；`ΔS` 与成功率增益 Spearman `ρ=0.835` | 诊断排序不只拟合 Gaussian noise，但只测一个强度 |

[error drift](https://arxiv.org/html/2608.12939v1#S4.SS4) · [CEM selection regret](https://arxiv.org/html/2608.12939v1#S4.SS5) · [cross-task screening](https://arxiv.org/html/2608.12939v1#S4.SS6) · [blur/resize](https://arxiv.org/html/2608.12939v1#S4.SS8)

Gaussian-noise sweep 中，LeWM 的 no-augmentation→best success 为 TwoRoom `68.8→97.1%`、PushT `7.2→86.8%`、Reacher `18.2→83.3%`、Cube `43.1→66.0%`。这些数字说明 robustness training 的恢复范围，不是 ACPC 自身提高成功率；ACPC 只负责识别和解释 checkpoint 行为。[Table 4](https://arxiv.org/html/2608.12939v1#A3.T4)

#### 相对已有工作的创新

1. 用同动作的 clean/perturbed multi-step predicted rollout 定义 pairwise diagnostic，而不是只测 encoder invariance。
2. 用 IR 衡量同状态扰动半径，再用 SR 显式排除 collapsed representation。
3. 给出 prediction-error change 与固定候选池 planner-cost change 的 sample-wise bounds。
4. 把 threshold selection 与 test tasks 分开，并加入 PLDM、blur、resize 的跨任务/跨架构/跨扰动审计。

#### 事实、作者主张与本研究推断

- **事实**：ACPC 不改模型训练，也不进入 CEM objective；论文衡量的是诊断与误差/成本/成功率变化的关系。
- **作者主张**：同动作多步 rollout 能揭示 encoder-only 和 one-step measures 遗漏的 downstream effects；低 IR 与高 SR 联合时更能识别稳健 checkpoint。
- **本研究推断**：论文最成熟的产物不是一个新 SOTA 分数，而是一套可迁移的 JEPA model card/CI 指标原型。尤其适合在 world model 发布时随 checkpoint 一起报告。
- **归因边界**：Gaussian-noise augmentation 才直接改善 robustness；ACPC 证明自己能诊断改善，而不是造成改善。

#### 局限、复现条件与潜在风险

1. **不是闭环改进方法**：ACPC 未进入 planning 或 training；论文没有证明 ACPC-guided planner 会提高真实 task success。
2. **依赖外部标签**：完整 IR–SR screen 需要 unaugmented reference、observed futures，以及手工构造 endpoint-state labels；这限制了无标签部署。
3. **扰动覆盖窄**：主分析是 Gaussian noise，blur/resize 各只有一个 severity；未覆盖摄像头视角、纹理、遮挡、光照、动态 distractor 或真实传感器故障。
4. **阈值边界**：主 IR threshold `0.3` 已在被测 grid 的上边缘，更大范围未知；Reacher-only 选择规则会把其他任务接受时间拖后最多 5 个 levels。
5. **理论适用边界**：adaptive CEM 的 bound 只在两次运行仍选择相同 elite candidates 时成立；selection regret 是 clean model 的 latent goal cost，不是环境 return 或累计 regret。
6. **环境边界**：四项均为仿真/离线数据，尚无真实机器人、长时规划、多摄像头或 stochastic dynamics。
7. **复现状态较好但不为零成本**：官方仓库已含 LeWM/PLDM 训练、评测、冻结协议、machine-readable results 与表图重建脚本；重新生成 checkpoint-level diagnostics 仍需下载 LeWM HDF5 数据并训练/准备对应 checkpoints。[官方 README](https://github.com/Anguo-star/acpc-diagnostics)

#### 是否值得写成区别于追踪日报的原创技术博客

**很值得，今日第二优先级。** 可写《预测得近，不代表世界模型更稳健：为什么 JEPA 需要 IR + SR》。TwoRoom collapse 反例和 “ACPC 只诊断、不治疗” 的边界能形成很清楚的原创叙事；官方代码已公开，也比今天另外两篇更适合做复现型文章。

### 3. DreamX-Phi 1.0：用冻结 V-JEPA teacher 约束机器人视频中的对象关系

#### 基本信息

- **完整题目**：[*DreamX-Phi 1.0: Action-Conditioned Video World Model for Robotic Manipulation*](https://arxiv.org/abs/2608.13489)
- **作者**：DreamX Team；论文末尾列 Rui Chen、Xiangxiang Chu、Geng Li、Jifan Li、Qingfeng Shi、Datao Tang、Jing Tang、Jun Wang、Pengfei Zhang。
- **机构**：论文题名页与作者附录没有列机构；只给出 `AMAP-ML/DreamX-Phi` 官方仓库地址。不能仅凭 GitHub 组织名替作者补机构。[PDF](https://arxiv.org/pdf/2608.13489v1)
- **时间与出处**：arXiv:2608.13489 v1，2026-08-13 17:18:09 UTC；`cs.CV` 预印本/WorldArena 2.0 challenge technical report，未见会议或期刊接收声明。[提交记录](https://arxiv.org/abs/2608.13489)
- **JEPA 血缘**：明确引用并实际加载冻结 V-JEPA teacher，只在训练期提供 object-relational supervision；其引用对应 V-JEPA 2，但实际版本/checkpoint 未披露。
- **下游任务**：给定首帧、语言指令和双臂 end-effector/gripper action sequence，生成未来机器人操作视频；并把生成世界模型作为 rollout environment 训练策略。

#### 方法如何衔接 JEPA

**事实：** 主体是 Wan2.2-TI2V-5B video diffusion transformer。PRoPE 把双臂 SE(3) 轨迹注入 attention，robot-only optical flow 提供图像平面的动作位置；Depth Anything 3 生成 depth target，SAM3 mask 提高被操纵对象区域的 RGB loss 权重。[总览](https://arxiv.org/html/2608.13489v1#S4.F2)

V-JEPA 分支先从 SAM3 object mask 内选时空 tokens，再把 student hidden tokens 插值到相同位置并投影归一化。损失比较 student 与冻结 V-JEPA teacher 的 Gram matrices，而非逐坐标 feature MSE；作者希望借此约束对象 identity、shape 和 state 在抓取期间不漂移。只有 mask token 足够且 flow-matching noise 不太高的样本才进入该 loss。[对象关系损失](https://arxiv.org/html/2608.13489v1#S4.SS4)

**作者主张：** mask-weighted RGB loss 决定“哪里要准确”，V-JEPA relational loss 决定“对象如何随时间一致地演化”，二者联合促进物理一致的 arm–object interaction。

**本研究推断：** 这是 V-JEPA 从 encoder/checkpoint 进一步变成训练监督 API 的例子；但在没有去掉 teacher 的 matched ablation 前，只能认可接口创新，不能认可独立效果量。

#### 数据、指标、基线与实验协议

训练语料混合 Ego4D 3,700h、AgiBot World 1,900h、InternData-A1 78h real + 3,747h simulated、Cosmos3-DROID 350h、RoboCOIN 618h，以及 RoboTwin 2.0 的 25,000 action-annotated clips；过滤后 AgiBot imitation split 为 178.7h。[数据表](https://arxiv.org/html/2608.13489v1#S3.T1)

WorldArena 2.0 Track 1 用 1,000 episodes 评估 action/language-conditioned video prediction，报告 15 个视觉、时序、内容、物理、三维与 controllability 指标的平均 `EWMScore-P`；Track 2 用提交的 world model 作为 rollout environment 优化 π0.5 policy，再在 RoboTwin 2.0 Adjust Bottle held-out episodes 上报成功率。WorldArena 1.0 另用 Clean-50：50 tasks×10 held-out episodes。[评测](https://arxiv.org/html/2608.13489v1#S5)

#### 关键实验结果

| 设置 | DreamX-Phi | 主要对照/排名 | 边界 |
|---|---:|---|---|
| WorldArena 2.0 Track 1 | `EWMScore-P 60.65` | Alpha-World 60.13、FlowWAM-FiveAges 59.72；31 项第一 | 固定于 2026-08-12 snapshot，非最终排名 |
| WorldArena 2.0 Track 2 | Adjust Bottle `67.19%` | WOVR-PLUS 68.75；与 Lute 67.19 并列第二 | 只有一个任务，policy 与 reward model 由 organizer protocol 给定 |
| WorldArena 1.0 Track 1 | offline `76.88` | 固定榜首 UNIS 73.64 | DreamX-Phi 不是该 pinned leaderboard 的正式提交 |

[WorldArena 2.0 Table 2/3](https://arxiv.org/html/2608.13489v1#S5.SS3) · [WorldArena 1.0 Table 4](https://arxiv.org/html/2608.13489v1#S5.T4)

这些都是 full-system comparisons。论文没有 w/o V-JEPA、w/o SAM3、w/o depth、w/o PRoPE 或相同训练预算的 alternate teacher；因此 `60.65` 与 `67.19%` 不能被写作 V-JEPA 的增益。

#### 相对已有工作的创新

1. 用 arm-grouped PRoPE 显式保留双臂 SE(3) 轨迹结构，并用 robot-only flow 补充图像平面位置。
2. 把 depth、SAM3 mask weighting 和冻结 V-JEPA relational loss 分工为几何、局部关注和对象时序一致性监督。
3. 不匹配 teacher feature 坐标，而是匹配 mask 内 token relations 的 Gram matrix。
4. 再用 DMD/adversarial training 将多步生成器蒸馏为 few-step student。

#### 事实、作者主张与本研究推断

- **事实**：冻结 V-JEPA teacher 真正进入训练 loss，不是 related-work-only；论文引用对应 V-JEPA 2，但没有说明 teacher 版本/checkpoint；WorldArena 固定快照的完整系统排名靠前；没有组件消融。
- **作者主张**：V-JEPA relational supervision 有助于对象在接触和抓取过程中保持 identity、shape 和 state coherence。
- **本研究推断**：当前最稳妥的结论是“V-JEPA 可以作为 object-relational teacher”，而不是“V-JEPA 让 DreamX-Phi 得到第一”。
- **归因风险**：模型规模、语料规模、video refinement、PRoPE、flow、depth、SAM3、V-JEPA、DMD 和 adversarial post-training 全部共同变化。

#### 局限、复现条件与潜在风险

1. **无 matched ablation**：无法估计 V-JEPA loss 的独立边际，也无法知道它是否优于 DINO/VideoMAE/像素 flow consistency teacher。
2. **评测范围窄**：只覆盖 WorldArena/RoboTwin；Track 2 只有 Adjust Bottle，未验证其他任务、本体或真实机器人。
3. **不是闭环 policy**：DreamX-Phi 接收外部 action sequence 并预测视频；Track 2 是另一个 policy 利用其 rollout environment，不等于模型本身生成动作。
4. **榜单时点风险**：论文固定在 8 月 12 日 snapshot，挑战最终名次可能变化；WorldArena 1.0 数字还是 offline evaluation。
5. **代码状态矛盾**：论文给出的 [GitHub](https://github.com/AMAP-ML/DreamX-Phi) 截至本次检索返回 404，脚注又说赛后才公开权重与 inference code；目前没有 checkpoint、训练代码、环境锁和确切资源预算。
6. **数据与许可成本**：训练混合数千小时多源视频、SAM3/DA3 离线标注和 DreamX-Refiner；论文没有 GPU-hours、硬件、总训练 steps、许可兼容性与数据清洗 manifest。
7. **安全外推**：视频指标与单任务 policy success 不能替代真实机器人碰撞、接触力、延迟和 OOD failure testing。

#### 是否值得写成区别于追踪日报的原创技术博客

**中等，先等消融与代码。** 适合以后并入“V-JEPA 作为 teacher，而不只是 backbone”的横向专题；当前单篇原创博客会被 full-system 榜单牵着走，V-JEPA 的机制证据不够独立。

## 横向比较

| 维度 | CardioState-JEPA | ACPC diagnostic | DreamX-Phi 1.0 |
|---|---|---|---|
| actual-use 类型 | method direct-use / pretrain-then-linear-probe | evaluation-only direct-use | teacher-supervision direct-use |
| 使用的 JEPA | I-JEPA 式 EMA teacher + masked/cross-modal predictor | LeWM 与 PLDM joint-embedding dynamics；引用 I/V-JEPA 家族 | 冻结 V-JEPA teacher（引用对应 V-JEPA 2，具体版本未披露） |
| JEPA 作用位置 | 学共享心脏状态 | 审计扰动后的 latent rollout | 约束对象 token 的时空关系 |
| 下游任务 | 25 项 ECG/PPG/PCG 分类与回归 | 4 项视觉控制、CEM checkpoint screening | 机器人视频生成与 world-model policy training |
| 最强机制证据 | 同数据/架构 objective replacement；完整 JEPA 四个聚合指标总体最好 | recorded-action 8-step ACPC 在 12/12 cells 降低 error-drift MAE | 只有 loss 定义，无 w/o-V-JEPA 消融 |
| 最重要反证 | 三模态 ECG/PPG classification 略低于 ECG+PPG | 低 IR 可由 collapse 伪造，必须联用 SR | full system 第一不能归因给 V-JEPA |
| 复现状态 | 无代码/权重；配置较细、paired manifest 缺 | 代码、协议与结果公开；需数据/checkpoints | 论文给的仓库当前 404，权重赛后再发 |
| 原创博客价值 | 很高 | 很高 | 中等，待消融 |

今天最重要的横向结论是：**JEPA 下游研究已经不能只问“有没有 predictor”，还要问 predictor 在哪个生命周期、是否真的承担独立因果角色。** CardioState-JEPA 的 matched objective replacement 最接近方法归因；ACPC 的贡献在诊断而非训练；DreamX-Phi 只有系统级相关证据。三篇都属于 actual-use，但证据强度和可写结论完全不同。

## 值得继续追的问题

1. **CardioState-JEPA 的 paired/trimodal manifest 能否公开？** 需要实际记录数、患者数、subject-level 去重、预训练与下游重叠审计，以及每种 pairing 的采样权重。
2. **delay aligner 是否真的学到 physiology，而不是 dataset/device identity？** 应报告预测 delay 与 R-peak→S1、pulse arrival time 的误差、跨数据集迁移、心律不齐和高噪声 failure cases。
3. **多模态收益来自 JEPA 还是额外数据？** 需要相同 data budget 的 late fusion、teacher distillation、cross reconstruction、contrastive alignment 与 fixed-delay controls。
4. **ACPC 能否从诊断器变成控制信号？** 最直接实验是把 ACPC 加入 CEM candidate filtering/cost，再看真实 success 是否改善，同时防止 planner 利用 diagnostic 漏洞。
5. **SR 能否无标签化？** 当前 endpoint-state labels 依赖任务坐标；可尝试 learned neighborhoods、action disagreement 或 uncertainty-aware separation，而不使用人工 state bins。
6. **ACPC 能否覆盖真实 shift？** 后续应加入摄像头外参变化、背景动态物体、遮挡、光照、压缩、延迟、真实机器人和更长 horizon。
7. **DreamX-Phi 的 V-JEPA 独立边际是多少？** 至少需要 full / w/o V-JEPA / DINO teacher / raw-feature MSE / Gram loss without teacher 的 matched runs，并报告 object-contact failure metrics。
8. **DreamX-Phi 官方仓库何时可用？** 需跟踪 challenge 结束后的 checkpoint、inference code、训练配方、许可和固定 leaderboard artifacts。
9. **A-JEPA / 纯音频方向今日仍没有严格新增。** CardioState-JEPA 含 PCG，但不是 A-JEPA 后代；后续继续分开追踪 audio-native JEPA 与跨生理模态模型。
10. **引用图谱的索引时延怎样处理？** 今天 OpenAlex 三条核心引用链仍为 0，而 arXiv 已有三篇全文；自动化应继续以 arXiv/官方预印本为严格增量主源，引用链只补漏，不作为否定证据。

## 博客价值判断

### 当日追踪博客

**应按「JEPA追踪」系列完整发布。** 今日不是空增量：一篇强方法、一篇强诊断、一篇弱归因但真实使用 V-JEPA teacher 的系统论文，正好展示“actual-use 内部分层”为什么必要。标题级结论应把 CardioState-JEPA 与 ACPC 放在 DreamX-Phi 榜单之前。

### 区别于追踪日报的原创博客

- **首选 CardioState-JEPA**：《跨模态 JEPA 的 target 不是同一时间戳》。重点写 delay-aware correspondence、matched objective ablation 和三模态不总胜双模态的反例。
- **次选 ACPC**：《预测得近，不代表世界模型稳健》。重点写 collapse 时低 IR 的假象、IR+SR 联合门槛，以及 diagnostic 与 intervention 的区别；官方代码使复现可行。
- **DreamX-Phi 暂缓单篇原创**：等 w/o-V-JEPA 消融和仓库开放后，再讨论 relational teacher 是否真的改善接触一致性。
- **今日不自行创建主题化原创博客。** 本记录只服务「JEPA追踪」系列。

### 配图判断

本日选用 [CardioState-JEPA Figure 1 官方动机图](https://arxiv.org/html/2608.12944v1/Motivationn.png)。它把 ECG、PPG、PCG 对同一心动周期的错时观测与下游任务放在一张图中，能直接解释为什么需要共享状态和 delay-aware alignment。官方 PNG 为 650×297、77,117 bytes（约 75 KiB），已经足够轻，无需在仓库另存压缩副本；页面限制 `max-width:650px` 并 lazy-load。完整 Figure 2 的官方 SVG 为 711,387 bytes（约 695 KiB），信息更密但不适合日报首屏。

<figure style="margin:1.5em auto;text-align:center;">
  <img src="https://arxiv.org/html/2608.12944v1/Motivationn.png" alt="ECG、PPG、PCG 在不同生理时刻观测同一心动周期，并共享一个心脏表征" style="display:block;max-width:650px;width:100%;height:auto;margin:0 auto;" loading="lazy">
  <figcaption>CardioState-JEPA Figure 1：三种传感器以不同生理时延观测同一心动周期。图片来自 arXiv 官方 HTML。</figcaption>
</figure>

## 来源链接

### 严格增量与引用链

- [arXiv 严格提交窗口：JEPA / joint-embedding predictive](https://export.arxiv.org/api/query?search_query=submittedDate%3A%5B202608130332%20TO%20202608140310%5D%20AND%20%28all%3AJEPA%20OR%20all%3A%22joint-embedding%20predictive%22%20OR%20all%3A%22joint%20embedding%20predictive%22%29&start=0&max_results=100&sortBy=submittedDate&sortOrder=descending)
- [arXiv 家族严格窗口：I-JEPA / V-JEPA / V-JEPA 2 / A-JEPA / SAR-JEPA](https://export.arxiv.org/api/query?search_query=submittedDate%3A%5B202608130332%20TO%20202608140310%5D%20AND%20%28all%3A%22I-JEPA%22%20OR%20all%3A%22V-JEPA%22%20OR%20all%3A%22V-JEPA%202%22%20OR%20all%3A%22A-JEPA%22%20OR%20all%3A%22SAR-JEPA%22%20OR%20all%3A%22Joint-Embedding%20Predictive%20Architecture%22%29&start=0&max_results=100&sortBy=submittedDate&sortOrder=descending)
- [arXiv 按 lastUpdatedDate 排序](https://export.arxiv.org/api/query?search_query=all%3AJEPA%20OR%20all%3A%22joint-embedding%20predictive%22&start=0&max_results=100&sortBy=lastUpdatedDate&sortOrder=descending)
- [时间窗外历史漏项：Scaling Representation Diversity（arXiv:2608.12748）](https://arxiv.org/abs/2608.12748)
- OpenAlex：[I-JEPA 日期引用链](https://api.openalex.org/works?filter=cites%3AW4386076428%2Cfrom_publication_date%3A2026-08-13&sort=publication_date%3Adesc&per-page=100) · [V-JEPA 日期引用链](https://api.openalex.org/works?filter=cites%3AW4394861491%2Cfrom_publication_date%3A2026-08-13&sort=publication_date%3Adesc&per-page=100) · [V-JEPA 2 日期引用链](https://api.openalex.org/works?filter=cites%3AW4417261359%2Cfrom_publication_date%3A2026-08-13&sort=publication_date%3Adesc&per-page=100)
- [bioRxiv 2026-08-13 至 2026-08-14 官方列表](https://api.biorxiv.org/details/biorxiv/2026-08-13/2026-08-14/0/json) · [medRxiv 同期列表](https://api.biorxiv.org/details/medrxiv/2026-08-13/2026-08-14/0/json)

### CardioState-JEPA 一手来源

- [arXiv 摘要与提交历史](https://arxiv.org/abs/2608.12944)
- [arXiv 官方元数据 API](https://export.arxiv.org/api/query?id_list=2608.12944)
- [HTML 全文](https://arxiv.org/html/2608.12944v1) · [PDF](https://arxiv.org/pdf/2608.12944v1)
- [Figure 1 官方动机图](https://arxiv.org/html/2608.12944v1/Motivationn.png) · [Figure 2 方法图](https://arxiv.org/html/2608.12944v1/CardioState_Figv1.svg)
- [Table 1：PPG](https://arxiv.org/html/2608.12944v1#S3.T1) · [Table 2：ECG](https://arxiv.org/html/2608.12944v1#S4.T2) · [Table 3：PCG](https://arxiv.org/html/2608.12944v1#S4.T3) · [Table 4：消融](https://arxiv.org/html/2608.12944v1#S4.T4)

### ACPC 一手来源

- [arXiv 摘要与提交历史](https://arxiv.org/abs/2608.12939)
- [arXiv 官方元数据 API](https://export.arxiv.org/api/query?id_list=2608.12939)
- [HTML 全文](https://arxiv.org/html/2608.12939v1) · [PDF](https://arxiv.org/pdf/2608.12939v1)
- [官方代码与复现说明](https://github.com/Anguo-star/acpc-diagnostics)
- [实验协议](https://arxiv.org/html/2608.12939v1#S4.SS1) · [error-drift evidence](https://arxiv.org/html/2608.12939v1#S4.SS4) · [CEM evidence](https://arxiv.org/html/2608.12939v1#S4.SS5) · [跨任务筛选](https://arxiv.org/html/2608.12939v1#S4.SS6) · [限制](https://arxiv.org/html/2608.12939v1#S5)

### DreamX-Phi 1.0 一手来源

- [arXiv 摘要与提交历史](https://arxiv.org/abs/2608.13489)
- [arXiv 官方元数据 API](https://export.arxiv.org/api/query?id_list=2608.13489)
- [HTML 全文](https://arxiv.org/html/2608.13489v1) · [PDF](https://arxiv.org/pdf/2608.13489v1)
- [Figure 2 方法图](https://arxiv.org/html/2608.13489v1/dreamx_phi_train.png)
- [V-JEPA relational supervision](https://arxiv.org/html/2608.13489v1#S4.SS4) · [WorldArena 2.0 结果](https://arxiv.org/html/2608.13489v1#S5.SS3) · [限制](https://arxiv.org/html/2608.13489v1#S6)
- [论文声明的官方仓库（本轮 404）](https://github.com/AMAP-ML/DreamX-Phi)
