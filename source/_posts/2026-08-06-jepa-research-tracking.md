---
title: JEPA 下游研究追踪 · 2026-08-06
date: 2026-08-06 10:00:00
categories:
  - JEPA研究追踪
tags:
  - JEPA
  - JEPA追踪
---

本文属于「JEPA追踪」系列，记录每日论文检索、原文核验与阶段性判断；它保留研究日志的证据密度，与经过主题化重写的原创博客区分。

# JEPA 下游研究追踪（2026-08-06）

> 检索窗口：以自动化上次运行时间 `2026-08-05T03:00:50.673Z` 为增量起点，检索至 2026-08-06 本次运行。
>
> 去重范围：automation memory 与 `research/jepa/` 2026-07-15 至 2026-08-05 的全部既有记录。FOUND-AF、LeDXA、ProWorld、Asleep at the Wheel、Auto-JEPA、MoRAE、DynaWM、seq-JEPA、TC-LeWM、JEPADepth、Rad-JEPA 3D 等已解读论文不重复汇报。
>
> 发现与核验口径：先检查 arXiv 的 JEPA 最新排序，再回到 arXiv HTML 全文、附录与作者官方代码入口逐项核验。arXiv 搜索页把 NodeJEPA 标为 2026-08-04 提交、8 月公告；它在本轮最新排序中位于昨日已记录的 FOUND-AF 之前。由于公开搜索页只显示日期、不显示时分秒，本文将它表述为“上一轮之后进入可发现公告窗口的严格增量”，不虚构小时级提交时间。
>
> 纳入标准：必须实际复用、改造或直接评估 JEPA，并进入明确下游任务。只在 related work 中引用、只借用 latent prediction 措辞，或尚不足以逐表复核实验协议的工作不进入主解读。

## 今日结论

1. **今日确认 1 篇高可信新增：NodeJEPA。** [NodeJEPA](https://arxiv.org/abs/2608.04381) 真正训练在线 GCN、EMA target encoder 与 latent predictor，在五个节点分类基准上冻结 encoder 做 linear/few-shot probe；它不是“只在相关工作引用 JEPA”。
2. **NodeJEPA 把图 JEPA 从 graph-level 推进到 node-level，但最可靠的贡献是完整 recipe，不是结构描述符本身。** 方法用连续的 `k`-hop ego-subgraph 做 target mask，predictor 通过受限消息传递或 cross-attention 预测 target embedding，并以 VICReg 与 SIGReg 防塌缩。[方法原文](https://arxiv.org/html/2608.04381v1#S3.SS2)
3. **同骨干、同 split、同 probe 的结果具有解释力。** NodeJEPA / PatchJEPA 在 Amazon-Computers、Amazon-Photo、Coauthor-CS、Coauthor-Physics、ogbn-arxiv 上的 linear-probe accuracy 分别为 `79.23/79.90`、`87.98/88.27`、`89.93/90.40`、`90.60/89.82`、`69.31/68.86`；二者在六个自监督方法中的平均排名均为 `2.4`。[主表](https://arxiv.org/html/2608.04381v1#S1.T1)
4. **结果不是全面胜出。** Coauthor-Physics 上 CCA-SSG 为 `93.06`，明显高于 NodeJEPA 的 `90.60`；ogbn-arxiv 上监督 GCN 为 `71.09`，高于 NodeJEPA 的 `69.31`。更准确的结论是“matched protocol 下强且稳定的 graph SSL alternative”，而不是“图节点任务新 SOTA”。
5. **最重要的反例来自作者自己的消融：显式 structural conditioning 没有证明是 load-bearing。** 去掉 PageRank、degree、clustering coefficient 与 Laplacian descriptor 后，Amazon-Photo 从 `87.87` 升到 `88.74`，Coauthor-Physics 基本不变（`90.57→90.61`）。因此论文题目中的 structure-conditioned 更像可选接口；主要结构信号可能已经由受限 GCN predictor 的邻接消息传递提供。[消融表](https://arxiv.org/html/2608.04381v1#S5.T2)
6. **Node-level 粒度的代价非常大。** 在 ogbn-arxiv 上，NodeJEPA 平均训练 `31,582.3 s`（约 `8.77 h`），PatchJEPA 为 `2,466.3 s`（约 `41.1 min`）；后者只比 GraphMAE 的 `2,117.7 s` 慢约 16%，而前者慢约 14.9 倍。瓶颈来自每步重新做 `k`-hop neighborhood expansion，不是 latent prediction 本身。[效率分析](https://arxiv.org/html/2608.04381v1#S6)
7. **今日阶段性判断：图 JEPA 的下一步不应只追 accuracy，而要同时报告“结构增益是否真实、反塌缩正则贡献、masking 系统成本”。** NodeJEPA 的高 effective rank 很亮眼，但 VICReg 在两个数据集上的作用方向相反，PatchJEPA 以更低 effective rank 仍取得相近准确率；表示几何、任务精度与训练成本不能用一个数字概括。

| 论文 | 时间性质 | JEPA 使用方式 | 下游任务 | 最强证据 | 主要边界 |
|---|---|---|---|---|---|
| NodeJEPA | 本轮公告窗口严格新增 | 在线/EMA GCN + masked latent prediction + anti-collapse regularization；另有 PatchJEPA | 五个同质图的节点分类、few-shot node classification | 同骨干 matched baselines；5 seeds；完整消融、显著性与 wall-clock | 显式结构条件无增益；仅 transductive homophilous graphs；NodeJEPA 在大图极慢 |

<figure>
  <img src="https://arxiv.org/html/2608.04381v1/figures/fig_two_jepa.png" alt="NodeJEPA 与 PatchJEPA 的结构、遮挡和 latent prediction 接口" style="display:block;max-width:820px;width:100%;height:auto;margin:0 auto;" loading="lazy">
  <figcaption>NodeJEPA Figure 2：左侧以 k-hop ego-subgraph 为 target、用节点级结构条件预测；右侧用预计算 METIS patch 换取可扩展性。图片来自 arXiv 官方 HTML，原图 1750×830、219,224 bytes（约 214 KiB）；本文只外链、限制显示宽度并 lazy-load，不在仓库保存副本。</figcaption>
</figure>

## JEPA 方向最新进展

### 1. Graph JEPA 正从“整图表示”分化到 node-level 与 multi-resolution

NodeJEPA 明确把目标放在单一大图内部的节点表征：target 不是一张图或一个图 patch 的类别，而是被遮节点在 EMA encoder 下的 latent。作者同时保留 PatchJEPA，把同一训练哲学改造成缓存式 graph partition。这揭示一个值得长期追踪的设计轴：**预测粒度越细，局部结构越完整，但 mask 构造和消息传递越可能成为系统瓶颈。**

这一趋势与昨日候选 [HP-JEPA](https://arxiv.org/abs/2608.00491) 形成互补：HP-JEPA 关心整图的多分辨率 partition，NodeJEPA 关心单图内部节点的连续邻域。两者都实际使用 JEPA，但不能把 graph-level 与 node-level 的结果放在一张 accuracy 表里横比。

### 2. 在图域，“JEPA objective”实际上是预测目标与三类正则的组合

NodeJEPA 的完整 objective 包含：target cosine prediction、VICReg-style variance/covariance、LeJEPA-style sliced isotropic Gaussian regularization。EMA target 本身不足以保证不塌缩，作者明确把额外正则作为主 recipe。[目标函数](https://arxiv.org/html/2608.04381v1#S3.SS2)

这要求后续论文继续拆开三件事：

- latent prediction 是否比 feature reconstruction 更适合节点任务；
- 显式 anti-collapse regularization 是否才是主要收益来源；
- 图结构来自 predictor 的 message passing，还是来自额外 descriptor。

当前消融只在 Amazon-Photo 与 Coauthor-Physics 上做三 seed，且没有“相同 VICReg/SIGReg、移除 prediction objective”的 matched encoder-only 对照，因此还不能把整体优势单独归因于 JEPA prediction。

### 3. 系统效率已经成为 graph JEPA 的第一等评测项

NodeJEPA 在 169K-node ogbn-arxiv 上从 1-hop curriculum 切到 2-hop 后，median epoch time 约从 `11 s` 跳到 `147 s`，p95 达 `320.7 s`；PatchJEPA 因 partition 预计算并缓存，约 `1.8 s/epoch`，保持平坦。[Figure 5](https://arxiv.org/html/2608.04381v1#S6.F5)

作者把差距归因于遮挡单位而非 latent objective，这一判断由 PatchJEPA 的 wall-clock 支持。但“NodeJEPA 可通过缓存或 degree cap 加速”仍只是尚未实验验证的改进方向；不能把潜在优化写成已解决。

### 4. 本轮发现但未纳入主解读的严格候选

- [Helping Music Co-Creation Agents ‘Listen’ Well](https://arxiv.org/abs/2608.04378)：实际训练 2.55M-parameter Swin V2，以 pitch/time shift equivariance、masked embedding prediction 与 distribution regularizer 学 MIDI piano-roll 表征，并连接 probing、flow matching 与 inpainting。它不是仅引用 JEPA；但本轮尚未完成训练数据切分、matched baseline、公平生成评测与代码/权重状态的全链路核验，暂不把摘要中的 probe/generation headline 升格为完整主解读。
- [SJEPA: Learning Elegant Latent Dynamics with Hybrid Symbolic–Neural Predictors](https://arxiv.org/abs/2608.04060)：实际训练 EMA target 与 symbolic/neural transition，理论和 pendulum 消融完整；但目前下游证据限于受控二维摆与人工 grammar，且一手全文未给可核验代码入口。它更适合作为“可解释 latent dynamics”概念论文，而不是今日具体领域下游主论文。
- [FactorJEPA](https://arxiv.org/abs/2608.01049)、[EEG-JEPA](https://arxiv.org/abs/2608.00114)、[HP-JEPA](https://arxiv.org/abs/2608.00491)：均保留在历史候选队列；本轮已有严格新增，不用尚未逐表审计的旧候选凑数。

## 新增下游论文解读

### 1. NodeJEPA: Structure-Conditioned Latent Prediction for Node-Level Graph Self-Supervised Learning

#### 基本信息

- **完整题目**：*NodeJEPA: Structure-Conditioned Latent Prediction for Node-Level Graph Self-Supervised Learning*
- **作者**：Tinghe Zhang、Jian Xu、Jiaheng Chen、Jiaxing Li、Yucheng Xiao、Qiang Wang
- **机构**：Northeastern University
- **时间与出处**：arXiv:2608.04381 v1，搜索页标为 2026-08-04 提交、2026 年 8 月公告；`cs.LG` 预印本，当前未见正式录用信息
- **使用的 JEPA**：从头训练的 graph JEPA；在线 GCN、EMA target GCN、masked-node latent predictor，并组合 VICReg/SIGReg 防塌缩
- **下游任务与场景**：学术引用、合著、商品共购网络中的 node classification，以及每类只有 5/10/20 个标签的 few-shot node classification
- **复现入口**：[作者官方代码、配置、脚本与聚合日志](https://github.com/OliverZ-dot/Node-Jepa)，论文称 MIT license；运行协议为 Python 3.8.10、PyTorch 2.4.1/CUDA 12.1、PyG ≥2.4、单张 A100 80GB

[arXiv 摘要](https://arxiv.org/abs/2608.04381) · [HTML 全文](https://arxiv.org/html/2608.04381v1) · [PDF](https://arxiv.org/pdf/2608.04381)

#### 方法如何衔接 JEPA

**可核对事实**

1. context 与 target encoder 都是 3-layer、256-hidden GCN；target 不参与梯度更新，而是以 `0.996→0.999` 的 momentum schedule 跟随 context encoder。
2. NodeJEPA 先采 target seed，再扩成连续 `k`-hop ego-subgraph；mask ratio 在前 50 epochs 从 `0.2→0.5`，hop 从 `1→2`。target node feature 被 learned mask token 替换，避免 context encoder 直接读取真实属性。
3. 主 predictor 是受限消息传递 GCN：信息只能由 context node 流向 target，target 不能向另一个 target 泄漏；cross-attention predictor 作为消融。
4. 可选结构描述符由 PageRank、degree、local clustering coefficient 与低维 Laplacian spectral embedding 组成。
5. prediction loss 是 target node 上的 cosine distance；context embedding 另外接受 VICReg-style variance/covariance 与 sliced isotropic-Gaussian penalty。
6. PatchJEPA 共享 encoder 与预测哲学，但把 mask unit 换成预计算、缓存的 METIS partition，并在 patch 内 mean-pool；它牺牲节点级细节来换取稳定 wall-clock。

[NodeJEPA 方法](https://arxiv.org/html/2608.04381v1#S3.SS2)｜[PatchJEPA 方法](https://arxiv.org/html/2608.04381v1#S3.SS3)｜[完整超参数](https://arxiv.org/html/2608.04381v1#A4)

**作者主张**

作者把结果解释为：JEPA-style latent neighborhood prediction 不依赖手工图增强、负样本或 raw feature reconstruction，在 matched encoder/probe 条件下，是 contrastive 与 generative graph SSL 的强替代；NodeJEPA 与 PatchJEPA 还给出了结构细粒度和 wall-clock 的两个操作点。

**本研究判断**

论文确实把 JEPA 用到了 node-level graph SSL，且 matched protocol 比跨论文摘取数字更可信。但“structure-conditioned”并未由消融支持：显式 descriptor 去掉后不降，真正 load-bearing 的更可能是邻域 mask、受限消息传递、prediction objective 与 anti-collapse regularization 的组合。NodeJEPA 与 PatchJEPA 不是单纯 accuracy 上的胜负关系，而是细粒度表示与可扩展性之间的工程选择。

#### 数据集、评价指标、主要基线与关键实验结果

**数据与协议（事实）**

| 数据集 | 节点数 | 边数 | 特征维 | 类别 | split |
|---|---:|---:|---:|---:|---|
| Amazon-Computers | 13,752 | 491,722 | 767 | 10 | 每类 20 train / 30 val / 其余 test |
| Amazon-Photo | 7,650 | 238,162 | 745 | 8 | 每类 20 / 30 / 其余 |
| Coauthor-CS | 18,333 | 163,788 | 6,805 | 15 | 每类 20 / 30 / 其余 |
| Coauthor-Physics | 34,493 | 495,924 | 8,415 | 5 | 每类 20 / 30 / 其余 |
| ogbn-arxiv | 169,343 | 2,315,598 | 128 | 40 | OGB official split |

[数据统计](https://arxiv.org/html/2608.04381v1#A3.T4)

所有方法用相同 3-layer GCN、训练 split 与冻结 logistic-regression probe。自监督基线为 DGI、GraphMAE、BGRL、CCA-SSG，监督 GCN 只作参考；报告 seeds `42–46` 的 mean±SD。作者还用共享 seed 做 paired t-test，seed set 不同时用 Welch test，但未报告多重比较校正。

| 方法 | Computers | Photo | Coauthor-CS | Physics | ogbn-arxiv | SSL 平均排名 |
|---|---:|---:|---:|---:|---:|---:|
| GraphMAE | 70.76±2.92 | 86.05±0.52 | 89.39±0.06 | 90.80±0.39 | 68.49±0.21 | 4.0 |
| BGRL | 62.95±3.01 | 79.18±3.15 | 89.76±0.15 | 91.76±0.77 | 68.87±0.20 | 3.6 |
| CCA-SSG | 78.10±0.35 | 85.75±0.53 | 88.56±0.07 | **93.06±0.15** | 68.85±0.19 | 3.6 |
| NodeJEPA | 79.23±1.27 | 87.98±0.58 | 89.93±0.37 | 90.60±0.62 | **69.31±0.16** | **2.4** |
| PatchJEPA | **79.90±0.86** | **88.27±0.46** | **90.40±0.24** | 89.82±1.33 | 68.86±0.20 | **2.4** |
| Supervised GCN | 79.26±0.31 | 86.48±0.26 | 89.67±0.17 | 91.17±0.11 | 71.09±0.05 | — |

[完整主表](https://arxiv.org/html/2608.04381v1#S1.T1)｜[pairwise tests](https://arxiv.org/html/2608.04381v1#A8)

few-shot 的代表性结果也支持“标签少时仍可迁移”，但不支持“全面超过监督”：

- Amazon-Computers 每类 5 个标签时，NodeJEPA / PatchJEPA 为 `71.75 / 71.76`，GraphMAE 为 `58.93`，监督 GCN 为 `80.51`；
- ogbn-arxiv 每类 5 个标签时，NodeJEPA / PatchJEPA 为 `41.58 / 42.78`，GraphMAE 为 `39.17`，监督 GCN 为 `52.90`；
- Coauthor-Physics 每类 5 个标签时，CCA-SSG 为 `89.52`，高于 NodeJEPA 的 `87.22` 与 PatchJEPA 的 `82.21`。

[few-shot 全表](https://arxiv.org/html/2608.04381v1#A9.T10)

**关键消融（事实）**

| NodeJEPA 变体 | Amazon-Photo | Coauthor-Physics | 解释边界 |
|---|---:|---:|---|
| Full | 87.87±0.69 | 90.57±0.80 | 三 seed |
| No explicit structure | **88.74±0.49** | **90.61±0.43** | descriptor 没有带来可见增益 |
| Cross-attention predictor | 87.53±0.78 | 90.18±0.64 | 与稀疏 predictor 接近但更贵 |
| No VICReg | 84.61±1.67 | **92.67±0.29** | anti-collapse 强度具有数据依赖性 |
| No isolation | 87.54±0.85 | 90.65±0.88 | 差值很小，leakage 影响未被强隔离 |
| L2 prediction loss | 88.36±0.56 | 89.79±0.05 | cosine 不是两库都显著更好 |

[Table 2](https://arxiv.org/html/2608.04381v1#S5.T2)

#### 相对已有工作的创新

1. 把图 JEPA 的 target 从 graph/patch 层推进到 node-level 连续 ego-subgraph；
2. 用 restricted message passing 明确限制 context→target 的信息方向，降低 target leakage；
3. 把结构粒度做成 NodeJEPA / PatchJEPA 两个可替换操作点，并在同一论文里实测 accuracy–wall-clock 前沿；
4. 在相同 GCN、split、probe 与 seed 下对照 contrastive、reconstruction 与 non-contrastive graph SSL；
5. 同时报告 collapse geometry、few-shot、pairwise significance 与完整训练时长，而非只给主 accuracy 表。

#### 局限、复现条件与潜在风险

1. **结构条件主张未被消融支持。** 去掉 descriptor 后两库不降；标题容易让读者误以为 PageRank/spectral conditioning 是主要增益。
2. **任务覆盖窄。** 五个数据集都是 homophilous co-purchase/coauthor/citation graph；没有 heterophily、link prediction、node regression、动态图、inductive unseen graph 或图级任务。
3. **transductive 风险。** 预训练看同一整图的结构和未标注节点；结果不能自动外推到新增节点、跨图或跨时间部署。
4. **objective 归因仍混合。** prediction、EMA、VICReg、SIGReg、mask curriculum 同时变化；缺少 matched encoder-only regularizer 与“无 prediction”全因子对照。
5. **正则作用不稳定。** 去掉 VICReg 在 Photo 降 `3.26` 点，却在 Physics 升 `2.10` 点，说明统一 `λ` recipe 不是跨图稳健最优。
6. **NodeJEPA 可扩展性差。** ogbn-arxiv 约 8.8 小时，且 epoch time 对 hub 与 hop 数高度敏感；作者提出缓存/degree cap，但没有给优化后结果。
7. **统计检验偏乐观风险。** 每配置只有五 seed，消融只有三 seed；大量 pairwise t-test 未见 Holm/Benjamini-Hochberg 校正，`p<0.05` 不宜当成强确证。
8. **监督参考不是严格同信息量比较。** supervised GCN 使用标签端到端训练，适合作为参考上限，不是与冻结 SSL probe 的因果对照。
9. **复现仍需锁定版本。** 仓库公开是优点，但正式复跑应固定 commit、PyG/CUDA 版本、METIS 预处理与 ogbn-arxiv mask curriculum；A100 80GB 的成本也不是普通工作站默认可得。

**复现判断：中高。** 代码、配置、聚合日志、seed、硬件和主要超参数均公开；最大障碍是 NodeJEPA 大图训练时间，以及图预处理/邻域扩展对 PyG 和硬件的敏感性。建议先在 Amazon-Photo 复现三 seed 消融，再跑 PatchJEPA 的 ogbn-arxiv timing；不应一开始就投入 NodeJEPA 全量大图 5-seed 训练。

#### 是否值得写成独立原创技术博客

**值得，中高优先级。** 推荐主题不是“NodeJEPA 刷新图学习 SOTA”，而是：

> 图上的 JEPA 应该预测节点还是 patch？一次结构粒度、塌缩与训练成本的三方权衡

原创博客应突出两个反直觉结果：显式结构 descriptor 去掉不降、VICReg 的作用方向随数据集变化；再用 `8.77 h vs 41.1 min` 解释为何 graph masking 是系统设计，而不只是 objective 细节。若能实际复现 Amazon-Photo 消融与 ogbn-arxiv PatchJEPA timing，原创价值会明显高于仅复述论文。

## 横向比较

| 维度 | NodeJEPA | HP-JEPA（待深读） | CS-JEPA（已记录） | I-JEPA / V-JEPA 视觉家族 |
|---|---|---|---|---|
| 基本单元 | 单一大图中的 node / ego-subgraph | 整图的 coarse-to-fine partitions | channel split 的图表示 | image/video spatial-temporal patches |
| target 粒度 | node-level；另有 patch-level 变体 | resolution-specific graph embedding | graph representation channel | masked region / future clip latent |
| 下游 | transductive node classification | graph classification/regression | graph classification | classification、动作识别、控制等 |
| 最强证据 | matched GCN + 5 seeds + timing | 声称 8 个 graph task，尚待逐表核验 | 已有逐表记录 | 跨论文协议高度多样 |
| 关键风险 | descriptor 无增益；k-hop 极慢 | partition 数与任务权重可能增加调参 | channel 贡献与正则归因 | backbone/data/objective 混杂 |

NodeJEPA 与昨日 FOUND-AF 的证据类型也不同：FOUND-AF 冻结现成 JEPA checkpoint，回答“已有表示能否迁移”；NodeJEPA 从头训练新的 node-level objective，回答“图上如何定义 context/target”。二者都属于实际 JEPA 下游，但不能用同一种“JEPA 有效”措辞：前者是 checkpoint utility，后者是 method recipe。

## 值得继续追的问题

1. 在相同 GCN、相同 VICReg/SIGReg、相同 mask budget 下，移除 latent predictor 或改为 GraphMAE feature reconstruction，差异还剩多少？
2. 显式 PageRank/degree/clustering/Laplacian descriptor 在 heterophilous graph、低度节点或结构噪声下是否才有价值？当前两个消融库为何完全不需要它？
3. 把 `k`-hop masks 缓存、degree-cap 或用 sampling GNN 后，NodeJEPA 能否把 ogbn-arxiv 从 8.8 小时压到 PatchJEPA 同级，同时保留 node-level accuracy？
4. PatchJEPA effective rank 明显低于 NodeJEPA，却在三库 accuracy 更高；哪些 rank/variance 指标真正预测 downstream transfer？
5. 在 temporal/inductive split、新节点与跨图迁移上，transductive pretraining 的优势是否仍然存在？
6. 对 25 组以上 pairwise comparison 做 Holm correction 与 bootstrap CI 后，哪些“显著胜出”仍成立？
7. HP-JEPA 的 hierarchical partitions 与 NodeJEPA/PatchJEPA 能否放在同一 codebase，形成 node↔patch↔graph 的统一 granularity sweep？
8. 音乐 JEPA 的 probe 与 generation headline 能否在公开 split、强音乐 SSL/生成 baseline 和可下载 checkpoint 下复现？
9. SJEPA 的 symbolic-neural allocation 能否从二维摆扩展到有控制输入、噪声和 model misspecification 的真实系统识别任务？
10. FactorJEPA 的 DENSEWORLD 数据到底公开到原视频、annotation、split 与 checkpoint 的哪一层；`factor surgery` 的 headline 是否能由公开 1B 配置复建？

## 博客价值判断

- **NodeJEPA：值得主题化重写，中高优先级。** 它提供了一个适合中文技术博客的完整矛盾：node-level masking 最细但极慢，patch-level 更快且 accuracy 不差；显式结构 descriptor 名字最响却没有消融收益。原创文章的价值在“如何读懂 graph JEPA 的真实 load-bearing components”，不是宣传平均排名。
- **音乐 co-creation JEPA：暂缓。** 方向新、展示性强，但需先核验数据 split、强 baseline、公平生成指标、代码/权重与 demo 可重复性；当前适合保留为下一轮候选。
- **SJEPA：概念价值高、下游博客价值暂低。** 更适合与 symbolic regression、Koopman/Neural ODE、可解释 world model 合并成主题，而不是单篇摆实验摘要。
- **HP-JEPA / EEG-JEPA / FactorJEPA：继续排队。** 后续应优先选择一篇能补足 graph-level、神经信号或城市世界模型的证据，不与 NodeJEPA 在同一天堆叠未经逐表审计的 headline。

今日追踪已经完整承载 NodeJEPA 的论文事实与判断；如果要另写原创博客，建议先跑通官方代码的 Amazon-Photo 消融或 PatchJEPA timing，再形成独立于「JEPA追踪」的主题化结论。

## 来源链接

### NodeJEPA 一手来源

- [arXiv 摘要与版本入口](https://arxiv.org/abs/2608.04381)
- [arXiv HTML 全文](https://arxiv.org/html/2608.04381v1)
- [论文 PDF](https://arxiv.org/pdf/2608.04381)
- [Figure 2：NodeJEPA / PatchJEPA 架构](https://arxiv.org/html/2608.04381v1#S1.F2)
- [Section 3.2：NodeJEPA 方法](https://arxiv.org/html/2608.04381v1#S3.SS2)
- [Section 3.3：PatchJEPA 方法](https://arxiv.org/html/2608.04381v1#S3.SS3)
- [Table 1：五数据集 linear-probe 主结果](https://arxiv.org/html/2608.04381v1#S1.T1)
- [Table 2：NodeJEPA 消融](https://arxiv.org/html/2608.04381v1#S5.T2)
- [Section 6：训练效率](https://arxiv.org/html/2608.04381v1#S6)
- [Table 10：few-shot 全结果](https://arxiv.org/html/2608.04381v1#A9.T10)
- [Table 12：表示塌缩诊断](https://arxiv.org/html/2608.04381v1#A11.T13)
- [Table 14：训练 wall-clock](https://arxiv.org/html/2608.04381v1#A12.T14)
- [Appendix P：复现说明](https://arxiv.org/html/2608.04381v1#A16)
- [作者官方代码、配置与日志](https://github.com/OliverZ-dot/Node-Jepa)

### 本轮新增候选与后续入口

- [Helping Music Co-Creation Agents ‘Listen’ Well](https://arxiv.org/abs/2608.04378)
- [音乐论文 HTML 全文](https://arxiv.org/html/2608.04378v1)
- [SJEPA arXiv](https://arxiv.org/abs/2608.04060)
- [SJEPA HTML 全文](https://arxiv.org/html/2608.04060v1)
- [HP-JEPA](https://arxiv.org/abs/2608.00491)
- [EEG-JEPA](https://arxiv.org/abs/2608.00114)
- [FactorJEPA](https://arxiv.org/abs/2608.01049)
- [arXiv：JEPA 最新排序](https://arxiv.org/search/?query=JEPA&searchtype=all&abstracts=show&order=-announced_date_first&size=50)
