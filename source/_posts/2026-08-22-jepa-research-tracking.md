---
title: JEPA 下游研究追踪 · 2026-08-22
date: 2026-08-22 10:00:00
categories:
  - JEPA研究追踪
tags:
  - JEPA
  - JEPA追踪
---

本文属于「JEPA追踪」系列，记录每日论文检索、原文核验与阶段性判断；它保留研究日志的证据密度，与经过主题化重写的原创博客区分。

# JEPA 下游研究追踪（2026-08-22）

> 检索截止：2026-08-22 14:40（Asia/Shanghai，06:40 UTC）。
>
> 增量边界：自动化元数据给出的上次运行时间为 `2026-08-21T03:01:09.666Z`，但 2026-08-21 已发布记录的实际检索截止是 `03:11 UTC`；本轮取两者中较晚的 **2026-08-21 03:11 UTC** 作为严格新增起点。搜索索引只用于发现候选，论文身份、方法、数据和实验数字均回到 arXiv/会议 DOI/论文原文核验。

## 今日结论

1. **今日无高可信严格新增。** 截至检索截止，arXiv 的 JEPA/完整术语检索与 I-JEPA、V-JEPA 2/2.1、A-JEPA、audio JEPA 专项检索都仍以昨日已经解读的 *Orthogonal JEPA*（arXiv:2608.20065，2026-08-20 13:59:57 UTC）为最新条目；没有一篇晚于本轮起点、同时满足“实际复用/改造/评估 JEPA + 进入具体下游任务 + 一手全文可核验”的论文。[综合检索](https://export.arxiv.org/api/query?search_query=%28all%3AJEPA%20OR%20all%3A%22joint%20embedding%20predictive%22%20OR%20all%3A%22joint-embedding%20predictive%22%29&start=0&max_results=100&sortBy=lastUpdatedDate&sortOrder=descending) · [家族专项检索](https://export.arxiv.org/api/query?search_query=%28all%3A%22A-JEPA%22%20OR%20all%3A%22audio%20JEPA%22%20OR%20all%3A%22acoustic%20JEPA%22%20OR%20all%3A%22V-JEPA%202%22%20OR%20all%3A%22V-JEPA%202.1%22%20OR%20all%3A%22I-JEPA%22%29&start=0&max_results=100&sortBy=lastUpdatedDate&sortOrder=descending)
2. **今天只完整回补 1 篇已登记的历史候选，不把它冒充新投稿。** *Multimodal Rapport Estimation in Real-World HRI*（arXiv:2608.18401 v1）提交于 2026-08-19 00:15:22 UTC，早于上一份 8 月 19 日记录的实际截止；论文已被 ICMI 2026 接收。它冻结 V-JEPA 2.1 ViT-Gigantic，为日本药店真实人机交互提取视频特征并预测第三方 rapport，属于 **frozen-backbone downstream evaluation**，不是 related-work-only。[arXiv 提交记录](https://arxiv.org/abs/2608.18401) · [ICMI/DOI](https://doi.org/10.1145/3776574.3831184) · [视觉特征方法](https://arxiv.org/html/2608.18401v1#S4.SS2.SSS2.Px3)
3. **最重要的结果不是 V-JEPA 单模态很强，而是它在融合中提供互补信息。** V-JEPA 单独回归的 `MAE/PCC/CCC` 为 `0.666/0.331/0.310`，弱于 HuBERT 的 `0.616/0.464/0.460`；Gemini 2.5 Flash 文本分支为 `0.634/0.665/0.580`。把 Gemini 文本预测与 V-JEPA 等权平均后达到 `0.490/0.712/0.632`，再加入 HuBERT 后为全表最佳 `0.471/0.717/0.656`。[单模态与基线表](https://arxiv.org/html/2608.18401v1#S5.T2) · [融合表](https://arxiv.org/html/2608.18401v1#S5.T3)
4. **不能把融合增益直接归因成“JEPA 优于其它视觉骨干”。** 论文没有 DINO、VideoMAE、CLIP 或监督视频 encoder 的 matched 视觉对照，也没有置信区间、显著性检验或多训练 seed。更醒目的负信号是：按一人、两人、三人交互分组时，V-JEPA 的 CCC 从 `.503` 降至 `.286`、再降至 `.043`；但三人组只有 13 个样本，且系统依赖人物框加权 pooling，因此这既可能反映表征边界，也可能来自小样本、跟踪或空间聚合误差。[分组分析](https://arxiv.org/html/2608.18401v1#S6.SS3) · [局限](https://arxiv.org/html/2608.18401v1#S6.SS4)
5. **跨索引复核没有补出第二篇。** OpenAlex 的 I-JEPA、V-JEPA 与 V-JEPA 2 日期引用链均为 0；Crossref 在 8 月 21–22 日新创建记录中的 JEPA 检索为 0；bioRxiv 525 条、medRxiv 142 条日期记录全文分页筛选均无 JEPA/完整术语命中。Semantic Scholar 仍只给出 9 月或 10 月 issue-date 条目，不能把未来期号当成今日新增。[I-JEPA 引用链](https://api.openalex.org/works?filter=cites%3AW4386076428%2Cfrom_publication_date%3A2026-08-21&sort=publication_date%3Adesc&per-page=100) · [V-JEPA 引用链](https://api.openalex.org/works?filter=cites%3AW4394861491%2Cfrom_publication_date%3A2026-08-21&sort=publication_date%3Adesc&per-page=100) · [V-JEPA 2 引用链](https://api.openalex.org/works?filter=cites%3AW4417261359%2Cfrom_publication_date%3A2026-08-21&sort=publication_date%3Adesc&per-page=100) · [Crossref](https://api.crossref.org/works?query.bibliographic=JEPA&filter=from-created-date%3A2026-08-21%2Cuntil-created-date%3A2026-08-22&rows=100)
6. **配图采用论文 Figure 4。** 它直接展示不同参与人数下 V-JEPA 与融合系统的 CCC 走势。arXiv 官方 PNG 为 `1726×1042`、`155,474` bytes（约 `151.8 KiB`），体积已经较小；博客只使用官方外链、限宽 760 px 并懒加载，不新增本地图片文件。

## JEPA 方向最新进展

### 1. 严格增量为空，最新列表没有越过昨日边界

| 发现入口 | 本轮结果 | 证据边界 |
|---|---|---|
| arXiv JEPA/完整术语，按更新时间排序 | 最新仍是 2608.20065 | 已在 8 月 21 日解读，不重复 |
| arXiv I-JEPA/V-JEPA 2/A-JEPA/audio 专项 | 没有晚于 2026-08-21 03:11 UTC 的新条目 | 关键词检索不能覆盖所有引用论文，继续用引用链补查 |
| OpenAlex 三条核心引用链 | `0 / 0 / 0` | 只说明该索引当前未暴露新增，存在索引时延 |
| Crossref 新创建记录 | 0 个 JEPA 命中 | 创建时间不是发表时间，只用于发现 DOI 候选 |
| bioRxiv / medRxiv 全日期分页 | `525 / 142` 条中 0 个 JEPA 命中 | 按标题与摘要筛选；无命中不代表其它专业预印本平台为空 |
| Semantic Scholar 引用链 | 只有未来 issue-date 候选 | 不以 9 月/10 月期号提前认领 |

因此今天不使用 related-work-only、二手摘要或不完整元数据凑数，也不把 Orthogonal JEPA、DA-LeWM、S-JEPA diagnostic 等已登记条目重复包装成新增。

### 2. 历史回补显示 V-JEPA 的下游角色正在变成“互补传感器”

**事实。** 本文不训练或改写 JEPA objective，也不使用 V-JEPA predictor；它把冻结的 V-JEPA 2.1 ViT-Gigantic 当作视觉特征提取器，再以轻量 attention pooling + MLP 预测 rapport。V-JEPA 在完整融合中的有效权重只有 `1/4`：Gemini 文本占 `1/2`，HuBERT 和 V-JEPA 各占 `1/4`。[融合定义](https://arxiv.org/html/2608.18401v1#S5.SS3)

**作者主张。** HuBERT+V-JEPA 在控制 Gemini 文本预测后仍有 partial correlation `.359`，加入它使线性解释度 `ΔR²=.072`；作者据此把音频和视觉描述为与文本 LLM 互补，而不是相互竞争。[互补性分析](https://arxiv.org/html/2608.18401v1#S5.SS2)

**我的判断。** 这是一篇有效的 JEPA 下游论文，但不是新的 JEPA 方法论文。它的价值在于把 V-JEPA 放进不受控、多人、真实零售场景，揭示“单模态弱、融合后仍有用”的系统角色；其证据最多支持“这组 V-JEPA 特征包含文本预测未覆盖的信号”，不能支持“JEPA 是最好的视觉表示”。

### 3. “仅引用”与“实际使用”的边界

- **Multimodal Rapport Estimation：实际使用。** 冻结 V-JEPA 2.1 ViT-Gigantic，约 8 fps 采样、非重叠 64 帧 clip、输出 1664 维特征，并结合目标人物框做加权空间 pooling；随后训练下游 regression head。[原文方法](https://arxiv.org/html/2608.18401v1#S4.SS2.SSS2.Px3)
- **论文对 JEPA 的归因范围很窄。** 下游训练只覆盖 pooling 与 MLP，不验证 JEPA predictor、masking objective 或未来 latent prediction；因此分类为 `backbone direct-use / downstream evaluation`，而不是 `method direct-use`。
- **严格窗口没有 related-work-only 候选占用主解读名额。** Semantic Scholar 的未来期号条目仍只用于去重；没有一手全文与正确时间身份时，不根据标题判断其是否真正运行 JEPA。

## 新增下游论文解读

### Multimodal Rapport Estimation in Real-World HRI（历史候选首次完整解读）

> 时间说明：arXiv v1 提交于 2026-08-19 00:15:22 UTC，早于 8 月 19 日已发布记录的 `03:12 UTC` 截止。本节是此前已登记候选的完整回补，不称为 8 月 22 日新投稿。

#### 基本信息

- **完整题目**：*Multimodal Rapport Estimation in Real-World HRI*
- **作者**：Akihiro Sakuramoto、Takato Hayashi、Ryo Miyoshi、Yuki Okafuji、Shogo Okada。
- **机构**：Sakuramoto、Hayashi、Okada 来自 Japan Advanced Institute of Science and Technology（JAIST）；Miyoshi、Okafuji 来自 CyberAgent 与 The University of Osaka。[arXiv HTML 标题页](https://arxiv.org/html/2608.18401v1)
- **发布时间与出处**：arXiv:2608.18401 v1，2026-08-19；已接收至第 28 届 ACM International Conference on Multimodal Interaction（ICMI 2026，2026-10-05 至 10-09，意大利那不勒斯），DOI `10.1145/3776574.3831184`。[arXiv 摘要与版本](https://arxiv.org/abs/2608.18401) · [DOI](https://doi.org/10.1145/3776574.3831184)
- **使用的 JEPA**：冻结的 V-JEPA 2.1 ViT-Gigantic；不是只引用，也没有继续预训练或修改 JEPA。
- **下游任务与场景**：根据日本药店内真实顾客与桌面社交机器人 Sota 的文本、语音和视频，回归第三方观察者标注的 CCR-8 rapport 分数；场景允许自由进入、退出和多人加入。[数据场景](https://arxiv.org/html/2608.18401v1#S3.SS1)

#### 方法如何衔接 JEPA

**事实。** 研究先用 DEIMv2 人体检测得到人物框，用 Whisper-large 转写，再人工修正 speaker ID。视觉分支以约 8 fps 采样，切成非重叠 64 帧 clip，经冻结 V-JEPA 2.1 ViT-Gigantic 得到 1664 维、L2-normalized 特征；有目标人物框时做加权空间 pooling。每个模态分别使用 additive attention 汇聚变长序列，再用带 `0.2` dropout 的两层 MLP 回归 rapport，训练损失是 `1-CCC`。[预处理](https://arxiv.org/html/2608.18401v1#S4.SS2.SSS1) · [特征提取](https://arxiv.org/html/2608.18401v1#S4.SS2.SSS2) · [下游模型](https://arxiv.org/html/2608.18401v1#S4.SS3)

文本基线使用 Sentence-T5-large 的 768 维 frozen embedding，音频基线使用 HuBERT-large-ll60k 的 1024 维 frozen embedding。零样本比较包括 GPT-5.4、Claude Sonnet 4.6 与 Gemini 2.5 Flash；Gemini 还分别接收文本、文本+音频、文本+音频+视频。LLM 预测在 2026 年 4 月通过公开 API 各运行一次。[LLM 协议](https://arxiv.org/html/2608.18401v1#S4.SS4)

**作者主张。** 真实 HRI 中，文本 LLM 已能给出强 rapport 预测；音频和 V-JEPA 视觉特征虽单独较弱，却能补充 LLM 没有覆盖的信号，最好的系统应做预测级融合。

**我的判断。** 论文真正评估的是“V-JEPA 预训练 encoder 能否作为 social-signal feature branch”，而不是 JEPA 的未来预测能力。64 帧/约 8 fps 意味着每个视觉 clip 约覆盖 8 秒，这是适合离线评价的粗时间粒度；若要实时自适应机器人，还需测试流式窗口、重叠策略与至少约 8 秒 observation latency 的影响。

#### 数据、标签、指标与主要基线

- **原始采集**：6 天、32 小时、131 个 session；机器人由人远程操控（Wizard of Oz）。
- **过滤后数据**：排除 4 人及以上、出现学龄前儿童、全程少于 2 句用户发言的 session 后，剩 62 个 session、101 名参与者；其中 97 人有可用语音并成为预测目标。每个目标平均 `7.06±5.83` 句，session 平均视频长度 `54.23±42.42` 秒。[数据与过滤](https://arxiv.org/html/2608.18401v1#S3.SS1)
- **标签**：3 名第三方日语标注者使用 8 项 CCR 量表，5 点 Likert；个人级总分 `3.72±0.80`，ICC(2,3)=`.85`，总体 Cronbach's α=`.95`。[标注方法](https://arxiv.org/html/2608.18401v1#S3.SS2) · [可靠性](https://arxiv.org/html/2608.18401v1#S3.SS3)
- **切分**：预定义 30-fold train/validation/test，按 session 分组，保证同一 session 的多人不会跨 split；最终合并各 fold 的 out-of-fold test predictions 后统一计算指标。[切分协议](https://arxiv.org/html/2608.18401v1#S4.SS6.SSS1)
- **指标**：MAE 越低越好，PCC 与 CCC 越高越好；CCC 同时要求相关性与均值/方差校准，也是训练目标。[指标](https://arxiv.org/html/2608.18401v1#S4.SS6.SSS2)
- **主要基线**：random、ST5、HuBERT、V-JEPA、三种 frozen embedding late fusion，以及 GPT-5.4、Claude Sonnet 4.6、Gemini 2.5 Flash 的零样本输入组合。

#### 关键实验结果

| 系统 | 模态 | MAE ↓ | PCC ↑ | CCC ↑ |
|---|---|---:|---:|---:|
| Random | — | 0.901 | −0.004 | −0.005 |
| ST5 | T | 0.633 | 0.327 | 0.281 |
| HuBERT | A | 0.616 | 0.464 | 0.460 |
| V-JEPA | V | 0.666 | 0.331 | 0.310 |
| Gemini 2.5 Flash | T | 0.634 | 0.665 | 0.580 |
| Gemini 2.5 Flash | T+A+V | 0.549 | 0.625 | 0.618 |
| Gemini(T) + V-JEPA | T+V | 0.490 | 0.712 | 0.632 |
| Gemini(T) + HuBERT + V-JEPA | T+A+V | **0.471** | **0.717** | **0.656** |

表中前六行来自主比较，最后两行来自等权预测融合；不能把两张表中的模型视为完全相同输入或推理预算。[Table 2](https://arxiv.org/html/2608.18401v1#S5.T2) · [Table 3](https://arxiv.org/html/2608.18401v1#S5.T3)

HuBERT+V-JEPA 的 standalone prediction 在控制 Gemini(T) 后仍有 partial correlation `.359`，为 Gemini 线性模型增加 `ΔR²=.072`。这是“互补性”最直接的中间证据，但论文没有 bootstrap CI，也没有比较“Gemini + 其它视觉 backbone”。[互补性指标](https://arxiv.org/html/2608.18401v1#S5.SS2)

<figure style="margin:1.4em auto;text-align:center;">
  <img src="https://arxiv.org/html/2608.18401v1/figures/party_size_ccc_trends.png" alt="一人、两人和三人交互下，各 rapport 预测模型的 CCC 变化；V-JEPA 随参与人数增加明显下降" style="display:block;max-width:760px;width:100%;height:auto;margin:0 auto;" loading="lazy">
  <figcaption>不同参与人数下的 CCC。V-JEPA 从一人 `.503` 降到两人 `.286`、三人 `.043`；图片来自 arXiv 原文 Figure 4，官方 PNG 约 151.8 KiB，页面限宽 760 px 并启用懒加载。</figcaption>
</figure>

**分组结果。** 97 个目标中，一人/两人/三人交互样本数为 `28/56/13`。Gemini(T) 在三人组反而达到 CCC `.721`，V-JEPA 则为 `.503/.286/.043`；短交互（≤40 秒）与长交互中，V-JEPA CCC 为 `.330/.295`，时长敏感性远小于人数敏感性。[时长分析](https://arxiv.org/html/2608.18401v1#S6.SS2) · [人数分析](https://arxiv.org/html/2608.18401v1#S6.SS3)

#### 相对已有工作的创新

1. **场景创新强于 JEPA 方法创新。** 论文把 frozen V-JEPA 2.1 带入不受控药店、自由退出与自然多人加入的真实 HRI，而不是实验室双人脚本。
2. **把第三方 rapport 当成连续下游任务。** 数据使用 CCR-8 的 Connection/Coordination 结构，并报告标注一致性，而不只用互动时长或任务成功率代理关系质量。
3. **给出互补性而不只报 late-fusion headline。** partial correlation 与 `ΔR²` 尝试说明音视频分支提供了 Gemini 文本之外的信息。
4. **负结果具有诊断价值。** V-JEPA 单模态弱、且多人条件快速退化，提醒后续 social video 研究不能把通用视频特征的单人结果直接外推到群体交互。

#### 局限、复现条件与潜在风险

**论文明确承认的局限。** 单一日本药店、主要为日语参与者；机器人由人类 operator 控制，rapport 可能部分反映 operator 能力；仅 97 个目标，分组后更小；目标是第三方观察到的 rapport，不是参与者自报体验；日语 CCR-8 未做完整心理测量学验证；LLM 与 embedding 模型输入和推理框架不完全一致。[局限原文](https://arxiv.org/html/2608.18401v1#S6.SS4)

**复现条件。** 优点是披露了 frozen backbone、帧率、clip 长度、特征维度、pooling、session-level split、标签量表和主指标。缺点是当前论文没有作者代码/数据入口，也没有给下游 optimizer、learning rate、epoch/batch、独立训练 seed、置信区间或显著性检验；人物框与 speaker ID 还依赖人工修正。LLM 只在 2026 年 4 月各运行一次，结果会随 API 版本和 prompt 变化。

**本研究推断。** `Gemini(T)+V-JEPA` 的提升有系统价值，但没有 matched alternative visual encoder，无法排除“任何合理视觉特征都会提升”的解释。V-JEPA 多人退化也不能直接归因给 JEPA：目标人物框 pooling、遮挡、身份切换、三人组仅 13 例以及三人组较低的标签均值都可能参与造成结果。

**风险。** rapport 预测不是读取人的真实内心状态。把第三方观察分数用于实时改变机器人行为，可能放大文化偏差、对儿童或低言语参与者产生选择性失明，并把公共空间中的脸、声音与对话变成敏感行为画像。论文要求限制原始数据访问、最小化保留、去标识并提供清晰通知与适当同意；这类模型不应成为评价个人或采取行动的唯一依据。[负责任创新声明](https://arxiv.org/html/2608.18401v1#S8)

#### 是否值得主题化原创博客

**中等价值，建议等待一个 matched 视觉 backbone 对照后再单篇成文。** 当前最好的原创主题不是“V-JEPA 识别人机 rapport”，而是“为什么弱单模态模型仍能成为强融合系统的互补传感器”。文章可用 `.310→.632` 的 standalone/fusion 反差与 `.503→.043` 的多人退化构成正反两面，并讨论 partial correlation、late fusion、人物级 pooling 与真实场景 shift。若没有 DINO/VideoMAE 对照、bootstrap CI 或更大跨文化数据，单篇宣传 JEPA 会超过证据。

## 横向比较

| 论文/既有记录 | JEPA 在系统中的角色 | 下游任务 | 最有价值的证据 | 最大归因边界 |
|---|---|---|---|---|
| 本文：Multimodal Rapport Estimation | 冻结 V-JEPA 2.1 visual feature branch | 真实药店 HRI rapport 回归 | V-JEPA 单独 CCC `.310`，与 Gemini 融合 `.632`；三模态 `.656` | 无替代视觉 backbone；97 个目标；多人退化 |
| *Asleep at the Wheel*（8 月 4 日已解读） | 冻结 V-JEPA 2 residual/novelty score | 驾驶新颖性检测 | 跨数据集 AP `.89`，同源 nuScenes AP `.288` | residual extraction 与数据 provenance 混杂；83 clips |
| V-JEPA4A（8 月 19 日已解读） | 保留 JEPA 训练管线，只改 driving mask | 城市场景分割、深度、跟踪 | matched random→MCD 的多任务同向提升 | 无代码/多 seed；部分表文冲突 |
| DynaWM（8 月 2 日已解读） | 可训练 V-JEPA 2.1 dense video encoder | 移动物体操控 | 八组平均 success `50.36%→76.15%` | Mamba/state/DiT 同时变化，无替代 encoder |

一条清晰的谱系正在出现：**冻结 encoder 的下游评估**更容易暴露场景失败，但很难归因 JEPA objective；**继续预训练或改 mask**更接近方法因果问题，却更依赖数据与完整训练预算；**系统级微调**可能得到最大任务收益，但归因也最混杂。今天的 HRI 论文属于第一类。

## 值得继续追的问题

1. **融合收益是否 JEPA-specific？** 固定人物框、pooling、MLP、split 和 fusion 权重，同协议比较 V-JEPA 2.1、DINOv3、VideoMAE、CLIP、监督动作识别 encoder。
2. **`.503→.286→.043` 的主因是什么？** 分别消融 full-frame、目标人物框、multi-person token pooling、显式 tracking 与身份交换；三人组需要显著扩样。
3. **等权融合是否稳定？** 对 out-of-fold prediction 做 participant/session-clustered bootstrap，报告 MAE/PCC/CCC 差值 CI，并与在 validation 上学习权重的 stacking 对比。
4. **分组分析是否受标签分布影响？** 三人组平均 rapport 只有 `3.391`，一人/两人约 `3.774/3.775`；应做 calibration-by-group、range restriction 与 matched-label resampling。
5. **离线 64 帧 clip 能否支持在线自适应？** 需要流式、因果窗口、窗口重叠、延迟—精度曲线，以及在用户即将退出时的早期预测，而不是只评估完整 session。
6. **第三方 rapport 与自报体验是否一致？** 最少需要同时收集参与者自报、operator 信息和行为结果，避免模型只学会“看起来投入”。
7. **真实部署的数据治理如何落地？** 多人公共场景中的旁观者、儿童、无言参与者、声音/人脸保留与撤回机制需要在模型指标之外单独审计。
8. **WONDER 是否值得历史回补？** 它声称用 radio-field JEPA 为 UAV 候选轨迹预测增量 radio effect；后续应优先核验 matched no-JEPA、actor-only、多 UAV negotiation 和公开 artifact，再决定是否占主解读名额。[WONDER](https://arxiv.org/abs/2608.16955)

## 博客价值判断

### 当日追踪博客

应明确以“今日无高可信严格新增”开头，只收录 1 篇时间身份清楚的历史回补。主线是：V-JEPA 在真实 HRI 中单独并不强，但作为 LLM 之外的视觉分支可能有互补价值；同时，参与人数增加暴露出很大的稳健性缺口。

### 是否另写原创技术博客

- **可以写，但优先级中等。** 推荐主题：“单模态弱，为什么融合后仍有用？从 V-JEPA 的 HRI 实验看互补表示。”
- **成文门槛。** 至少补一个 matched DINO/VideoMAE 对照或对现有 out-of-fold prediction 做 clustered bootstrap；否则文章应把 V-JEPA 只作为案例，不把融合增益归为 JEPA 的独特优势。
- **不建议的角度。** 不写“V-JEPA 已能理解人机 rapport”或“多人场景证明 V-JEPA 失效”；两者都超过当前 97 样本、单一文化和单一 pooling 实现能够支持的范围。

### 配图选择

[Figure 4](https://arxiv.org/html/2608.18401v1/figures/party_size_ccc_trends.png) 最能同时说明正向融合价值与多人稳健性风险。官方 PNG 为 `1726×1042`、约 `151.8 KiB`，已经是适合网页引用的小体积资源；正文限宽 760 px、懒加载、只外链，不复制进仓库。

## 来源链接

### 今日主解读的一手来源

- *Multimodal Rapport Estimation in Real-World HRI*：[arXiv 摘要与版本](https://arxiv.org/abs/2608.18401) · [HTML 全文](https://arxiv.org/html/2608.18401v1) · [ICMI/DOI](https://doi.org/10.1145/3776574.3831184)
- 数据与标注：[真实药店语料](https://arxiv.org/html/2608.18401v1#S3.SS1) · [CCR-8 标注](https://arxiv.org/html/2608.18401v1#S3.SS2) · [可靠性](https://arxiv.org/html/2608.18401v1#S3.SS3)
- 模型与评测：[V-JEPA 特征](https://arxiv.org/html/2608.18401v1#S4.SS2.SSS2.Px3) · [session-level split](https://arxiv.org/html/2608.18401v1#S4.SS6.SSS1) · [主结果](https://arxiv.org/html/2608.18401v1#S5.T2) · [融合结果](https://arxiv.org/html/2608.18401v1#S5.T3) · [局限](https://arxiv.org/html/2608.18401v1#S6.SS4)

### 发现、去重与排除来源

- arXiv：[JEPA/完整术语最新排序](https://export.arxiv.org/api/query?search_query=%28all%3AJEPA%20OR%20all%3A%22joint%20embedding%20predictive%22%20OR%20all%3A%22joint-embedding%20predictive%22%29&start=0&max_results=100&sortBy=lastUpdatedDate&sortOrder=descending) · [I-JEPA/V-JEPA/A-JEPA/audio 专项](https://export.arxiv.org/api/query?search_query=%28all%3A%22A-JEPA%22%20OR%20all%3A%22audio%20JEPA%22%20OR%20all%3A%22acoustic%20JEPA%22%20OR%20all%3A%22V-JEPA%202%22%20OR%20all%3A%22V-JEPA%202.1%22%20OR%20all%3A%22I-JEPA%22%29&start=0&max_results=100&sortBy=lastUpdatedDate&sortOrder=descending)
- OpenAlex：[I-JEPA](https://api.openalex.org/works?filter=cites%3AW4386076428%2Cfrom_publication_date%3A2026-08-21&sort=publication_date%3Adesc&per-page=100) · [V-JEPA](https://api.openalex.org/works?filter=cites%3AW4394861491%2Cfrom_publication_date%3A2026-08-21&sort=publication_date%3Adesc&per-page=100) · [V-JEPA 2](https://api.openalex.org/works?filter=cites%3AW4417261359%2Cfrom_publication_date%3A2026-08-21&sort=publication_date%3Adesc&per-page=100)
- [Crossref 2026-08-21 至 2026-08-22 创建记录](https://api.crossref.org/works?query.bibliographic=JEPA&filter=from-created-date%3A2026-08-21%2Cuntil-created-date%3A2026-08-22&rows=100)
- 生物医学预印本：[bioRxiv 日期入口](https://api.biorxiv.org/details/biorxiv/2026-08-21/2026-08-22/0/json) · [medRxiv 日期入口](https://api.biorxiv.org/details/medrxiv/2026-08-21/2026-08-22/0/json)
- Semantic Scholar：[I-JEPA citations](https://api.semanticscholar.org/graph/v1/paper/ARXIV:2301.08243/citations?offset=0&limit=100&fields=title,year,publicationDate,externalIds,url) · [V-JEPA citations](https://api.semanticscholar.org/graph/v1/paper/ARXIV:2404.08471/citations?offset=0&limit=100&fields=title,year,publicationDate,externalIds,url)

### 未纳入主解读的理由

- **严格窗口确实为空。** 最新 arXiv 条目没有越过 8 月 21 日 03:11 UTC；不重复解读 Orthogonal JEPA，也不把版本未变的旧稿称为新增。
- **未来期号不等于今日发表。** Semantic Scholar 的农业分割、创面分割和行为科学条目显示 9 月/10 月期号；当前只保留去重，不根据未来日期写结论。
- **WONDER 继续排队。** 它属于 actual-use 历史候选，但本轮没有足够理由在已完成一篇真实 HRI 回补后再用第二篇历史稿填充；其 matched attribution 和 artifacts 仍待审计。
- **没有低质量第二篇补位。** 今日选择“无高可信严格新增 + 1 篇历史回补”，而不是用 related-work 引用、标题命中或二手摘要凑满数量。
