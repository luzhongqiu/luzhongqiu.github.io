---
title: JEPA 下游研究追踪 · 2026-08-12
date: 2026-08-12 10:00:00
categories:
  - JEPA研究追踪
tags:
  - JEPA
  - JEPA追踪
---

本文属于「JEPA追踪」系列，记录每日论文检索、原文核验与阶段性判断；它保留研究日志的证据密度，与经过主题化重写的原创博客区分。

# JEPA 下游研究追踪（2026-08-12）

> 检索截止：2026-08-12 11:18（Asia/Shanghai，约 03:18 UTC）
>
> 严格增量起点：2026-08-11T03:00:17.795Z
>
> 去重范围：`/Users/nic/.codex/automations/jepa/memory.md` 与 `research/jepa/` 全部既有记录、候选池和排除项。
>
> 证据口径：索引只用于发现；论文身份、方法、实验和发表状态回到 arXiv 原文、DOI 或作者官方入口核验。本文把“新 JEPA 方法”“实际加载 JEPA checkpoint 做下游评估”“仅在相关工作引用”分开记录，也把严格新增与索引延迟回补分开。

## 今日结论

1. **今日确认 2 篇严格窗口内新增的高可信 JEPA 下游论文，另回补 1 篇昨日漏收的实际 JEPA 应用。** *JEPA-WAM: Stage-Level Joint-Embedding Prediction for World-Action Models in Robot Manipulation*（arXiv:2608.10780 v1）冻结 V-JEPA 2 encoder、训练 stage predictor，并把预测的下一阶段 latent 注入机器人 world-action model；它属于明确的 **JEPA 方法改造与下游使用**。*SAR2Agri*（arXiv:2608.11142 v1）自身不是 JEPA 方法，但实际加载公开 SAR-JEPA checkpoint，在统一协议下评估六项农业任务，属于 **evaluation-only direct-use**，不是 related-work-only。[Stage-Level JEPA-WAM 原文](https://arxiv.org/html/2608.10780v1) · [SAR2Agri 原文](https://arxiv.org/html/2608.11142v1)
2. **Stage-Level JEPA-WAM 的总体结果为正，但“任务特定 Stage-I 训练”不是大部分收益来源。** RoboTwin 2.0 的 clean/random 成功率为 `91.42/89.08%`，整体 `90.25%`，高于 matched Motus 的 `88.66/87.02%`；然而保留 V-JEPA2 predictor 与新 conditioning pathway、只去掉 Stage-I 任务训练时仍有 `89.98%`，与完整模型只差 `0.27 pp`。更稳妥的结论是“预训练 V-JEPA2 加 stage-conditioning 接口整体有效”，不是“新 stage objective 单独带来 3 个点”。[原文 Table 1–2](https://arxiv.org/html/2608.10780v1)
3. **这篇 Stage-Level JEPA-WAM 的 target 更接近“带时间上下文的下一阶段表示”，而非严格远期预测。** `81.72%` 的自动阶段短于 64 帧输入窗；clean/random 的 current-target slice overlap 分别为 `86.77%/86.34%`。作者在附录也明确使用这一限定。重叠不使训练无效，但会削弱“模型从纯当前信息外推遥远未来”的表述。[原文阶段诊断](https://arxiv.org/html/2608.10780v1)
4. **SAR2Agri 提供了罕见的 SAR-JEPA 外部下游审计，而且结果不是单向胜负。** SAR-JEPA 在 crop type、完整季 yield、季内 yield、sowing、transplanting、harvest 六项上的结果依次为 `76.725 / 33.551 / 34.300 / 2.433 / 3.012 / 10.286`；SAR2Agri 自研 TD→FF+TD+90% masking pipeline 为 `84.871 / 30.013 / 30.024 / 2.292 / 2.905 / 10.509`。前者在前五项落后，但 harvest MAPE 更低。它证明 SAR-JEPA checkpoint 能迁移到农业监测，不证明 JEPA 是该论文的新机制。[原文 Table 1](https://arxiv.org/html/2608.11142v1)
5. **历史回补的 Field-Layer World Model 把 JEPA 推到无线物理层，但证据仍偏早期。** 它在多频、多分辨率 CSI 上训练 masked/future latent prediction，再把预测 latent 与当前稀疏 pilots 融合，用于 channel reconstruction、16-QAM detection、cross-band reconstruction 和 beamforming。论文曲线显示 FWM 相对 Simple Estimation 与 Direct Training 改善任务表现，尤其在 coefficient NMSE 接近时仍保留更好的 beamforming ratio；但实验只有单一 Chicago ray-tracing 场景，没有表格化主数字、seed 或置信区间。[FWM 原文](https://arxiv.org/html/2608.10222v1)
6. **Temporal Straightening v3 是实质证据更新，但不是一篇新论文。** camera-ready 版本重算/修正主 Table 1 的多行 global-feature 结果，并新增“以两个 held-out validation seeds 为 MPC 选择 straightening strength”的协议说明。例如 DINOv2 global projector + curvature 的 Wall open-loop/MPC 从 v2 的 `42.00/56.67%` 变为 v3 的 `32.00/77.33%`，PushT 从 `5.33/14.67%` 变为 `2.00/8.67%`。7 月 18 日已经深读过该论文，因此今天只做版本审计，后续引用必须以 v3 为准。[v2 PDF](https://arxiv.org/pdf/2603.12231v2) · [v3 PDF](https://arxiv.org/pdf/2603.12231v3)
7. **没有用低可信候选凑数。** SOICT 2025 proceedings 的内镜 I-JEPA 论文摘要确认 actual-use，但正文付费，今天无法核验逐表结果；UA-JEPA 正文仍不可得；ProtJEPA 官方全文入口仍受限；JEPA-DNA v3 主要是参考文献、编号与排版修订，没有新实验。OpenAlex 三条核心引用链和 bioRxiv/medRxiv 当日列表也未补出新的全文可核验 direct-use 稿件。

## JEPA 方向最新进展

### 1. 同名 JEPA-WAM 已经代表两条不同技术路线

昨天追踪的 [JEPA-WAM（arXiv:2608.09381）](https://arxiv.org/abs/2608.09381) 把 current–future joint target prediction 放进 VLA 的 shared predictor；今天的 [Stage-Level JEPA-WAM（arXiv:2608.10780）](https://arxiv.org/abs/2608.10780) 则保留 Motus 的短期视频—动作预测，额外增加“下一语义阶段”的 latent condition。两篇题名缩写相同、作者组不同、模型接口也不同，后续引用时必须带 arXiv ID 或“joint-target / stage-level”限定，不能把实验数字混用。

这两条路线共同显示：V-JEPA 的 predictor 正从预训练附件变成机器人策略里的可查询组件。区别在于，joint-target 版本让预测目标直接塑造动作 backbone；stage-level 版本把 Stage-JEPA 冻结为较慢时间尺度的条件分支，再由局部 WAM 生成短期视频和动作。

### 2. JEPA 下游使用需要增加第三个标签：evaluation-only direct-use

过去的二分法——“actual-use”与“related-work-only”——对 SAR2Agri 不够精确。其自研 pretext 是 time-difference、future-frame、masking 和 curriculum，并没有 JEPA online/target encoder 或 latent-prediction objective；但作者确实下载公开 SAR-JEPA checkpoint，并在相同 SICKLE 输入、UPerNet decoder 与 100-epoch downstream schedule 下产生六项结果。[基线与实现细节](https://arxiv.org/html/2608.11142v1)

因此本文使用三层标签：

- **method direct-use**：复用、改造或从头训练 JEPA objective，并让其进入下游系统；Stage-Level JEPA-WAM 与 FWM 属于此类。
- **evaluation-only direct-use**：真实加载 JEPA checkpoint，在新领域或新任务上评估，但论文自己的方法不是 JEPA；SAR2Agri 属于此类。
- **related-work-only**：只在背景或文献综述出现 JEPA，没有进入实验。

这个区分能避免两个相反错误：把外部迁移证据误删成“只引用”，或把一次 baseline evaluation 写成“新 JEPA 变体”。

### 3. JEPA 的价值正在从平均表示精度转向任务相关结构

Stage-Level JEPA-WAM 追求的是任务阶段；FWM 追求的是 dominant spatial subspace；SAR-JEPA 外部评估覆盖的是作物类型、产量与物候日期。三者不再围绕 ImageNet 线性探测，而是在问 latent 保留了哪种下游结构。

FWM 尤其提供一个值得继续验证的命题：两个模型的 complex coefficient NMSE 可以接近，但预测 latent 若更好保存 channel covariance 的主特征方向，beamforming ratio 仍会显著不同。换句话说，JEPA objective 的下游价值可能体现在“保留任务充分统计量”，而非均匀降低所有观测维度误差。[FWM 下游分析](https://arxiv.org/html/2608.10222v1)

### 4. 版本追踪必须看逐表差异，不能只看摘要与 arXiv comment

Temporal Straightening v3 的 comment 只写 “ICML 2026 Camera Ready”，但 v2/v3 原文对比显示 global-feature 主结果与 MPC 超参选择协议发生了实质变化。空间 feature + projector + straightening 的核心强结果大体保留，但旧版若引用 global-feature 单项 headline，必须回到 v3 重新核对。相反，JEPA-DNA v3 的正文方法、主结果与表格没有实质实验变化，不应凭更新时间重复认领。

这说明每日去重不能只按 arXiv ID，也不能只按标题：同一 ID 的新版本可能改变论文能说什么；另一些版本只修元数据。今天将 Temporal Straightening 登记为 **substantive version update**，但不把它伪装成第三篇新投稿。

### 5. 今日没有新的 A-JEPA 或跨模态高可信 direct-use 论文

按 JEPA、完整术语、I-JEPA、V-JEPA/V-JEPA 2、A-JEPA、SAR-JEPA 及引用链组合检索，严格窗口内的新增集中在机器人与遥感。A-JEPA、音频—视觉和新的生物医学全文没有越过原文核验门槛。这里的“没有”只描述本轮可见的一手入口，不外推为绝对不存在。

## 新增下游论文解读

### 1. JEPA-WAM: Stage-Level Joint-Embedding Prediction for World-Action Models in Robot Manipulation

#### 基本信息

- **作者**：Xiao Liu、Yuguang Yang、Xi Wang、Kai Jiang、Cheng Chi、Yong Xu、Wenchao Ding、Yilun Chen、Yan Wang。
- **机构**：清华大学智能产业研究院（AIR）、北京航空航天大学电子信息工程学院与人工智能学院、清华大学无锡应用技术研究院智能产业研究中心、中国人民大学信息学院、TARS Robotics。
- **时间与出处**：arXiv:2608.10780 v1，2026-08-11 10:33:12 UTC，`cs.RO` 预印本；未见会议接收或正式代码入口。[摘要与提交记录](https://arxiv.org/abs/2608.10780)
- **使用的 JEPA**：`facebook/vjepa2-vitl-fpc64-256`；冻结 V-JEPA2 encoder，继续训练其预训练 predictor 与任务指令 cross-attention adapter。
- **下游任务**：RoboTwin 2.0 的 50 项双臂操作任务，以及两个 LIFT2 真机任务；分别看 success rate、执行步数和 task-progress score。

#### 方法如何衔接 JEPA

作者先用冻结 V-JEPA2 表征相邻帧的变化强度，为每条 demonstration 自动选择最多 5 个阶段边界。对阶段内每个当前时刻 `t`，监督目标是下一个边界 `b(i+1)`；current 与 target 都转成以各自中心为中心的 64 帧 clip。Stage I 冻结 encoder，以当前 clip 和语言指令预测 target clip 的 latent。[方法与数据构造](https://arxiv.org/html/2608.10780v1)

Stage II 冻结完整 Stage-JEPA，把预测的下一阶段 latent 经一个有界全局标量 gate 注入 Motus video tokens。局部 WAM 仍以 8 帧观测预测 8 个未来视频帧和 16 个动作。因此系统显式拆分两种未来：Stage-JEPA 表示“下一步任务状态是什么”，Motus 表示“短期物理变化与动作如何发生”。

<figure>
  <img src="https://arxiv.org/html/2608.10780v1/Figures/intro_3.png" alt="Stage-Level JEPA-WAM 以 Stage-JEPA 预测下一语义阶段并条件化局部世界动作模型" loading="lazy" style="display:block;max-width:820px;width:100%;height:auto;margin:0 auto;">
  <figcaption>Stage-Level JEPA-WAM 官方概念图。原始 PNG 约 140 KiB，本文使用一手来源外链、限制最大宽度并延迟加载，不把大图复制进仓库。来源：arXiv HTML。</figcaption>
</figure>

#### 数据、指标、基线与关键实验

**事实：协议与基线**

- RoboTwin 2.0 覆盖 50 项任务；clean 与 randomized 每个任务各跑 100 个 closed-loop episodes，即每个 checkpoint 共 10,000 次评估。主指标为成功率。
- 对照包括 GO-1、π0.5、X-VLA 与 Motus；其中 Motus 与 JEPA-WAM 使用相同 closed-loop protocol，其余数字来自 Motus 已发表结果。
- Stage I 与 Stage II 都只训练 seed 0；两阶段均使用 8 张 NVIDIA A800 80GB、effective batch 256。Stage I 为 1,000 steps，Stage II 为 4 epochs。

| 模型 | Clean | Randomized | Overall |
|---|---:|---:|---:|
| Motus | 88.66 | 87.02 | 87.84 |
| w/o JEPA | 87.80 | 86.66 | 87.23 |
| w/o Stage-I training | 91.34 | 88.62 | 89.98 |
| JEPA-WAM | **91.42** | **89.08** | **90.25** |

完整模型相对 Motus 的 overall 提升为 `+2.41 pp`；相对“w/o JEPA”为 `+3.02 pp`。但最关键的归因对照是 `w/o Stage-I training → full` 只有 `+0.27 pp`，说明新增 pathway、预训练 predictor 和 Stage-I task tuning 不是同一个贡献。

执行效率方面，全部 rollouts 的平均长度从 Motus `156.28` 降为 `132.80`（`-15.02%`）；只看成功 rollouts，从 `79.57` 降为 `74.82`（`-5.97%`）。前者同时受失败率和 horizon 截断影响，后者更接近真正的动作效率。[原文 Figure 4](https://arxiv.org/html/2608.10780v1)

真机只评估两个 LIFT2 任务、每个模型每任务 20 次。π0.5 的平均 task-progress score 为 `41.50`，JEPA-WAM 为 `48.00`；论文只给均值，没有方差、置信区间或显著性检验。[附录真机表](https://arxiv.org/html/2608.10780v1)

#### 事实、作者主张与本研究推断

- **事实**：完整系统在 RoboTwin 成功率和成功轨迹步数上优于 matched Motus；“不做 Stage-I 任务训练”的模型已经达到 `89.98%` overall。
- **作者主张**：stage-level future guidance 补充了短期 WAM prediction，尤其有助于 handover、placement、packing、arrangement 等需要显式任务进度的语义类别。
- **本研究推断**：当前证据最支持“V-JEPA2 stage-conditioning interface 有用”；对新 Stage-I objective 的独立支持很弱。若论文主张目标是 stage discovery 或 goal-conditioned latent learning的必要性，下一步必须增加随机 target、固定时间偏移、冻结随机 predictor、不同 stage detector 等 matched 对照。
- **归因边界**：它不是单独比较 JEPA 与非 JEPA backbone；结果同时包含 V-JEPA2 checkpoint、Motus、阶段边界构造、语言 adapter、condition gate 和两阶段训练。

#### 创新、局限、复现条件与风险

1. **创新**：把任务级未来与短期物理未来拆开，并用 V-JEPA2 latent 作为两者接口；自动 stage mining 减少人工阶段标签；推理期只需当前的 causal 64-frame buffer 与指令。
2. **target 泄漏式重叠风险**：`81.72%` 阶段短于 64 帧窗，current-target slice 共享至少一帧的比例为 clean `86.77%`、randomized `86.34%`。这不是传统数据集泄漏，因为只发生在离线训练 pair 内，但 target 的时间距离比“下一阶段”措辞容易让人想象得更近。
3. **统计证据不足**：两阶段都只有 seed 0；真机每任务 20 次且只给 progress mean；没有训练方差或 paired significance。
4. **高算力门槛**：完整训练使用 8×A800 80GB；没有 wall-clock、能耗或较小配置复现曲线。
5. **代码缺口**：截至检索截止，arXiv 页面与正文没有可访问的官方代码/项目页。只有超参和附录不足以复现数据 loader、stage mining 与 Motus 集成细节。
6. **基线可比性**：只有 Motus 是完全相同评估协议；GO-1、π0.5、X-VLA 为转载数字，不宜用于严格因果归因。
7. **评测文字有内部张力**：Dataset 段写 evaluation “early stopping disabled”，Execution Efficiency 段又写成功后立即终止；复现 episode-length 指标前需要作者澄清具体 evaluator 行为。

#### 博客价值

**高，值得单独写区别于日报的原创机制审计。** 推荐题目是《两个 JEPA-WAM，两个“未来”：joint target 与 stage condition 到底差在哪》。真正值得写的不是排行榜，而是同名论文的接口差异、`+0.27 pp` 的归因边界，以及 64 帧窗口重叠如何改变“预测下一阶段”的含义。写作前最好等代码或作者澄清 stage detector 与数据配方。

### 2. SAR2Agri: Learning SAR Intensity Representations for Agricultural Monitoring

#### 基本信息

- **作者**：Moti Rattan Gupta、Anupam Sobti。
- **机构**：Plaksha University，Mohali，Punjab，India。
- **时间与出处**：arXiv:2608.11142 v1，2026-08-11 17:01:26 UTC，`cs.CV` 预印本。[摘要与提交记录](https://arxiv.org/abs/2608.11142)
- **JEPA 关系**：论文自己的方法不是 JEPA；作者实际使用公开 SAR-JEPA Base checkpoint 作为全球 SAR foundation-model baseline，并在 SICKLE 的六项下游任务上训练 UPerNet decoder。
- **下游任务**：crop type mapping、完整季与季内 crop-yield estimation、sowing/transplanting/harvest date prediction。

#### 方法如何衔接 JEPA

SAR2Agri 自研 encoder 的预训练数据来自 Tamil Nadu 6,602 个地点、242,590 个 Sentinel-1 VV/VH chips。核心 pretext 是 time-difference prediction（TD）与 future-frame prediction（FF），再研究 spatial masking、multi-task 与 curriculum；最终方案为 `TD → FF+TD + 90% masking`。[数据与方法](https://arxiv.org/html/2608.11142v1)

SAR-JEPA 不进入这条训练 pipeline，而是作为 **外部预训练 backbone** 进入相同 downstream evaluation：对每个时刻抽取多层 feature，时间维 max pooling 后组成 feature pyramid，交给 UPerNet；crop type 用 IoU，其余任务用 MAPE。这个衔接足以把论文纳入“JEPA 的真实下游评估”，但不能把 SAR2Agri 的 TD/FF curriculum 叫作 JEPA。

#### 数据、指标、基线与关键实验

SICKLE 的 crop type split 为 1,937 train / 227 validation；yield 与三项日期任务为 282 train / 37 validation。对比包括 supervised ViT-S、UNet3D、MAE、Time2Agri optical pretexts、DoFA、CopernicusFM、TerraMind、SAR-JEPA、SARATR-X、SAR-W-MixMAE 与 SARMAE。SAR-JEPA 使用 Base variant、batch 128、64×64 输入、100 epochs、Adam；同一组超参用于三类 downstream task，仅 loss 不同。[Appendix Table 8](https://arxiv.org/html/2608.11142v1)

| 方法 | Crop IoU ↑ | Yield MAPE ↓ | In-season yield ↓ | Sowing ↓ | Transplant ↓ | Harvest ↓ |
|---|---:|---:|---:|---:|---:|---:|
| SAR-JEPA | 76.725 | 33.551 | 34.300 | 2.433 | 3.012 | **10.286** |
| SAR2Agri final | **84.871** | **30.013** | **30.024** | **2.292** | **2.905** | 10.509 |

SAR2Agri 在作物分类和产量任务明显更好，在 sowing/transplanting 小幅更好，但 harvest 比 SAR-JEPA 差 `0.223` MAPE。更强的日期基线也存在，例如 CopernicusFM harvest MAPE `1.167`；因此不能把 SAR2Agri 写成六任务全面 SOTA。[完整 Table 1](https://arxiv.org/html/2608.11142v1)

#### 事实、作者主张与本研究推断

- **事实**：作者使用公开 SAR-JEPA checkpoint，在统一 SICKLE protocol 上得到六项明确数字；自研方法在五项优于 SAR-JEPA，harvest 略差。
- **作者主张**：区域对齐的 SAR temporal pretraining 更适合作物类型与产量，90% masking 与 curriculum 能加强已有的 spatio-temporal prior。
- **本研究推断**：对 JEPA 研究者而言，价值不在新 objective，而在“全球 SAR-JEPA backbone 面对区域农业物候时的外部压力测试”。结果暗示 domain/data alignment 可能比通用 checkpoint 规模更重要，但没有 matched 数据规模与架构，不能把差异归因到 TD/FF 优于 JEPA。
- **归因边界**：SAR2Agri final 是 ViT-S 区域预训练，SAR-JEPA 是 Base 全球预训练；模型规模、数据地域、预训练语料与 objective 同时变化。

#### 创新、局限、复现条件与风险

1. **创新**：系统拆分 SAR temporal objectives、masking 与 curriculum 的相互作用；同时给 SAR-JEPA 等 foundation model 一个农业六任务评估面。
2. **小样本与单区域**：回归任务只有 282/37 train/validation samples，且都来自 Tamil Nadu；不能直接外推到不同作物、气候和 SAR acquisition geometry。
3. **没有 test split 与多 seed**：论文报告 validation 性能，未见多训练 seed、置信区间或显著性；小差异特别不稳定。
4. **比较未完全匹配**：Base foundation models 与 ViT-S 自研模型、全球与区域数据并不等价；统一 decoder 不等于统一 pretraining budget。
5. **模态范围有限**：只用 Sentinel-1 intensity，不包含 complex phase、polarimetric 或 interferometric 信息；适用结论应限于 intensity imagery。
6. **复现条件**：论文给出数据构建、预训练/下游超参和公开 checkpoint 使用说明，复现透明度较好；但需固定 GEE 数据版本、S1 acquisition selection 与 SICKLE split。

#### 博客价值

**中等，不建议仅凭这一篇单独写“JEPA 新方法”博客。** 更好的原创主题是《当 JEPA 只是 baseline：如何读懂 foundation model 的外部领域审计》，把 SAR-JEPA 与区域数据对齐、模型规模混杂、六任务非单向结果作为案例。若只介绍 SAR2Agri，自研 temporal curriculum 才是主角，JEPA 应是被审计的对照。

### 3. A JEPA-Based Field-Layer World Model for Bridging Channel Prediction and Estimation（历史回补）

#### 基本信息

- **作者**：Yuzhi Yang、Brahim Mefgouda、Hang Zou、Lina Bariah、Anis Bara、Yuhuan Lu、Hao Zhang、Mérouane Debbah。
- **机构**：Khalifa University Institute of Digital Future；Macao Polytechnic University Faculty of Applied Sciences。
- **时间与出处**：arXiv:2608.10222 v1，2026-08-10 20:47:06 UTC，`eess.SP` 预印本。它早于本轮严格起点，是昨日索引/检索漏收后的历史回补，不冒充今日新投稿。[摘要与提交记录](https://arxiv.org/abs/2608.10222)
- **使用的 JEPA**：从头训练 CSI context encoder、EMA target encoder 与 predictor；同时做 masked latent prediction 和 future latent prediction，并用 diversity regularization 与 frozen-reference incremental alignment 扩展多分辨率 tokenizer。
- **下游任务**：单频 channel reconstruction、uncoded 16-QAM symbol detection、跨频 channel reconstruction 与 single-stream transmit beamforming。

#### 方法如何衔接 JEPA

FWM 为 `32×16`、`128×64`、`1024×64` 等 CSI observation scale 提供各自 tokenizer，将不同 carrier band、时间和分辨率映射到共享 latent field。context encoder 只看 visible cells，predictor 恢复 masked 或 future target latents，target encoder 用 EMA 更新。新增 scale 时，作者冻结旧 reference latent，再对齐新 tokenizer/predictor，避免全模型重训。[架构与训练目标](https://arxiv.org/html/2608.10222v1)

下游阶段并不尝试让 latent 完全替代观测。预测 latent 是历史传播结构 prior；当前 sparse/noisy pilots 提供瞬时相位与细节，两者经 reconstruction head 融合。跨频场景中，部分 band 没有当前 pilot，再用 observed-band pilot latent 校准 missing-band predicted latent。

#### 数据、指标、基线与关键实验

作者用 Sionna RT 的 Chicago city-center 单一场景生成数据：3 个楼顶基站，每站 200 条 UE trajectories，每条 16 个时间点；每个 time-band cell 为 1024 subcarriers × 64 antennas，覆盖 5 个 sub-6-GHz 与 3 个 mmWave bands。trajectory 级拆分 train/test，避免同轨迹切片跨 split。[数据原文](https://arxiv.org/html/2608.10222v1)

主要基线为：

- Simple Estimation（SE）：只用当前 sparse/noisy pilot，不用历史和 predicted latent；
- Direct Training（DT）：相同输入与 reconstruction architecture，但去掉 JEPA pretraining，端到端训练 500 epochs；
- Current-Latent（CL）：用完整当前 channel 的 latent 代替 predicted latent，是不可部署的 oracle reference。

指标包括 coefficient reconstruction NMSE、16-QAM SER、dominant-eigenvector similarity、covariance NMSE 与 normalized beamforming performance ratio。论文没有主结果数值表，关键结果只以曲线呈现，因此本记录不从图中手工估数。[Figure 7–9 与正文](https://arxiv.org/html/2608.10222v1)

**原文可稳妥复述的结果**：单频时，FWM 在不同 pilot 数/噪声下持续优于 SE 与 DT 的 reconstruction NMSE 和 SER，pilot 越稀疏优势越大；跨频时，FWM 与 DT 的 coefficient error 可接近，但 FWM 的 beamforming performance 明显更好，并更接近 CL。这与其更高的 dominant-eigenvector similarity、更低 covariance NMSE 一致。

#### 事实、作者主张与本研究推断

- **事实**：FWM 相对 matched DT 多了 JEPA pretraining；下游仍需 sparse current pilots；跨频数据基于共享 path geometry 合成。
- **作者主张**：latent prediction 保存了 coefficient-wise error 看不到的传播场 spatial subspace，因此能在 NMSE 优势很小或不一致时仍改善 beamforming。
- **本研究推断**：这是 JEPA “预测可复用结构、当前观测校正不可预测细节”的一个清晰物理层实例；beamforming 与 NMSE 排名不一致，是它最有研究价值的结果。但没有数值表和多 seed，当前更像有力的机制假设，而非稳定 benchmark 结论。
- **归因边界**：FWM 同时包含 multi-scale tokenizers、diversity loss、incremental alignment、pilot calibration 与 downstream decoder；不能把全部增益只归给标准 JEPA loss。

#### 创新、局限、复现条件与风险

1. **创新**：把 heterogeneous CSI 映射到共享 field latent，并用增量 tokenizer alignment 扩展观测规格；评价从 coefficient accuracy 延伸到 SER 与 beamforming utility。
2. **合成场景单一**：只有 Chicago 一个 ray-tracing environment，没有真实 RF measurement、不同城市或硬件 impairment。
3. **跨频简化**：所有 band 复用 3.5 GHz 的 path geometry/material configuration，再重算 carrier phase、Doppler 和 array response；没有 frequency-dependent material response 或 band-dependent path visibility。
4. **当前 pilots 不可缺**：模型不是零开销的纯预测器；它明确依赖当前 sparse pilots 恢复瞬时 fine-grained details。
5. **统计与报告缺口**：没有主数值表、seed、error bar 或 CI；纯预测 baselines 因不收敛未报告，削弱了对失败边界的定量比较。
6. **代码状态**：论文脚注给出 `https://github.com/yuzhiyang123/FWM_JSAC`，截至检索时入口返回 404；复现仍依赖作者后续开放数据、代码和配置。

#### 博客价值

**中高，适合在代码/数值表补齐后写原创技术博客。** 推荐角度是《为什么 channel NMSE 接近，beamforming 却差很多：JEPA 的任务相关 latent》。它比单纯介绍无线 JEPA 更能解释 joint-embedding prediction 的价值边界：稳定 spatial subspace 可以预测，瞬时复系数仍要靠 pilots 校正。

## 横向比较

| 维度 | Stage-Level JEPA-WAM | SAR2Agri 中的 SAR-JEPA | Field-Layer World Model |
|---|---|---|---|
| 今日身份 | 严格新投稿 | 严格新投稿 | 索引延迟历史回补 |
| JEPA 类型 | method direct-use | evaluation-only direct-use | method direct-use |
| JEPA 衔接 | 冻结 V-JEPA2 encoder，训练 predictor/语言 adapter | 加载公开 SAR-JEPA Base checkpoint，训练统一下游 decoder | 从头训练 online/EMA encoder 与 masked/future predictor |
| 下游 | 双臂操作与真机 task progress | 六项农业监测 | CSI reconstruction、SER、跨频与 beamforming |
| 最强证据 | 50 任务×2 设置×100 episodes；matched Motus | 六任务统一 SICKLE protocol | matched DT/SE 曲线与 task-level beamforming |
| 最重要反证 | 去掉 Stage-I task training 只差 `0.27 pp`；clip 高重叠 | harvest 略优于自研方法；规模/数据不匹配 | NMSE 优势可很小；单一合成场景、无数值表 |
| seed / 不确定性 | 训练仅 seed 0 | 未见多 seed/CI | 未见 seed/CI |
| 复现状态 | 无官方代码入口；8×A800 | 配方较完整，依赖公开 checkpoint 与数据版本 | 论文代码链接当前 404 |

三篇合起来给出一条比“JEPA 是否更强”更具体的判断：**JEPA 的下游作用取决于 target 选择和接口位置。** Stage-Level JEPA-WAM 把 target 定义成任务进度，FWM 把 target 定义成传播场稳定结构，SAR2Agri 则直接检验已有 checkpoint 在区域物候任务里还保留多少可迁移信息。三者都不能只看 headline 指标，必须同时看 matched ablation、target 构造和数据域。

## 值得继续追的问题

1. **Stage-I 到底贡献多少？** 固定 Motus、V-JEPA2 encoder/predictor 与 gate，比较任务训练、随机 predictor、随机/固定间隔 target、人工 stage 与自动 stage，并报告多 seed paired intervals。
2. **64 帧重叠是否是主要捷径？** 按 current-target overlap 分层评估，增加完全不重叠的 causal target windows，比较 stage distance 与成功率增益。
3. **同名两篇 JEPA-WAM 能否统一比较？** 在同一 LIBERO/RoboTwin 数据和 policy backbone 上，对比 joint current–future target、stage target、两者联合与 no-JEPA，测 success、latency、训练成本和 OOD。
4. **SAR-JEPA 的外部农业结果是否稳定？** 用固定 backbone size、相同 Tamil Nadu 预训练 chips、相同 UPerNet 与 seeds，对比 SAR-JEPA objective、MAE、TD/FF curriculum，拆掉数据与架构混杂。
5. **SAR2Agri 的 harvest 反例来自什么？** 检查 label 分布、时间截断、validation sample variance、Sentinel-1 acquisition density，以及 SAR-JEPA/optical model对 late-season signals 的敏感性。
6. **FWM 的 beamforming gain能否在真实信道成立？** 需要不同城市/材质、band-dependent path visibility、硬件 phase noise、真实 pilot pattern 和 measured CSI；同时公开每个 metric 数值、seed 与 CI。
7. **任务相关结构如何选择？** 对机器人可看阶段/对象关系，对无线可看 covariance eigenspace；应建立 target sufficiency probes，而不是只用 latent NMSE 选 checkpoint。
8. **待取全文候选**：继续获取内镜 I-JEPA 正文、UA-JEPA 正文与 ProtJEPA 官方全文；在看见方法和逐表结果前不升级为主解读。
9. **Temporal Straightening v3 为何大幅改数？** 需要作者 changelog、fixed seeds、v2/v3 checkpoint 对应关系，以及 validation-seed 选 λ 是否完全隔离 test scenarios。

## 博客价值判断

### 当日追踪博客

**应完整发布。** 今日既有明确的新方法论文，也有一篇对 SAR-JEPA 的外部评估，还有一个跨到无线物理层的历史回补。最值得读者记住的不是“三篇都正向”，而是三种 direct-use 的证据等级不同：方法改造、checkpoint 审计、领域 JEPA world model不能混写。

### 区别于追踪日报的原创博客

1. **首选：两篇同名 JEPA-WAM 的机制对照。** joint target 与 stage target 分别把“未来”放进 shared backbone 和 frozen condition branch；适合结合 `+0.27 pp` 与窗口重叠做归因审计。
2. **次选：FWM 的 task-relevant latent。** 围绕“NMSE 相近但 beamforming 不同”讲清楚 JEPA 为什么不追逐所有像素/系数细节；等代码和数值表再写更稳妥。
3. **方法学主题：evaluation-only direct-use。** 用 SAR2Agri 说明一篇论文即使没有提出 JEPA，也可能提供高价值的 JEPA 下游证据。
4. **本轮不自行创建原创博客。** 以上只做价值判断，保持与「JEPA追踪」系列的边界。

### 配图判断

今日只使用 Stage-Level JEPA-WAM 的官方概念图。直接地址为 [arXiv Figure](https://arxiv.org/html/2608.10780v1/Figures/intro_3.png)，PNG 约 139,700 bytes（约 136 KiB），已足够轻量；页面设置 `max-width:820px`、`height:auto`、`loading=lazy`，不新增本地图片文件。FWM 的完整 framework 图约 1.5 MiB，今天不引用，避免页面负担。

## 来源链接

### 增量检索与引用链

- [arXiv 按更新时间检索 JEPA](https://export.arxiv.org/api/query?search_query=all%3AJEPA%20OR%20all%3A%22joint-embedding%20predictive%22&start=0&max_results=100&sortBy=lastUpdatedDate&sortOrder=descending)
- OpenAlex：[I-JEPA 引用链](https://api.openalex.org/works?filter=cites%3AW4386076428%2Cfrom_publication_date%3A2026-08-11&sort=publication_date%3Adesc&per-page=100) · [V-JEPA 引用链](https://api.openalex.org/works?filter=cites%3AW4394861491%2Cfrom_publication_date%3A2026-08-11&sort=publication_date%3Adesc&per-page=100) · [V-JEPA 2 引用链](https://api.openalex.org/works?filter=cites%3AW4417261359%2Cfrom_publication_date%3A2026-08-11&sort=publication_date%3Adesc&per-page=100)
- [bioRxiv 官方日期 API](https://api.biorxiv.org/details/biorxiv/2026-08-11/2026-08-12/0/json) · [medRxiv 官方日期 API](https://api.biorxiv.org/details/medrxiv/2026-08-11/2026-08-12/0/json)

### Stage-Level JEPA-WAM 一手来源

- [arXiv 摘要与提交历史](https://arxiv.org/abs/2608.10780)
- [arXiv HTML 全文](https://arxiv.org/html/2608.10780v1) · [PDF](https://arxiv.org/pdf/2608.10780v1)
- [官方概念图](https://arxiv.org/html/2608.10780v1/Figures/intro_3.png)
- [V-JEPA 2 官方模型页](https://huggingface.co/facebook/vjepa2-vitl-fpc64-256)

### SAR2Agri 一手来源

- [arXiv 摘要与提交历史](https://arxiv.org/abs/2608.11142)
- [arXiv HTML 全文](https://arxiv.org/html/2608.11142v1) · [PDF](https://arxiv.org/pdf/2608.11142v1)

### Field-Layer World Model 一手来源

- [arXiv 摘要与提交历史](https://arxiv.org/abs/2608.10222)
- [arXiv HTML 全文](https://arxiv.org/html/2608.10222v1) · [PDF](https://arxiv.org/pdf/2608.10222v1)
- [论文声明的代码入口（检索时为 404）](https://github.com/yuzhiyang123/FWM_JSAC)

### 实质版本更新

- [Temporal Straightening 版本记录](https://arxiv.org/abs/2603.12231) · [v2 PDF](https://arxiv.org/pdf/2603.12231v2) · [v3 PDF](https://arxiv.org/pdf/2603.12231v3)

### 未纳入与版本审计

- [内镜 I-JEPA DOI](https://doi.org/10.1007/978-981-92-2600-9_2)：摘要确认对 66,820 个无标签帧做 I-JEPA，并评估分类、息肉分割和多任务；正文付费，无法核查逐表数字，且书目身份为 SOICT 2025 proceedings。
- [UA-JEPA DOI](https://doi.org/10.1016/j.patrec.2026.08.007)：正文入口仍不可得，未升级为主解读。
- [ProtJEPA 官方 bioRxiv 记录](https://api.biorxiv.org/details/biorxiv/10.64898/2026.08.03.742606/na/json)：官方摘要状态无实质推进，全文入口仍受限。
- [JEPA-DNA v3](https://arxiv.org/abs/2602.17162)：正文核心实验相对 v2 未见实质变化，不重复纳入。
