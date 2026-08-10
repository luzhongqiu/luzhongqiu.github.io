---
title: JEPA 下游研究追踪 · 2026-08-10
date: 2026-08-10 10:00:00
categories:
  - JEPA研究追踪
tags:
  - JEPA
  - JEPA追踪
---

本文属于「JEPA追踪」系列，记录每日论文检索、原文核验与阶段性判断；它保留研究日志的证据密度，与经过主题化重写的原创博客区分。

# JEPA 下游研究追踪（2026-08-10）

> 检索截止：2026-08-10 11:28（Asia/Shanghai，约 03:28 UTC）
>
> 严格增量起点：2026-08-09T03:02:17.531Z
>
> 去重范围：`/Users/nic/.codex/automations/jepa/memory.md` 与 `research/jepa/` 全部既有记录、候选池和排除项。
>
> 证据口径：搜索与引用索引只用于发现；方法、实验和发表状态必须回到论文原文、官方项目/代码、会议页、arXiv、bioRxiv 或 DOI 元数据核验。无法取得全文时，只转述官方摘要明确披露的事实，并把证据缺口写入结论。

## 今日结论

1. **今日没有一篇同时满足“严格时间窗内出现、实际使用 JEPA、全文与逐表实验可闭环”的高可信新增论文，不以摘要补齐完整主解读。** arXiv 的精确提交窗口查询为 0；按 `lastUpdatedDate` 降序的 JEPA feed 最新更新仍是 2026-08-07 的 UniJEPA、触觉 VLA `τ` v3 与 PSG-JEPA，均早于上次运行。OpenAlex 对 I-JEPA、V-JEPA、V-JEPA 2 自 8 月 9 日起的引用项也均为 0。[arXiv 严格窗口](https://export.arxiv.org/api/query?search_query=submittedDate%3A%5B202608090302%20TO%20202608102359%5D%20AND%20all%3AJEPA&start=0&max_results=100&sortBy=submittedDate&sortOrder=descending) · [arXiv 按更新时间排序](https://export.arxiv.org/api/query?search_query=all%3AJEPA&start=0&max_results=100&sortBy=lastUpdatedDate&sortOrder=descending) · [I-JEPA 引用链](https://api.openalex.org/works?filter=cites%3AW4386076428%2Cfrom_publication_date%3A2026-08-09&sort=publication_date%3Adesc&per-page=100)
2. **严格窗口内发现一篇值得优先追、但尚未达到全文闭环门槛的 ProtJEPA。** bioRxiv 与 Crossref 均记录 *ProtJEPA: A Multimodal Joint-Embedding Predictive Architecture for Protein Biological World Modeling with Multi-Teacher Modality-Attentive Fusion* 于 2026-08-09 发布/创建，晚于严格起点。官方摘要明确描述 sequence-only student 预测十种生物模态的 joint embedding，并给出蛋白功能、酶类别、亚细胞定位、药物靶点和无序预测结果，因此不是 related-work-only。然而 bioRxiv HTML/XML/PDF 本轮持续返回 HTTP 429，Europe PMC 也标记 `inEPMC=N`、`hasPDF=N`，GitHub 官方仓库检索无结果；数据集名称、完整基线表、训练预算与复现细节不能原文核对，故今天将其登记为**严格新增、最高优先级待核验候选**，而不包装成高可信完整解读。[bioRxiv 官方记录](https://api.biorxiv.org/details/biorxiv/10.64898/2026.08.03.742606/na/json) · [Crossref 元数据](https://api.crossref.org/works/10.64898/2026.08.03.742606)
3. **arXiv feed 补出了两篇上次运行前已提交、但此前未被追踪记录覆盖的论文；它们只能算公告/可发现性回补。** PSG-JEPA（2026-08-07 04:44 UTC）证据较完整，实际改造 LeWM 式 JEPA 并进入 OGBench、LIBERO 和真机操作；UniJEPA（2026-08-07 16:55 UTC）同样实际训练 JEPA，但其“ICML 2026 接收”声明与官方论文列表冲突，结果协议和复现信息也不足。两者均不计入今日严格新增。[PSG-JEPA](https://arxiv.org/abs/2608.06799) · [UniJEPA](https://arxiv.org/abs/2608.07409)
4. **PSG-JEPA 是本轮最值得保留的下游证据，但不是无监督优势的纯比较。** 它与 LeWM 保持同一 encoder–predictor 骨干，在训练期用真实机器人 proprioception 和多时域关节角变化作辅助监督；部署时虽裁掉辅助 head，不增加推理成本，训练期却使用了 privileged physical state。它证明“物理状态可读性监督能让 JEPA latent 更易被 planner/policy 使用”，不能直接证明 forward-only JEPA 自己学到了这些物理变量。[论文原文](https://arxiv.org/pdf/2608.06799v1) · [官方项目页](https://haodong-yan.github.io/psg-jepa-project-page/)
5. **本日不新增本地图片文件。** 为满足配图可读性，下面只外链 PSG-JEPA 官方项目页的 method 图（约 262 KiB），明确标注它属于公告回补而非严格新增；页面限宽并 lazy-load，不扩大仓库写入范围。

## JEPA 方向最新进展

### 1. JEPA 正在从视觉 latent 扩展到“序列推断多模态生物知识”

ProtJEPA 的核心接口不是在推理时同时输入十种模态，而是用序列学生去预测由 sequence、structure、knowledge graph、protein interactions、literature、localization、tissue expression、GO function、anatomy 和 disorder 共同形成的教师目标。按官方摘要，部署时只需蛋白序列。这个设计把跨模态 JEPA 从“联合编码可同时获得的多模态输入”推进到“训练期 privileged teachers、部署期单模态 student”。[bioRxiv 官方摘要](https://api.biorxiv.org/details/biorxiv/10.64898/2026.08.03.742606/na/json)

摘要还把 target whitening 作为 load-bearing component：joint targets 的平均 cosine 从 `0.984` 降至 `0.086`，用于缓解目标各向异性与表示坍塌，而不再依赖 covariance regularization。若全文证实，这会形成与 EMA、SIGReg/VICReg、LeJEPA Gaussian regularizer 不同的防坍塌路线。不过当前只能确认作者报告，尚不能核对 whitening 的拟合范围、是否在 test/domain 数据上估计统计量，以及与更简单标准化基线的公平性。

### 2. PSG-JEPA 把 predictor 的问题从“未来可预测”改成“物理量可读”

PSG-JEPA 保留 LeWM 的 action-conditioned forward prediction 和 `SIGReg`，再加两类只在训练期存在的 head：单 latent 回归关节角、夹爪状态和末端位姿；任意时间跨度的 latent pair 回归 endpoint joint-angle change。与 action inverse dynamics 不同，后者使用固定维度的端点变化，而不是随 horizon 增长、且可能一对多的动作序列。[方法原文](https://arxiv.org/pdf/2608.06799v1)

这条路线与 8 月 7 日已经记录的 PhyLatent 相邻，但不是同一论文：PhyLatent 混合五类 physical objectives 并用于 MPC；PSG-JEPA 用较干净的同骨干对照，把 state readout、transition readout、冻结表示规划、policy fine-tuning 和真机操作串成三层证据链。两者共同提示：**global non-collapse 不等于 latent 对控制变量可识别。**

### 3. “统一 JEPA”命名必须同时审计方法和发表身份

arXiv:2608.07409 的 UniJEPA 声称把 photometric prediction 与 temporal prediction 放入共享 encoder/predictor，以 Gaussian regularizer 取代 EMA/stop-gradient，并在 action-conditioned post-training 后做视觉目标规划。论文/摘要还声称 “Accepted by ICML 2026”，PDF 自列为 PMLR 306。

但 ICML 2026 官方完整 paper list 只命中另一篇题目为 *UniJEPA: Enhancing Robot Policy via Unified Continuous and Discrete Representation Learning* 的论文（poster 63426），作者与 arXiv 候选完全不同；PMLR `v306` 入口当前也不存在。因而本记录只把“接收”写作**作者/arXiv 声明，未获官方列表确认**。[ICML 2026 官方论文列表](https://icml.cc/virtual/2026/papers.html) · [官方列表中的另一篇 UniJEPA](https://icml.cc/virtual/2026/poster/63426) · [arXiv 候选](https://arxiv.org/abs/2608.07409)

### 4. 今日没有新的 A-JEPA / 音频 direct-use 证据

本轮覆盖 arXiv 的 JEPA 泛词、完整术语、I-JEPA/V-JEPA/A-JEPA 家族，I-JEPA/V-JEPA/V-JEPA 2 引用链，Crossref 新 DOI，以及 bioRxiv/medRxiv 8 月 9–10 日窗口。严格窗口内唯一新增线索是蛋白 ProtJEPA；没有可由一手全文确认的 A-JEPA/音频新稿。

## 新增下游论文解读

### 1. ProtJEPA：严格新增，但全文未闭环，不升格为高可信完整主解读

**完整题目**：*ProtJEPA: A Multimodal Joint-Embedding Predictive Architecture for Protein Biological World Modeling with Multi-Teacher Modality-Attentive Fusion*

**作者与机构**：Vaibhava Lakshmi Ravideshik、Jinha Kim、Manolis Kellis；Crossref 为三位作者都登记 Massachusetts Institute of Technology。

**时间与出处**：bioRxiv v1，posted/published/created 为 2026-08-09；预印本，CC BY-NC 4.0。[Crossref](https://api.crossref.org/works/10.64898/2026.08.03.742606)

**证据状态**：官方摘要和 DOI 元数据可访问；全文端点本轮持续 429，无官方代码/权重入口。因此下述数字均严格限定为“官方摘要报告”，不推断摘要未披露的表格细节。

#### 它如何衔接 JEPA（官方摘要事实）

- sequence-only student 预测十种生物模态的 joint embeddings；推理只需 sequence；
- 训练目标包含 target whitening，将 joint targets 的 mean cosine 从 `0.984` 调整到 `0.086`，作者称其可避免 collapse，且无需 covariance regularization；
- 摘要称 Phase 1 aggregator pretraining 与 target whitening 的消融都显示为必要组件。

这是实际 latent-target prediction，不是只在背景引用 JEPA。不过摘要没有说明 teacher 是否冻结/EMA、各模态 teacher 的具体模型、predictor 结构、损失、masking、训练语料规模及 whitening 统计量的估计范围，不能据名字自动等同于 I-JEPA、V-JEPA 或 LeJEPA 管线。

#### 下游场景、数据、指标、基线与结果

**可核验事实/作者报告**：

- 核心测试包含 `1,828` 个 held-out dark proteins，且与训练集在 primary Pfam family 上零重叠；
- zero-shot GO retrieval：`Hit@10 = 58.07%`，相对摘要中的比较对象 `+2.80 pp`，`p=0.020`；
- enzyme class accuracy：`69.99%`，`+9.64 pp`，`p<0.001`；
- 1% 标签亚细胞定位：相对比较对象 `+11.87 pp`，`p<0.001`；
- 摘要称在 relational modalities 缺失的 dark-protein 部署设置中优于“剩余模态 naive concatenation”；
- drug–target interaction 与 disorder prediction 被用于跨域迁移，摘要称六个独立任务都复现 `T1-only < ESMC < ProtJEPA` 排序。

**仍不可核验**：摘要没有给出训练/验证数据集名称与样本规模、GO ontology 分支、Hit@10 候选库、enzyme/localization 的类别与 split、六项任务逐项数字、主基线完整名称/版本、误差条、训练 seed、统计检验方法、多重比较校正、参数量、算力和代码。`+2.80/+9.64/+11.87 pp` 的具体参照行也不能从摘要唯一确定。

#### 创新、局限与潜在风险

- **事实**：它把多模态知识压入 sequence-only student，并用 family-disjoint 的 dark-protein 集合测试，任务比单一蛋白分类更广。
- **作者主张**：target whitening 和 aggregator pretraining 都是必要组件；ProtJEPA 在未直接作为训练模态的下游也能迁移。
- **本研究推断**：若全文结果成立，最有价值的不是“蛋白 JEPA 又涨点”，而是 **privileged multimodal teacher 能否形成单序列部署接口**。这与临床多模态蒸馏、传感器缺失和低成本推理都有共性。
- **归因风险**：收益可能同时来自十种 teacher 的知识、aggregator capacity、whitening、数据规模与 JEPA loss；没有全文中的 matched distillation/contrastive/reconstruction baseline，不能把全部增益归给 JEPA。
- **数据泄漏风险**：primary Pfam family 零重叠不自动排除 sequence homology、GO evidence、知识图谱边、文献文本或结构数据库的跨 split 泄漏；多模态 teacher 的数据时间截点尤其关键。
- **部署风险**：训练时需要十种模态，可能带来受限数据库许可、缺失模态偏差和高昂预计算成本；“推理只用序列”不等于训练可低成本复现。
- **复现风险**：本轮无全文、代码、checkpoint 或可重建 manifest，今天不能把摘要数字升级为高可信逐表证据。

#### 博客价值

**潜在很高，但现在不应单独写原创技术博客。** 取得全文后可写“让十种生物知识教会一个序列模型：ProtJEPA 的 privileged-teacher 路线”，重点审计 family/homology/knowledge leakage 与 whitening 对照。今天更适合留在追踪日报，避免用摘要完成一篇看似完整的论文解读。

### 2. PSG-JEPA：公告/可发现性回补，不计今日严格新增

**完整题目**：*Is Forward Prediction Enough? Physical State Grounding for JEPA World Models*

**作者与机构**：Haodong Yan、Jiaguan Zhu、Mingyuan Jia、Ruiqing Yin、Junjie He、Zhide Zhong、Junfeng Li、Jinxuan Lu、Hengtao Li、Tianran Zhang、Jiayi Chen、Wenxuan Song、Wen Chen、Yuxiang Gao、Haoang Li；The Hong Kong University of Science and Technology (Guangzhou)、COCOMatrix。

**时间与出处**：arXiv:2608.06799 v1，2026-08-07 04:44:16 UTC；预印本，未见会议接收声明。官方项目页的 arXiv/code 按钮仍为 `coming soon`，没有可核验代码仓。[arXiv](https://arxiv.org/abs/2608.06799) · [项目页](https://haodong-yan.github.io/psg-jepa-project-page/)

#### JEPA 衔接方式

它保留 LeWM 的 end-to-end encoder、causal action-conditioned predictor、forward latent MSE 与 `SIGReg`（权重 `0.09`），在 `T=4` 帧训练窗口上新增：

1. state head：从每个 latent 回归 joint angles、gripper state、end-effector pose；
2. transition head：从所有合法 endpoint latent pairs 回归 `k=1,2,3` 的 joint-angle change；
3. grounding 总权重 `0.1`；训练后裁掉两种 head。

因此它是对 JEPA 训练目标的直接改造。需要强调：proprioception 和 joint-angle change 是训练期真实物理标签，方法虽然没有下游任务标签、部署也不额外输入状态，但不属于纯 observation-only 自监督。

<figure>
  <img src="https://haodong-yan.github.io/psg-jepa-project-page/assets/fig-method.png" alt="PSG-JEPA 训练期状态与多时域转移 grounding 架构" loading="lazy" style="max-width:820px;width:100%;height:auto;">
  <figcaption>PSG-JEPA 官方方法图。辅助 state/transition heads 只在训练期存在；本论文是公告回补，不计 2026-08-10 严格新增。来源：作者官方项目页。</figcaption>
</figure>

#### 数据、任务、指标与基线（原文事实）

- 表征探针：OGBench-Cube，episode-level train/test split；线性 ridge 与浅层 MLP，用 Pearson `r` 测 proprioception、velocity 和 action 可恢复性；
- 冻结表示规划：OGBench-Cube 与 OGBench-Scene；相同 GC-IDM 三层 MLP planner，200 个目标实例，改变 planner epoch 与 demonstration fraction；三 planner seeds；
- policy learning：LIBERO-Goal 10 任务，OFT action head，30 epochs、三 seeds，每任务/seed 50 rollouts；encoder 会共同 fine-tune；
- 真机：Mobile ALOHA 风格双臂 Cobot、三摄像头，Place-to-Bread、Place-to-Plate、Pour-Water；每任务 100 条 teleoperation demonstrations、50 次测试；
- 主要基线：同骨干 forward-only LeWM、作者构造的一步 inverse-dynamics `LeWMActionIDM`、冻结或同协议微调的 DINOv2。

#### 关键实验结果（作者报告）

- OGBench-Cube 单 latent 的 EE-yaw linear/MLP `r`：LeWM `0.08/0.08`，PSG-JEPA `0.94/0.98`；joint position linear `0.71→0.83`；
- OGBench-Cube、full data、仅 5 planner epochs：LeWM `80.7±1.9%`，PSG-JEPA `95.0±0.7%`；100 epochs 时 `89.7±0.2%` vs `98.7±1.2%`；
- OGBench-Scene、full data、5 epochs：`76.2±1.2%` vs `83.5±2.4%`；
- recursive open-loop latent MSE 在 30 model steps：Cube `0.1488→0.0485`，Scene `0.1608→0.0982`；
- LIBERO-Goal policy success：LeWM `77.7±0.5%`、LeWMActionIDM `82.6±2.2%`、DINOv2 `80.1±5.3%`、PSG-JEPA `85.3±3.9%`；
- 真机三任务：`84/74/80%`，LeWM 为 `62/58/60%`，宏平均 `79.3% vs 60.0%`；
- 组件消融显示 transition grounding 对 5-epoch Cube planning 最关键（full `95.0`，去掉后 `81.3`），state grounding 对 state probe 最关键（mean linear `0.94`，去掉后 `0.69`）。

#### 事实、作者主张与本研究推断

- **事实**：最干净的归因是 PSG-JEPA 与 LeWM 共用骨干，只增加训练期 grounding；三层评测都报告正增益，且对 `LeWMActionIDM` 的比较说明动作可读性本身不完全等价于物理状态可读性。
- **作者主张**：forward prediction 不足以让 robot-centric state/state change 可靠可识别，grounding 提高 planner/policy 的样本与优化效率而不增加部署成本。
- **本研究推断**：论文真正证明的是“**显式物理辅助监督能把 JEPA latent 改造成更好的控制接口**”，不是“JEPA 自发发现了物理”。其工程价值类似训练期 depth/tactile/state teacher，部署时蒸馏进视觉 encoder。

#### 局限、复现条件与风险

- privileged proprioception 使其与 forward-only JEPA 的监督量不同；还缺相同标签下的 multi-task encoder、contrastive/state-distillation、non-JEPA dynamics matched baselines；
- probe target 与训练 grounding target 高度重合，`r` 的巨大提升主要验证目标被写入 latent，不能独立证明通用物理理解；
- policy 阶段 fine-tune encoder，最终收益不再是纯 frozen-representation comparison；
- real-robot 只有三任务、单平台、每任务 50 trials，没有随机种子/置信区间、失败类型与 unseen scene/object 协议；
- OGBench 与 LIBERO 都是受控机器人基准，没有接触力、传感器域偏移、遮挡/相机移动和安全约束的系统压力测试；
- 原文没有给出足以复建预训练的完整数据量、优化器、学习率、硬件与耗时；项目页 code 仍 `coming soon`，复现风险高；
- 三 seed 下 LIBERO 的 `85.3±3.9` 与 `82.6±2.2` 差距未附显著性检验，不能写成稳定全面碾压。

#### 博客价值

**高，值得区别于追踪日报做主题化原创博客，但应等代码或更完整复现实验。** 推荐角度：《只会预测未来还不够：为什么 JEPA latent 需要把机器人状态“写进去”》。文章主轴应是 self-supervision 与 privileged grounding 的边界，而不是简单复述 `79.3 vs 60.0`。

### 未纳入主解读的候选

| 候选 | 实际使用判断 | 未纳入原因 | 后续动作 |
|---|---|---|---|
| UniJEPA: A Unified Joint-Embedding Predictive Architecture for Task-Agnostic Visual World Modeling | 实际训练 photometric + temporal + action-conditioned JEPA；不是 related-work-only | v1 早于严格起点；ICML/PMLR 声明未获官方列表确认；论文只固定一个 seed，控制数据集和训练预算披露不足，无代码；多行 leaderboard 跨 backbone/规模/协议 | 等官方会议记录、代码、数据 manifest、multi-seed 与 matched IWM/V-JEPA/LeWM 对照；当前不采用其 `44×` 等 headline 作高可信结论 |
| Hō‘ike: A Joint-Embedding Predictive Architecture for Transcriptome Data Generation with Diffusion Models | 官方摘要提出 cross-domain JEPA + latent diffusion，目标是 normal→condition bulk transcriptome generation | bioRxiv date 为 2026-08-05，早于严格起点；摘要自称 technical specification/evaluation protocol，没有定量结果、基线或已验证结论；全文同受 429 影响 | 等完整实验、代码和 TCGA/GTEx split 审计；不把技术规格写成下游突破 |
| PSG-JEPA | 实际使用并已完成全文审计 | v1 为 8 月 7 日，只是今日首次可见/补捞，不计严格新增 | 保留为高价值历史回补与原创博客候选 |
| ProtJEPA | 摘要已确认 actual use；严格新增 | 全文/代码未闭环，不能完成用户要求的逐表审计 | 下一轮第一优先级重试 XML/PDF、作者仓库、数据/模型卡 |

## 横向比较

| 维度 | ProtJEPA | PSG-JEPA | UniJEPA | Hō‘ike |
|---|---|---|---|---|
| 时间身份 | **严格新增（8 月 9 日）** | 8 月 7 日公告回补 | 8 月 7 日公告回补 | 8 月 5 日历史候选 |
| JEPA 使用 | 十模态 teacher target → sequence student | LeWM forward JEPA + state/transition grounding | photometric + temporal shared JEPA | cross-domain JEPA + diffusion blueprint |
| 下游 | GO retrieval、enzyme、localization、DTI、disorder | probe、OGBench planning、LIBERO、真机 | ImageNet、视频理解、离线控制 | condition-specific transcriptome generation |
| 当前最强证据 | 官方摘要给 family-disjoint 与三组显著性数字 | 同骨干 LeWM 对照 + 三层评测 | arXiv 论文内部表格 | 官方摘要仅描述协议 |
| 最大风险 | 全文/代码不可得，知识模态泄漏与归因不可审 | privileged state 监督、代码未开、真机范围小 | 会议身份冲突、单 seed、协议不透明 | 无定量实证 |
| 今日处理 | 严格新增待核验，不升格完整主解读 | 完整回补解读，不冒充新增 | 排除出高可信主稿 | 排除出实证主稿 |

本轮最重要的横向判断是：**“严格新增”与“高可信可闭环”是两道独立门槛。** ProtJEPA 过了日期和 actual-use 门槛，但尚未过全文/复现门槛；PSG-JEPA 过了方法和实验门槛，却不属于严格时间增量。把两者的身份明确分开，比凑出一篇“今日重磅论文”更可靠。

## 值得继续追的问题

1. **ProtJEPA 的十种 teacher 具体是什么、如何构建 joint target？** 需要核对各 teacher checkpoint、训练语料、modality-attentive fusion、学生 predictor、损失和 target whitening 的 fit/transform 边界。
2. **ProtJEPA 的 dark-protein split 是否真正抵抗知识泄漏？** 除 primary Pfam family 外，应审计 sequence identity、结构相似性、GO/STRING/UniProt/文献边、发布日期和 teacher 预训练重叠。
3. **ProtJEPA 的收益来自 JEPA 还是多教师蒸馏？** 需要同 teacher、同 student、同数据下对比 latent MSE、contrastive alignment、logit/feature distillation、naive concatenation、单 teacher 与重建目标。
4. **PSG-JEPA 的 privileged labels 最少需要多少？** 应做 proprioception fraction、噪声、missing joints、跨本体和状态估计误差曲线，确认训练期传感器依赖是否可接受。
5. **PSG-JEPA 在真正冻结 encoder 的 policy learning中是否仍领先？** 当前 LIBERO 会共同 fine-tune encoder；应补 frozen linear/action head、跨机器人 embodiment 和 unseen camera/site 迁移。
6. **UniJEPA 的发表身份与数字能否复核？** 等 ICML/PMLR 官方记录、代码和数据 manifest；在此之前不要引用“Accepted”或 `44×` 为已独立验证事实。
7. **公告延迟怎样进入自动化去重？** 后续除 v1/updated 时间外，记录“API 首次可见时间”；回补可以深读，但必须继续与严格新增分栏。

## 博客价值判断

### 当日追踪博客

**应按系列规则发布。** 首要标题结论应是“没有可全文闭环的高可信新增”，同时突出 ProtJEPA 是严格新增待核验、PSG-JEPA 是公告回补。这样既不会漏掉当天真正出现的蛋白方向，也不会把摘要或旧稿冒充完整新证据。

### 区别于追踪日报的原创博客

- **ProtJEPA：潜在最高价值，但需等待全文。** 值得写“十种生物知识如何压进一个 sequence-only JEPA”，前提是先完成数据泄漏、teacher 和 baseline 审计。
- **PSG-JEPA：现在已具备主题博客骨架。** 最佳观点是“predictable latent 不等于 controllable latent”，但必须把 privileged state supervision 放在标题级边界中；等代码后再成文更稳妥。
- **UniJEPA：当前不值得写原创博客。** 会议身份与复现协议未解决前，最多作为“如何核验发表声明和 leaderboard”案例。
- **今日不自行创建主题化原创博客。** 本记录只服务「JEPA追踪」系列。

### 配图判断

只外链 PSG-JEPA 官方 method 图，约 262 KiB，页面限宽 820px 并 lazy-load；不下载图片副本、不新增第三个仓库文件。ProtJEPA 当前无法取得可核验的官方图 URL/编号，因此不用索引图片替代论文图。

## 来源链接

### 严格增量与引用链

- [arXiv：JEPA 严格提交窗口](https://export.arxiv.org/api/query?search_query=submittedDate%3A%5B202608090302%20TO%20202608102359%5D%20AND%20all%3AJEPA&start=0&max_results=100&sortBy=submittedDate&sortOrder=descending)
- [arXiv：JEPA 按 lastUpdatedDate 降序](https://export.arxiv.org/api/query?search_query=all%3AJEPA&start=0&max_results=100&sortBy=lastUpdatedDate&sortOrder=descending)
- OpenAlex：[I-JEPA citing works](https://api.openalex.org/works?filter=cites%3AW4386076428%2Cfrom_publication_date%3A2026-08-09&sort=publication_date%3Adesc&per-page=100) · [V-JEPA citing works](https://api.openalex.org/works?filter=cites%3AW4394861491%2Cfrom_publication_date%3A2026-08-09&sort=publication_date%3Adesc&per-page=100) · [V-JEPA 2 citing works](https://api.openalex.org/works?filter=cites%3AW4417261359%2Cfrom_publication_date%3A2026-08-09&sort=publication_date%3Adesc&per-page=100)
- bioRxiv：[2026-08-09 至 2026-08-10 官方列表](https://api.biorxiv.org/details/biorxiv/2026-08-09/2026-08-10/0/json) · [medRxiv 同期列表](https://api.biorxiv.org/details/medrxiv/2026-08-09/2026-08-10/0/json)

### 严格新增候选 ProtJEPA

- [bioRxiv 官方记录与摘要](https://api.biorxiv.org/details/biorxiv/10.64898/2026.08.03.742606/na/json)
- [Crossref DOI 元数据与官方摘要](https://api.crossref.org/works/10.64898/2026.08.03.742606)
- [DOI 入口](https://doi.org/10.64898/2026.08.03.742606)
- [Europe PMC 元数据](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI%3A10.64898%2F2026.08.03.742606&format=json)

### 公告回补 PSG-JEPA

- [arXiv 摘要与提交历史](https://arxiv.org/abs/2608.06799)
- [arXiv 官方 PDF](https://arxiv.org/pdf/2608.06799v1)
- [作者官方项目页](https://haodong-yan.github.io/psg-jepa-project-page/)
- [官方 method 图](https://haodong-yan.github.io/psg-jepa-project-page/assets/fig-method.png)

### 排除与待核验项

- UniJEPA：[arXiv 摘要与提交历史](https://arxiv.org/abs/2608.07409) · [PDF](https://arxiv.org/pdf/2608.07409v1) · [ICML 2026 官方论文列表](https://icml.cc/virtual/2026/papers.html) · [官方列表中的另一篇 UniJEPA](https://icml.cc/virtual/2026/poster/63426)
- Hō‘ike：[bioRxiv 官方摘要](https://api.biorxiv.org/details/biorxiv/10.64898/2026.08.03.741845/na/json) · [DOI](https://doi.org/10.64898/2026.08.03.741845)
