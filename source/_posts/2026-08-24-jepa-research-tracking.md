---
title: JEPA 下游研究追踪 · 2026-08-24
date: 2026-08-24 10:00:00
categories:
  - JEPA研究追踪
tags:
  - JEPA
  - JEPA追踪
---

本文属于「JEPA追踪」系列，记录每日论文检索、原文核验与阶段性判断；它保留研究日志的证据密度，与经过主题化重写的原创博客区分。

# JEPA 下游研究追踪（2026-08-24）

> 严格新增窗口：**2026-08-23 06:32:24 UTC — 2026-08-24 03:14:52 UTC**。起点采用上一份已发布记录的实际检索截止。本期把窗口后的新提交或实质版本更新称为“严格新增”；提交早于起点、但因周末公告与 arXiv 索引延迟而在本轮首次公开暴露的论文明确标成“历史回补”。

> 证据口径：搜索索引只用于发现候选；下文的方法、数据、数值、作者机构、artifact 状态和限制均回到 arXiv 元数据、论文原文、官方 PDF 或作者官方仓库核验。**Human-JEPA** 与 **WA-JEPA** 都属于 `actual-use / method direct-use`，不是只在 related work 中引用 JEPA；**Graph-JEPA collapse diagnostic** 也实际训练 JEPA，但它主动证明自己的任务 target 不足以支持科学推理，因此登记为 `actual-use diagnostic`，不挤占本期两篇具体下游主解读。

## 今日结论

1. **今日无高可信严格新增，但补出两篇高价值 actual-use 历史漏项。** arXiv 官方 `cs.CV/new` 页面在本轮显示“Monday, 24 August 2026”的 New submissions，并列出 [Human-JEPA（2608.21160）](https://arxiv.org/abs/2608.21160) 与 [WA-JEPA（2608.20974）](https://arxiv.org/abs/2608.20974)；两篇 v1 的元数据提交时间分别为 2026-08-21 14:32:08 与 10:54:35 UTC，均早于本轮严格起点，不能冒充 8 月 23 日之后的新投稿。它们在 automation memory 与既有 `research/jepa/` 记录中均无命中，因此作为“周末延迟公告/索引延迟首次发现的历史回补”完整解读。[8 月 24 日 cs.CV new listings](https://arxiv.org/list/cs.CV/new) · [arXiv submittedDate 检索](https://export.arxiv.org/api/query?search_query=all%3AJEPA&start=0&max_results=100&sortBy=submittedDate&sortOrder=descending) · [lastUpdatedDate 检索](https://export.arxiv.org/api/query?search_query=all%3AJEPA&start=0&max_results=50&sortBy=lastUpdatedDate&sortOrder=descending)
2. **Human-JEPA 是对 V-JEPA 2.1-L 的真正继续预训练，而不是冻结特征评测。** 它把标准 multi-block completion 改成纯 past-to-future forecasting，并用冻结初始化 `f₀` 约束 dense context target，再加入 LUPerson-T 图像分支防止外观表征漂移；架构和参数量仍为 0.3B。[方法原文](https://arxiv.org/html/2608.21160v1#S3)
3. **Human-JEPA 最可信的贡献是揭示“继续训练会静默遗忘什么”，而不是全面胜过 V-JEPA 2.1。** 两个预训练 seed 的 frozen-probe 均值中，V-JEPA 2.1-L→Human-JEPA 的 COCO pose AP 为 `.614→.620`、Market-1501 mAP 为 `.4370→.4635`；但 ATR mIoU `.748→.739`、DensePose mIoU `.649→.630`、NTU-120 top-1 `70.8→68.2`，仍有明确代价。最有解释力的负对照是：同数据、anchor 与预算下，block-mask 版本 ReID 跌到 `.2666`，而 forecasting 版本为 `.4635`。[主表](https://arxiv.org/html/2608.21160v1#S4.T1) · [ReID 表](https://arxiv.org/html/2608.21160v1#S4.T2)
4. **Human-JEPA 的 predictor “不再伤害 anticipation”，但尚未证明 rollout 带来额外决策价值。** NTU-120 只看前半段时，V-JEPA 2.1 的 encoder/head 为 `78.91/75.93`，Human-JEPA 为 `79.93/79.99`；完整 bundle 相对基座提高 `4.06 pp`，其中 `2.98 pp` 来自消除基座 predictor 的负作用，而 Human predictor 相对自身 encoder 只增加 `0.06 pp`。论文也明确承认这证明的是同空间一致性，不是额外 anticipatory signal。[anticipation Table 3](https://arxiv.org/html/2608.21160v1#S4.T3)
5. **WA-JEPA 把 V-JEPA 2 从视频 completion 改造成直接输出规划轨迹的 world-action model。** Stage 1 在 nuPlan 多视角视频上混合 full-future mask 与 patch-future mask，并以 conditional flow matching 生成未来 latent；Stage 2 让 future-scene tokens 与 ego-trajectory tokens 在同一 predictor 中联合去噪，最终直接采样 8 个 2 Hz action points，不再通过目标图像和 CEM/MPC 反求动作。[方法原文](https://arxiv.org/html/2608.20974v1#Sx3)
6. **WA-JEPA 的 matched ablation 比跨论文 SOTA headline 更有归因价值。** 不做 Stage 1 时，V-JEPA 2 初始化为 `89.5 EPDMS`，MAE/DINOv3 为 `83.8`、SigLIP2 为 `83.1`；在 V-JEPA 2 scaffold 上，no-Stage-1 / patch-only / full-only / hybrid 为 `89.5 / 91.0 / 91.3 / 91.7`。Stage 2 中，joint predictor + flow 为 `91.7`，joint + direct regression 为 `90.7`。这支持“future masking 与 flow objective 都有作用”，但不同初始化的预训练数据和预算不等价，不能把 `83.8→89.5` 全解释为 JEPA objective。[Table 4](https://arxiv.org/html/2608.20974v1#Sx4.T4)
7. **WA-JEPA 的闭环信号值得重视，但不能写成真实道路验证。** 它在 NAVSIM-v2 得到 `91.7 EPDMS`，高于表中 SparseDriveV2 的 `90.1` 和 Discrete-WAM 的 `90.4`；在 436 个 HUGSIM 仿真场景中 HD-Score 为 `.4462`，高于下一名 DrivoR 的 `.3252`。不过 Extreme 子集只有 `.1362`，comfort `.6620` 明显低于 LTF/DrivoR/VAD 的 `.9478/.9390/.9534`；10 个 seed 只重采样推理噪声，同一训练模型没有多 seed 重训。[NAVSIM 主表](https://arxiv.org/html/2608.20974v1#Sx4.T1) · [HUGSIM 表](https://arxiv.org/html/2608.20974v1#Sx4.T2) · [seed 说明](https://arxiv.org/html/2608.20974v1#Sx8)
8. **复现状态与论文摘要存在重要落差。** WA-JEPA 摘要称“Code is available”，但截至本轮截止，[官方仓库](https://github.com/AFARI-Research/WA-JEPA) 的 README 只有 “The code will be released soon”，仓库未提供训练代码、配置、checkpoint 或许可证；Human-JEPA 原文多次使用“released”描述模型、predictor 与 manifests，但论文和 arXiv 元数据没有给出可访问的一手 artifact 链接。两篇目前都只能审计论文，不能独立复跑。
9. **其它一手入口没有补出严格新增。** OpenAlex 的 I-JEPA、V-JEPA、V-JEPA 2 日期引用链均为 0；Crossref 同期新创建 JEPA 记录为 0；bioRxiv 44 条与 medRxiv 9 条日期记录经全分页标题/摘要扫描均无 `JEPA` 或完整术语命中。Semantic Scholar 官方 API 本轮返回 429，未形成稳定结果，不作为阴性证据。[I-JEPA 引用链](https://api.openalex.org/works?filter=cites%3AW4386076428%2Cfrom_publication_date%3A2026-08-23&sort=publication_date%3Adesc&per-page=25) · [V-JEPA 引用链](https://api.openalex.org/works?filter=cites%3AW4394861491%2Cfrom_publication_date%3A2026-08-23&sort=publication_date%3Adesc&per-page=25) · [V-JEPA 2 引用链](https://api.openalex.org/works?filter=cites%3AW4417261359%2Cfrom_publication_date%3A2026-08-23&sort=publication_date%3Adesc&per-page=25)

## JEPA 方向最新进展

### 1. 两篇新发现同时把随机 block completion 改成因果 future prediction

**事实。** Human-JEPA 用前半视频 tubelets 预测后半 tubelets，WA-JEPA 的 Full-mask branch 也只允许过去帧作为 context；两者都保留 EMA target encoder 和 latent-space prediction，不重建像素。[Human-JEPA forecasting mask](https://arxiv.org/html/2608.21160v1#S3.SS2) · [WA-JEPA Stage 1](https://arxiv.org/html/2608.20974v1#Sx3.SSx3)

**作者主张。** Human-JEPA 认为重复到全时域的 spatial block 会让模型走 appearance-copy 捷径，消耗人体动作与身份能力；WA-JEPA 认为随机 completion 缺乏规划所需的 future-directed generation，且确定性回归容易把多未来平均化。

**本研究判断。** 这不是一句泛化的“future mask 总比 block mask 好”。Human-JEPA 自己显示 forecasting 会牺牲一部分 dense appearance 与平均 action accuracy；WA-JEPA 则发现 full-only `91.3`、patch-only `91.0`、二者混合 `91.7`，说明驾驶任务仍受益于 partial-future completion。更准确的趋势是：**mask geometry 正成为下游因果可见性假设，而不是通用遮挡超参。**

### 2. Predictor 从训练期辅助模块变成可部署接口

- Human-JEPA 训练 predictor 在 encoder 自身空间预测未来 latent，并把 predictor 随 checkpoint 一起作为 anticipation interface；不过当前 probe 只显示它“不伤害”自身 encoder，增量为 `+0.06 pp`。[Table 3](https://arxiv.org/html/2608.21160v1#S4.T3)
- WA-JEPA 把 predictor 扩成 future-scene/action joint generator，经 12 步 flow sampling 直接生成 trajectory；predictor 已从 representation learner 的训练头变成在线 planner。[planning inference](https://arxiv.org/html/2608.20974v1#Sx3.SSx4)

两者共同推进了“predictor 是否值得部署”的问题，但证据层级不同：Human-JEPA 主要验证 feature-space consistency；WA-JEPA 验证了仿真闭环控制，却没有真实车辆、训练 seed 方差或 runtime/latency 报告。

### 3. JEPA 继续预训练的两个核心风险变得可测

**表征遗忘风险。** Human-JEPA 的 naive continued pretraining 在训练 loss 正常下降时，pose AP `.6142→.1105`、DensePose `.6490→.3534`；冻结初始化 anchor 与图像分支分别解决 target drift 和 appearance grounding，说明 EMA teacher 并不会自动保存初始化已有能力。[anchor ablation](https://arxiv.org/html/2608.21160v1#S4.T6)

**任务过拟合风险。** WA-JEPA 让 action supervision 通过 joint interaction module 塑造 scene latent，同时阻断 scene loss 反向更新 action token stream。这使 latent 更贴近 planner，但也意味着它不再是纯自监督通用视频表示；其迁移价值必须在不同 planner、传感器、城市与真实闭环中重新验证。[stop-gradient 设计](https://arxiv.org/html/2608.20974v1#Sx8.SSx3.SSS0.Px1)

### 4. 新发现、actual-use 与 related-work-only 的分流

| 候选 | 时间身份 | JEPA 身份 | 本期处理 |
|---|---|---|---|
| [Human-JEPA](https://arxiv.org/abs/2608.21160) | v1 2026-08-21；索引延迟历史回补 | 继续预训练 V-JEPA 2.1-L，修改 target anchor 与 mask；actual-use | 完整主解读 |
| [WA-JEPA](https://arxiv.org/abs/2608.20974) | v1 2026-08-21；索引延迟历史回补 | V-JEPA 2 ViT-L + future masking + flow + joint action predictor；actual-use | 完整主解读 |
| [When Graph-JEPA Learns the Wrong Thing](https://arxiv.org/abs/2608.20516) | v1 2026-08-20；索引延迟历史候选 | 真正训练 Graph-JEPA；actual-use diagnostic | 不作具体下游主解读：作者证明 repaired target 可由 node census 决定，不能支持 reasoning claim |
| [From World Models to World Action Models](https://arxiv.org/abs/2607.00836) | v6 更新于 2026-08-19；早于窗口 | tutorial 中讨论 JEPA，不运行 JEPA | related-work / survey-only，排除 |

Graph-JEPA diagnostic 的核心警告值得保留：linear probe `.871` 与 effective rank `18–47/128` 看似健康，但 instance retrieval 为 chance；修复后虽恢复 `14.377/14.379 bits`，论文又证明 target 几乎可由 node census 推出，因此“metric 修复”并不等于“科学推理表征成立”。它适合后续做 JEPA 诊断专题，而不是用来补具体应用篇数。[论文摘要与结论](https://arxiv.org/html/2608.20516v1#S11)

## 新增下游论文解读

### 1. Human-JEPA: A Human-Centric Vision Model that Perceives and Anticipates（历史回补）

#### 基本信息

- **完整题目**：[*Human-JEPA: A Human-Centric Vision Model that Perceives and Anticipates*](https://arxiv.org/abs/2608.21160)
- **作者**：Hui Wei、Licai Sun、Guoying Zhao。
- **机构**：ELLIS Institute Finland；芬兰奥卢大学 Center for Machine Vision and Signal Analysis（CMVS）。[论文标题页](https://arxiv.org/html/2608.21160v1)
- **时间与出处**：arXiv:2608.21160 v1，2026-08-21 14:32:08 UTC；`cs.CV / cs.LG` 预印本，未声明会议/期刊接收。
- **JEPA 血缘**：从公开 V-JEPA 2.1-L encoder + predictor 初始化，保持 0.3B 架构与参数量，进行人体视频/图像自监督继续预训练；属于 `method direct-use / checkpoint adaptation`。
- **下游任务**：人体解析、DensePose、COCO pose、NTU RGB-D 120/Kinetics-700 action recognition、Market-1501 person re-identification，以及只观察视频前半段的 early action anticipation。

#### 方法如何衔接 JEPA

**论文事实。** 标准 V-JEPA 2.1 的 context dense target 来自随 student 一起移动的 EMA teacher。Human-JEPA 保留 masked latent prediction，但把 visible context 的 dense target 改成冻结初始化 `f₀(x)`，以 stop-gradient L1 固定已有 dense feature；同时用 958k LUPerson-T person crops 作为单帧 clip 共训，持续补充人体外观。[anchored continued pretraining](https://arxiv.org/html/2608.21160v1#S3.SS1)

第二个变化是用纯 past-to-future mask 替代跨所有帧重复的 spatial multi-block mask：前半 tubelets 是 context，后半是 target。predictor 因而不能从未来其他空间位置复制外观，只能预测 continuation。论文还测试 block/forecast batch mixture、two-phase schedule、part/person masks、skeleton prior 与 motion weighting，但发布 recipe 选择 pure forecasting。[mask 设计](https://arxiv.org/html/2608.21160v1#S3.SS2)

**分类判断。** 论文实际运行 V-JEPA 2.1 checkpoint、EMA target 与 latent predictor，并改变 JEPA target 和 mask；不是 related-work-only，也不是把普通人体 ViT 改名为 JEPA。

#### 数据集、评价指标、主要基线与复现条件

- **继续预训练数据**：检测 536,699 个 Kinetics-700 clips，筛出 164,431 个 full-body clips 与 82,696 个 interaction clips；AIST++ 占视频采样权重 5%；另用 958k LUPerson-T person crops。视频权重为 `0.60/0.35/0.05`。[数据说明](https://arxiv.org/html/2608.21160v1#S4.SS1)
- **训练**：V-JEPA 2.1-L 起点；200 epochs / 60k steps；global batch 为 192 videos + 576 crops；bfloat16、4 GPUs、学习率 `1e-4`、warmup + cosine decay、gradient clipping 1.0；输入为 16 帧、4 fps、256 px。论文未披露 GPU 型号、wall-clock 或能耗。
- **评测**：所有 backbone 冻结、每条 track 使用相同 probe 与训练预算。ATR 报 mIoU，DensePose 报 mIoU，COCO pose 报 AP，NTU/K700 报 top-1，Market-1501 报 mAP/Rank-1/Rank-5。
- **主要基线**：V-JEPA 2.1-L（最重要的同起点对照）、Sapiens2-0.8B、DINOv3-L、HAP ViT-B；消融包括 naive continued pretraining、anchor-only、image-only、anchored block-mask 和多种 person-level mask。
- **统计**：headline 表报告两个预训练 seed 的 mean/spread，但不是所有表格单元都给置信区间；anticipation 的直接 forecast sanity check 只有 20 个 held-out K700 clips。

#### 关键实验结果

| Frozen probe | V-JEPA 2.1-L | Human-JEPA | 方向与边界 |
|---|---:|---:|---|
| ATR mIoU | .748 | .739±.004 | -0.009，dense parsing 退化 |
| DensePose mIoU | .649 | .630±.004 | -0.019 |
| COCO pose AP | .614 | .620±.003 | +0.006；Sapiens2 为 .591 |
| NTU-120 top-1 | 70.8 | 68.2±2.3 | -2.6 pp |
| NTU mutual top-1 | 79.6 | 77.5±1.6 | -2.1 pp |
| Market-1501 mAP | .4370 | .4635 | +0.0265；DINOv3-L 仍为 .5148 |

[完整 frozen-probe 表](https://arxiv.org/html/2608.21160v1#S4.T1) · [ReID 表](https://arxiv.org/html/2608.21160v1#S4.T2)

**matched mask 证据。** anchored block-mask adaptation 的 NTU top-1 为 `65.6`，pure forecasting 为 `70.4`，基座为 `70.8`；block-mask ReID mAP `.2666`，比基座 `.4370` 低 17.04 个百分点，而 forecasting 为 `.4635`。这支持“mask family 决定 continuation adaptation 的损失形态”。[mask ablation](https://arxiv.org/html/2608.21160v1#S4.T4)

**静默坍塌证据。** naive continued pretraining 的 pose AP `.6142→.1105`、DensePose `.6490→.3534`，但训练 loss 持续下降；image branch alone 和 anchor + image 可以避免灾难性遗忘。这个结果比 Human-JEPA 对外部模型的排行榜更有机制价值。[preserver ablation](https://arxiv.org/html/2608.21160v1#S4.T6)

**anticipation 证据。** encoder/head probe 为基座 `78.91/75.93`、Human-JEPA `79.93/79.99`。20 个 held-out clips 上，预测未来与真实未来 cosine 为 `.873`，静态保持最后 latent 为 `.798`，错配另一 clip 未来为 `.735`；但 predictor 对 probe 的增量只有 `+0.06 pp`。[anticipation 结果](https://arxiv.org/html/2608.21160v1#S4.SS3)

#### 相对已有工作的创新

1. 把冻结初始化作为继续预训练期间的 dense target anchor，显式分离“学习新动态”与“保存已有 dense feature”。
2. 用同一 V-JEPA 2.1 scaffold 证明 block mask 在人体继续预训练中同时伤害 action 与 ReID，而纯 future mask 显著减少这种 tax。
3. 不只发布 encoder 逻辑，还直接评估 predictor 是否适合作为同空间 future-latent interface。
4. 用 partner-token removal probe 系统否定九种 person-level objectives，保留“未学到关系”的负结果，而不是只展示 pose/ReID headline。[person-level ablation](https://arxiv.org/html/2608.21160v1#S4.SS4)

#### 事实、作者主张与本研究推断

- **论文事实**：Human-JEPA 在 pose、ReID 和 encoder-only early anticipation 上优于 V-JEPA 2.1-L，但在 ATR、DensePose 与平均 NTU action 上低于基座；forecast predictor 相对自身 encoder 只增加 `0.06 pp`。
- **作者主张**：anchored forecasting 能在不破坏人体 perception 的情况下加入 anticipation，并认为 block mask 的 appearance-copy shortcut 是 action/ReID tax 的来源。
- **本研究推断**：论文最强贡献是一个“继续预训练遗忘审计框架”。它尚未证明一个模型同时取代 Sapiens2/DINOv3 和动作模型：DINOv3 的 ReID 更高，Sapiens2 的高分辨率解析更高，Human-JEPA 的动态优势也主要体现为恢复基座能力，而不是全面新增能力。

#### 局限、复现条件与潜在风险

1. **只有两个预训练 seed。** 表中 spread 不能替代稳定置信区间；ReID、20-clip forecast 等结果的统计覆盖更弱。
2. **anticipation horizon 短。** 输入 16 帧/4 fps，总时长约 4 秒，预测后半约 2 秒；没有动作决策、轨迹规划或长时交互闭环。
3. **训练—评测边界。** 基座和 Human-JEPA 都看过 Kinetics 视频，因此 K700 probe 只衡量保留，不是独立分布泛化。
4. **选择偏差。** full-body detector、空间 engagement gate 与 LUPerson crops 偏向身体完整、可检测、较清晰的人；遮挡、拥挤、小目标、非典型姿态和文化/地理分布可能不足。
5. **“causal probe”边界。** token removal 能测模型对 partner token 的依赖，但不等于识别人际因果机制；论文自己发现九种 person-level objective 均未学出可用 partner dependence。
6. **artifact 未闭环。** 原文声称发布模型、predictor 与 manifests，但截至本轮没有给出可访问的一手仓库、checkpoint、manifest 或完整命令；4 GPU 的具体型号、训练时长与数据获取脚本也未披露。
7. **人体数据风险。** 大规模公开视频/person crop 的许可、隐私、身份偏差与 ReID 滥用风险没有系统讨论，部署时必须额外做数据治理和公平性审计。

#### 是否值得写成区别于追踪日报的原创技术博客

**值得，原创博客优先级高。** 最合适的主题不是“Human-JEPA 超越人体视觉模型”，而是《为什么继续训练 V-JEPA 会静默遗忘：target anchor、mask family 与 predictor 生命周期》。文章应把 pose/ReID 增益、dense/action 退化、`+0.06 pp` predictor 边界和 artifact 缺口放在同一叙事中。

### 2. WA-JEPA: Rethinking the Video JEPA Paradigm for World-Action Modeling in Autonomous Driving（历史回补）

#### 基本信息

- **完整题目**：[*WA-JEPA: Rethinking the Video JEPA Paradigm for World-Action Modeling in Autonomous Driving*](https://arxiv.org/abs/2608.20974)
- **作者**：Xinlin Wang、Yujiao Xiang、Yuheng Zhou、Jingqi Wang、Minqing Huang、Jiajie Huang、Dongxu Wei、Tingguang Zhou、Xiyang Wang、Gong Chen、Zhi Xu、Feiyang Tan、Hangning Zhou、Mu Yang。
- **机构**：Afari Intelligent Drive、电子科技大学、东南大学、北京邮电大学、天津大学。[官方 PDF 标题页](https://arxiv.org/pdf/2608.20974)
- **时间与出处**：arXiv:2608.20974 v1，2026-08-21 10:54:35 UTC；`cs.CV / cs.AI` 预印本，未声明正式录用。
- **JEPA 血缘**：以 V-JEPA 2 ViT-L 初始化，把 JEPA 的 random completion 改成 multi-view future prediction，再用 flow matching 与 joint action stream 直接做自动驾驶规划；属于 `method/system direct-use`。
- **下游任务**：NAVSIM-v1/v2 open-loop planning；HUGSIM 436 场景 zero-shot closed-loop driving simulation。

#### 方法如何衔接 JEPA

**Stage 1（事实）。** 四路同步相机的历史帧始终可见，未来帧走两类 mask：Full-mask 隐去全部 future tokens，只从过去预测；Patch-mask 保留部分 future tokens，维持 V-JEPA 式 completion。EMA target encoder 读取未遮挡未来帧形成 clean target。predictor 不做 L1 regression，而从 Gaussian noise 经 conditional flow matching 生成 future latent。[Stage 1](https://arxiv.org/html/2608.20974v1#Sx3.SSx3)

**Stage 2（事实）。** 模型把 noisy future scene tokens、noisy future ego trajectory、历史 trajectory 与 ego state token 放进 joint predictor；scene 与 action stream 共同迭代去噪。scene prediction loss 在 action-token 接口 stop-gradient，避免 scene loss 反向塑造 action branch；action loss仍能通过 joint interaction 影响 scene representation。推理时用 12 个 sampling steps 直接输出 8 个 2 Hz trajectory points。[Stage 2](https://arxiv.org/html/2608.20974v1#Sx3.SSx4) · [梯度说明](https://arxiv.org/html/2608.20974v1#Sx8.SSx3.SSS0.Px1)

**分类判断。** WA-JEPA 直接加载 V-JEPA 2 ViT-L 并保留 online/EMA target/predictor 的 latent prediction骨架；不是只在 related work 引用 V-JEPA，也不同于先冻结 V-JEPA 特征再接一个独立 planner。

<figure style="margin:1.5em auto;text-align:center;max-width:720px;">
  <img src="https://arxiv.org/html/2608.20974v1/method_comparison_vertical.png" alt="WA-JEPA Figure 1：V-JEPA、解耦/耦合视频世界动作模型与 WA-JEPA 的接口比较" style="display:block;max-width:720px;width:100%;height:auto;margin:0 auto;" loading="lazy">
  <figcaption>WA-JEPA Figure 1：作者把 V-JEPA 的丰富语义、视频世界模型的 future rollout 与直接 planning 汇入同一 latent/action predictor。来源：<a href="https://arxiv.org/html/2608.20974v1#S0.F1">arXiv 官方 HTML</a>。官方 PNG 实际为 993×331、102,456 bytes（约 100.1 KiB；论文 HTML 显示为 698×233），正文限宽 720px 并延迟加载，不在仓库保存副本。</figcaption>
</figure>

#### 数据集、评价指标、主要基线与复现条件

- **Stage 1**：nuPlan 多视角视频；论文未给样本数、epoch/step 数或 wall-clock。
- **Stage 2**：NAVSIM 官方 `navtrain`，在 held-out `navtest` 上评 NAVSIM-v1 PDMS 与 NAVSIM-v2 EPDMS。
- **输入/输出**：left/front/right/rear 四相机，4 个历史帧，256×512；输出 8 个 2 Hz actions。
- **训练资源**：Stage 1/2 分别使用 64/32 张 NVIDIA A800，per-GPU batch 4，bfloat16 + AdamW + DeepSpeed ZeRO-2；没有披露总 GPU-hours、训练 seed 数或 checkpoint。
- **open-loop 基线**：E2E、VLA、video/world-action methods，包括 SparseDriveV2、Drive-JEPA、WAM-Diff、DriveWorld-VLA、Latent-WAM、Discrete-WAM 等。外部模型的 backbone、预训练数据与输入配置不同，最适合看排行榜位置，不适合单独归因 JEPA。
- **closed-loop**：HUGSIM commit `ead17f2`，436 场景，来源为 nuScenes/KITTI-360/Waymo/PandaSet；同 controller/commands/metrics，模型保留各自 sensor 配置。LTF 用三前视相机，其余用四相机。[HUGSIM protocol](https://arxiv.org/html/2608.20974v1#Sx6)

#### 关键实验结果

**NAVSIM headline（作者报告）。** WA-JEPA 在 v2 为 `91.7 EPDMS`，SparseDriveV2 为 `90.1`，Discrete-WAM 为 `90.4`；v1 为 `91.8 PDMS`。[NAVSIM 表](https://arxiv.org/html/2608.20974v1#Sx4.T1) · [v1 表](https://arxiv.org/html/2608.20974v1#Sx4.T3)

**matched encoder/Stage 1 ablation。** 同 Stage 2 架构/数据/优化下，不做 Stage 1 的 MAE/SigLIP2/DINOv3/V-JEPA 2 初始化为 `83.8/83.1/83.8/89.5`；V-JEPA 2 起点再做 patch/full/hybrid Stage 1 为 `91.0/91.3/91.7`。这说明 V-JEPA 2 initialization 与 future-domain adaptation 都有强信号，但初始化对照的上游数据/规模并未匹配。

**matched Stage 2 ablation。** cascaded historical-only 为 `89.9`；separate future-flow predictor 为 `90.8`；joint model 无显式 future supervision 为 `91.1`；joint + direct regression 为 `90.7`；joint + flow 为 `91.7`。flow 相对 regression `+1.0 pp` 是本篇最干净的 objective 证据。[Table 4](https://arxiv.org/html/2608.20974v1#Sx4.T4)

**HUGSIM closed-loop。** WA-JEPA 的 HD-Score `.4462`，DrivoR `.3252`、UniAD `.3124`、LTF `.2310`、VAD `.1393`；但 WA-JEPA comfort `.6620`，低于四个基线中的三项 `.9478/.9390/.9534`，Extreme 场景也只有 `.1362`。因此“综合分第一”和“已在困难场景安全舒适”是两回事。[closed-loop Table 2](https://arxiv.org/html/2608.20974v1#Sx4.T2)

**随机性边界。** 10 个 inference-noise seeds 的 EPDMS 均值 `91.7014`、标准差 `.0531`、95% t-CI `[91.6634, 91.7393]`；这是同一 checkpoint 的 sampling variance，不是独立训练方差。[Appendix C](https://arxiv.org/html/2608.20974v1#Sx8.SSx3.SSS0.Px2)

#### 相对已有工作的创新

1. 在 V-JEPA 2 表征空间中把 future latent generation 与 ego trajectory generation 变成同一 flow process，而不是“V-JEPA encoder + 独立 planner”。
2. 同时保留 Full-mask 的因果 future pressure 与 Patch-mask 的较容易 completion signal，并用 matched ablation 显示二者互补。
3. 用 asymmetric stop-gradient 明确分配 scene loss 与 action loss 的作用方向，使 planning supervision 可以塑造 future scene latent。
4. 不只报 NAVSIM open-loop，还在统一 HUGSIM snapshot 上重跑 436 个闭环场景并报告多种 aggregation，证据比仅靠 open-loop composite score更完整。

#### 事实、作者主张与本研究推断

- **论文事实**：WA-JEPA 在作者表中的 NAVSIM-v2 EPDMS 与 HUGSIM HD-Score 均最高；matched ablation 中 hybrid mask、joint modeling 与 flow 均带来正向差值。
- **作者主张**：V-JEPA-native world-action modeling 同时保留强语义、future rollout 与直接 planning，并能规模化用于自动驾驶。
- **本研究推断**：当前数据支持“V-JEPA 2 是一个强驾驶 world-action 初始化，且 flow 比 direct regression 更适合其 future latent”；尚不支持“该路线已可真实道路部署”。HUGSIM 仍是模拟器，Extreme `.1362`、comfort 退化、无 training-seed 方差和未公开代码都显示系统可靠性证据仍早期。

#### 局限、复现条件与潜在风险

1. **只有仿真闭环。** HUGSIM 虽 source-disjoint 且 photo-realistic，但没有真实车辆、传感器故障、天气长尾、交通参与者不可预测性或安全接管测试。
2. **复现预算高且信息不足。** 64/32×A800 是很高门槛；论文未给 Stage 1/2 epoch、总 step、wall-clock、训练 seed 或能耗。
3. **统计容易误读。** 10 seeds 只变化 sampling noise，同一训练模型的方差未测；与确定性基线“一次评测”的区间也不完全对称。
4. **跨模型比较不完全 matched。** backbone、上游数据、sensor 数、参数量和训练集不同；HUGSIM 中 LTF 还只用三相机。SOTA headline 不能单独归因 JEPA。
5. **复合指标掩盖弱项。** Extreme `.1362` 和 comfort `.6620` 提示极端场景与乘坐质量仍弱；`91.7 EPDMS` 不能替代逐场景安全审计。
6. **生成式 planning 成本未知。** 12 sampling steps 的 latency、吞吐、显存和车载部署性能没有报告。
7. **代码实际未发布。** [官方仓库](https://github.com/AFARI-Research/WA-JEPA) 当前 README 只有 “The code will be released soon”，且仓库 size 为 0；论文摘要的“Code is available”尚未兑现，无法核验数据预处理、训练配置、checkpoint 与 seed 日志。

#### 是否值得写成区别于追踪日报的原创技术博客

**值得，原创博客优先级最高。** 可写《从 V-JEPA 到 World-Action Model：future mask、flow matching 与 joint planning 到底各贡献多少？》。文章应以 Table 4 的 matched ablation 为主线，以 HUGSIM Extreme/comfort、sampling-seed 与 training-seed 的区别、空代码仓和 A800 预算为归因边界；不要只复述 `91.7` 和 `.4462`。

## 横向比较

| 工作 | 时间/证据身份 | JEPA 改造位置 | 下游接口 | 最可信证据 | 主要边界 |
|---|---|---|---|---|---|
| Human-JEPA | 历史回补；method direct-use | 冻结初始化 dense anchor + image branch + past→future mask | frozen human perception/action/ReID probes；future-latent head | block→forecast ReID `.2666→.4635`；naive pose `.6142→.1105` 的遗忘审计 | 两训练 seed；predictor 只 `+0.06 pp`；artifact 无入口 |
| WA-JEPA | 历史回补；method/system direct-use | V-JEPA 2 + hybrid future mask + flow + joint action stream | NAVSIM open-loop；HUGSIM closed-loop simulator | Stage 2 regression→flow `90.7→91.7`；no Stage 1→hybrid `89.5→91.7` | 无训练 seed；高 A800 预算；真实代码未发布；无真车 |
| V-JEPA4A（8 月 19 日已解读） | historical method direct-use | 只改 driving saliency mask | Cityscapes/KITTI/BDD100K perception | same teacher random→MCD 同向提升 | 不做直接规划；无多 seed/代码 |
| Drive-JEPA（7 月 23 日已解读） | method + system direct-use | V-JEPA encoder 接 E2E trajectory planner | NAVSIM planning | 预训练/系统消融可分层 | `93.7` headline 混合 closed-loop refinement；系统归因复杂 |

Human-JEPA 与 WA-JEPA 共同证明“预测未来”不是单一 recipe：前者关注继续预训练时保存哪些既有能力，后者关注 latent 是否能直接支撑 action generation。把两者放在一起，比把它们都归为“V-JEPA 下游微调”更能解释今天的方向变化。

## 值得继续追的问题

1. **Human-JEPA artifact 是否真正发布。** 继续检查 checkpoint、predictor、manifest、数据 gate、probe 配置和两个 seed 日志；若上线，优先复跑 naive collapse 与 block-vs-forecast ReID。
2. **Human predictor 是否有决策增量。** 在多个 observation fractions、长 horizon、动作 anticipation、轨迹预测与交互决策上比较 encoder-only、static-copy、V-JEPA 2 head 与 Human head，而不是只看 20 clips cosine。
3. **人体数据偏差。** 对遮挡、群体规模、身体可见度、肤色/服饰、地区、年龄与 disability 做分层评估，并审计 ReID 滥用与隐私风险。
4. **WA-JEPA code/checkpoint 发布。** 核验官方仓库是否补齐 nuPlan preprocessing、NAVSIM training、HUGSIM commit wrapper、所有配置与训练日志；摘要与仓库状态不一致应持续追踪。
5. **WA-JEPA training variance。** 至少三次独立 Stage 1/2 训练，区分 checkpoint variance 与 flow sampling variance；报告 Table 4 所有差值的 CI。
6. **真实闭环与 runtime。** 在统一四相机/三相机配置、相同 controller 和车载硬件上报告 12-step sampler latency、closed-loop intervention、碰撞/越线/舒适度及极端天气/传感器异常。
7. **future mask 的跨域规律。** 比较 Human-JEPA pure future、WA-JEPA hybrid future、V-JEPA4A saliency mask，在同 backbone/数据/预算下测 dense perception、action、ReID 与 planning，区分“领域假设”和“JEPA 通用规律”。
8. **Graph-JEPA diagnostic。** 把 instance-retrieval bits、target reducibility gate 和 downstream causal probe 接到 Human/WA 类模型，防止 probe/SOTA 分数掩盖表示走捷径。

## 博客价值判断

### 当日追踪博客

应如实发布为：**今日无高可信严格新增；arXiv 索引延迟首次暴露 Human-JEPA 与 WA-JEPA 两篇高价值 actual-use，均作历史回补。** 不能把 8 月 21 日的 v1 写成 8 月 23 日之后提交。

### 区别于追踪日报的原创博客

1. **首选 WA-JEPA，优先级最高。** 它有清晰的 V-JEPA→future mask→flow→joint action 演化链和 matched Table 4，适合写方法归因审计；发布前最好等待代码。
2. **Human-JEPA，优先级高。** 更适合写继续预训练的 silent collapse、能力保存和 predictor 生命周期，而不是人体 SOTA 榜单。
3. **双篇专题也成立。** 主题可为“当 V-JEPA 真正面向未来：保留旧能力与生成动作是两个不同问题”，以 mask geometry 和 target/predictor lifecycle 贯穿。
4. **Graph-JEPA，暂列诊断专题。** 等能把 reducibility audit 应用到其它 JEPA 下游后，再写成“为什么 linear probe 和 effective rank 都可能骗你”。

### 配图判断

本期引用 WA-JEPA Figure 1 的 arXiv 官方外链。它用一张图明确区分 V-JEPA、解耦/耦合视频 WAM 与 joint WA-JEPA，比纯文字更容易理解 predictor 如何从训练头变成 planner。官方 PNG 仅约 100.1 KiB，正文限制最大宽度 720px、启用 lazy loading，未新增图片文件；无需再做本地压缩或扩大提交范围。

## 来源链接

### Human-JEPA 一手来源

- [arXiv 摘要、版本与提交时间](https://arxiv.org/abs/2608.21160)
- [arXiv 官方 HTML 全文](https://arxiv.org/html/2608.21160v1)
- [anchored continued pretraining](https://arxiv.org/html/2608.21160v1#S3.SS1)
- [forecasting mask 与 family mixing](https://arxiv.org/html/2608.21160v1#S3.SS2)
- [数据、评测与训练设置](https://arxiv.org/html/2608.21160v1#S4.SS1)
- [主 frozen-probe 结果](https://arxiv.org/html/2608.21160v1#S4.T1)
- [ReID 与 block-mask 反例](https://arxiv.org/html/2608.21160v1#S4.T2)
- [anticipation 结果](https://arxiv.org/html/2608.21160v1#S4.SS3)
- [mask / person-level / anchor 消融](https://arxiv.org/html/2608.21160v1#S4.SS4)

### WA-JEPA 一手来源

- [arXiv 摘要、版本与提交时间](https://arxiv.org/abs/2608.20974)
- [arXiv 官方 HTML 全文](https://arxiv.org/html/2608.20974v1)
- [官方 PDF（作者机构）](https://arxiv.org/pdf/2608.20974)
- [方法：Stage 1 与 Stage 2](https://arxiv.org/html/2608.20974v1#Sx3)
- [NAVSIM 主结果](https://arxiv.org/html/2608.20974v1#Sx4.T1)
- [HUGSIM closed-loop 结果](https://arxiv.org/html/2608.20974v1#Sx4.T2)
- [matched Table 4 消融](https://arxiv.org/html/2608.20974v1#Sx4.T4)
- [HUGSIM protocol 与多种 aggregation](https://arxiv.org/html/2608.20974v1#Sx6)
- [sampling seed 统计](https://arxiv.org/html/2608.20974v1#Sx8.SSx3.SSS0.Px2)
- [官方仓库：当前只写 code will be released soon](https://github.com/AFARI-Research/WA-JEPA)
- [Figure 1 官方图片](https://arxiv.org/html/2608.20974v1/method_comparison_vertical.png)

### 增量检索与候选分流

- [arXiv JEPA submittedDate feed](https://export.arxiv.org/api/query?search_query=all%3AJEPA&start=0&max_results=100&sortBy=submittedDate&sortOrder=descending)
- [arXiv JEPA lastUpdatedDate feed](https://export.arxiv.org/api/query?search_query=all%3AJEPA&start=0&max_results=50&sortBy=lastUpdatedDate&sortOrder=descending)
- [arXiv 2026-08-24 cs.CV new listings](https://arxiv.org/list/cs.CV/new)
- [OpenAlex I-JEPA 日期引用链](https://api.openalex.org/works?filter=cites%3AW4386076428%2Cfrom_publication_date%3A2026-08-23&sort=publication_date%3Adesc&per-page=25)
- [OpenAlex V-JEPA 日期引用链](https://api.openalex.org/works?filter=cites%3AW4394861491%2Cfrom_publication_date%3A2026-08-23&sort=publication_date%3Adesc&per-page=25)
- [OpenAlex V-JEPA 2 日期引用链](https://api.openalex.org/works?filter=cites%3AW4417261359%2Cfrom_publication_date%3A2026-08-23&sort=publication_date%3Adesc&per-page=25)
- [Crossref 8 月 23–24 日 JEPA 新创建记录](https://api.crossref.org/works?query.bibliographic=JEPA&filter=from-created-date%3A2026-08-23%2Cuntil-created-date%3A2026-08-24&rows=100)
- [bioRxiv 8 月 23–24 日日期列表](https://api.biorxiv.org/details/biorxiv/2026-08-23/2026-08-24/0/json)
- [medRxiv 8 月 23–24 日日期列表](https://api.biorxiv.org/details/medrxiv/2026-08-23/2026-08-24/0/json)
- [Graph-JEPA collapse diagnostic](https://arxiv.org/abs/2608.20516) · [官方代码](https://github.com/corei5/SCI-JEPA/tree/main)
- [World Models to World Action Models tutorial](https://arxiv.org/abs/2607.00836)

### 去重与未纳入说明

- Orthogonal JEPA、S-JEPA diagnostic、DA-LeWM、Multimodal Rapport、AC-MTM、Calibrated Predictive Safety、V-JEPA4A、SCALE 与 WONDER 均已在 8 月 18–23 日记录中登记或完整解读，本期不重复。
- Human-JEPA、WA-JEPA、Graph-JEPA 在 automation memory 与全部既有 `research/jepa/` 记录中均无命中；本期首次登记。
- 本轮没有用 tutorial、仅在 related work 引用 JEPA 的论文、未来 issue-date 或二手摘要补主解读数量。
- Semantic Scholar 官方 API 返回 429，未把失败请求写成“引用链为 0”。
