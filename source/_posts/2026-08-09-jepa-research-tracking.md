---
title: JEPA 下游研究追踪 · 2026-08-09
date: 2026-08-09 10:00:00
categories:
  - JEPA研究追踪
tags:
  - JEPA
  - JEPA追踪
---

> 本文属于「JEPA追踪」系列，记录每日论文检索、原文核验与阶段性判断；它保留研究日志的证据密度，与经过主题化重写的原创博客区分。

# JEPA 下游研究追踪（2026-08-09）

> 检索截止：2026-08-09 11:16（Asia/Shanghai，约 03:16 UTC）
>
> 严格增量起点：2026-08-08T03:00:36.596Z
>
> 去重范围：`/Users/nic/.codex/automations/jepa/memory.md` 与 `research/jepa/` 全部既有记录、候选池和排除项。
>
> 证据口径：arXiv、OpenAlex、Semantic Scholar 等索引只用于发现和日期筛选；论文是否真正使用 JEPA，以及方法、数据、结果与局限，必须回到论文原文、官方项目/代码、会议页、arXiv 或 DOI 核验。

## 今日结论

1. **今日无高可信严格新增，不用低质量结果凑数。** 三组 arXiv 第一方 API 检索的最新 JEPA 家族 v1 仍是 2026-08-06 的 Bar-JEPA、BioM-JEPA、SR-JEPA 与 PhyLatent；没有晚于本轮严格起点的新投稿或版本更新。[arXiv：JEPA 最新排序](https://export.arxiv.org/api/query?search_query=all%3AJEPA&start=0&max_results=50&sortBy=submittedDate&sortOrder=descending) · [arXiv：`joint embedding predictive architecture` 最新排序](https://export.arxiv.org/api/query?search_query=all%3A%22joint%20embedding%20predictive%20architecture%22&start=0&max_results=50&sortBy=submittedDate&sortOrder=descending)
2. **核心引用链没有补出 8 月 8–9 日的新 direct-use 论文。** OpenAlex 对 I-JEPA、V-JEPA、V-JEPA 2 的 citing works 做 `from_publication_date=2026-08-08` 过滤均返回 0；Semantic Scholar 引用链交叉发现也没有补出能回到一手全文核验的窗口内论文。部分附加 OpenAlex 请求出现 HTTP 429，因此“无新增”只适用于本轮已完成的检索范围，不能解释成对所有未索引论文的绝对证明。[I-JEPA 引用查询](https://api.openalex.org/works?filter=cites%3AW4386076428%2Cfrom_publication_date%3A2026-08-08&sort=publication_date%3Adesc&per-page=100) · [V-JEPA 引用查询](https://api.openalex.org/works?filter=cites%3AW4394861491%2Cfrom_publication_date%3A2026-08-08&sort=publication_date%3Adesc&per-page=100) · [V-JEPA 2 引用查询](https://api.openalex.org/works?filter=cites%3AW4417261359%2Cfrom_publication_date%3A2026-08-08&sort=publication_date%3Adesc&per-page=100)
3. **发现一篇高价值但不能纳入主解读的晚到索引候选。** KDD 2026 论文 *Bridging ECG and PPG: Latent-Space Prediction for Robust Physiological Analysis* 的 online 日期标为 8 月 8 日，DOI 记录在 8 月 6 日 17:15:47 UTC 已创建、8 月 7 日已 deposited/indexed，均早于上一轮截止；8 月 9 日的 print/issue 日期只是同一论文的载体元数据，不构成新的论文版本。更重要的是，ACM 全文/PDF 当前无法取得，无法用原文核对数据集、指标、基线、逐表结果与消融。[DOI](https://doi.org/10.1145/3770855.3819000) · [Crossref 日期元数据](https://api.crossref.org/works/10.1145/3770855.3819000)
4. **BrainNetGFM 是“双重排除”：日期不合格，方法也不是 JEPA。** 其 DOI 同样在 8 月 6 日创建、8 月 8 日正式出版；官方仓库明确实现 masked node/edge reconstruction 与 graph/node contrastive learning，预训练总损失为 reconstruction loss 加 contrastive loss，没有 context–target latent predictor、EMA target encoder 或 JEPA checkpoint。因此它属于 I-JEPA 引用链中的 related-work-only 命中，不计 JEPA 下游论文。[DOI / Crossref 元数据](https://api.crossref.org/works/10.1145/3770855.3818988) · [官方 README](https://github.com/BrainLabA/BrainNetGFM/tree/be1eadd8f3322942406de84906b2dd15c8753e1b) · [官方预训练实现](https://github.com/BrainLabA/BrainNetGFM/blob/be1eadd8f3322942406de84906b2dd15c8753e1b/brainnetgfm/pretrain_engine.py#L19-L38) · [官方 SSL 模型](https://github.com/BrainLabA/BrainNetGFM/blob/be1eadd8f3322942406de84906b2dd15c8753e1b/brainnetgfm/ssl_model.py#L343-L374)
5. **今日没有新增 A-JEPA / 音频 direct-use 证据，也不配论文图。** 无入选论文时复用旧图会制造“今日有新论文”的视觉暗示；Bridging ECG–PPG 又没有可核验的官方图 URL/编号，因此本日保持纯文本证据链，不新增图片文件。

## JEPA 方向最新进展

### 1. 周末严格增量为空，但正式出版索引开始补出跨生理模态线索

准确结论是“**本轮窗口没有新的、可由一手全文完整核验的 JEPA 下游论文**”，不是“JEPA 方向停滞”。arXiv 最新提交仍停在 8 月 6 日；与此同时，KDD 正式出版元数据把 ECG–PPG latent prediction 带入引用发现链，说明后续需同时跟踪 arXiv、会议 proceedings 与 DOI created/indexed/published 日期，不能只看 issue date。

### 2. Bridging ECG–PPG 候选提示跨模态生理 JEPA，但证据尚未闭环

**可核验事实**：论文题目为 *Bridging ECG and PPG: Latent-Space Prediction for Robust Physiological Analysis*；作者 Zhaoliang Chen、Saurabh Kataria、Minxiao Wang、Xiao Hu，均来自 Emory University；收录于 *Proceedings of the 32nd ACM SIGKDD Conference on Knowledge Discovery and Data Mining V.2*。Crossref 显示 DOI 创建于 8 月 6 日 17:15:47 UTC、8 月 7 日 deposited/indexed、8 月 8 日 online、8 月 9 日 print。[Crossref 元数据](https://api.crossref.org/works/10.1145/3770855.3819000)

**索引发现、尚未升级为论文事实**：OpenAlex / Semantic Scholar 摘要把它描述为以 LeJEPA 为基础、在统一 latent space 中连接 ECG 与 PPG，并提到心率估计、房颤检测和血压估计等下游任务。由于 ACM 官方页面和 PDF 当前被访问防护拦截，OpenAlex / Semantic Scholar 又没有开放 PDF，GitHub 官方搜索未发现作者仓库，今天不能确认 encoder–target–predictor 结构、是否使用 EMA、训练数据、评价指标、主要基线、关键数字或 matched ablation。索引摘要可以用于决定“下一轮优先读什么”，不能代替原文成为实质性结论。[ACM DOI 入口](https://doi.org/10.1145/3770855.3819000)

### 3. “joint self-supervised learning”不能按名字自动归入 JEPA

BrainNetGFM 的标题含 *joint self-supervised learning*，又出现在 I-JEPA 引用链，但其官方实现把被遮节点恢复到原始输入特征，并以 SCE/MSE 做 reconstruction；另一支对两种图增强使用 NT-Xent / InfoNCE 与 node supervised contrastive loss。`pretrain_engine.py` 明确将总损失写成 `alpha_recon * recon_loss + beta_cl * cl_loss`。这与 JEPA 的 context–target latent prediction 不是同一训练管线，说明引用图和相似术语都必须再过代码级方法审计。[SSL 模型](https://github.com/BrainLabA/BrainNetGFM/blob/be1eadd8f3322942406de84906b2dd15c8753e1b/brainnetgfm/ssl_model.py#L103-L137) · [训练实现](https://github.com/BrainLabA/BrainNetGFM/blob/be1eadd8f3322942406de84906b2dd15c8753e1b/brainnetgfm/pretrain_engine.py#L19-L38)

## 新增下游论文解读

### 今日无高可信新增

本节不放置论文级主解读。纳入门槛要求候选同时满足：

1. 晚于 2026-08-08T03:00:36.596Z 出现可核验的投稿、实质版本或正式出版增量；
2. 不是只在 related work 中引用 JEPA，而是实际复用、改造或评估 JEPA；
3. 能由一手全文核对完整题目、作者/机构、方法、下游场景、数据集、指标、主要基线、关键结果、创新与局限；
4. 事实、作者主张与本研究推断可以清楚分开。

今天没有候选同时越过四道门槛，因此不复述 8 月 7–8 日已经解读的 BioM-JEPA、Bar-JEPA、PhyLatent、SR-JEPA，也不拿尚无逐表证据的 ECG–PPG 候选补齐数字。

### 本轮筛选与排除表

| 候选 | “仅引用”还是“实际使用” | 未纳入原因 | 后续动作 |
|---|---|---|---|
| Bridging ECG and PPG | 索引摘要强烈提示实际构建跨 ECG–PPG latent predictive model；一手全文尚未核验 | DOI created/indexed 早于严格起点；ACM 全文/PDF不可得，数据、指标、基线、关键结果和消融均无法原文核验 | 保留为最高优先级待核验候选；取得正文后先审计 JEPA 结构与单模态部署协议 |
| BrainNetGFM | related-work-only；官方代码不是 JEPA | 日期早于起点；实际目标是输入特征/边重建 + graph/node contrastive，无 context–target latent predictor 或 EMA target | 明确排除，不再作为 JEPA 下游候选；可保留为“如何审计引用链”的反例 |
| Bar-JEPA / BioM-JEPA / SR-JEPA / PhyLatent | 实际使用或改造 JEPA | v1 均为 8 月 6 日，已在既有记录登记或解读 | 仅在新版本增加实质实验时更新 |
| ω-0: A Latent Predictive World Action Model for Concurrent Humanoid Loco-Manipulation | V-JEPA 2 引用链的历史候选，是否实际复用仍需逐节核验 | arXiv:2608.06375 v1 为 8 月 6 日，不属于今日严格增量 | 作为历史补课候选，不占今日名额；后续先审计 checkpoint/predictor 是否进入方法 |
| OpenAlex / Semantic Scholar 新命中 | 发现入口，不是证据类别 | 部分接口有索引延迟或 429；日期字段也可能混合 created、online 与 issue date | 继续以 arXiv、DOI、会议原文和官方仓库闭环 |

## 横向比较

| 维度 | 严格新增 | ECG–PPG 晚到候选 | BrainNetGFM 引用命中 |
|---|---|---|---|
| 本日计数 | **0** | 不计入 | 不计入 |
| 日期判断 | 无窗口内稿件 | DOI created/indexed 早于起点，online date 较晚 | DOI created 早于起点 |
| JEPA 使用判断 | 无论文可判 | 索引提示 actual use，尚缺一手全文闭环 | 官方代码证实不是 JEPA |
| 下游证据 | 无新增数字 | 只知道索引声称覆盖生理任务，不能核对数据/指标/结果 | 有脑网络下游任务，但不能归为 JEPA 证据 |
| 最大风险 | 把周末空窗写成方向停滞 | 用摘要主张替代逐表结果 | 把引用或“joint”术语误写成 JEPA 方法 |

今天最重要的比较不在模型排行榜，而在证据状态：**实际使用但全文未闭环**与**只引用且代码明确不是 JEPA**是两种完全不同的排除原因。前者值得继续追，后者应从 JEPA 下游候选池清除。

## 值得继续追的问题

1. **Bridging ECG–PPG 的预测对象究竟是什么？** 需要确认它是在模态内遮挡 token、跨模态预测 paired embedding，还是只做全局表示对齐；还要核验 target encoder 是否 EMA、predictor 下游是否保留。
2. **“只带 PPG 推理仍受益于 ECG 预训练”的增量如何隔离？** 应有 PPG-only、paired ECG–PPG、contrastive、input reconstruction、LeJEPA-style prediction 的 matched 对照，并按相同 encoder/数据/预算比较。
3. **生理信号任务是否 patient-disjoint、device/site-disjoint？** 心率、房颤和血压结果若按窗口随机切分，可能被同一患者或同一次记录泄漏放大；取得全文后应优先审计 split unit，而不是先抄 headline。
4. **低质量 PPG 的“鲁棒”是怎样定义的？** 需要区分合成噪声、真实运动伪影、设备域偏移、缺失片段与人群偏移，并检查是否有置信区间、校准和失败亚组。
5. **正式出版日期如何用于自动化去重？** 后续同时记录 DOI `created`、`deposited/indexed`、online、print/issue、arXiv v1 与首次发现时间；严格增量优先采用首次公开且可核验的时间，避免把同一论文重复认领。
6. **下一轮继续查什么？** 周一优先检查 arXiv 新公告，再重试 KDD ECG–PPG 全文/作者仓库；A-JEPA/音频线仍只纳入实际训练或评估 JEPA objective 的工作。

## 博客价值判断

### 当日追踪博客

**应按系列规则发布，但首要结论必须是“今日无高可信新增”。** 本日价值在于固定周末空窗、登记 ECG–PPG 晚到候选、把 BrainNetGFM 从 JEPA 候选池中清除，并记录索引日期/429 限制，方便后续去重。

### 区别于追踪日报的原创博客

- **Bridging ECG–PPG：有潜在高博客价值，但现在不值得单独成文。** 理想主题是“让 ECG 教会只戴 PPG 的设备：跨模态 JEPA 能否绕开输入噪声”，但至少要先取得全文、逐表结果与复现入口。
- **BrainNetGFM：不值得作为 JEPA 论文写原创博客。** 它可在“引用链为什么会误报 direct-use”方法文章中作为代码审计反例，但不能宣传为 graph JEPA。
- **今日不自行创建主题化原创博客。** 没有新增且证据闭环不足时，追踪日报已经是最诚实的载体。

### 本日配图判断

不引用论文图，也不新增图片文件。BrainNetGFM 虽有官方 Figure 1，但论文已按 related-work-only 排除；Bridging ECG–PPG 暂无可核验的官方图 URL/编号。等拿到其正式正文后，再优先评估方法总览或跨模态预测框架图，并检查许可、尺寸与压缩需求。

## 来源链接

### 第一方增量检索

- [arXiv API：JEPA，按 submitted date 降序](https://export.arxiv.org/api/query?search_query=all%3AJEPA&start=0&max_results=50&sortBy=submittedDate&sortOrder=descending)
- [arXiv API：`joint embedding predictive architecture`，按 submitted date 降序](https://export.arxiv.org/api/query?search_query=all%3A%22joint%20embedding%20predictive%20architecture%22&start=0&max_results=50&sortBy=submittedDate&sortOrder=descending)
- [arXiv API：I-JEPA / V-JEPA / A-JEPA 家族，按 submitted date 降序](https://export.arxiv.org/api/query?search_query=all%3A%22V-JEPA%22%20OR%20all%3A%22I-JEPA%22%20OR%20all%3A%22A-JEPA%22&start=0&max_results=50&sortBy=submittedDate&sortOrder=descending)

### 核心 JEPA 与引用链锚点

- I-JEPA：[arXiv](https://arxiv.org/abs/2301.08243) · [CVPR 2023 官方论文页](https://openaccess.thecvf.com/content/CVPR2023/html/Assran_Self-Supervised_Learning_From_Images_With_a_Joint-Embedding_Predictive_Architecture_CVPR_2023_paper.html)
- V-JEPA：[arXiv](https://arxiv.org/abs/2404.08471) · [CVPR 2024 官方论文页](https://openaccess.thecvf.com/content/CVPR2024/html/Bardes_Revisiting_Feature_Prediction_for_Learning_Visual_Representations_from_Video_CVPR_2024_paper.html)
- V-JEPA 2：[arXiv](https://arxiv.org/abs/2506.09985) · [Meta 官方项目页](https://ai.meta.com/vjepa/)
- OpenAlex 日期过滤：[I-JEPA citing works](https://api.openalex.org/works?filter=cites%3AW4386076428%2Cfrom_publication_date%3A2026-08-08&sort=publication_date%3Adesc&per-page=100) · [V-JEPA citing works](https://api.openalex.org/works?filter=cites%3AW4394861491%2Cfrom_publication_date%3A2026-08-08&sort=publication_date%3Adesc&per-page=100) · [V-JEPA 2 citing works](https://api.openalex.org/works?filter=cites%3AW4417261359%2Cfrom_publication_date%3A2026-08-08&sort=publication_date%3Adesc&per-page=100)

### 今日候选与排除项

- Bridging ECG and PPG：[ACM DOI](https://doi.org/10.1145/3770855.3819000) · [Crossref 元数据](https://api.crossref.org/works/10.1145/3770855.3819000)
- BrainNetGFM：[ACM DOI](https://doi.org/10.1145/3770855.3818988) · [Crossref 元数据](https://api.crossref.org/works/10.1145/3770855.3818988) · [官方仓库固定提交](https://github.com/BrainLabA/BrainNetGFM/tree/be1eadd8f3322942406de84906b2dd15c8753e1b) · [SSL 模型](https://github.com/BrainLabA/BrainNetGFM/blob/be1eadd8f3322942406de84906b2dd15c8753e1b/brainnetgfm/ssl_model.py#L103-L137) · [预训练循环](https://github.com/BrainLabA/BrainNetGFM/blob/be1eadd8f3322942406de84906b2dd15c8753e1b/brainnetgfm/pretrain_engine.py#L19-L38)
- 历史候选 ω-0：[arXiv 摘要与提交历史](https://arxiv.org/abs/2608.06375)
