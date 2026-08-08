---
title: JEPA 下游研究追踪 · 2026-08-08
date: 2026-08-08 10:00:00
categories:
  - JEPA研究追踪
tags:
  - JEPA
  - JEPA追踪
---

> 本文属于「JEPA追踪」系列，记录每日论文检索、原文核验与阶段性判断；它保留研究日志的证据密度，与经过主题化重写的原创博客区分。

# JEPA 下游研究追踪（2026-08-08）

> 检索截止：2026-08-08 11:15（Asia/Shanghai，约 03:15 UTC）
>
> 严格增量起点：2026-08-07T03:00:24.514Z
>
> 去重范围：`/Users/nic/.codex/automations/jepa/memory.md` 与 `research/jepa/` 中 2026-07-15 至 2026-08-07 的全部既有记录、候选池和排除项。
>
> 发现入口：[arXiv：JEPA / `joint-embedding predictive` API 最新排序](https://export.arxiv.org/api/query?search_query=all%3AJEPA%20OR%20all%3A%22joint-embedding%20predictive%22&start=0&max_results=100&sortBy=submittedDate&sortOrder=descending)、[arXiv：I-JEPA / V-JEPA / V-JEPA 2 / A-JEPA 家族 API 最新排序](https://export.arxiv.org/api/query?search_query=all%3A%22I-JEPA%22%20OR%20all%3A%22V-JEPA%22%20OR%20all%3A%22V-JEPA%202%22%20OR%20all%3A%22A-JEPA%22&start=0&max_results=100&sortBy=submittedDate&sortOrder=descending)，并以 Semantic Scholar 的 I-JEPA、V-JEPA、V-JEPA 2 引用链作交叉发现。任何候选只有回到论文原文、官方项目页、会议页、arXiv 或 DOI 后才可能进入实质性结论。

## 今日结论

1. **今日无高可信严格新增。** 截至 2026-08-08 03:15 UTC，两组 arXiv 第一方 API 的最新 JEPA 家族 v1 仍是 2026-08-06 的 Bar-JEPA、BioM-JEPA、SR-JEPA 与 PhyLatent；最新可见版本更新是 *One Future, Every Robot* v3 的 2026-08-06 17:23:43 UTC，也早于本轮严格起点，且该论文已在 2026-07-31 记录完整解读。因此没有把旧论文、旧版本或未来期号元数据包装成“今日新增”。[Bar-JEPA 提交历史](https://arxiv.org/abs/2608.06062) · [One Future, Every Robot 提交历史](https://arxiv.org/abs/2607.28443)
2. **核心引用链没有补出日期落在本窗口的新论文。** 对 I-JEPA（arXiv:2301.08243）、V-JEPA（arXiv:2404.08471）和 V-JEPA 2（arXiv:2506.09985）的 Semantic Scholar citing-paper 列表按 `publicationDate` 过滤 2026-08-07 至 2026-08-08，结果为空。这个结果只说明当前索引中没有带该日期的引用项，不等于对所有尚未索引论文的数学证明，因此仍以 arXiv 第一方增量为主、引用图为补充发现。[I-JEPA 原文](https://arxiv.org/abs/2301.08243) · [V-JEPA 原文](https://arxiv.org/abs/2404.08471) · [V-JEPA 2 原文](https://arxiv.org/abs/2506.09985)
3. **没有新增论文，就没有新增实验数字可报告。** 今天不重复 8 月 7 日已解释的 BioM-JEPA、Bar-JEPA、PhyLatent，也不把当日已登记但未占主解读名额的 SR-JEPA 当成新论文。研究记录的价值是留下检索范围、时间边界和排除理由，避免下一轮重复劳动。
4. **今日未发现新的 A-JEPA / 音频直接下游稿。** 显式 A-JEPA 家族关键词和 JEPA 泛词最新排序都没有截止后记录；Helping Music Co-Creation Agents 仍是 2026-08-05 的既有候选，需另行审计数据切分、matched baseline、生成评测和代码/权重，不在无严格新增的日期强行升格。
5. **本日不配论文图。** 没有纳入新增论文时复用昨日图片会造成“今日有新论文”的视觉暗示；因此保留纯文本证据链，不新增或外链配图。

## JEPA 方向最新进展

### 1. 严格增量为空，不能解释成方向停滞

本轮只覆盖约 24 小时，而且落在周末公告窗口。arXiv 检索结果表明最新 JEPA 家族稿件仍集中在 8 月 6 日；它支持的准确表述是“**本窗口没有新的可核验投稿或修订**”，不是“JEPA 研究没有进展”。[arXiv JEPA 最新排序](https://arxiv.org/search/?query=JEPA&searchtype=all&abstracts=show&order=-announced_date_first&size=100)

### 2. 现有高价值待审项仍横跨三种 predictor 生命周期

- **SR-JEPA**：predictor 本身是 3D scene completion 的诊断接口，但当前依赖 oracle target centroid；属于 8 月 7 日已登记的严格新增，不在今天重复认领。[原文](https://arxiv.org/html/2608.05774v1)
- **HERA**：冻结 V-JEPA 2-G encoder / predictor blocks，只训练历史证据路由适配器；v1 为 2026-08-06 02:01:05 UTC，早于上一轮截止，且总体 IntPhys2 仍接近 chance。[原文](https://arxiv.org/html/2608.05523v1)
- **Helping Music Co-Creation Agents ‘Listen’ Well**：JEPA-style encoder 同时服务理解、flow matching 和 inpainting，方向新，但一手复现链尚未完成审计。[原文](https://arxiv.org/html/2608.04378v1)

这三项分别让 predictor 成为查询器、被冻结骨干中的可适配动力学模块、以及生成系统的表征来源。若后续深读，不能只比较 headline 分数，而应先说明 predictor 在下游是否被丢弃、冻结、继续训练或直接用于规划/生成。

### 3. 严格区分“实际使用”“仅引用”和“日期不合格”

- **实际使用、但日期不合格或已经解读**：SR-JEPA、HERA、Helping Music、SJEPA、FactorJEPA、EEG-JEPA、HP-JEPA；它们保留在候选池，不计作 2026-08-08 新增。
- **仅在相关工作中引用**：若方法、checkpoint、context–target predictor 或 JEPA objective 均未进入实验，即使引用 I-JEPA / V-JEPA / V-JEPA 2，也不计入具体下游证据。
- **日期元数据容易误导的引用链命中**：Semantic Scholar 返回两篇期号日期为 2026-09-01 的 I-JEPA citing works，但 DOI 注册元数据显示 *A unified training framework with masked pixel–semantic reconstruction for agricultural image segmentation* 的 Crossref record 创建于 2026-06-30，*Superpixel-graph self-supervised pretraining with joint-embedding and contrastive objectives for wound image segmentation* 创建于 2026-08-01；两者都早于本轮起点，不能用未来 issue date 冒充严格新增。[农业分割 DOI 注册元数据](https://api.crossref.org/works/10.1016/j.compag.2026.112096) · [创面分割 DOI 注册元数据](https://api.crossref.org/works/10.12913/22998624/224196)
- **跨仓库命中也必须过“实证”和“JEPA 使用强度”两道门槛**：Kukulu 的 bioRxiv 官方摘要明确把稿件定位为 methods-focused overview，只描述 structure-aware JEPA、conditional diffusion 与拟采用的 structure/docking evaluation protocol，没有报告可比较的定量结果；HERMES 的 Zenodo 官方说明更直接标注为 theoretical blueprint，未来工作才计划把它接到 4D JEPA encoder。二者都不能算已验证的下游实证。[Kukulu bioRxiv 官方记录](https://api.biorxiv.org/details/biorxiv/10.64898/2026.08.03.742168/na/json) · [HERMES Zenodo 记录](https://zenodo.org/records/21800053)
- **创面分割论文属于“JEPA-like 历史边界项”，不是 canonical I-JEPA 复现**：原文明确只用一个 U-Net encoder，不使用 I-JEPA 的双 encoder / EMA weight transfer；它以 superpixel target/context 的 L2 prediction 作为 joint loss，再可选加入 NT-Xent。30 张标注图微调时 Dice 为 contrastive `0.266`、JEPA-like `0.183`、combined `0.193`，100 张全监督 U-Net 为 `0.354`。这证明它实际评估了 JEPA 风格目标，却也显示本协议中最好的是纯 contrastive；加之论文发表于 8 月 1 日，既不满足日期，也不满足“核心 JEPA 管线带来强下游证据”的门槛。[期刊原文 PDF](https://www.astrj.com/pdf-224196-143057?filename=Superpixel-graph-self-sup.pdf)
- **Speaker-Invariant Emotion Representations with Gradient Reversal 属 related-work-only**：V-JEPA 只进入参考文献/背景链，论文实际方法是 gradient reversal 学 speaker-invariant emotion representation；没有复用 V-JEPA checkpoint、predictor 或 JEPA objective，不计入直接下游。[Springer 标题检索](https://link.springer.com/search?query=Speaker-Invariant%20Emotion%20Representations%20with%20Gradient%20Reversal)
- **历史回补线索**：*Stylistic-STORM (ST-STORM): Perceiving the Semantic Nature of Appearance* 的 Content branch 明确采用 JEPA scheme + contrastive objective，并在 ImageNet-1K、天气识别和 ISIC 2024 melanoma detection 上评估；它是实际 JEPA-style 下游，不是 related-work-only。但 arXiv v1 为 2026-04-17，页面注明 ICPR 2026 也不改变其早于本轮窗口的事实，只登记为历史候选，不纳入今日论文。[arXiv 摘要与提交历史](https://arxiv.org/abs/2604.16086)

## 新增下游论文解读

### 今日无高可信新增

本节不放置论文级解读，也不复述旧论文数字。纳入门槛要求同时满足：

1. 在 2026-08-07T03:00:24.514Z 之后出现可核验的投稿、版本或正式出版增量；
2. 不是只在 related work 提及 JEPA，而是实际复用、改造或评估 JEPA；
3. 有原文可核对下游任务、数据、指标、基线与关键结果；
4. 证据质量足以区分事实、作者主张和本次推断。

今天没有候选同时越过四道门槛。于是作者/机构、数据集、评价指标、主要基线、关键实验结果、创新、局限、复现条件和潜在风险均没有“当日新增”内容可填；凭旧候选补齐这些栏目会破坏增量追踪语义。

### 本轮筛选与排除表

| 候选 | 当前分类 | 未纳入原因 | 后续动作 |
|---|---|---|---|
| SR-JEPA | 实际使用 JEPA；8 月 7 日已登记 | v1 为 2026-08-06 09:09:16 UTC，已属于上一轮；今天重复主解读会造成双计 | 优先审计去 oracle centroid 后的 object discovery 与完整 scene completion |
| One Future, Every Robot v3 | 实际使用 JEPA；既有主解读 | v3 更新于 2026-08-06 17:23:43 UTC，早于严格起点；2026-07-31 已完整解读 | 仅在新实验、代码或结论实质变化时更新 |
| HERA | 实际改造 V-JEPA 2-G | v1 早于上一轮截止；seed 数、误差条、总体显著性与代码仍缺 | 等代码和 seed-level 结果 |
| Helping Music | 实际 JEPA-style 下游 | v1 与候选登记均早于本轮；生成评测与复现链未审完 | 核验 split、强基线、生成指标、代码/权重 |
| ST-STORM | 实际 JEPA-style 下游；历史回补 | arXiv v1 为 2026-04-17，页面注明 ICPR 2026，远早于严格窗口；方法还混合 contrastive、style prediction、reconstruction 与 adversarial constraint | 后续主题化比较“invariance 与 appearance preservation”，不计严格新增 |
| Kukulu | 实际提出 structure-aware JEPA + diffusion；方法稿 | bioRxiv 日期为 8 月 4 日，早于窗口；官方摘要只给 evaluation protocol，无定量结果、基线或复现结论 | 等完整实验表、代码/checkpoint 与抗体设计外部验证 |
| HERMES | JEPA-adjacent 理论蓝图 | Zenodo 官方说明写明 future empirical work 才接 4D JEPA encoder；当前没有下游实验 | 不进入实证候选池，等 TartanAir 实验 |
| 创面 superpixel-graph SSL | 实际评估 JEPA-like loss；历史边界项 | 单 encoder、无 EMA target；30-label Dice `0.183` 低于 contrastive `0.266`，且 8 月 1 日已发布 | 可用于“JEPA-style ≠ canonical JEPA”的方法边界案例 |
| 农业分割（2026-09 issue-date） | I-JEPA citing work；历史候选 | DOI record 于 2026-06-30 创建，非本轮新增；尚未按 JEPA 实际使用门槛逐表审计 | 作为历史补课候选，不进入严格增量 |
| Speaker-Invariant Emotion Representations with Gradient Reversal | related-work-only | V-JEPA 只进入参考文献；实际方法是 gradient reversal | 明确排除，不再作为 JEPA 下游候选 |
| OpenAlex 核心引用链 | 发现入口 | 低频查询未返回截止后记录，部分直接 API 请求触发 HTTP 429；索引延迟与不完整响应均不足以证明“绝对没有” | 后续低频重试；继续以 arXiv / 原文为主 |

## 横向比较

| 维度 | 严格新增 | 既有待审候选 | related-work-only 命中 |
|---|---|---|---|
| 本日数量 | **0** | 多篇，但均早于截止或昨日已登记 | 不计数 |
| 是否可称“今天的新论文” | 否 | 否 | 否 |
| 是否实际使用 JEPA | 无论文可判 | SR-JEPA、HERA、Helping Music 等为是 | 否，或尚无一手方法证据 |
| 今天应做什么 | 留下空结果与检索证据 | 保留优先级，不重复 headline | 继续排除 |
| 最大风险 | 把索引延迟误写成“绝对没有” | 把补课候选包装成严格新增 | 把引用关系误写成方法关系 |

今天最重要的横向判断不是模型优劣，而是三种“新”的语义必须分开：**新提交、新版本、今天首次被我们读到**。本追踪以第一种为严格主线；第二种只有实质实验变化才纳入；第三种可以进入历史补课，但必须明确标注，不能伪装成时间增量。

## 值得继续追的问题

1. **SR-JEPA 去 oracle target centroid 后还剩多少能力？** 需要把 target proposal / object discovery 与 completion 串成端到端协议，再看 `43.13%` semantic identity 与 `41.15 AP` 是否保持。[SR-JEPA 原文](https://arxiv.org/html/2608.05774v1)
2. **HERA 的总体改善是否稳健？** 应公开 seed 数、paired confidence interval、子组多重比较和代码，才能判断 `52.57→54.35%` 是否超出随机波动。[HERA 原文](https://arxiv.org/html/2608.05523v1)
3. **音乐 JEPA 的表示收益能否与生成器容量拆开？** 同 split、同 decoder/flow matcher 下比较 JEPA、MAE、contrastive 与监督音频表示，并报告生成质量、可控性、版权/训练数据来源和计算成本。[Helping Music 原文](https://arxiv.org/html/2608.04378v1)
4. **引用图的未来期号如何去重？** 后续应同时记录 DOI `created`、online publication、issue date、arXiv v1 和首次发现时间；任何单一日期都可能把历史工作误判成严格新增。
5. **A-JEPA 为什么仍缺少可审计的直接下游链？** 下一轮继续查音频事件检测、音乐生成、语音与音视频任务，但只有实际训练/评估 A-JEPA 或明确 JEPA objective 的工作才纳入。
6. **周一公告批次优先检查什么？** 先查 JEPA / joint-embedding predictive 显式新稿，再查 I-JEPA、V-JEPA、V-JEPA 2、A-JEPA 引用链；若出现 revision，先比较版本 diff 是否新增下游实验，而不是只看更新时间。

## 博客价值判断

### 当日追踪博客

**应按系列规则发布简短追踪，但明确标题下的首要结论是“今日无高可信新增”。** 这种空结果对长期研究有价值：它固定了截止时间、检索入口、索引限制和不纳入原因，使下一轮可以从 2026-08-08 的截止点继续，而不是重复扫描或误报旧稿。

### 区别于追踪日报的原创博客

- **今天不应仅凭空结果创建主题化原创博客。** 没有新增事实支撑新的主题结论。
- 若从既有候选另做原创文章，优先级仍是：SR-JEPA 的“查询点是否构成 oracle”、HERA 的“冻结 world model 如何接历史记忆”、以及音乐 JEPA 的“表征与生成收益如何归因”。这些都需要额外主题化重写和更完整审计，不能由本追踪自动创建。

### 本日配图判断

不引用旧论文图，也不新增图片文件。未来若 SR-JEPA 完成端到端审计，可优先选择其官方方法图，并在引用前核对原图尺寸、文件大小和版权/来源；今日没有对应的新增论文图可诚实使用。

## 来源链接

### 第一方增量检索

- [arXiv API：`JEPA OR "joint-embedding predictive"`，按 submitted date 降序](https://export.arxiv.org/api/query?search_query=all%3AJEPA%20OR%20all%3A%22joint-embedding%20predictive%22&start=0&max_results=100&sortBy=submittedDate&sortOrder=descending)
- [arXiv API：I-JEPA / V-JEPA / V-JEPA 2 / A-JEPA 家族，按 submitted date 降序](https://export.arxiv.org/api/query?search_query=all%3A%22I-JEPA%22%20OR%20all%3A%22V-JEPA%22%20OR%20all%3A%22V-JEPA%202%22%20OR%20all%3A%22A-JEPA%22&start=0&max_results=100&sortBy=submittedDate&sortOrder=descending)
- [arXiv 网页：JEPA 最新排序](https://arxiv.org/search/?query=JEPA&searchtype=all&abstracts=show&order=-announced_date_first&size=100)

### 核心 JEPA 与引用链锚点

- I-JEPA：[arXiv](https://arxiv.org/abs/2301.08243) · [CVPR 2023 官方论文页](https://openaccess.thecvf.com/content/CVPR2023/html/Assran_Self-Supervised_Learning_From_Images_With_a_Joint-Embedding_Predictive_Architecture_CVPR_2023_paper.html)
- V-JEPA：[arXiv](https://arxiv.org/abs/2404.08471) · [CVPR 2024 官方论文页](https://openaccess.thecvf.com/content/CVPR2024/html/Bardes_Revisiting_Feature_Prediction_for_Learning_Visual_Representations_from_Video_CVPR_2024_paper.html)
- V-JEPA 2：[arXiv](https://arxiv.org/abs/2506.09985) · [官方项目页](https://ai.meta.com/vjepa/)

### 本轮保留候选与日期边界

- [SR-JEPA arXiv / 提交历史](https://arxiv.org/abs/2608.05774) · [HTML 全文](https://arxiv.org/html/2608.05774v1)
- [HERA arXiv / 提交历史](https://arxiv.org/abs/2608.05523) · [HTML 全文](https://arxiv.org/html/2608.05523v1)
- [Helping Music Co-Creation Agents ‘Listen’ Well](https://arxiv.org/abs/2608.04378) · [HTML 全文](https://arxiv.org/html/2608.04378v1)
- [One Future, Every Robot v3 提交历史](https://arxiv.org/abs/2607.28443)
- [ST-STORM arXiv / 提交历史](https://arxiv.org/abs/2604.16086)
- [农业图像分割 DOI](https://doi.org/10.1016/j.compag.2026.112096) · [Crossref 注册元数据](https://api.crossref.org/works/10.1016/j.compag.2026.112096)
- [创面图像分割 DOI / 出版者页面](https://doi.org/10.12913/22998624/224196) · [Crossref 注册元数据](https://api.crossref.org/works/10.12913/22998624/224196)
- [创面图像分割期刊原文 PDF](https://www.astrj.com/pdf-224196-143057?filename=Superpixel-graph-self-sup.pdf)
- [Kukulu bioRxiv DOI](https://doi.org/10.64898/2026.08.03.742168) · [bioRxiv 官方 API 记录](https://api.biorxiv.org/details/biorxiv/10.64898/2026.08.03.742168/na/json)
- [HERMES Zenodo 正式记录](https://zenodo.org/records/21800053)
- [Speaker-Invariant Emotion Representations with Gradient Reversal：Springer 标题检索](https://link.springer.com/search?query=Speaker-Invariant%20Emotion%20Representations%20with%20Gradient%20Reversal)
