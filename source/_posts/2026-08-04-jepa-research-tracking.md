---
title: JEPA 下游研究追踪 · 2026-08-04
date: 2026-08-04 10:00:00
categories:
  - JEPA研究追踪
tags:
  - JEPA
  - JEPA追踪
---

> 本文属于「JEPA追踪」系列，记录每日论文检索、原文核验与阶段性判断；它保留研究日志的证据密度，与经过主题化重写的原创博客区分。

# JEPA 下游研究追踪（2026-08-04）

> 检索窗口：以自动化上次运行时间 `2026-08-03T03:02:01.537Z` 为严格增量起点，检索至 2026-08-04 本次运行。
>
> 去重范围：automation memory，以及 `research/jepa/` 中全部既有记录。Auto-JEPA、MoRAE、Physics-Aligned SSL、CS-JEPA、DynaWM、seq-JEPA、TC-LeWM、JEPADepth、Rad-JEPA 3D、Temporal-Distance JEPA、INTACT 等已解读论文不重复汇报。
>
> 发现与核验范围：按最新排序检索 arXiv 中 `JEPA`、`joint-embedding predictive architecture`、`I-JEPA`、`V-JEPA`、`A-JEPA`、`LeWM` 等关键词，并用 OpenAlex 的 2026-08-03 至 2026-08-04 日期窗口补查非 arXiv 来源。索引只用于发现；题目、提交时间、方法、数据、实验数字和代码状态均回到 arXiv 原文、作者官方仓库或 DOI 落地页核验。
>
> 纳入标准：必须实际复用、改造或直接评估 JEPA，并进入明确下游任务。只在 related work 中引用 JEPA、只使用“latent prediction”措辞、没有足够一手实验支撑，或无法区分 JEPA 组件与完整系统成绩的候选不计入主解读。
>
> 时间口径：LeDXA 与 ProWorld 分别于 2026-08-03 13:33:04 UTC、08:59:22 UTC 提交，严格晚于上次截止；*Asleep at the Wheel* 于 2026-08-02 15:57:40 UTC 提交，早于截止约 11 小时，但在上次运行时尚未进入 arXiv 公告排序，本日作为“首次纳入的回补”，不写成截止后投稿。

## 今日结论

1. **严格时间窗内有两篇高可信下游新增，另回补一篇很有价值的负结果。** [LeDXA](https://arxiv.org/abs/2608.02208) 用 LeJEPA 从头训练 DXA 专用表征，进入跨队列疾病、发病风险、生物年龄和遗传分析；[ProWorld](https://arxiv.org/abs/2608.01926) 改造 LeWM 式动作条件 JEPA，用双曲进度几何做四项视觉目标到达；[Asleep at the Wheel](https://arxiv.org/abs/2608.01336) 则直接把冻结 V-JEPA 2 用于驾驶视频分诊，证明一个看似很强的 `0.89 AP` 实际主要来自数据集域偏移。
2. **LeDXA 是今日临床覆盖最广、复现材料最完整的新增。** 冻结表征在外部 UK Biobank 上做纵向 Cox 分析，髋关节病 C-index 为 `0.758`，高于扫描仪表格特征的 `0.633`；膝关节病为 `0.744 vs 0.677`，2 型糖尿病为 `0.753 vs 0.721`。[论文原文](https://arxiv.org/pdf/2608.02208#page=9)
3. **但 LeDXA 的成绩不能被解释为“LeJEPA objective 已被证明优于其他医学自监督目标”。** 它与 DINOv3、扫描仪表格特征和人口学协变量比较，却没有在相同 HPP 数据、相同 ViT-S/16 和相同训练预算下对照 MAE、I-JEPA、DINO 或监督从头训练。最强事实是“LeJEPA 训练出的 DXA 专用小模型有效”，不是“收益已被单独归因给 LeJEPA”。
4. **ProWorld 把 JEPA latent 从局部状态预测器推进成显式的长时规划代价。** 相对 LeWM，四项成功率分别从 `83.33→94.00`、`71.33→77.33`、`22.00→32.00`、`57.33→69.33`，平均绝对提升 `9.67` 个百分点；三项训练损失和规划代价均有组件消融。[主结果 Table 1](https://arxiv.org/html/2608.01926v1#Sx4.T1)
5. **ProWorld 的进步也并非“换成双曲空间”一个因素造成。** 它同时加入 batch 内负例的 Lorentz contrastive loss、目标锚定 entailment cone，以及 terminal/best/mean 三项规划代价。Cube-S 上换回欧氏空间是 `68%`，完整模型 `78%`；去掉 contrastive loss 则降到 `46%`。因此完整收益来自几何、可分性约束和规划器三者共同作用。[消融 Tables 2–3](https://arxiv.org/html/2608.01926v1#Sx4.T3)
6. **驾驶视频分诊论文给出今天最重要的评测警告。** 同一个 V-JEPA 2 checkpoint 在“外部数据多为正例、nuScenes 为负例”的跨数据集池上 `AP=0.89`，换成同源 nuScenes 公平测试后只有 `0.288`，接近正例率 `0.241`；监督线性头在同一冻结特征上却有 `0.499 AP`。失败发生在“用 masked prediction residual 抽取 review value”，而不是 V-JEPA 2 表征完全没有相关信息。[完整指标 Table 2](https://arxiv.org/html/2608.01336v1#S5.T2)
7. **今天的共同判断是：JEPA 进入真实下游以后，评价协议比“是否用了 latent prediction”更决定结论强度。** LeDXA 需要同数据同骨干 objective 对照；ProWorld 需要拆分表示几何与规划代价；视频分诊则必须让标签与数据来源解耦。三篇共同反对把完整系统 headline 简化为“JEPA 带来 X 点提升”。

| 论文 | JEPA 使用方式 | 下游任务 | 最强证据 | 主要边界 |
|---|---|---|---|---|
| LeDXA | 从头训练 LeJEPA：多视图全局质心预测 + SIGReg | DXA 疾病/生物标志物、发病风险、生物年龄、GWAS | HPP probe 按受试者隔离 + UKBB 外部；代码与聚合表公开 | HPP probe 图像已进入无标签预训练；无 matched SSL objective；数据受控、无 checkpoint release |
| ProWorld | 从头训练 LeWM 式动作条件 predictor；增加 Lorentz 预测、对比、进度 cone 与规划代价 | PushT、Cube-S、AntMaze-L、Scene 视觉目标到达 | 三训练 seed；统一数据/规划预算；多项组件与几何消融 | 无代码；评测 episode 数未披露；进度用时间顺序代理；仅仿真 |
| Asleep at the Wheel | 冻结 V-JEPA 2 ViT-L；训练 masked-embedding predictor，以 residual 作新颖度 | 自动驾驶视频人工审核分诊 | 同 checkpoint 跨域/同域对照；监督 probe；no-training baselines；5 seeds | 公平测试仅 83 clips/20 positives；mean pooling；单 encoder/单 masking 设计 |

<figure>
  <img src="https://raw.githubusercontent.com/GilSasson1/LeDXA/main/assets/readme/model_and_applications.png" alt="LeDXA 的多视图 LeJEPA 预训练与跨队列下游分析" style="display:block;max-width:820px;width:100%;height:auto;margin:0 auto;" loading="lazy">
  <figcaption>LeDXA 官方仓库的模型与应用总览：从 HPP 无标签 DXA 预训练，到跨队列疾病、发病风险、生物年龄与遗传分析。原图 1557×833、约 249 KiB；本文仅外链并限制显示宽度、启用 lazy loading，不在仓库保存副本。</figcaption>
</figure>

## JEPA 方向最新进展

### 1. 严格新增从“表征是否可迁移”继续走向“下游接口是否可审计”

LeDXA 和 ProWorld 虽然都属于 JEPA 谱系，但使用方式已经明显分化：

- **域专用基础表征**：LeDXA 使用 LeJEPA 的 multi-view centroid prediction 与 SIGReg，不采用 I-JEPA 的 context-target block masking，也没有 EMA target encoder；训练后冻结 ViT 表征，再用线性/生存模型服务多个医学任务。[LeDXA 方法与配置](https://arxiv.org/pdf/2608.02208#page=16)
- **动作条件世界模型**：ProWorld 保留 LeWM 的状态 encoder、动作 encoder、一步 latent predictor 与 SIGReg，在其上加入双曲 future discrimination、goal-conditioned entailment cone 和 CEM 规划代价。[ProWorld 方法](https://arxiv.org/html/2608.01926v1#Sx4)
- **下游误差分数审计**：Asleep at the Wheel 不重新训练 V-JEPA 2 encoder，而是验证“prediction residual 能否作为 review-value score”。结果说明表征可线性读出，并不保证无监督 residual 排序就会读出正确属性。[方法与评分定义](https://arxiv.org/html/2608.01336v1#S3)

这三种路线分别回答“能否学到通用域内信号”“能否让 latent 支持动作规划”“能否用预测误差发现异常”，不能用同一个“JEPA 有效”结论互相替代。

### 2. 严格区分实际使用与 related-work 引用

本日三篇均属于**实际复用、改造或直接评估**：

- LeDXA 的训练 objective 就是 LeJEPA；
- ProWorld 的预测与规划 pipeline 从 LeWM 式 JEPA 世界模型出发，并在同一 pipeline 中改造表示几何；
- Asleep at the Wheel 使用公开 V-JEPA 2 权重产出 embedding target，并训练实际用于分诊排序的 predictor。

相反，仅在引言中把 JEPA 当世界模型背景、没有 encoder/predictor/loss/checkpoint 进入方法与实验的结果，仍不纳入。

### 3. 严格时间窗还命中一篇 Research Square 稿件，但不纳入主解读

[Training-Time Regularization for Inference-Time Monitoring—A Unified Framework for Self-Supervised World Models](https://doi.org/10.21203/rs.3.rs-10545715/v1) 于 2026-08-03 posted，提出 TR-SIGReg、TRIM-Monitor 与 TRIM-Replan，并声称 LIBERO 四套件平均成功率 `73.6%`、结构扰动下比 VLA-Corrector 高 `19.0` 个百分点。

它不是 related-work 引用；论文确实宣称修改官方 LeWM 并用于 LIBERO。但本日不把它计入高可信新增，原因是：

1. 正文没有代码/权重/实验仓库链接，也没有训练超参数、训练 seed、置信区间或硬件资源；
2. “标准 LIBERO”主表、扰动表和消融表之间的 clean 成功率分别约 `73.6%` 与 `91.8%`，但没有解释样本、任务或 checkpoint 如何切换；
3. 扰动类型、强度、VLA-Corrector 适配与“100 episodes per suite”细节不足以重建协议；
4. `73.6%` 与本系列 2026-07-30 已核验的 TC-LeWM suite-wise 10-task headline 数字完全相同，稿件却把 TC-SIGReg 写成 `60.7%`，在没有实现和逐任务表时无法排除协议混用；
5. “精确卡方校准”“反坍塌保证”和 variational free-energy 连接主要以断言给出，正文没有足以审计适用条件的定理证明。

因此它作为**高风险待核验候选**留档，而不是用不完整实验凑第三篇严格新增。

### 4. 其余实际使用候选进入下一轮，而不是被误判为低质量引用

- [FactorJEPA](https://arxiv.org/abs/2608.01049) 实际在 V-JEPA 2.1 1B/2B backbone 上分解 layout/entity/interaction channel，并发布 DENSEWORLD-115k 与 surgery checkpoint；但 headline 仍以 future-latent、causal-L1、mask-slope 等内部表征指标为主，具体闭环规划或策略下游尚需逐表审计。
- [HP-JEPA](https://arxiv.org/abs/2608.00491) 实际训练 multi-resolution Graph-JEPA，并在 7 个图分类与 1 个图回归任务上评估；提交早于窗口，保留为历史回补候选。
- [EEG-JEPA](https://arxiv.org/abs/2608.00114) 实际使用 EMA target、结构化 electrode-time masking 与多层 target supervision，在 EEG-FM-Bench 评估 14 项冻结迁移和 9 项微调；证据规模较大，下一轮优先深读数据泄漏、预训练 corpus 与 matched baseline。

## 新增下游论文解读

### 1. Self-supervised DXA representations encode multi-system disease risk, biological aging and heritability（LeDXA）

#### 基本信息

- **完整题目**：*Self-supervised DXA representations encode multi-system disease risk, biological aging and heritability*
- **作者**：Gil Sasson、Zachary Levine、Smadar Shilo、Sarah Kohn、Guy Lutsker、Anastasia Godneva、Adam Gabet、David Krongauz、Adina Weinberger、Yann LeCun、Randall Balestriero、Eran Segal
- **机构**：Weizmann Institute of Science、Tel Aviv University、Schneider Children’s Medical Center、New York University、AMI Labs、Brown University、Mohamed bin Zayed University of Artificial Intelligence
- **时间与出处**：arXiv:2608.02208 v1，2026-08-03 13:33:04 UTC；`cs.CV / q-bio.QM` 预印本，未声明正式录用
- **实际使用的 JEPA**：LeJEPA；ViT-S/16 从随机初始化训练，多视图投影预测全局视图质心，以 SIGReg 防坍塌
- **下游任务**：DXA 表格读数恢复、疾病/生物标志物预测、纵向发病风险、生物年龄与死亡风险、embedding GWAS、无监督体成分分型
- **复现状态**：[官方仓库](https://github.com/GilSasson1/LeDXA) 提供 MIT 许可的训练/分析参考代码、合成 smoke test、去标识聚合表和论文图；没有已训练 checkpoint/release，HPP 与 UKBB 数据需申请授权

[arXiv 元数据](https://arxiv.org/abs/2608.02208) · [论文 PDF](https://arxiv.org/pdf/2608.02208) · [官方代码](https://github.com/GilSasson1/LeDXA) · [HPP 数据申请](https://humanphenotypeproject.org/data-access)

#### 方法如何衔接 JEPA

**可核对事实**

1. 输入是每次 DXA 的 bone/tissue 两个单通道视图，各自复制到三通道并统一为 `384×128`；bone 与 tissue 分支共用同一 ViT-S/16 encoder。[预处理与架构](https://arxiv.org/pdf/2608.02208#page=15)
2. 每个样本构造 2 个全身 global view 和 8 个 local view；local view 优先使用左右股骨与 L1–L4 ROI，不足部分才从全身图随机裁切。
3. encoder 后接 `384→2048→2048→64` projection head；每个 view 预测两个 global projection 的质心，并让投影分布经 2,048 个随机方向的 SIGReg 接近各向同性高斯。
4. 它没有 I-JEPA 的 masked block predictor、EMA teacher 或 stop-gradient target；“JEPA 血缘”来自 LeJEPA 的 joint-embedding multi-view prediction，而不是 I-JEPA/V-JEPA 原始实现。
5. 预训练使用单张 NVIDIA L40S、batch 256、400 epochs、约 10 小时；encoder 21.7M 参数。训练后冻结 encoder，以最终 CLS token 的 bone/tissue 拼接表示进入下游模型。

[LeJEPA objective 与训练配置](https://arxiv.org/pdf/2608.02208#page=16)

**作者主张**

作者认为，DXA 标准临床读数把空间结构压成少数脂肪、瘦体重和骨密度标量；LeDXA 能从原始图像中保留更细的骨骼形态与脂肪分布，因此同时捕获肌骨、代谢、呼吸、衰老和遗传信号。

**本研究判断**

LeDXA 是真正使用 LeJEPA 的域专用基础模型，而不是在 related work 中借名。它最有价值的设计是用一个小型、单卡可训练的 JEPA encoder 支持多种临床分析；但论文没有 matched objective ablation，所以“域专用数据、图像处理、ViT-S 架构、LeJEPA objective”四者的贡献仍缠在一起。

#### 数据集、指标、主要基线与关键结果

**数据与协议（事实）**

- HPP：11,540 次扫描、8,820 名参与者用于自监督预训练与内部评估；分析样本 8,759 人。重复扫描存在，但下游 train/validation 按参与者严格隔离；
- UKBB：47,400 名参与者的首个成像访视用于外部验证；没有 UKBB 数据进入预训练；
- 冻结表征主要与约 860M 参数的 DINOv3 ViT-H+、扫描仪生成的 DXA 表格特征，以及 age/sex/BMI covariates 比较；
- 连续指标用 Pearson `r`，分类用 AUROC；疾病/生物标志物使用 10 次受试者隔离的 80/20 split，显著性用 Wilcoxon + Benjamini–Hochberg FDR；纵向事件用带惩罚 Cox 模型和 C-index。

[队列与评测方法](https://arxiv.org/pdf/2608.02208#page=14)

| 任务 | LeDXA | 主要对照 | 解释边界 |
|---|---:|---:|---|
| HPP 年龄 MAE / `r` | **3.53 年 / 0.89** | DINOv3 4.27 / 0.84；tabular 5.12 / 0.76 | 同一 HPP 下游 split，但 DINOv3 不是 HPP 同预算预训练 |
| 骨密度三部位平均 `r` | **0.882±0.026** | DINOv3 0.789±0.029 | LeDXA 更贴合 DXA 域；仍缺 matched SSL objective |
| UKBB 髋关节病 C-index | **0.758** | tabular 0.633 | 纵向、外部队列；观察性关联，不是临床干预效用 |
| UKBB 膝关节病 C-index | **0.744** | tabular 0.677 | 同上 |
| UKBB 2 型糖尿病 C-index | **0.753** | tabular 0.721 | 同上 |
| 外部年龄预测 | `r=0.88`，MAE `2.90` 年 | 论文摘要未给出同段全部对照 | 反映迁移，但 UKBB 年龄分布不同 |
| embedding PC 平均 SNP heritability | **0.143** | DINOv3 0.098；tabular traits 0.345 | LeDXA 高于 DINOv3，仍未接近人工临床表格特征 |

[疾病与生物标志物结果](https://arxiv.org/pdf/2608.02208#page=7)｜[纵向风险](https://arxiv.org/pdf/2608.02208#page=9)｜[遗传结果](https://arxiv.org/pdf/2608.02208#page=11)

生物年龄部分还报告：UKBB `n=39,310`、377 例死亡、median follow-up 3.40 年；每增加一年 biological-age gap，死亡 hazard 增加约 `5.9%`（HR `1.06`, 95% CI `1.026–1.094`），最老貌 Q4 相对最年轻貌 Q1 为 HR `1.45`（95% CI `1.09–1.94`）。药物前后分析中，女性 HRT 只有 `n=11`、男性抗抑郁药只有 `n=17`，尽管 FDR 后显著，仍只应视为小样本观察性信号。[生物年龄与药物分析](https://arxiv.org/pdf/2608.02208#page=12)

#### 相对已有工作的创新

1. 把 LeJEPA 的轻量、稳定训练路径带到全身 DXA，而不是依赖自然图像大模型直接迁移；
2. 让全身 global view 与股骨/腰椎 regional view 在同一 embedding 中学习，兼顾系统性体成分与局部骨骼结构；
3. 使用同一个冻结表征覆盖 cross-sectional、longitudinal、survival、genetic 和 unsupervised phenotype discovery；
4. 在一个训练队列之外使用不同人群、不同年龄结构和不同扫描仪系统的 UKBB 做外部验证；
5. 公开代码、去标识 aggregate tables 和论文图，复现透明度明显好于只发布摘要或仓库骨架的医学预印本。

#### 局限、复现条件与潜在风险

1. **JEPA 因果归因不足。** 没有同一 ViT-S/16、同一 HPP、同一 400 epochs 下的 MAE、DINO、I-JEPA、监督从头训练或 no-SIGReg 对照。
2. **DINOv3 对比并不 compute-matched。** 一个是自然图像 1.698B 规模预训练的 860M generalist，一个是 11,540 DXA 扫描训练的 21.7M specialist；“更少图像/参数却更强”不能直接等于 objective 效率更高。
3. **内部评估是 transductive SSL。** HPP 的 11,540 次扫描全部用于无标签预训练，之后 probe 的 80/20 split 才按受试者隔离；因此内部 probe 没有标签泄漏，却也不是“encoder 从未见过测试图像”。真正独立的分布外证据来自 UKBB。
4. **临床队列选择偏差。** HPP 总体较健康且以色列志愿者为主，UKBB 同样有 healthy-volunteer bias；论文未按 ancestry 分层报告，不能外推到未筛选临床人群。
5. **观察性与标签风险。** HPP 慢病多为自报；药物开始时间也是自报，HRT/抗抑郁药样本很小，不能把 age-gap 变化解释为药物因果效应。
6. **外部设备仍不够广。** 两队列都来自 GE Healthcare Lunar 系统；跨厂商、跨院常规临床扫描、极端体型与图像质量仍未验证。
7. **随访较短。** 发病分析 median 4.3 年，死亡分析 3.40 年；很多慢性疾病需要更长时间窗。
8. **数据受控、无模型发布。** 代码仓可运行合成 smoke test，但没有 pretrained checkpoint/release；精确复现需要 HPP/UKBB 授权与合规环境。
9. **健康与遗传隐私风险。** 通用 embedding 可同时携带疾病、年龄与遗传结构；部署时需要用途限制、访问控制、校准审计和 subgroup 性能监测。

**复现判断：中。** 模型、损失、训练资源、下游协议和代码均较完整；真正的瓶颈是受控数据、缺 checkpoint，以及难以重建相同临床标签版本。

#### 是否值得写成独立原创技术博客

**值得，高优先级。** 适合的主题是“1.1 万张 DXA、单卡 10 小时：小型 JEPA 如何成为域专用医学基础模型”。写作必须同时强调 external validation 与 matched SSL objective 的缺失，避免把观察性健康关联包装成临床预测产品。

---

### 2. ProWorld: Progress-Aware Hyperbolic World Models for Long-Horizon Visual Goal Reaching

#### 基本信息

- **完整题目**：*ProWorld: Progress-Aware Hyperbolic World Models for Long-Horizon Visual Goal Reaching*
- **作者**：Zihan Liu、Yuzhe Zhuang、Yuanzu Li、Wanshuang Gou、Jiahong Liu、Min Zhou、Menglin Yang
- **机构**：The Hong Kong University of Science and Technology (Guangzhou)、The Chinese University of Hong Kong、Yinwang Technologies Ltd.；Wanshuang Gou 为 independent researcher
- **时间与出处**：arXiv:2608.01926 v1，2026-08-03 08:59:22 UTC；`cs.AI` 预印本，未声明正式录用
- **实际使用的 JEPA**：从零训练的 LeWM 式动作条件视觉 JEPA；保留一步 latent prediction 与 SIGReg，再加入 Lorentz-space contrastive/cone losses
- **下游任务**：离线视觉轨迹学习 + CEM latent planning，覆盖 PushT、OGBench Cube-S、AntMaze-L 和 Scene
- **复现状态**：论文写明代码将在论文 accepted 后发布；本次核验时无官方代码、权重或项目页

[arXiv 元数据](https://arxiv.org/abs/2608.01926) · [HTML 全文](https://arxiv.org/html/2608.01926v1) · [论文 PDF](https://arxiv.org/pdf/2608.01926)

#### 方法如何衔接 JEPA

**可核对事实**

1. 无预训练 ViT-tiny/14 把 `224×224` 图像编码为 192 维欧氏 latent；动作 encoder 与 6-block Transformer predictor 使用最近 `H=3` 个状态/动作预测下一步 latent。
2. 欧氏 latent 经 projection head 和 exponential map 放入 192 维 spatial + 1 维 time-coordinate 的 Lorentz manifold；预测 loss 是预测 future point 与真实 future point 的双曲距离平方。
3. Lorentz contrastive loss 把 batch 中匹配 future 当正例、其余 future 当负例；这与原始“无负例 JEPA”不同，ProWorld 是 JEPA prediction 与 contrastive discrimination 的混合目标。
4. entailment cone 使用同一 hindsight trajectory 中相隔 `Δ=2` 的 earlier/later state 作为 parent/child，并以未来 goal 为锚点；越接近 goal，cone 越窄。
5. 推理时 CEM 每步采样 300 个 action sequence、迭代 30 轮、保留 30 elites；cost 同时考虑 terminal goal distance、rollout 中 best intermediate distance 和 mean distance。

[训练结构与损失](https://arxiv.org/html/2608.01926v1#Sx4.SSx2)｜[双曲规划代价](https://arxiv.org/html/2608.01926v1#Sx4.SSx3)｜[超参数 Tables 13–14](https://arxiv.org/html/2608.01926v1#A6.T14)

**作者主张**

作者把长时目标到达表述为 goal-conditioned progress order：早期状态拥有更宽的未来可能，后期状态逐渐收缩到更具体的目标区域；负曲率空间更适合表达这种非对称、粗到细结构，因此能减轻 rollout drift 和视觉上相近但长期进度不同的 progress ambiguity。

**本研究判断**

ProWorld 是实际改造 LeWM/JEPA 的下游系统，主要贡献不是更准确的一步预测，而是让训练期 latent geometry 与推理期 planning cost 使用同一种“目标进度”结构。它也已经超出经典 JEPA：batch negatives、双曲 cone 和 CEM cost 都是新增机制，所以 headline 不应只归因于 JEPA 或双曲投影。

#### 数据集、指标、主要基线与关键结果

**数据与协议（事实）**

- PushT：20,000 条 expert trajectory，平均 196 steps；
- Cube-S、Scene、AntMaze-L：各自官方 offline dataset 为 1M transitions / 1,000 episodes；
- 所有方法使用相同训练数据和 planning budget；主基线含 LeWM、C-JEPA、GCIQL、GCIVL、PLDM、EB-JEPA、TD-MPC2、Sub-JEPA，以及作者重实现的 GeoWorld-Style；
- 主表用三个训练 seed `42/1337/3407` 报 mean±SD；指标是环境 native termination signal 定义的 success rate，不是 latent distance；
- 所有实验在 Huawei Ascend 910C NPU 上进行，batch 128，AdamW，100 epochs。论文没有说明 NPU 数量、wall-clock time 或每 seed 评测 episode 数。

[环境与数据](https://arxiv.org/html/2608.01926v1#A5)｜[评测定义](https://arxiv.org/html/2608.01926v1#A5.SSx2)｜[实现细节](https://arxiv.org/html/2608.01926v1#A8)

| 任务 | ProWorld | LeWM | 次强方法 | 相对 LeWM 绝对变化 |
|---|---:|---:|---:|---:|
| PushT | **94.00±2.00** | 83.33±4.04 | PLDM 80.67±2.49 | +10.67 |
| Cube-S | **77.33±1.15** | 71.33±3.06 | GCIVL 64.00±4.32 | +6.00 |
| AntMaze-L | **32.00±2.00** | 22.00±4.00 | PLDM 22.67±3.77 | +10.00 |
| Scene | **69.33±0.94** | 57.33±2.49 | EB-JEPA 67.33±0.94 | +12.00 |

[主结果 Table 1](https://arxiv.org/html/2608.01926v1#Sx4.T1)

最有解释力的 Cube-S 消融：完整模型 `78%`；去掉 entailment cone 为 `62%`；去掉 contrastive loss 为 `46%`；去掉 SIGReg 为 `76%`；只留 prediction + SIGReg 为 `46%`。换成欧氏空间为 `68%`，反转 parent-child temporal order 为 `44%`，随机配对为 `52%`；规划只用 terminal distance 为 `62%`。这些结果支持 progress order 与中间轨迹代价有用，但消融表没有多 seed 误差条。[训练与规划消融](https://arxiv.org/html/2608.01926v1#Sx5.SSx2)

#### 相对已有工作的创新

1. 相对 LeWM 的局部一步一致性，显式建模以 goal 为条件的 trajectory progress order；
2. 相对 GeoWorld 关注 rollout geometric degradation，ProWorld 把几何直接用于 goal-conditioned ordering、future discrimination 和 planning cost；
3. 用自适应 entailment cone 同时表达方向一致性与 parent-to-goal distance reduction；
4. 训练期用 temporally ordered hindsight pairs 提供弱监督，不要求人工逐步 progress label；
5. 推理期不只看终点，把 closest intermediate 与 rollout mean goal distance 纳入 CEM，降低“终点看似接近、中途持续偏航”的候选得分。

#### 局限、复现条件与潜在风险

1. **代码未发布。** 官方明确推迟到 accepted 后，当前无法核验数据处理、baseline adapter、CEM 细节与 seed 一致性。
2. **训练统计不完整。** 主表有三 seed，但没有置信区间、评测 episode 数、训练时间或总算力；小任务 SR 的离散性无法从论文重建。
3. **消融可能是单次结果。** Tables 2–6 只给整数百分比，不给 mean±SD；机制排序可能受 checkpoint/seed 影响。
4. **进度监督是时间顺序代理。** 同轨迹 later state 不总是更接近 goal；回退、绕路、接触重试、子目标切换都会违反单调 progress 假设，作者也在限制段承认这一点。[论文限制](https://arxiv.org/html/2608.01926v1#A12)
5. **收益高度复合。** 双曲空间、contrastive negatives、cone loss 和 planning cost 同时变化；尽管有消融，仍没有“相同欧氏 loss + 相同 progress-aware planner”的全因子多 seed 对照。
6. **GeoWorld 对照是 proxy。** 因官方实现/权重/评测脚本不可得，作者自行重实现 GeoWorld-Style；不能把其结果当成原论文方法的直接复现。
7. **仅仿真与离线数据。** 四项任务不覆盖真实相机噪声、机器人磨损、人类干预、部分观测和在线分布漂移。
8. **规划开销仍高。** 每步 300 candidates × 30 CEM iterations；论文只报告模型 FLOPs 相对 LeWM 增约 `0.03%`，没有报告完整 planner 的实际延迟，因此不能据此称在线规划开销可忽略。

**复现判断：中低。** OGBench/PushT 数据和主要超参数公开，但没有实现、权重、训练时间与完整评测样本数。

#### 是否值得写成独立原创技术博客

**值得，高优先级。** 推荐主题是“JEPA 的 latent 距离为何不够做长时规划：从局部预测到目标进度几何”。文章应把 GeoWorld、Temporal-Distance JEPA、TC-LeWM 与 ProWorld 放在同一坐标系，重点解释 progress supervision 与 planner cost 的耦合，而不是只讲“双曲空间更好”。

---

### 3. Asleep at the Wheel: JEPA's Limitations in Evaluating Novel Driving Data

#### 基本信息

- **完整题目**：*Asleep at the Wheel: JEPA's Limitations in Evaluating Novel Driving Data*
- **作者**：Advait Pavuluri、Shamik Karkhanis、Uzma Mushtaque
- **机构**：Rensselaer Polytechnic Institute
- **时间与出处**：arXiv:2608.01336 v1，2026-08-02 15:57:40 UTC；`cs.CV / cs.LG` 预印本；早于本轮严格截止，作为公告后回补
- **实际使用的 JEPA**：冻结公开 V-JEPA 2 ViT-L checkpoint `facebook/vjepa2-vitl-fpc64-256`；训练轻量 masked-embedding predictor，用预测残差给驾驶 clip 排 review value
- **下游任务**：从自动驾驶车队视频中无标签筛选“值得人工审核”的罕见/异常片段
- **复现状态**：[官方代码仓库](https://github.com/shamikkarkhanis/AV-SSL-Optimization-JEPA) 已在论文中给出；数据依赖 nuScenes、Waymo Open Dataset 和 BDD100K

[arXiv 元数据](https://arxiv.org/abs/2608.01336) · [HTML 全文](https://arxiv.org/html/2608.01336v1) · [论文 PDF](https://arxiv.org/pdf/2608.01336) · [官方代码](https://github.com/shamikkarkhanis/AV-SSL-Optimization-JEPA)

#### 方法如何衔接 JEPA

**可核对事实**

1. 冻结 V-JEPA 2 encoder 对 two-frame tubelet 输出 1,024 维 token，论文将所有 tubelet token mean-pool 成单个 clip vector。
2. 对每个 tubelet 的 `16×16` spatial patch 随机遮 50%；同一个冻结 encoder 分别编码 masked 与 clean tubelet；512 hidden-width predictor 从 masked embedding 预测 clean embedding。
3. 训练 loss 是 predictor output 与 clean target 的 L1 distance；推理 score 改用 prediction 与 target 的 cosine distance，并对 tubelet 平均。
4. 它真正使用 V-JEPA 2 表征和 latent prediction，但不是重新训练标准 V-JEPA 2：没有 EMA target encoder，target/context 都来自固定 backbone，且 mean pooling 丢弃局部时空结构。
5. 同一冻结特征另训练 logistic regression 预测 review-worthy label，作为“表征中是否存在线性信号”的监督诊断，而非无监督部署方案。

[方法原文](https://arxiv.org/html/2608.01336v1#S3)

**作者主张**

作者不是声称 V-JEPA 2 对自动驾驶无用，而是声称：当 positive/negative 由不同数据源构造时，prediction-error novelty 会优先学习 sensor、分辨率、城市与色彩风格等 provenance 差异，从而把跨域分离伪装成 review-value 排序能力。

**本研究判断**

这是一篇实际评估 JEPA 下游接口的负结果，价值高于再报一个弱小的正向提升。它把“表征是否含信息”和“某个无监督 objective 是否能抽取信息”拆开，并用同 checkpoint、同 embedding 的监督 probe 定位失败环节。不过样本小且实现偏离原生 V-JEPA 2 predictor，不能扩展成“所有 JEPA anomaly detection 都失败”。

#### 数据集、指标、主要基线与关键结果

**数据与协议（事实）**

- predictor 只用 nuScenes CAM_FRONT 无标签 clip 训练；外部 Waymo/BDD100K 不进入训练；
- 跨数据集 benchmark：64 clips，32 positives（Waymo 13、BDD100K 9、nuScenes 10）与 32 个 nuScenes routine negatives，正例率/随机 AP 为 0.50；
- 公平 within-nuScenes benchmark：83 clips、20 positives，随机 AP 为 0.241；
- 监督 probe 另用 437 个 nuScenes clips、38 scenes、21% positives；两名 annotator 标注，训练池与 83-clip benchmark scene-disjoint；
- predictor 25 epochs、5 seeds；单 V100 32GB，训练约 31–250 分钟，peak memory 约 1.9–2.1GB；监督 probe 用 10 次 scene-disjoint CV；
- baselines 含 masked-gap、leave-one-out kNN-density、随机未训练 predictor，以及监督 logistic head。

[数据与实验协议](https://arxiv.org/html/2608.01336v1#S4)｜[算力 Table 1](https://arxiv.org/html/2608.01336v1#S4.T1)

| 评测 | 方法 | AP | ROC-AUC | 结论 |
|---|---|---:|---:|---|
| 跨数据集 64 clips | trained predictor novelty | **0.89** | — | 标签与来源混杂，不能当真实 triage 能力 |
| 来源分类 | novelty score | — | **0.965** | score 几乎是 domain detector |
| 来源分类 | embedding logistic classifier | — | **1.00** | V-JEPA 2 embedding 完全线性分离来源 |
| 同源 83 clips | JEPA novelty | **0.288** | 0.533 | 接近随机正例率 0.241 |
| 同源 83 clips | kNN-density | **0.302** | 0.629 | 无训练 baseline 不低于 JEPA novelty |
| 同源 83 clips | supervised head | **0.499** | 0.663 | review-value 信号在 embedding 中，但无监督 residual 未抽取 |

[domain detector 分析](https://arxiv.org/html/2608.01336v1#S5.SS2)｜[完整指标 Table 2](https://arxiv.org/html/2608.01336v1#S5.T2)

配置 sweep 也很关键：samples-16/32、sweeps-16/32 的 AP 分别约 `0.273/0.269/0.263/0.256`；使用约 5 倍 sweeps-all 也只有 `0.280`。masked-gap、untrained predictor、kNN-density 分别为 `0.277/0.301/0.304`。更多无标签数据与更密时间采样都没有让训练 predictor 超过 no-training baseline。[配置 Table 3](https://arxiv.org/html/2608.01336v1#S5.T3)

#### 相对已有工作的创新

1. 不是再造 anomaly detector，而是用同 checkpoint 做 cross-dataset 与 within-dataset 反事实评测；
2. 直接训练 dataset-provenance classifier，证明“高 novelty”与来源边界高度一致；
3. 用 supervised probe 区分 representation failure 与 extraction-objective failure；
4. 同时对照 kNN、masked-gap 和 random predictor，检查 predictor training 是否真的创造价值；
5. 给驾驶视频自监督评测提出低成本控制：每个来源同时包含正负样本，并报告同源 benchmark 与监督读出上限。

#### 局限、复现条件与潜在风险

1. **公平测试很小。** 83 clips/20 positives 的 AP 方差不会小，论文没有为 held-out AP 给 bootstrap CI。
2. **标签有主观性。** 仅两名 annotator，论文未报告 inter-rater agreement；“值得审核”可能随车队策略变化。
3. **只验证一个 V-JEPA 2 checkpoint。** 没有比较 V-JEPA 1、DINOv3、VideoMAE、CLIP、端到端 adaptation 或不同模型规模。
4. **mean pooling 可能洗掉异常。** review-worthy 事件常短暂且局部，把全部 tubelet 平均成单向量可能是 objective 失败的重要原因。
5. **masking 设计单一。** 只用 50% spatial patch masking 与 lightweight predictor；temporal future prediction、局部 token score 和 end-to-end fine-tuning 仍未验证。
6. **跨域高分并非完全无用。** 真实车队可能确实需要发现新 sensor/city/weather domain；论文证明的是它不能被称为 review-value，而不是 domain novelty 本身没有运营价值。
7. **数据许可与下载门槛。** 三套驾驶数据的账号、许可和存储要求不同；复跑要锁定 clip 清单与人工标签版本。

**复现判断：中高。** 公开 checkpoint、三套公开数据、单卡预算、核心代码和详细 split 设计均可得；主要不可控因素是人工标签、精确 clip 清单和小样本方差。

#### 是否值得写成独立原创技术博客

**非常值得，今天最高优先级。** 推荐主题是“0.89 AP 为什么是假的：V-JEPA 2 驾驶视频分诊中的域偏移陷阱”。它可以独立于 JEPA 介绍，写成一篇关于 foundation-model downstream evaluation 的方法论文章；重点不是唱衰 JEPA，而是展示如何用同源控制、provenance probe 与监督 ceiling 拆穿伪提升。

## 横向比较

### 1. 三篇论文实际上在检验三种不同的“JEPA 可用性”

| 层次 | LeDXA | ProWorld | Asleep at the Wheel |
|---|---|---|---|
| 学习对象 | 全身 DXA 的跨视图域内结构 | 动作条件未来状态与目标进度 | frozen video embedding 的 masked prediction residual |
| 下游接口 | 冻结 embedding → 线性/Cox/GWAS/cluster | latent rollout → CEM planning | residual score → 人工审核排序 |
| 最强证据 | 外部队列 + 多任务 + 受试者隔离 | 同预算多 baseline + 三 seed + 消融 | 同 checkpoint 跨域/同域反事实 |
| 主要混杂 | domain data 与 objective 未拆开 | representation 与 planner 同时增强 | 数据来源与 review label 混杂 |
| 最可靠结论 | 小型域专用 JEPA 表征有临床关联和外部迁移 | progress-aware 完整世界模型提高仿真规划 SR | 此配置的 residual 不适合做同源 review-value |
| 不能推出 | LeJEPA 优于所有 matched SSL | 双曲空间或 JEPA 单独贡献 9.67 点 | V-JEPA 2 表征不含驾驶异常信息 |

### 2. 证据强度排序取决于问题，而不是 headline 数字

- 若问“结果是否跨数据分布成立”，LeDXA 的 HPP→UKBB 外部验证最强，但仍是同厂商设备与志愿者队列；
- 若问“组件为何有效”，ProWorld 的结构化消融最多，但缺多 seed 消融和公开实现；
- 若问“评测是否测到了声称属性”，Asleep at the Wheel 的同源反事实最清楚，且负结果由监督 probe 支撑；
- 若问“能否立即复跑”，视频分诊最好，LeDXA 受数据授权限制，ProWorld 目前最弱。

### 3. 今天出现一个值得长期保留的反模式

三个案例都提醒：**下游 score 可能优先抓住最容易的代理变量。** LeDXA 可能抓住 cohort/扫描仪相关结构，需多中心校准；ProWorld 用 temporal order 代理真实 progress，在绕路任务中可能失真；视频分诊则直接抓住 dataset provenance。JEPA latent 本身并不会自动保证“预测的就是我们想测的概念”。

## 值得继续追的问题

1. **LeDXA matched objective study**：在同一 HPP split、ViT-S/16、400 epochs 与单 L40S 预算下，对比 LeJEPA、I-JEPA、MAE、DINO/VICReg 与 supervised scratch；这是判断 LeJEPA 独立价值的最高优先级缺口。
2. **LeDXA 多中心与 subgroup calibration**：跨 GE/Hologic、不同国家/ancestry/性别/年龄层，报告 AUROC/C-index calibration、decision curve 与失败案例，而不只看总体 discrimination。
3. **ProWorld 表示与规划器的全因子拆分**：Euclidean vs hyperbolic × terminal vs progress-aware planner × contrastive on/off，全部跑多 seed，才能定位 `+9.67` 真正来自哪里。
4. **非单调进度任务**：在必须回退、绕障、重抓取、切换子目标的任务上，测试 temporal-order cone 是否错误惩罚合法 detour；考虑 learned reachability 或分段 progress label。
5. **完整规划延迟**：ProWorld 需要报告 encoder + 300×30 CEM candidate rollout 的 wall-clock、NPU/CPU 传输和每 action latency，而不是只报告网络 FLOPs。
6. **V-JEPA 2 localized novelty**：保留 token/tubelet 分数，比较 spatial mask、temporal future prediction、attention pooling 与 end-to-end adaptation，看 `0.288 AP` 是否主要由 mean pooling 导致。
7. **多来源平衡异常基准**：nuScenes、Waymo、BDD100K 每个来源都收集正/负例，做 leave-one-domain-out 与 source-balanced AP，验证 provenance confound 是否仍存在。
8. **严格复核 TRIM**：等待代码、逐任务明细、扰动生成脚本与多 seed 结果；在此之前不把 Research Square headline 纳入 JEPA 下游证据链。
9. **下一轮候选顺序**：优先 EEG-JEPA 的 14/9-task transfer 与 FactorJEPA 的 1B/2B backbone/数据发布；HP-JEPA 作为图领域回补。

## 博客价值判断

### 当日追踪博客

三篇均应完整进入当日「JEPA追踪」：LeDXA 与 ProWorld 是严格截止后新增，Asleep at the Wheel 是因 arXiv 公告节奏在上次运行后才可稳定发现的高价值回补。Research Square 的 TRIM 只记录排除理由，不把未经充分核验的 headline 写成新增事实。

### 区别于追踪日报的原创博客优先级

1. **最高：Asleep at the Wheel 的评测反例。** 主题可脱离单篇论文，上升为“如何判断 foundation-model anomaly score 在测异常还是测数据源”。证据链短、反事实清晰、读者可迁移到检索、医学和机器人。
2. **高：LeDXA 的小型域专用基础模型。** 重点写“专用小模型为何能胜过自然图像大模型”，同时用 matched objective 缺口约束结论；适合连接医学影像、少数据自监督和外部验证。
3. **高：ProWorld 的进度几何。** 适合与 GeoWorld、Temporal-Distance JEPA、TC-LeWM 合写“latent distance 不是规划代价”；不建议只翻译双曲空间公式。
4. **暂缓：TRIM。** 只有在代码/协议/多 seed 结果公开并解释与 TC-LeWM 数字关系后，才值得写独立主题；当前只适合作为证据质量审计案例。

## 来源链接

### 一手论文与全文

- [LeDXA arXiv 元数据](https://arxiv.org/abs/2608.02208)
- [LeDXA PDF](https://arxiv.org/pdf/2608.02208)
- [ProWorld arXiv 元数据](https://arxiv.org/abs/2608.01926)
- [ProWorld HTML 全文](https://arxiv.org/html/2608.01926v1)
- [ProWorld PDF](https://arxiv.org/pdf/2608.01926)
- [Asleep at the Wheel arXiv 元数据](https://arxiv.org/abs/2608.01336)
- [Asleep at the Wheel HTML 全文](https://arxiv.org/html/2608.01336v1)
- [Asleep at the Wheel PDF](https://arxiv.org/pdf/2608.01336)
- [TRIM Research Square / DOI](https://doi.org/10.21203/rs.3.rs-10545715/v1)

### 官方代码、数据与资源

- [LeDXA 官方代码仓库](https://github.com/GilSasson1/LeDXA)
- [Human Phenotype Project 数据申请](https://humanphenotypeproject.org/data-access)
- [UK Biobank 数据访问](https://www.ukbiobank.ac.uk/enable-your-research/apply-for-access)
- [Asleep at the Wheel 官方代码仓库](https://github.com/shamikkarkhanis/AV-SSL-Optimization-JEPA)
- [V-JEPA 2 官方模型与代码](https://github.com/facebookresearch/vjepa2)
- [OGBench 官方仓库](https://github.com/seohongpark/ogbench)

### 本轮发现、候选与去重入口

- [arXiv：JEPA 最新排序](https://arxiv.org/search/?query=JEPA&searchtype=all&abstracts=show&order=-announced_date_first&size=100)
- [FactorJEPA](https://arxiv.org/abs/2608.01049)
- [HP-JEPA](https://arxiv.org/abs/2608.00491)
- [EEG-JEPA](https://arxiv.org/abs/2608.00114)
