---
title: JEPA 下游研究追踪 · 2026-07-18
date: 2026-07-18 10:00:00
categories:
  - JEPA研究追踪
tags:
  - JEPA
  - JEPA追踪
---

> 本文属于「JEPA追踪」系列，记录每日论文检索、原文核验与阶段性判断；它保留研究日志的证据密度，与经过主题化重写的原创博客区分。

# JEPA 下游研究日报（2026-07-18）

> 检索截止：2026-07-18（Asia/Shanghai）  
> 去重基线：已完整读取 research/jepa/ 中 2026-07-15、2026-07-16、纯文本检索专题与 2026-07-17 的记录，并读取自动化记忆；不重复汇报此前已深读的 BA-Future-JEPA、GeoWorld、US-JEPA、NeuroVFM、MoP-JEPA、P-JEPA、Rabtriever、Clin-JEPA、AD-L-JEPA 与 CryoLVM。  
> 纳入标准：论文必须明确引用 JEPA 核心工作，并实际复用、改造或评估潜表示预测机制来完成具体下游任务。仅在 related work 中提及 JEPA 的工作不计入。  
> 证据原则：搜索索引只用于候选发现；以下实质性结论均回到 arXiv 原文、OpenReview/会议页或作者官方代码页核验。

## 今日结论

今天新增三篇此前只进入候选池、尚未完整解读的高价值工作：

1. **MJEPA 是目前 A-JEPA/V-JEPA 向统一音视频模型扩展的最完整证据。** 它用一个共享 encoder 处理音频、视频和音视频联合输入，以 3 个模态内 JEPA 目标和 6 个跨模态潜表示预测目标共同训练。最有说服力的结果不是 1B 模型的榜单数字，而是同一 ViT-L 递进消融：朴素共享 encoder 会让音频、视频都退化，加入跨模态预测后两者才同时改善。[论文原文](https://arxiv.org/html/2606.25225)
2. **Temporal Straightening 把“表示是否适合规划”变成了显式训练目标。** 该 ICML 2026 论文在 JEPA world model 的预测损失上加入局部轨迹曲率正则，使潜空间欧氏距离更接近可达路径距离，并明显提高 Wall、PointMaze、PushT 中的梯度规划成功率。但证据仍来自二维模拟环境，理论保证也主要针对线性动力学。[ICML OpenReview](https://openreview.net/forum?id=Ik1mKtUYlZ)
3. **JetParticle-JEPA 将 I-JEPA 式 masked latent prediction 移植到连续粒子云。** 它在 JetClass 上达到接近全监督 Particle Transformer 的精度，并在低标签与部分缺失变量条件下展示优势。不过“更鲁棒”不能笼统成立：随机删除超过 30% 粒子后，它比监督 ParT 降得更快，ECE 与 log loss 也略差。[论文原文](https://arxiv.org/html/2606.14813)

综合博客价值排序：**MJEPA（高）≈ Temporal Straightening（高）> JetParticle-JEPA（中高）**。

今天最重要的横向结论是：

> JEPA 的新设计空间正在从“预测哪个遮挡块”分化成三层：跨模态预测决定不同感官是否正迁移，潜空间几何决定 predictor 是否容易被 planner 优化，领域 masking 与结构偏置决定模型到底学到何种物理关系。

## JEPA 方向最新进展

### 1. 跨模态 JEPA 从对齐两个 encoder 转向共享一个 encoder

过去的音视频自监督方法通常使用两个 encoder，再用对比、重建或蒸馏目标对齐。MJEPA 反过来先共享参数，再用跨模态 prediction 解决梯度冲突。它说明“共享 encoder”本身不是统一感知的充分条件：在 AudioSet-20K 上，只做音频/视频模态内预测时，音频 mAP 从独立 encoder 的 30.87 降到 28.70，视频从 19.84 降到 17.90；加入音频↔视频跨模态预测后，分别回升到 33.52 与 19.58。[递进实验](https://arxiv.org/html/2606.25225#S4)

### 2. 规划型 JEPA 开始主动塑造 latent geometry

此前 GeoWorld 用双曲空间表达层次分叉，MoP-JEPA 用多 predictor 表达一对多未来；Temporal Straightening 则直接惩罚连续 latent velocity 的转角。三者对应不同问题：

- GeoWorld：潜空间采用什么全局几何；
- Temporal Straightening：局部轨迹是否足够直，目标函数是否易优化；
- MoP-JEPA：同一状态动作是否需要多个合法后继。

这三类改造并不互斥。一个真正可规划的 JEPA world model 很可能既需要可分叉的多未来接口，也需要对 planner 友好的局部和全局几何。

### 3. JEPA 正进入非规则科学数据，但“领域先验”与 JEPA 贡献必须拆开

JetParticle-JEPA 不把粒子云栅格化或离散 token 化，而是保留 Particle Transformer 的成对物理关系，并加入 contiguous particle masking、feature dropout、KoLeo/SIGReg 与物理偏置。结果来自整套组合，不能把所有提升归为“latent prediction 胜过 reconstruction”。[方法原文](https://arxiv.org/html/2606.14813#S4)

### 4. 今日新增候选很多，但没有挤入深读的第四篇

本轮还核验了以下实际采用 JEPA 的候选：

- [FF-JEPA](https://arxiv.org/html/2606.09311)：在 action-conditioned JEPA world model 上增加 action-free latent subgoal planner，初步结果只覆盖 PushT，且部分外部基线协议不同，暂留候选池。
- [Emotion-JEPA](https://openreview.net/forum?id=J5TIa3f9vd)：以 predictive visual adaptation 和 audio-modulated fusion 做多模态情感识别，当前仍为 TMLR under review。
- [SPACE-HOP](https://openreview.net/forum?id=t9LTeubtto)：JEPA 预训练用于航天器 6-DoF 位姿估计，但属于 AI4Space 短篇/工作坊证据。
- [From Offline Trajectories to Online Adaptation](https://openreview.net/forum?id=8li5NOHh9S)：像素+游戏 RAM 的多模态 JEPA 用于 Pokemon Red 下游 PPO，当前为 DEMO 2026 Poster。

它们都不是“只引用 JEPA”，但证据广度、正式发表状态或复现条件暂时弱于今天的三篇，因此不为凑数扩成第四篇。

## 新增下游论文解读

### 1. MJEPA：用一个 JEPA 统一音频、视频与音视频表示

**完整题目**：[MJEPA: A Simple and Scalable Joint-Embedding Predictive Architecture for Audio-Visual Learning](https://arxiv.org/abs/2606.25225)  
**作者**：Revant Teotia、Adrien Bardes、Michael Rabbat、Sumit Chopra、Matthew J. Muckley、Nicolas Ballas。  
**机构**：FAIR at Meta、New York University。  
**时间与出处**：arXiv v1，2026-06-23；截至检索截止日，arXiv 页面尚未标注正式会议出处，按预印本处理。  
**代码状态**：论文和 arXiv 页面未给出官方代码、权重或训练日志。

#### 它引用并使用了哪种 JEPA？

MJEPA 明确把 A-JEPA、V-JEPA/V-JEPA 2 的模态内 masked latent prediction 扩展到共享音视频模型：

- 一个 ViT encoder 共享处理 audio、video 和拼接后的 audio-video tokens；音频用 2D spectrogram patch projection，视频用 3D tubelet projection。
- EMA target encoder 处理完整输入，context encoder 只处理遮挡后的输入；共享窄 ViT predictor 预测多个 encoder 中间层的 masked token latent，以 L1 距离训练。
- 三个模态内目标分别对应 audio、video、audio-video。
- 六个 3 层 MLP 跨模态 predictor 在最后一层 mean-pooled latent 上做 audio、video、audio-video 之间的有向预测。
- 总损失是 3 个模态内目标和 6 个跨模态目标的无权重求和。

因此它不是“用现成 V-JEPA 特征做分类”，而是对 **JEPA 的 encoder sharing、input modes 和 prediction graph** 做了实质改造。[架构与目标](https://arxiv.org/html/2606.25225#S4)

#### 下游任务、数据、指标与基线（事实）

- 预训练：
  - AudioSet-2M：约 180 万个 10 秒音视频片段，约 5,000 小时；
  - VideoMix2M：约 200 万个视频、约 136,000 小时，来自 HowTo100M、Kinetics-710 与 Something-Something-v2。
- 模型：ViT-L 约 300M 参数；ViT-g 约 1B 参数。均训练 150k steps；扩展模型再做 12k-step、64-frame cooldown。
- 音视频分类：AudioSet-20K，音频、视频和音视频输入均用 mAP。
- 音频分类：AudioSet-20K、FSD50K 用 mAP，ESC-50 用 accuracy。
- 视频理解：Kinetics-400、Something-Something-v2 用 top-1 accuracy。
- 跨模态检索：AudioSet retrieval subset，报告 audio→video 与 video→audio 的 R@1/5/10。
- 统一评测协议：冻结 encoder，训练一个含 cross-attention、4 个 Transformer blocks 和分类头的 attentive probe。
- 主要基线：A-JEPA、V-JEPA/V-JEPA 2、SSLAM、CAV-MAE、MAViL、EquiAV、CAV-MAE Sync、XKD，以及若干更大音频模型。

#### 关键结果（作者报告）

递进消融最能隔离方法贡献：

| ViT-L / AudioSet-2M 设置 | Audio mAP | Video mAP | Audio-video mAP |
|---|---:|---:|---:|
| 独立 audio / video encoders | 30.87 | 19.84 | — |
| 共享 encoder，仅模态内目标 | 28.70 | 17.90 | 32.38 |
| + audio↔video 跨模态预测 | 33.52 | 19.58 | 36.34 |
| + audio-video 联合输入与全部 9 个目标 | 38.89 | 25.38 | 42.90 |
| + VideoMix2M | 40.00 | 29.63 | 45.31 |
| + ViT-g | 40.97 | 29.82 | 45.44 |

主下游表：

- AudioSet-20K：ViT-g 冻结特征的 audio/video/audio-video mAP 为 40.97/29.82/45.44；最强所列 frozen AV baseline EquiAV 为 34.25/18.60/38.60。
- ESC-50/FSD50K：ViT-g 冻结特征为 96.9 accuracy / 65.8 mAP，分别略高于所列最佳 fully-finetuned 结果 96.5 / 62.6。[音频表](https://arxiv.org/html/2606.25225#S5.SS2)
- K400/SSv2：ViT-g 为 85.0/73.9，低于 V-JEPA 2 ViT-g 的 86.6/75.3；ViT-L 的 84.7/73.3 接近 V-JEPA 2 ViT-L 的 85.1/73.7，但后者使用约 10 倍视频数据。[视频表](https://arxiv.org/html/2606.25225#S5.SS3)
- 跨模态检索并未全面领先：MJEPA audio→video R@1/5/10 为 29.3/53.7/61.8，EquiAV 为 29.6/53.7/63.1；video→audio 为 30.6/53.4/61.3，CAV-MAE Sync 为 35.2/58.3/67.6。[检索表](https://arxiv.org/html/2606.25225#S9)

#### 事实、作者主张与本研究推断

- **事实**：共享 encoder 仅配模态内 JEPA 目标会同时损害音频和视频表示；加入跨模态 prediction 后，在同一 ViT-L/AS2M 递进协议下两者都改善。
- **作者主张**：cross-modal prediction 是共享 encoder 产生正迁移的关键，单一 JEPA objective family 足以替代复杂的对比、重建和增强组合。
- **本研究推断**：论文真正有因果含量的是前半段递进消融，不是最终 1B 榜单。ViT-g、额外 136k 小时视频、64-frame cooldown 与强 attentive probe 同时变化后，最终数字不能只归因于跨模态 JEPA。

#### 创新、局限、复现条件与风险

- 创新是把模态内 masked token prediction 与 pooled cross-modal prediction 统一为一个有向 prediction graph，并允许同一 encoder 在单模态缺失时继续工作。
- attentive probe 本身并不轻：包含 cross-attention 和 4 个 Transformer blocks。作者重跑公开基线后，某些基线分数大幅高于原论文 linear probe；这提高了内部一致性，却不等同于所有历史论文的原协议横比。
- 预训练数据与参数量差异很大。对 85M A-JEPA、170M AV 基线和 1B MJEPA 的跨行比较不能作为纯目标函数证据。
- AudioSet 标签噪声与音画不同步会影响分类/检索；检索只在 AudioSet subset，且 MJEPA 没有全面超过显式对比式方法。
- 论文未报告训练硬件、总 GPU-hours、跨种子方差、模型校准或真实缺失/损坏模态压力测试。
- 截至本次检索没有官方代码与 checkpoint，完整 1B 复现成本高且无法独立核查。

#### 博客价值

**高。** 推荐题目：《一个 encoder 能同时听和看吗？MJEPA 证明“共享参数”不等于“共享语义”》。文章主线应放在“朴素共享导致负迁移→跨模态 prediction 恢复正迁移”，并把 1B scaling、强 probe 和检索未全面领先放在结论旁。

---

### 2. Temporal Straightening：把 JEPA 潜空间拉直以服务梯度规划

**完整题目**：[Temporal Straightening for Latent Planning](https://arxiv.org/abs/2603.12231)  
**作者**：Ying Wang、Oumayma Bounou、Gaoyue Zhou、Randall Balestriero、Tim G. J. Rudner、Yann LeCun、Mengye Ren。  
**机构**：New York University、Brown University、University of Toronto。  
**时间与出处**：arXiv v2，2026-06-11；ICML 2026 camera-ready，OpenReview 标注 ICML 2026 regular。[OpenReview](https://openreview.net/forum?id=Ik1mKtUYlZ)  
**代码**：[官方项目与代码入口](https://agenticlearning.ai/temporal-straightening/)；[官方 GitHub](https://github.com/Agentic-Learning-AI-Lab/temporal-straightening)。

#### 它如何衔接 JEPA？

论文实现的是用于 planning 的 action-conditioned JEPA world model：

- sensory encoder 将图像映射到 spatial 或 global latent；
- action encoder 编码连续动作；
- causal ViT predictor 根据历史 latent 和 action 预测下一 latent；
- prediction loss 对 stop-gradient target latent 做 MSE；
- 新增 straightening loss：对三个相邻 latent 的两段 velocity 计算负 cosine similarity，惩罚方向转折；
- 训练时联合优化 predictor 和可训练 projector/encoder，推理时通过 predictor rollout，对 action sequence 做梯度下降或 MPC。

它明确引用 JEPA、V-JEPA/V-JEPA 2，并实际改变 JEPA 的 latent geometry 和 downstream planner objective，不是仅在 related work 中提及。[方法原文](https://arxiv.org/html/2603.12231#S3)

#### 下游任务、数据、指标与基线（事实）

- 环境：Wall、PointMaze-UMaze、PointMaze-Medium、PushT，均为二维 goal-reaching/操作模拟环境。
- 视觉表示：
  - 冻结 DINOv2 backbone + 可训练 CNN projector；
  - 从头训练 ResNet；
  - 分别比较 CLS/global features 与保留空间结构的 patch features。
- predictor：带 action/proprioception 条件和时间因果 mask 的 ViT。
- planner：gradient descent（GD）为主，另比较 CEM；同时评测 open-loop 与每步重规划的 MPC。
- 目标从 test trajectories 采样，保证 25 步内可达；frameskip=5。
- 主指标：50 个测试样本的 goal-reaching success rate，三个 data-sampling seeds 的 mean±std。
- 核心基线：DINO-WM 冻结 DINOv2 features，以及同一 projector/ResNet 架构下不加 curvature regularizer 的 matched ablation；附录还比较 smoothness 与 temporal contrastive objectives。

#### 关键结果（作者报告）

空间特征、GD planner 的 matched ablation：

| Encoder | Straightening | Wall OL/MPC | UMaze OL/MPC | Medium OL/MPC | PushT OL/MPC |
|---|---|---:|---:|---:|---:|
| DINOv2 patch + projector | 否 | 80.0 / 90.7 | 44.0 / 81.3 | 72.0 / 96.7 | 70.0 / 78.7 |
| DINOv2 patch + projector | 是 | **90.7 / 100** | **94.0 / 100** | **82.7 / 98.7** | **77.3 / 85.3** |
| ResNet from scratch | 否 | 1.3 / 6.7 | 14.7 / 66.0 | 18.7 / 57.3 | 71.3 / 70.7 |
| ResNet from scratch | 是 | **84.7 / 100** | **64.7 / 98.7** | **80.7 / 99.3** | 70.7 / **91.3** |

50-step 压力测试更复杂：

- PointMaze-Medium 上，projector straightening 的 open-loop/MPC 从 60/72 提升到 68/88；ResNet 从 14.67/48 提升到 76/98.67。
- PushT 上并非每格都改善：projector MPC 为 26.67→24.00，ResNet open-loop 为 13.33→10.67；加入 global aggregation 的 combined cost 后 MPC 才更稳定。[长时域表](https://arxiv.org/html/2603.12231#S5.SS3)
- 论文还报告，straightening 对 CEM 也有改善；CEM 绝对成功率更高但推理更慢，straightened GD 提供更好的成功率—延迟折中。

#### 事实、作者主张与本研究推断

- **事实**：在同 encoder/projector、同数据、同 predictor 和同 planner 的控制实验中，加入 curvature regularizer 通常显著提高 25-step open-loop 与 MPC 成功率；PointMaze-UMaze 的增益尤其大。
- **作者主张**：低曲率使 latent 欧氏距离更接近 geodesic distance，改善 planning Hessian 条件数，从而让 gradient-based action optimization 更稳定。
- **本研究推断**：论文支持“局部拉直有助于当前这些二维任务的梯度规划”，但还不能证明真实世界动力学存在全局欧氏、低曲率坐标系。长时域 PushT 的反例也表明，geometry regularizer 与 planner cost 仍需共同设计。

#### 创新、局限、复现条件与风险

- 创新是把表示几何、world-model prediction 与 planner conditioning 放进同一条可验证链，而不是只展示 latent 可视化。
- 理论核心针对线性动力学、可逆/可控子空间；真实实验用非线性 predictor，理论不能直接推出全部经验结果。
- 全部任务为二维模拟环境，无真实机器人、相机噪声、接触不确定性、动作延迟或跨环境迁移。
- 目标从已知可达的 test trajectory 采样，不能代表开放世界目标发现或不可达目标检测。
- 25-step 主表只有 50 个测试样本与 3 个 data seeds；并非大规模、多机器人统计。
- 对称欧氏 goal cost 不适合不可逆或有方向代价的动力学，论文自己建议未来使用 quasimetric。
- 从头 ResNet 的无正则结果在部分环境异常低，虽然 matched ablation 显示强增益，也意味着训练稳定性和超参数敏感性值得独立复现。
- 优点是 ICML 正式论文、代码与配置公开，复现门槛明显低于今天另外两篇。

#### 博客价值

**高。** 最适合与 GeoWorld、MoP-JEPA 合写：《JEPA 为什么还不会规划：空间要拉直、未来要分叉、距离要能优化》。若单篇成文，可用《把潜空间拉直以后，梯度下降就会规划了吗？》并重点解释短时域强结果与长时域反例。

---

### 3. JetParticle-JEPA：在连续粒子云中预测被遮挡粒子的 latent

**完整题目**：[JetParticle-JEPA: An Efficient Self-Supervised Representation Learning method for Jet Tagging in High-Energy Physics](https://arxiv.org/abs/2606.14813)  
**作者**：Guillaume Letellier、Antonin Vacheret、Frédéric Jurie。  
**机构**：GREYC（Normandy University、Unicaen、ENSICAEN、CNRS）与 LPC Caen（Normandy University、Unicaen、ENSICAEN、IN2P3/CNRS）。  
**时间与出处**：arXiv v1，2026-06-12；当前为预印本。  
**代码状态**：论文称投稿期可按请求提供，正式发表后公开代码和权重；截至检索截止日尚无公开仓库链接。

#### 它如何衔接 JEPA？

JP-JEPA 明确引用 I-JEPA，并把 image block masking 改造成连续粒子云上的 latent prediction：

- 以 Particle Transformer（ParT）为 student、teacher 和 predictor 的核心；
- 先用 Point-JEPA/HEP-JEPA 的 greedy nearest-neighbor 顺序排列粒子，再做 contiguous masking，使 target 对应局部相干的粒子区域；
- EMA teacher 看完整粒子集合，student 只看 context particles；predictor 恢复 target particle 和 event-level latent；
- teacher branch stop-gradient；event latent 使用 Smooth L1 与 KoLeo/SIGReg 防坍塌；
- ParT attention 保留物理 pairwise bias；student 做 PID/trajectory-displacement feature dropout，而 teacher 保有更完整信息；
- 下游使用 event CLS token 接三层 MLP，并默认联合微调 encoder。

这不是“仅用 I-JEPA 作为灵感”，而是实际实现 teacher–student、masking、latent predictor 与 EMA target 的 JEPA pipeline。[方法原文](https://arxiv.org/html/2606.14813#S4.SS1)

#### 下游任务、数据集、指标与基线（事实）

- JetClass：100M train、5M validation、20M test 的模拟 jet events；10 个平衡类别，提供 kinematics、particle ID 和 trajectory displacement。
- Top Quark Tagging：1.2M/0.4M/0.4M train/val/test，只提供 kinematics。
- Quark–Gluon Tagging：1.6M/0.2M/0.2M，提供 kinematics + particle ID。
- 下游任务：10 类 jet tagging、top-vs-QCD 二分类、quark-vs-gluon 二分类。
- 指标：accuracy、AUROC、固定 signal efficiency 下的 background rejection；另评测 log loss、ECE 和 entropy。
- 标签效率：JetClass 多种子集比例的全监督 ParT vs JP-JEPA fine-tuning。
- 鲁棒性：单变量删除、成组变量删除、随机 particle drop，以及不同粒子数/能量区间分析。
- 基线：PFN、ParticleNet、ParT、MIParT、L-GATr、LLoCa，以及 SSL 的 MPMv2、J-JEPA、HEP-JEPA。
- 预训练约 10 epochs，batch 2048；JP-JEPA Small 使用 4×A100 80GB、float32。JetClass fine-tuning 为 500k steps，外部两数据集 10 epochs。

#### 关键结果（作者报告）

| 数据集 / 模型 | Accuracy | AUROC |
|---|---:|---:|
| JetClass ParT（监督） | 0.861 | 0.9877 |
| JetClass L-GATr（监督） | **0.865** | **0.9884** |
| JetClass JP-JEPA Mini | 0.858 | 0.9872 |
| JetClass JP-JEPA Small | 0.861 | 0.9876 |
| Top Tagging ParT fine-tuned | 0.944 | 0.9877 |
| Top Tagging JP-JEPA Small | 0.939 | 0.9852 |
| Quark–Gluon ParT fine-tuned | 0.852 | 0.9230 |
| Quark–Gluon JP-JEPA Small | 0.848 | 0.9185 |

JP-JEPA 是表中最强 SSL 方法之一，在 JetClass accuracy 上追平监督 ParT，但没有超过最强监督 L-GATr；在两个外部数据集上也略低于监督 ParT。[主表](https://arxiv.org/html/2606.14813#S2.SS2)

鲁棒性与不确定性需要分开看：

- 删除整组 particle-ID 变量时，JP-JEPA accuracy 仍为 0.5355，ParT 仅 0.1361，支持 feature-dropout 训练带来的缺变量鲁棒性。
- 随机删除超过 30% 粒子后，JP-JEPA 的性能下降反而比 ParT 更陡；作者将其解释为模型依赖整体粒子云几何，而 ParT 更依赖少数 leading-particle shortcuts。[缺失输入分析](https://arxiv.org/html/2606.14813#S2.SS3)
- ParT 的 ECE 0.0058、log loss 0.3919，均略优于 JP-JEPA 的 0.0092/0.3934；因此“uncertainty behavior 更好”主要来自 entropy 分布更尖锐，不等于全局校准更好。[不确定性分析](https://arxiv.org/html/2606.14813#S2.SS4)

#### 事实、作者主张与本研究推断

- **事实**：JP-JEPA 在 100M 模拟 JetClass 上达到与监督 ParT 几乎相同的 accuracy/AUROC，并在成组缺失变量时明显更稳；但最强监督模型仍更高，外部数据集也略落后。
- **作者主张**：latent particle prediction 学到更完整、物理有意义的粒子云流形，因此低标签、缺变量和不确定性行为优于纯监督分类边界。
- **本研究推断**：最可信的收益来自“JEPA pretraining + feature dropout + ParT physics bias”的整体。成组变量删除结果很强，但随机删粒子和校准结果提示，论文的“现实鸿沟已被跨越”叙事过早。

#### 创新、局限、复现条件与风险

- 创新是直接在连续 particle cloud 上做 JEPA，不经 subjet grouping、voxelization 或离散 tokenization，并同时保留 event/particle 两级表示。
- 三个数据集都是模拟数据；没有真实 LHC collision data、data-vs-Monte-Carlo shift、不同 detector geometry 或真实故障验证。
- 预训练使用多项领域设计：contiguous ordering/masking、pairwise bias、feature dropout、KoLeo/SIGReg。缺少同一 ParT、同一增强与正则下仅替换 JEPA-vs-MAE/对比目标的最小归因实验。
- 下游默认联合微调 encoder；不能把最终结果理解为完全冻结、开箱即用的 foundation representation。
- JetClass 主表没有置信区间；外部任务虽报告多次初始化标准差，HTML 转换没有完整呈现每个误差值。
- 小标签子集取每类文件的前 X%，而非每次随机采样；作者做了分布分析，但仍应警惕文件顺序与子样本代表性。
- 论文未公开代码和权重；尽管超参数较详细，当前仍不能独立复核数据管线和图中低标签曲线。
- 用高 entropy 更少来解释“更懂得不确定”并不充分；ECE 与 proper scoring rule 反而略差，应补 OOD detection、coverage-risk 与 detector-shift calibration。

#### 博客价值

**中高。** 推荐题目：《把 I-JEPA 搬进大型强子对撞机：不重建粒子，能否跨越模拟与真实的鸿沟？》。适合展示 JEPA 如何适配非规则科学数据，但必须并列写出“全为模拟数据、随机丢粒子反例、校准略差、无公开代码”。

## 横向比较

| 论文 | JEPA 改造层级 | 具体下游 | 最强证据 | 主要混杂/风险 | 当前证据等级 |
|---|---|---|---|---|---|
| MJEPA | 共享 encoder、3 个模态内 + 6 个跨模态 prediction | 音频/视频/AV 分类与跨模态检索 | 同 ViT-L/AS2M 递进消融直接显示跨模态预测消除负迁移 | 1B scaling、额外数据和强 probe；无代码；检索未全面领先 | **中高：机制证据强，仍是预印本** |
| Temporal Straightening | JEPA prediction + latent curvature regularizer | 2D goal-reaching、PushT、GD/CEM/MPC | ICML 正式论文；matched ablation；代码公开；多环境一致趋势 | 仅模拟环境；线性理论外推；长时域少数反例 | **高：规划几何证据最完整** |
| JetParticle-JEPA | 连续粒子 masking、ParT predictor、物理偏置与 feature dropout | JetClass/top/quark-gluon tagging | 100M 预训练规模；三数据集；缺变量压力测试 | 全模拟；多项领域改造混杂；粒子大比例丢失与校准反例；无代码 | **中：应用具体，现实外推有限** |

共同结论：

1. **matched ablation 仍比 leaderboard 更重要。** MJEPA 的共享 encoder 递进实验和 Temporal Straightening 的有/无曲率正则，比跨参数量、跨数据量的最终榜单更能说明 JEPA 改造为何有效。
2. **predictor 正在从预训练附件变成结构接口。** MJEPA 用它连接模态，Temporal Straightening 用它连接表示和 planner，JP-JEPA 用它连接粒子局部与 event-level 物理表征。
3. **“鲁棒”必须拆成不同故障模式。** 缺一组输入变量、随机缺大量粒子、跨数据集、校准、闭环误差是不同问题；在一个维度更好不能代表全面更稳。
4. **规模与目标函数经常一起变化。** JEPA 论文越来越依赖更大 encoder、更广数据与领域先验，博客和综述必须把目标、架构、数据、probe 四类变量分开。

## 值得继续追的问题

1. **MJEPA 的正迁移究竟来自 cross-modal prediction 还是 shared encoder 的容量共享？** 需要同总参数量的双 encoder、shared encoder、对比对齐、latent prediction 对照，并报告多种音画不同步与缺模态压力测试。
2. **MJEPA 能否扩展到非配对和弱配对数据？** 当前全局 pooled predictor 对 10 秒片段有效，但细粒度声源定位、说话人/唇动同步和长视频事件边界可能需要 token-level correspondence。
3. **Temporal Straightening 与 GeoWorld/MoP-JEPA 能否组合？** 双曲几何表达层次、多头 predictor 表达分叉、局部曲率正则改善优化；三者应在同一视觉机器人基准做组合和消融。
4. **straightening 会不会抹掉必要的不可逆性与事件边界？** 应在接触丰富、带滞后/不可逆动态的真实机器人任务中比较 Euclidean cost、quasimetric 与 learned planner cost。
5. **JP-JEPA 能否在真实 detector shift 下保持收益？** 最关键的下一步不是再刷模拟 JetClass，而是在真实数据控制区、不同 shower generator、detector calibration 与 pileup 条件下测试。
6. **JP-JEPA 的低标签收益能否与 MAE/MPM 做 matched compute 对照？** 需要同 ParT、同 masking、同 feature dropout、同 fine-tuning budget，只替换 latent-vs-input target。
7. **FF-JEPA 是否值得下一轮深读？** 它直接针对长时域和无 goal-image 规划，但当前只有 PushT preliminary evidence；需先审计表格中缺失/转换异常数字、基线协议和代码可用性。

## 博客价值判断

### 首选：MJEPA 单篇机制解读

推荐题目：

> 一个 encoder 能同时听和看吗？MJEPA 证明“共享参数”不等于“共享语义”

博客应围绕递进消融展开，而不是从 1B 最终分数起笔。最有价值的观点是：跨模态模型的失败不一定来自 encoder 不够大，而可能来自缺少能协调不同模态梯度的 prediction relation。

### 次选：JEPA 规划几何专题

推荐把 Temporal Straightening 与 GeoWorld、MoP-JEPA 合写：

> JEPA 世界模型为什么还不会规划：潜空间要拉直、未来要分叉、距离要能优化

三篇分别回答局部几何、未来多模态和全局几何，能形成比单篇复述更强的原创框架。

### JetParticle-JEPA 适合科学 AI 案例

可与 CryoLVM、NeuroVFM/Vol-JEPA 合成“JEPA 如何进入三维与非规则科学数据”的专题。若单写，应把 simulated-data reality gap 作为中心问题，而不是把接近监督 ParT 写成“已可用于新物理发现”。

## 未纳入与检索去重记录

### 实际采用 JEPA，但本日未深读

| 候选 | 实际用途 | 未纳入原因 |
|---|---|---|
| [FF-JEPA](https://arxiv.org/abs/2606.09311) | LeWorldModel latent 上的 action-free subgoal planner；PushT 长时域/无 goal-image 规划 | 仅单任务 preliminary results；部分对照协议不同；下一轮优先审计 |
| [Emotion-JEPA](https://openreview.net/forum?id=J5TIa3f9vd) | 情绪视频上的 predictive visual adaptation + audio-modulated fusion | TMLR under review；需核对匿名全文、数据切分与融合消融 |
| [SPACE-HOP](https://openreview.net/forum?id=t9LTeubtto) | 航天器 6-DoF pose estimation | AI4Space 短篇/工作坊，证据与复现材料较薄 |
| [Pokemon Red multimodal JEPA](https://openreview.net/forum?id=8li5NOHh9S) | pixels + RAM 预训练后作为 PPO frozen encoder | DEMO Poster；需要核对 DreamerV3 预算与 online adaptation 协议 |
| [JEPA-MSAC](https://arxiv.org/abs/2603.29796) | 无线定位、波束与 RSSI 的多模态 JEPA | 重叠滑窗后随机切分可能造成 temporal leakage，需先审计 |

### 仅引用或证据不足，继续排除

- 只在 related work 中引用 I-JEPA/V-JEPA，主体仍是 MAE、对比学习、扩散或普通 world model 的论文。
- 只使用现成 V-JEPA/DINO 特征，既不改造也不隔离评估 JEPA 机制的 feature consumer。
- 教程、综述、观点、无原文项目页和只有模型命名、没有标准下游实验的工作。
- Mine-JEPA/SIGReg 类命名相近工作，若主体目标不能确认仍是 context–target latent prediction pipeline，不与实际 JEPA 下游证据混排。

本轮检索覆盖 JEPA/I-JEPA/V-JEPA/V-JEPA 2/A-JEPA 与 audio-visual、planning、robotics、particle physics、emotion recognition、spacecraft pose、game RL、wireless 等组合；搜索索引用于发现，入选与排除均回到一手原文核验。

## 来源链接

### 今日深读

- MJEPA：[arXiv 摘要](https://arxiv.org/abs/2606.25225)；[HTML 全文](https://arxiv.org/html/2606.25225)；[PDF](https://arxiv.org/pdf/2606.25225)
- Temporal Straightening：[ICML 2026 OpenReview](https://openreview.net/forum?id=Ik1mKtUYlZ)；[arXiv 摘要](https://arxiv.org/abs/2603.12231)；[HTML 全文](https://arxiv.org/html/2603.12231)；[官方代码](https://github.com/Agentic-Learning-AI-Lab/temporal-straightening)
- JetParticle-JEPA：[arXiv 摘要](https://arxiv.org/abs/2606.14813)；[HTML 全文](https://arxiv.org/html/2606.14813)；[PDF](https://arxiv.org/pdf/2606.14813)

### 后续候选的一手来源

- FF-JEPA：[arXiv](https://arxiv.org/abs/2606.09311)；[HTML 全文](https://arxiv.org/html/2606.09311)
- Emotion-JEPA：[OpenReview](https://openreview.net/forum?id=J5TIa3f9vd)
- SPACE-HOP：[OpenReview](https://openreview.net/forum?id=t9LTeubtto)
- Pokemon Red multimodal JEPA：[OpenReview](https://openreview.net/forum?id=8li5NOHh9S)

---

如果你愿意，下一轮可以优先深挖 **FF-JEPA 的无目标图像长时域规划**，或把 **MJEPA 的跨模态正迁移**、**GeoWorld + Temporal Straightening + MoP-JEPA 的规划几何**整理成中文技术博客。

