---
title: JEPA 下游研究追踪 · 2026-08-18
date: 2026-08-18 10:00:00
categories:
  - JEPA研究追踪
tags:
  - JEPA
  - JEPA追踪
---

本文属于「JEPA追踪」系列，记录每日论文检索、原文核验与阶段性判断；它保留研究日志的证据密度，与经过主题化重写的原创博客区分。

# JEPA 下游研究追踪（2026-08-18）

> 增量边界：自动化元数据给出的上次唤醒时间为 `2026-08-17T03:01:56.767Z`，但上一轮研究记录实际检索到 2026-08-17 03:12 UTC；为避免重复认领，本轮采用较晚的 03:12 UTC 作为有效起点。检索截止为 2026-08-18 03:12 UTC。搜索索引只用于候选发现，下文实质性结论均回到 arXiv/bioRxiv 原文、官方元数据或 DOI 核验。

> 分类口径：**SCALE** 是可逐项审计的 `method direct-use`；**HI-JEPA** 明确引用 I-JEPA、声称以正样本 latent-neighbor prediction 训练并进入蛋白互作与干预规划，但作者不公开架构和训练流程，因此记为 **`claimed direct-use / implementation-not-auditable`**，不与可复现的标准 I-JEPA 实现等量齐观。

## 今日结论

1. **今日有两篇严格窗口内的新增下游论文，不需要用历史漏项补位。** [SCALE](https://arxiv.org/abs/2608.16287) 于 2026-08-17 08:58:55 UTC 首次提交到 arXiv；[HI-JEPA](https://www.biorxiv.org/content/10.64898/2026.08.14.744901v1) 于 2026-08-17 登上 bioRxiv，Crossref 创建 DOI 的时间为 12:30:20 UTC。两者都晚于上轮截止。
2. **SCALE 给出今天最可靠的方法证据：JEPA 表征中“能解码出任务状态”不等于该状态会影响规划器。** 它在 LeWorldModel（LeWM）的 action-conditioned latent prediction 与 SIGReg 上，加入“latent 距离与标准化任务状态距离相关”的训练正则；在五个任务、三种求解器的 15 个 task–solver 平均项中全部高于 LeWM。以 iCEM 为例，五任务跨预算平均增益分别为 `+4.3 / +3.1 / +5.2 / +10.0 / +3.1 pp`。[论文 Table 2](https://arxiv.org/html/2608.16287#S6.T2)
3. **但 SCALE 不是“纯像素自监督”或统一最优规划器。** 它训练时读取任务特定的 simulator state，甚至不同任务选择不同状态维度和权重；Aux state-regression 在 Push-T 的三种 solver 平均都略高于 SCALE，而固定 DINO-WM 在 Two-Room 与 PointMaze 仍明显更强。最稳妥的结论是“几何校准稳定改善 LeWM”，不是“状态几何监督击败所有 world model”。
4. **HI-JEPA 把 JEPA 思路带到分子空间组织与靶点提名，数字醒目但复现证据极弱。** 论文称每个蛋白对应一个 embedding，通过预测实测邻居 embedding 学习，不重建输入、不生成负例；在双方蛋白均未见过的低序列相似互作上报告 AUC `0.908`，对 ESM-C 6B 的 `0.514`，并在 knockout partner recovery 上达到 Recall@100 `0.640`。然而作者明确把它定义为“capability report”，架构、训练流程、采集细节、代码、权重和专有语料全部不公开。[官方 PDF](https://www.biorxiv.org/content/biorxiv/early/2026/08/17/2026.08.14.744901.full.pdf)
5. **HI-JEPA 最值得保留的是边界而非排行榜。** 训练图中 1,633,725 条 edge 混合九类通道，真正 nanoscale measured proximity 只占 `0.04%`；proximity-channel ablation 让 cross-scale median rank 从 `14` 退到 `68`，却不伤 navigation 和 within-scale dynamics，这支持“该通道提供跨尺度信号”。但 5xFAD 规划轴由 4 只动物的 17 个 region 拟合并在同批 region 上评分，且 disease-to-healthy 轴本身需要 5xFAD/WT 分组；不能照搬摘要，把整个规划结果写成“没有疾病标签”。

## JEPA 方向最新进展

### 1. 规划研究从“预测误差”进入“planner-facing geometry”

SCALE 延续 LeWM 一类端到端 action-conditioned JEPA world model，但把检查点从“未来 latent 是否预测准确”移到“规划器真正消费的距离是否让任务状态拥有足够权重”。在平方欧氏成本下，第 `j` 个主成分平均贡献恰为 `2λ_j`；任务信息即使可被 probe 解码，只要落在低方差方向，也很难改变候选动作排序。[方法推导](https://arxiv.org/html/2608.16287#S4.SS2)

这与此前追踪的 Temporal Straightening、Causal-JEPA、ACPC 诊断形成连续链条：研究问题正在从“latent 可预测吗”细化为“latent 的路径、距离和排序是否适合控制”。新的评估单位不再只是 representation accuracy，而是 candidate ranking、规划搜索预算和 rollout 后仍保留的几何结构。

### 2. 下游 JEPA 开始显式使用 privileged task state

SCALE 训练时用 simulator state 定义目标距离，测试时仍只输入图像。它比端到端监督 policy 更接近 representation shaping，却已不是无标签视觉自监督。更重要的是，论文发现给 Reacher/Cube 加入更多状态变量反而把平均成功率从 `66.17→65.75`、`62.65→62.55`；这说明 state selection 自身就是任务先验，不能把结果外推成“有更多状态监督就更好”。[Appendix B](https://arxiv.org/html/2608.16287#A2.SS0.SSS0.Px1)

### 3. JEPA 的“context–target”从视觉 block 扩展到关系图邻居

HI-JEPA 明确引用 I-JEPA，并把“从一个实体预测另一个相关实体的 latent”迁到蛋白关系图：context 不再是图像可见块，target 是实测邻居蛋白；防塌缩也不是 I-JEPA 的完整 EMA recipe，而是作者称经过能力表选择的 Barlow Twins + DINO 组合。因此它属于广义 JEPA 直接使用，而不是可直接复刻的 I-JEPA 生物版。[bioRxiv PDF，Sections 2 与 5](https://www.biorxiv.org/content/biorxiv/early/2026/08/17/2026.08.14.744901.full.pdf)

### 4. 今日没有新的 V-JEPA/V-JEPA 2、A-JEPA 专项稿

[I-JEPA](https://api.openalex.org/works?filter=cites%3AW4386076428%2Cfrom_publication_date%3A2026-08-17&sort=publication_date%3Adesc&per-page=100)、[V-JEPA](https://api.openalex.org/works?filter=cites%3AW4394861491%2Cfrom_publication_date%3A2026-08-17&sort=publication_date%3Adesc&per-page=100) 与 [V-JEPA 2](https://api.openalex.org/works?filter=cites%3AW4417261359%2Cfrom_publication_date%3A2026-08-17&sort=publication_date%3Adesc&per-page=100) 的 OpenAlex 日期引用链均返回 0；这与当天两篇实际新稿并不矛盾，只表明引用索引有时延。今日入选两篇分别沿用 LeWM/LeJEPA 与 I-JEPA 广义谱系，没有新的视频或音频专项落地。

## 新增下游论文解读

### 1. SCALE: State-Calibrated Latent Embeddings for JEPA Planning in the Right Geometry

#### 基本信息

- **完整题目**：[*SCALE: State-Calibrated Latent Embeddings for JEPA Planning in the Right Geometry*](https://arxiv.org/abs/2608.16287)
- **作者与机构**：Jiaming Hu（Boston University、Unity Technologies；工作完成于 Unity 实习期间）、Yan Zheng 与 Tian Wang（Unity Technologies）。
- **时间与出处**：arXiv:2608.16287 v1，2026-08-17 08:58:55 UTC；15 页、2 幅图，当前无会议接收、DOI 或正式出版信息。[arXiv 官方 HTML](https://arxiv.org/html/2608.16287)
- **JEPA 血缘**：以 LeWorldModel（LeWM）的端到端 action-conditioned joint-embedding prediction + SIGReg 为主体，同时以 frozen DINO-WM 作为 pretrained-feature reference；不是 I-JEPA/V-JEPA checkpoint 下游微调。
- **下游任务**：Push-T、DeepMind Control Reacher、OGBench-Cube、Two-Room、PointMaze 的 goal-conditioned visual planning。

#### 方法如何衔接 JEPA

LeWM 由图像 encoder `Eθ` 和 action-conditioned predictor `Pψ` 组成，使用一步 latent MSE `Lpred` 学动态，并用 SIGReg 防塌缩。测试时，CEM/iCEM/MPPI 将候选 action sequence 滚动到 terminal latent，再以 terminal–goal 的平方欧氏距离排序。[LeWM objective](https://arxiv.org/html/2608.16287#S3.SS2)

SCALE 给每个训练帧配一个标准化、任务特定的 simulator state `q`；每步抽取 4,096 对帧，一半来自同一子轨迹、一半跨 episode，使 latent pairwise distance 与 state pairwise distance 的相关最大。完整目标为 `Lpred + λsig·SIGReg + λcorr·Lcorr`；`Lcorr` 只更新 encoder，predictor 仍只由 `Lpred` 更新。state 仅是 detached training target，测试保持 image-only。[SCALE objective](https://arxiv.org/html/2608.16287#S5.SS1)

为区别“状态可解码”与“状态会影响欧氏距离”，作者设计 Aux 对照：同样的 state、架构和训练协议，但用非线性 head 回归 state，不直接约束 latent metric。

#### 数据、指标、主要基线与复现协议

- **模型**：ViT-Tiny/14，12 层、3 heads、宽 192；6 层 causal Transformer predictor，16 heads、dropout 0.1、history 3。
- **训练**：4-frame 子轨迹、batch 128、10 epochs、Adam、学习率 `5e-5`、weight decay `1e-3`，只披露一个训练 seed `3072`；`λcorr=0.1`，Reacher 为 `0.15`。
- **规划**：CEM、iCEM、MPPI；五档预算对应每次 replanning `9000 / 2000 / 500 / 100 / 30` 次 rollout，跨度 300×；horizon 为五个 action blocks（25 environment steps）。
- **评测**：CEM/iCEM 的 6 个 evaluation set 各 100 episodes，配置间复用相同 episode 与 planner randomness；MPPI 使用 5 个 held-out sets。论文明确说明表中 SD 只反映 episode sampling，不包括重新训练模型的方差。[Appendix A](https://arxiv.org/html/2608.16287#A1)
- **基线**：LeWM、同监督 Aux regression、DINO-WM；主要指标为 success rate，并辅以 latent–state Spearman、probe `R²`、normalized rollout error 与候选 cost ranking 的 Kendall `τ`。

论文没有报告各环境离线训练轨迹数量、训练 GPU/耗时、代码或 checkpoint，也没有多训练 seed。

#### 关键实验结果

**iCEM 跨五档预算的平均成功率：**

| 任务 | LeWM | SCALE | Aux | DINO-WM |
|---|---:|---:|---:|---:|
| Push-T | 63.9 | 68.2 | **69.3** | 51.3 |
| Reacher | 78.0 | **81.1** | 80.2 | 72.8 |
| Cube | 65.3 | **70.5** | 68.6 | 62.7 |
| Two-Room | 82.9 | 92.9 | 83.1 | **98.2** |
| PointMaze | 80.2 | 83.4 | 81.3 | **91.5** |

[论文 Table 2](https://arxiv.org/html/2608.16287#S6.T2)

SCALE 在 CEM、iCEM、MPPI 共 15 个 task–solver 平均项里都高于 LeWM，但不是每个预算单元格都更高；例如 Push-T/iCEM 的最低预算 T5 为 `25.5`，略低于 LeWM 的 `25.7`。Aux 在 Push-T 的三种 solver 平均均略高于 SCALE；DINO-WM 则在两个 navigation 任务保持优势。[完整规划表](https://arxiv.org/html/2608.16287#A3)

几何一致性上，held-out latent–state Spearman 从 LeWM 到 SCALE 分别为 Push-T `.13→.77`、Reacher `.18→.53`、Cube `.00→.56`、Two-Room `.41→.77`、PointMaze `.52→.80`；Aux 基本停在 LeWM 水平。[Table 9](https://arxiv.org/html/2608.16287#A2.T9) 但该相关性正是 `Lcorr` 的直接训练目标，论文自己把它称为 consistency check，而不是独立机制证据。

更有独立意义的是 rollout 后的候选排序：SCALE 在五任务的 Kendall `τ` 都高于 LeWM，PointMaze 从 `-0.0029` 提到 `0.1675`；Aux 只到 `0.0540`。不过 DINO-WM 在 PointMaze 为 `0.2850`，再次说明 SCALE 修复的是 LeWM 的一致短板，并非全局最优。[Table 3](https://arxiv.org/html/2608.16287#S6.T3)

<figure style="margin:1.5em auto;text-align:center;max-width:620px;">
  <img src="https://arxiv.org/html/2608.16287v1/figures/fig_topk_pusht.png" alt="SCALE Figure 2 的 Push-T 子图：从不同数量主成分预测任务状态的 R²" width="620" loading="lazy">
  <figcaption>SCALE Figure 2 的 Push-T 子图：SCALE 让任务状态更多地进入高方差主成分，而 Aux 虽能从完整 embedding 解码状态，却没有同样重排主导子空间。来源：<a href="https://arxiv.org/html/2608.16287#S6.F2">arXiv 官方 HTML</a>。官方 PNG 为 900×740、36,648 bytes（约 35.8 KiB），正文限宽并延迟加载，不复制本地图片。</figcaption>
</figure>

#### 相对已有工作的创新

1. 把平方欧氏规划成本中主成分方差的贡献写成明确的 `metric leverage`，将 representation geometry 与 planner ranking 对接。
2. 用相同 privileged state 构造 Aux regression control，证明“完整 embedding 可解码”不足以解释所有规划增益。
3. 在三种 solver 和 300× rollout budget 上复核，而不是只为某个 search heuristic 调参。
4. 用 rollout error 与 Kendall ranking 区分“预测更准”和“候选排序更对”。

#### 事实、作者主张与本研究推断

- **论文事实**：单个训练 seed 的模型中，SCALE 高于 LeWM 的全部 15 个 task–solver 平均项；几何相关与 rollout ranking 也系统改善。
- **作者主张**：规划取决于任务信息是否进入 planner 消费的高 metric-leverage 方向，而不仅是它能否从完整 representation 被解码。
- **本研究推断**：planning success 的跨 solver 改善支持该主张，但 latent–state correlation 本身是直接优化量，不能独立验证机制。还需与 learned goal metric、Mahalanobis whitening、state-aware cost head 和只在 planner 侧重加权的对照比较，才能判断收益来自“表征重排”还是“换了更合适的成本函数”。

#### 局限、复现条件与潜在风险

1. 训练依赖 task-specific simulator state，现实机器人若没有可靠 state logger，需要额外传感或估计器。
2. 状态维度和 `λcorr` 按任务选择；论文自己的“更多状态变量略有害”表明 inductive bias 很强。
3. 只有一个训练 seed；表中 SD 只覆盖 episode sampling，无法估计 representation training variance。
4. 无代码、权重、环境轨迹数、GPU/耗时；公开超参不足以端到端复现。
5. 五项都属于模拟/标准视觉控制环境，无真实机器人、噪声状态或 domain shift。
6. SCALE 不全面超过 Aux 或 DINO-WM；不能把 `15/15` 写成“所有对照、所有预算都获胜”。

#### 是否值得写成区别于追踪日报的原创技术博客

**值得，优先级高。** 最适合的主题是《可解码不等于可规划：JEPA latent geometry 为什么会骗过 probe》。它可以把 PCA 方差、欧氏成本、candidate ranking 和 privileged-state 代价串成一个完整方法论故事。原创文章必须保留“一 seed、simulator state supervision、SCALE 只稳定胜 LeWM、DINO-WM 在导航仍强”四个边界。

### 2. HI-JEPA: A World Model of Molecular Organization Learned from Measured Proximity

#### 基本信息

- **完整题目**：[*HI-JEPA: A World Model of Molecular Organization Learned from Measured Proximity*](https://www.biorxiv.org/content/10.64898/2026.08.14.744901v1)
- **作者与机构**：Ryan Shihabi、Siddhant Karmali、Brent Vaughan、Sharief Taraman（Eratos Therapeutics），Manolis Kellis（MIT CSAIL）。
- **时间与出处**：bioRxiv Systems Biology 预印本，v1 于 2026-08-17 发布，DOI `10.64898/2026.08.14.744901`，未经过同行评审。[Crossref 官方元数据](https://api.crossref.org/works/10.64898/2026.08.14.744901)
- **JEPA 血缘**：正文引用 I-JEPA，把一个蛋白的 embedding 预测其 measured neighbors 的 embeddings；无像素重建、无生成负例。collapse prevention 使用 Barlow Twins + DINO，而非披露完整的 I-JEPA online/EMA target 配方。
- **下游任务**：蛋白互作、显微点云身份识别、蛋白复合体补全、knockout partner recovery、基因沉默响应、跨器官组织共定位、化合物结合、5xFAD 疾病异常发现与 intervention planning。

#### 方法如何衔接 JEPA

论文把 13,447 个蛋白放进一个共享 latent space，每个蛋白一个 embedding；九种关系通道提供 neighbor pairs，核心 predictive objective 只让 query protein 预测已测邻居的 latent，不做输入重建和负采样。作者称模型为 38.9M 参数、各 modality 编码到 768 维，readout 投影到 384 维。

配置（configuration）是同一 neighborhood 内一组蛋白 embeddings，也是 world-model state。动作包括移除、稳定某个成分或 modeled intervention；另一个 set-structured Transformer 接受 control cell population 与 perturbed-gene latent，预测 perturbation response。5xFAD planning 用疾病—健康轴作为 reward，贪心搜索 28 个动作、horizon 8。[官方 PDF，Section 3](https://www.biorxiv.org/content/biorxiv/early/2026/08/17/2026.08.14.744901.full.pdf)

这里必须降级表述：作者不公开 encoder/predictor 架构、target 更新方式、loss 公式与相对权重、采样、optimizer、epoch、seed 或 compute。可以核验“论文声称并评估了 JEPA 式正样本 latent prediction”，不能核验其实现是否等价于标准 I-JEPA。

#### 数据、指标、主要基线与复现协议

- **ASCEND measured proximity**：164 个蛋白、5 个 studies、37 个 imaged regions、约 120 万次 scored colocalization events。
- **公共 5xFAD worked example**：4 只 12 月龄小鼠（2 只 5xFAD、2 只 WT）、17 个 cortex regions、161,678 个 nanoclusters、40,831 次 colocalizations；注册精度约 25–40 nm。
- **训练图**：九类关系、1,633,725 条 training edges；12,468 个 training proteins、979 个 held-out proteins。任意接触 held-out protein 的 edge 均不进入训练，但 split 只随机固定一次，未按 family/pathway/degree 分层。measured proximity 只占训练 edge 的 `0.04%`，multiplex spatial imaging 占 `43.3%`，curated references 占 `56.7%`。
- **指标**：AUC、Recall@k、Top-1、median rank、Pearson `r`、cosine、effective rank；论文称 95% CI 通过 resampling 获得。
- **主要基线**：相同数据和关系的 contrastive/InfoNCE control，ESM-C 600M/6B、ESMFold2、partner/complex frequency、mean configuration、mass action、random/single intervention。

论文没有公开代码、权重或专有语料；只说 benchmark splits 和 derived evaluation data “can be released”，不是已经开放。公共 5xFAD 原始图像可复查 measurement 例子，但无法重训模型。[Availability](https://www.biorxiv.org/content/biorxiv/early/2026/08/17/2026.08.14.744901.full.pdf)

#### 关键实验结果

1. **蛋白互作**：双方蛋白都未见过、最低 25% sequence-similarity 的 68 个 positives 上，HI-JEPA AUC `0.908`，ESM-C 600M/6B 为 `0.606/0.514`，partner-count baseline `0.499`；interaction masked、n=3,427 时为 `0.926` 对 ESM-C 6B `0.575`。负例按 partner count 匹配，报告 12 次独立 negative draws，spread 最大 0.030。
2. **复合体补全**：325 个 held-out targets 中，13,447 候选的 Recall@100 为 `0.954 [0.929,0.975]`，complex-frequency floor 为 `0.514`；移除 pathway-annotation channel 后仍为 `0.917`。
3. **knockout partner recovery**：62 个 held-out targets 的 Recall@100 为 `0.640 [0.55,0.72]`；把 action 换成另一个蛋白后降到 `0.028 [0.00,0.07]`，partner-count 为 `0.190`，ESM-C 6B 为 `0.119`。这是比静态检索更强的 action-conditioning 控制。
4. **相同数据的 contrastive control**：navigation Recall@100 `0.748→0.847`、interaction AUC `0.859→0.910`、function `0.875→0.881`、cross-scale median rank `21→14`（右侧为 HI-JEPA）。但 contrastive control 使用 2,000 negatives per positive，“约 2,000× pair comparisons”与该采样设定是同一个事实，不能当成第二项独立效率证据。
5. **5xFAD planning**：planned trajectory 关闭 disease-to-healthy gap 的比例为 `0.844 [0.696,0.984]`，random 为 `0.345`、single action 为 `0.019`；计划选择 GluA2/GluA3/GluA4，region-level label permutation 1,000 次得到 `p=0.041`。但疾病轴由全部 17 regions 拟合并在同批数据上评分，4 只动物内的 regions 不独立，论文也主动承认这一点。
6. **通道消融**：移除 measured proximity 让 cross-scale median rank `14→68`，navigation `0.847→0.853`、within-scale dynamics `1164→1268` 基本不变；移除 perturbation channel 则让 dynamics `1164→2403`，cross-scale 维持 `14`。这支持两类信号的功能分工，但不能替代完整 architecture ablation。

[上述表格与实验均见 bioRxiv 官方 PDF](https://www.biorxiv.org/content/biorxiv/early/2026/08/17/2026.08.14.744901.full.pdf)

#### 相对已有工作的创新

1. 把 JEPA 的 target 从同一输入的另一视图改成关系图中实测邻居，尝试用同一 latent 串联分子、复合体、细胞和组织尺度。
2. 用真实 nanoscale proximity 作为不可由 sequence/structure 直接读取的输入通道，并做 proximity/perturbation 双向消融。
3. 除静态检索外，加入 wrong-action control、perturbation response 和 disease-goal planning。
4. 在相同图数据上提供 contrastive control，而不是只与输入通道不同的蛋白语言模型比较。

#### 事实、作者主张与本研究推断

- **论文事实**：固定 split 和未公开的 shipped checkpoint 上，互作、复合体补全、knockout、共定位与规划指标达到正文所列数值；proximity-channel ablation 只显著伤及 cross-scale retrieval。
- **作者主张**：跨尺度能力来自 measured proximity，而不是“只是看了更多数据”；该表示能用于常规 sequence/structure 缺少起点的疾病 target nomination。
- **本研究推断**：通道消融为“proximity 有独立信息”提供支持，但不能证明 headline 增益来自 JEPA objective，而非专有 acquisition、九通道图构建、readout 或未披露训练 recipe。Table 4 的 matched contrastive control 是 objective 归因的主要依据，但因实现和调参完全不可见，证据强度只能定为中低。
- **措辞纠偏**：模型预训练可以不使用 disease label，但 planning reward 明确由 5xFAD/WT 轴定义；“按 5xFAD 相对 WT 的 departure 排名”也需要组别身份。摘要中的“no disease label”不能扩展为整个下游流程没有疾病监督。

#### 局限、复现条件与潜在风险

1. **核心实现不可审计。** 论文主动隐藏架构、训练流程、采集细节、loss 权重、代码、权重和专有语料；无法独立复现或验证它是否符合标准 JEPA。
2. **能力选择与确认混在一起。** Barlow+DINO collapse objective 是按 Table 3 的同一 capabilities 选择，作者承认该表不是独立确认；缺真正 held-out model-selection benchmark。
3. **单一随机 protein split。** 只有 979 个 held-out proteins，未按 family/pathway/degree 分层；虽然有 family-removal 补充检查，仍没有多个 split 的方差。
4. **规划样本层级过小。** 17 regions 只来自 4 只 mice；region permutation 不能替代 animal-level generalization，axis 又在同批 region 上拟合和评分。
5. **前瞻干预尚未验证。** 论文明确说 treatment 下的 forward transition 是 prospective prediction，human ExM encoder wet-lab validation 仍属未来工作。
6. **输入不匹配基线。** 序列模型无法读取 microscopy point cloud/proximity；论文自己承认这些比较衡量的是跨输入泛化，不是 ESM-C 的原生任务能力。
7. **proximal 不等于 binding。** 作者清楚区分 proximity-grounded 与 interaction-grounded，但 target nomination 若直接转成治疗结论仍有生物学和临床风险。
8. **无 compute 与外部复核。** 没有硬件、训练时长、seed 数或独立机构复现；工业专有环境下的强 headline 应等待开放基准。

#### 是否值得写成区别于追踪日报的原创技术博客

**有题材价值，但不建议写成能力发布稿；优先级中高、审计门槛高。** 可以写《当 JEPA 进入蛋白邻域：HI-JEPA 的跨尺度承诺与不可复现代价》，主线是“新测量通道确有价值”与“JEPA 归因仍未闭环”的分离。若想写成肯定式技术教程，应等待至少公开 benchmark split、derived evaluation data、objective 伪代码和 checkpoint；目前更适合作为开放科学与证据等级案例。

## 横向比较

| 维度 | SCALE | HI-JEPA |
|---|---|---|
| 今日状态 | 严格新增 | 严格新增 |
| 分类 | method direct-use | claimed direct-use / implementation-not-auditable |
| JEPA 接口 | action-conditioned future latent prediction + SIGReg | query protein 预测 measured-neighbor latent + 未披露 predictor |
| 下游 | 五项视觉 goal-conditioned planning | 蛋白关系、显微识别、扰动、疾病规划 |
| 最强归因证据 | matched LeWM/Aux + 3 solvers × 5 budgets | matched contrastive control + 通道消融 |
| 最强结果 | iCEM Two-Room `82.9→92.9`；15/15 solver 平均改善 | 双蛋白 held-out AUC `0.908 vs 0.514`；KO Recall@100 `0.640` |
| 最重要反例 | Push-T Aux 更高；两项导航 DINO-WM 更高 | 规划用 disease/control axis；架构与训练完全不可见 |
| 监督代价 | task-specific simulator state | 专有 proximity/curated multi-channel graph |
| 复现性 | 中低：有公式/超参，无代码与 multiseed | 很低：作者明确不公开核心实现与语料 |
| 原创博客价值 | 高：方法论清晰 | 中高：适合证据审计，不适合复现教程 |

两篇看似跨度极大，实际共同改变了 JEPA 的“预测接口”：SCALE 决定哪些状态差异应进入 planner metric，HI-JEPA 决定哪些关系可作为 target neighbor。它们都说明 **JEPA 的价值不能只由“有没有 latent prediction”判断，而要审计 target 的定义、监督从哪里来，以及下游真正读取哪一种几何。**

## 值得继续追的问题

1. SCALE 若只在 planner 侧学习 Mahalanobis/goal-cost head、不改 encoder，能否达到相同规划增益？
2. SCALE 在 3–5 个独立训练 seed、噪声/缺失 simulator state 和真实机器人上是否仍保持 15/15 task–solver 平均优势？
3. state selection 是否可以从任务数据学习，而不是人工选择 2–6 个 privileged variables？
4. rollout ranking 的改善是否能预测每个 task/solver 的 success gain，还是只在某些几何环境相关？
5. HI-JEPA 能否公开 objective 伪代码、split、derived benchmark 和一个只读 checkpoint，让 `claimed direct-use` 升级为可审计 direct-use？
6. HI-JEPA 的 matched contrastive control 是否真正匹配参数量、训练步数、超参搜索与 checkpoint-selection budget？
7. 以 animal 为独立单位、外部队列拟合 disease axis 后，GluA2/3/4 与 PSD-95 的规划方向是否仍稳定？
8. measured proximity 仅占 0.04% edges 时，跨尺度提升是由少量关键桥边、edge weight、sampling oversampling 还是 objective 产生？
9. proximity-grounded 候选经过 binding assay、细胞干预和体内验证后，precision/recall 与 false-positive burden 如何？
10. 后续重查 OpenAlex/Google Scholar 引用索引，确认今日两篇如何连接 I-JEPA、LeWM 与 V-JEPA world-model 谱系，避免索引时延造成漏报。

## 博客价值判断

### 当日追踪博客

应完整收录两篇：SCALE 是可核验的方法推进，HI-JEPA 是重要但证据等级特殊的跨领域落地。两者同日出现，最有价值的编辑线索不是“JEPA 又扩了两个场景”，而是 **一个用公开公式改变几何，一个用专有测量改变 target；下游效果都强烈依赖预测接口和监督来源。**

### 区别于追踪日报的原创博客

1. **优先写 SCALE，优先级高。** 题目可为《可解码不等于可规划：SCALE 如何重排 JEPA 的 latent geometry》。已有足够公式、对照、反例与轻量官方配图。
2. **HI-JEPA 只适合审计型文章，优先级中高。** 题目可为《HI-JEPA 的 0.908 AUC：新测量通道的价值，还是不可审计的能力报告？》。必须把 proximity-channel value、JEPA-objective attribution 与 disease-planning supervision 分成三条证据链。
3. **不把两篇合写成“JEPA 通吃规划与生物”。** 任务、数据和证据等级差异过大；合写只能围绕“预测接口与监督来源”这个方法论主题。

### 配图判断

本日采用 SCALE Figure 2 的 Push-T 官方子图：900×740、约 35.8 KiB，既能直接说明“完整 embedding 可解码不等于高方差子空间承载状态”，又明显小于两篇 PDF。HI-JEPA 的最佳内容图是 Figure 8 proximity/perturbation 双消融，但 bioRxiv 未提供稳定的独立图片 URL，官方 PDF 约 4.2 MiB；为保持只提交两份 Markdown 的发布边界，本日不复制本地图。

## 来源链接

### 严格增量与检索范围

- [arXiv JEPA 严格时间窗：唯一命中 SCALE](https://export.arxiv.org/api/query?search_query=%28all%3AJEPA%20OR%20all%3A%22joint-embedding%20predictive%22%20OR%20all%3A%22joint%20embedding%20predictive%22%29%20AND%20submittedDate%3A%5B202608170312%20TO%20202608180312%5D&start=0&max_results=100&sortBy=submittedDate&sortOrder=descending)
- [bioRxiv 2026-08-17 至 08-18 官方日期列表：JEPA 唯一命中 HI-JEPA](https://api.biorxiv.org/details/biorxiv/2026-08-17/2026-08-18/0)
- [medRxiv 2026-08-17 至 08-18 官方日期列表：无 JEPA 命中](https://api.biorxiv.org/details/medrxiv/2026-08-17/2026-08-18/0)
- [I-JEPA OpenAlex 日期引用链](https://api.openalex.org/works?filter=cites%3AW4386076428%2Cfrom_publication_date%3A2026-08-17&sort=publication_date%3Adesc&per-page=100)
- [V-JEPA OpenAlex 日期引用链](https://api.openalex.org/works?filter=cites%3AW4394861491%2Cfrom_publication_date%3A2026-08-17&sort=publication_date%3Adesc&per-page=100)
- [V-JEPA 2 OpenAlex 日期引用链](https://api.openalex.org/works?filter=cites%3AW4417261359%2Cfrom_publication_date%3A2026-08-17&sort=publication_date%3Adesc&per-page=100)

### SCALE 一手来源

- [arXiv 摘要与版本页](https://arxiv.org/abs/2608.16287)
- [arXiv 官方 HTML 全文](https://arxiv.org/html/2608.16287)
- [arXiv 官方 PDF](https://arxiv.org/pdf/2608.16287)
- [官方 Figure 2 Push-T 子图](https://arxiv.org/html/2608.16287v1/figures/fig_topk_pusht.png)

### HI-JEPA 一手来源

- [bioRxiv 官方记录](https://www.biorxiv.org/content/10.64898/2026.08.14.744901v1)
- [bioRxiv 官方 PDF](https://www.biorxiv.org/content/biorxiv/early/2026/08/17/2026.08.14.744901.full.pdf)
- [DOI：10.64898/2026.08.14.744901](https://doi.org/10.64898/2026.08.14.744901)
- [Crossref DOI 元数据](https://api.crossref.org/works/10.64898/2026.08.14.744901)

### 未纳入与排除说明

- **仅 related-work 引用者**：本轮严格窗口没有让“只在相关工作出现 JEPA、主体方法不用 JEPA”的论文占用名额。
- **索引时延回补候选**：[*Gaussian-JEPA*](https://arxiv.org/abs/2608.15651) 与 [*AlignJEPA*](https://arxiv.org/abs/2608.15456) 的 arXiv v1 分别标注提交于 2026-08-16 09:43:50 UTC 与 00:27:07 UTC，早于本轮有效起点；但上一轮检索时 arXiv 最新结果仍停在 8 月 14 日，本轮才在按更新时间排序的结果中看到二者。两篇都属于 actual-use（前者为 3D Gaussian latent prediction，后者使用冻结 AnySat JEPA backbone 并训练 text-target predictive adapter），保留为后续历史回补，不伪装成今日新投稿。
- **历史期刊候选**：*Sensor-specialized JEPA foundation models complement planetary-scale embeddings for agentic hydrologic reasoning*（DOI `10.1016/j.rsase.2026.102136`）在 Crossref 创建于 2026-07-01、8 月 6 日已 deposited；不属于今日新增，保留后续历史回补，不与两篇严格新增混写。
- **索引空结果不是否定证据**：OpenAlex 尚未收录今日两篇的核心引用关系，Semantic Scholar 查询触发 429；本轮以 arXiv、bioRxiv 和 DOI 原文闭环为准。
- **没有第三篇低质量补位**：今日已有两篇严格新增；未使用标题相似、未来期号、无正文或实现归属不清的条目凑数。
