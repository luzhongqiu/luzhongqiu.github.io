---
title: JEPA 下游研究追踪 · 2026-08-11
date: 2026-08-11 10:00:00
categories:
  - JEPA研究追踪
tags:
  - JEPA
  - JEPA追踪
---

本文属于「JEPA追踪」系列，记录每日论文检索、原文核验与阶段性判断；它保留研究日志的证据密度，与经过主题化重写的原创博客区分。

# JEPA 下游研究追踪（2026-08-11）

> 检索截止：2026-08-11 11:10（Asia/Shanghai，约 03:10 UTC）
>
> 严格增量起点：2026-08-10T03:02:13.782Z
>
> 去重范围：`/Users/nic/.codex/automations/jepa/memory.md` 与 `research/jepa/` 全部既有记录、候选池和排除项。
>
> 证据口径：arXiv、Crossref、OpenAlex、bioRxiv/medRxiv 等索引只用于发现；方法、实验、代码与发表状态回到论文原文、作者项目/代码仓、模型仓或 DOI 元数据核验。本文把“新投稿”“实质新版本”和“今天首次发现但正文不可得”分开记录。

## 今日结论

1. **今日确认 1 篇严格新投稿和 1 篇实验实质更新的高可信 JEPA 下游论文。** arXiv 严格提交窗口只返回 *JEPA-WAM: Learning Vision-Language-Action Policies with Joint-Embedding World Modeling*（arXiv:2608.09381 v1，2026-08-10 09:57:54 UTC）；按更新时间检查则另有 AquaJEPA v2（2026-08-10 11:30:28 UTC）。前者直接把冻结 V-JEPA 2.1 接入机器人策略，后者从头训练 action-conditioned EMA JEPA 并用 latent 做水下 MPC；两者都不是 related-work-only。[严格窗口 API](https://export.arxiv.org/api/query?search_query=submittedDate%3A%5B202608100302%20TO%20202608112359%5D%20AND%20%28all%3AJEPA%20OR%20all%3A%22joint-embedding%20predictive%22%29&start=0&max_results=100&sortBy=submittedDate&sortOrder=descending) · [按更新时间排序](https://export.arxiv.org/api/query?search_query=all%3AJEPA%20OR%20all%3A%22joint-embedding%20predictive%22&start=0&max_results=100&sortBy=lastUpdatedDate&sortOrder=descending)
2. **JEPA-WAM 是今日最强的“V-JEPA 进入下游策略”证据，但完整收益不能全归给 JEPA objective。** 冻结 V-JEPA 2.1 本身在 LIBERO-Plus matched ablation 中把平均成功率从 DINOv2+SigLIP 的 `73.2%` 提到 `77.0%`；再加入 current–future joint target prediction 后到 `79.2%`。因此 headline 同时包含预训练表征与新增 transition objective，两者贡献应分层。[原文与 Table 4](https://arxiv.org/html/2608.09381v1) · [官方项目页](https://spritewithoutice.github.io/JEPA_WAM/)
3. **JEPA-WAM 的 strongest claim 是 OOD 泛化与“训练期预测、部署期裁枝”，不是所有基准全面 SOTA。** LIBERO-Plus 上无大规模 robot-policy pretraining 的 JEPA-WAM 为 `79.2%`，带预训练的 `π0.5 + JEPA Obj.` 为 `86.3%`；但标准 LIBERO 上 JEPA-WAM `96.7%` 低于同组 Fast-WAM `97.6%`。RoboTwin Random 上 `π0.5` 加目标后仅 `37.2→37.5%`，而 Clean 为 `75.4→84.6%`。部署时 target encoder/head 被移除，基础 JEPA-WAM 仍需运行 V-JEPA、Qwen predictor 与 DiT action expert，实测 `85 ms / 11.76 Hz`。[论文 PDF](https://arxiv.org/pdf/2608.09381v1) · [项目结果表](https://spritewithoutice.github.io/JEPA_WAM/)
4. **AquaJEPA v2 改变了 8 月 3 日的旧判断，值得作为实质版本进展重新解读。** v1 只有 `12×30 s` 数据，预注册的 state-only 主比较置信区间跨零；v2 扩充为 `150×30 s`（其中训练 60 分钟），并在 120 个配对场景中把 state-only 的成功数 `76/120` 提至 `91/120`、final error `0.806→0.617 m`，两项 paired 95% interval 均排除零。它还加入三训练种子、2,160 次 closed-loop runs 的单 checkpoint 分析。[v1 PDF](https://arxiv.org/pdf/2607.29393v1) · [v2 PDF](https://arxiv.org/pdf/2607.29393v2) · [版本记录](https://arxiv.org/abs/2607.29393)
5. **AquaJEPA v2 仍不能写成“JEPA 普遍优于传统 dynamics model”。** 在三种子单 checkpoint 汇总中，AquaJEPA-base 成功 `219/360`，反而低于 supervised dynamics 的 `238/360` 和 recurrent world model 的 `257/360`；它相对 recurrent model 的主 ensemble final-error 与 success intervals 也都跨零。论文可靠支持的是“相对 state-only 的多模态闭环优势”和“base 相对 sonar-only 的 endpoint-error 优势”，不是 universal objective superiority。[v2 Table V–VI 与 Limitations](https://arxiv.org/html/2607.29393v2)
6. **今天没有可全文闭环的第三篇。** Crossref 新建 UA-JEPA 正式 DOI，但无 arXiv、可访问摘要或正文，无法仅凭标题与参考文献确认它究竟如何使用 JEPA；ProtJEPA 的 bioRxiv HTML/XML/PDF 重试仍为 HTTP 429，证据状态没有超过昨日官方摘要。I-JEPA、V-JEPA、V-JEPA 2 的 OpenAlex 日期引用链均为 0；bioRxiv/medRxiv 8 月 10–11 日全部分页也无 `JEPA`/完整术语命中。这些空结果只描述本轮可见索引，不外推为绝对不存在。[UA-JEPA Crossref 元数据](https://api.crossref.org/works/10.1016/j.patrec.2026.08.007) · [ProtJEPA 官方记录](https://api.biorxiv.org/details/biorxiv/10.64898/2026.08.03.742606/na/json)

## JEPA 方向最新进展

### 1. V-JEPA 的下游角色从“冻结特征”推进到“策略共享预测器的训练目标”

JEPA-WAM 不只把 V-JEPA token 当作 VLA 输入。它让同一个 Qwen2.5-0.5B backbone 同时产生两类 readout：视觉 token 位置预测 joint current–future V-JEPA target，专门的 action placeholders 则为 DiT flow-matching action expert 提供条件。transition loss 因而直接更新动作策略使用的 backbone，而不是训练一个与 policy 分离的 world-model head。[方法原文](https://arxiv.org/html/2608.09381v1)

需要精确描述它的“world modeling”边界：V-JEPA 将当前帧与轨迹中的未来帧沿时间维堆叠，形成 stop-gradient target；在线分支只看当前视觉 token，transition readout 本身不显式输入未来动作。论文也承认，当同一当前观测因不同指令通向不同未来时，这种 task-shared target 可能表达不足。因此它不是传统 action-conditioned dynamics predictor，而是用真实轨迹未来构造的 policy representation regularizer。

### 2. “未来 target”正在从单一未来状态变成端点关系

JEPA-WAM 的关键设计不是独立编码未来帧，也不是把两个 endpoint feature 相减，而是把当前与未来一起送进 V-JEPA 的 two-frame tubelet，得到保持 `24×24` patch correspondence 的联合表示。LIBERO-Plus matched ablation 为：endpoint difference `70.9%`、future-only `77.3%`、joint current–future `79.2%`。[附录 Table 6](https://arxiv.org/html/2608.09381v1)

冻结 probe 进一步给出正反两面：joint target 的 temporal-gap 六分类为 `67.2%`，高于 endpoint difference 的 `47.0%`；预测去掉直线位移后的 14-D trajectory residual，mean `R²` 为 `0.582 vs 0.485`。但直接预测 endpoint displacement 时，endpoint difference 反而更好（`0.740 vs 0.718`）。因此 joint encoding 更擅长时间关系与区间轨迹结构，并非对所有“变化量”都更优。

### 3. AquaJEPA v2 展示“版本更新也必须重新过证据门槛”

AquaJEPA v2 没有改变核心家族：camera、FLS sonar、proprioception 经 mask-aware fusion，五步 thruster command 由 GRU 编码，online predictor 预测 EMA future latent，同时回归 velocity change 与 32-bin sonar profile，并用 executed action 对 inverse/zero action 的 margin 避免 action-insensitive latent。[v2 方法](https://arxiv.org/html/2607.29393v2)

真正变化发生在证据面：训练数据从 v1 的 8 个训练 episode 扩至 120 个；fresh paired scenarios、三个独立训练 seed、分层 bootstrap 和 matched non-JEPA controls 让 state-only 比较越过不确定性门槛。这说明追踪系统不能只按标题去重：**同一 arXiv ID 的新版本若改变样本量、主比较与结论，应作为实质进展记录。**

### 4. 严格区分实际使用、仅凭命名待核验与 related-work-only

- **实际复用核心 checkpoint 并用于下游**：JEPA-WAM 使用冻结 V-JEPA 2.1 ViT-L/ViT-G target；论文、项目页、训练/评估代码与权重均可访问。
- **实际训练 JEPA-style objective 并用于下游**：AquaJEPA 从头训练 online/EMA encoder、action-conditioned predictor 与 latent loss；它引用 I-JEPA/V-JEPA 但不复用其 checkpoint。
- **命名与参考链强烈提示 direct-use，但正文不可得**：UA-JEPA 的 Crossref 题目为 *Uncertainty-Aware Joint-Embedding Predictive Learning for Remote Sensing Image Retrieval*，参考文献含 I-JEPA、LeJEPA 与 REJEPA；然而没有可核验方法/数据/结果，今天仍是待核验候选。
- **已经确认 actual-use、但今日证据没有推进**：ProtJEPA 仍只能引用官方摘要，不能重复占用主解读名额。
- **今日未发现 A-JEPA / 音频 direct-use 新稿**：关键词与日期引用链没有补出全文可核验候选。

## 新增下游论文解读

### 1. JEPA-WAM: Learning Vision-Language-Action Policies with Joint-Embedding World Modeling

#### 基本信息

- **作者**：Yihan Lin、Jiawei He、Shifeng Bao、Chen Zhao、Yang Li、Xiaobo Wang、Yan Wang、Cheng Chi、Jing Zhang。
- **机构**：中国人民大学信息学院、XYZ Embodied AI、中国人民大学数据工程与知识工程重点实验室、中国人民大学数据库与商务智能工程研究中心、深圳理工大学、清华大学智能产业研究院（AIR）。
- **时间与出处**：arXiv:2608.09381 v1，2026-08-10 09:57:54 UTC，`cs.RO` 预印本；未见会议接收声明。[arXiv 摘要与提交记录](https://arxiv.org/abs/2608.09381)
- **使用的 JEPA**：基础 JEPA-WAM 使用冻结 V-JEPA 2.1 ViT-L/16（约 300M）编码当前帧和训练期联合 target；迁移到 `π0.5` 时用冻结 V-JEPA 2.1 ViT-G target。
- **下游任务**：LIBERO / LIBERO-Plus 单臂操作、RoboTwin 2.0 双臂操作，以及 AgileX Cobot Magic 五项真机双臂任务；指标主要是 simulation success rate，真机使用带 partial credit 的 normalized completion score。

#### 方法如何衔接 JEPA

对每个 camera view，冻结 V-JEPA 分别编码当前观测，保留固定 camera 顺序和 patch grid。训练期另取偏移 `δ` 的未来帧，与当前帧沿时间维堆叠后送入同一个 V-JEPA，构成 `24×24×1024` 的 joint target。因为 V-JEPA 2.1 tubelet size 为 2，两帧联合编码仍与当前帧 token 一一对应。[论文方法与附录 A.1](https://arxiv.org/html/2608.09381v1)

Qwen2.5-0.5B 作为 shared predictor。视觉 token 最终 hidden states 经 MLP 映回 V-JEPA 空间，逐 patch 优化 cosine distance；64 个 action placeholders 的 hidden states则条件化 16-layer DiT-L，以 flow matching 生成连续 action chunk。总损失为 `L_act + 0.5 L_wm`。部署时 future target encoder 与 transition head 被移除；基础策略仍保留 current-frame V-JEPA、visual projector、Qwen predictor 与 action expert。

<figure>
  <img src="https://spritewithoutice.github.io/JEPA_WAM/assets/method-balanced.webp?v=20260805" alt="JEPA-WAM 共享 predictor 连接 V-JEPA transition target 与动作生成" loading="lazy" style="max-width:820px;width:100%;height:auto;">
  <figcaption>JEPA-WAM 官方方法图：冻结 V-JEPA 构造 joint current–future target，shared predictor 同时服务 transition prediction 和 action readout。原图为 WebP，2806×1170、约 143 KiB。来源：作者官方项目页。</figcaption>
</figure>

#### 数据、指标、基线与关键结果

**事实：协议与主要基线**

- LIBERO：四个标准 suite 联合训练，primary + wrist camera，action horizon 8、future offset 31；在同一策略上直接测试 LIBERO-Plus 七类 camera/robot/language/light/background/noise/layout 扰动，不做 OOD fine-tuning。
- RoboTwin 2.0：20 个任务，只用 Clean demonstrations 训练，同时测试 Clean 与 Random；external + 双 wrist camera，14-D 双臂动作、horizon/offset 50。
- 真机：五任务，每任务 100 demonstrations；ID 与 OOD 各做每任务 10 rollouts，因此每个 policy 共 100 次评测。结果是 partial-credit completion score，不是全部二值 success。
- 主要基线：Diffusion Policy、ResVLA、Fast-WAM、VLA-Adapter、RoVLA、VLA-JEPA、PokeVLA、ABot-M0、Cosmos-Policy、`π0/π0.5`、Being-H0.7，以及 matched 的 DINOv2+SigLIP、V-JEPA-only、future-only、endpoint-difference、iREPA-style alignment 等消融。[实验与附录](https://arxiv.org/pdf/2608.09381v1)

**作者报告：核心结果**

| 场景 | JEPA-WAM / 加 JEPA 目标 | 关键对照 | 准确解读 |
|---|---:|---:|---|
| LIBERO ID | `96.7%` | Fast-WAM `97.6%` | 保持竞争力，但不是同组最高 |
| LIBERO-Plus | `79.2%` | ResVLA `77.1%`；V-JEPA-only `77.0%` | 无大规模 policy pretraining 组最高；transition objective 相对 V-JEPA-only `+2.2 pp` |
| LIBERO-Plus，预训练 VLA | `π0.5 + Obj. 86.3%` | `π0.5 84.5%` | matched backbone 增益 `+1.8 pp` |
| RoboTwin Clean / Random | `79.9 / 36.9%` | DP3 `73.9 / 8.3%` | 无 policy pretraining 下 OOD 优势明显 |
| RoboTwin `π0.5 + Obj.` | `84.6 / 37.5%` | `π0.5 75.4 / 37.2%` | 主要改善 Clean，Random 近乎不变 |
| 真机 JEPA-WAM ID / OOD | `59.82 / 54.18%` | `π0 51.82 / 22.50%` | 每任务/setting 10 rollouts，partial credit |
| 真机 `π0.5 + Obj.` ID / OOD | `90.34 / 84.68%` | `π0.5 77.52 / 72.50%` | 正向，但无 seed/CI |

#### 事实、作者主张与本研究推断

- **事实**：matched ablation 将“V-JEPA 预训练表征”与“joint transition prediction”拆开，分别贡献 `73.2→77.0` 和 `77.0→79.2`；joint target 又优于 future-only 与 endpoint difference。
- **作者主张**：joint current–future target 保留任务共享的局部变化、对象关系和空间重配置；shared predictor 让 transition supervision 更直接影响 action representation，且不需部署未来图像生成器。
- **本研究推断**：最有价值的不是再造一个 latent WAM，而是把“预测目标”和“策略读出”放到同一 backbone 中，同时用 action placeholders 隔离两种 readout。Full-hidden variant 从 `79.2` 降到 `73.1%`，提示共享 backbone 并不等于共享所有 token；接口隔离本身是 load-bearing design。
- **归因边界**：headline 同时依赖 V-JEPA checkpoint、Qwen/LLaVA vision-language initialization、DiT flow head、LoRA、proprioception 和联合目标；只有 Table 4 的 matched rows 能较干净回答局部机制问题。

#### 创新、局限、复现条件与风险

1. **创新**：用 V-JEPA two-frame tubelet 构造稠密 joint endpoint target；不把未来压成少量 subgoal token；shared predictor 让同一 backbone 同时承担 transition 与 action conditioning；同一目标还能作为预训练 VLA 的训练期辅助分支。
2. **未来多解性**：transition readout 没有显式接收 future action，真实轨迹只提供单一未来。论文自己承认，同一当前观测对应不同语言指令/动作未来时，task-shared target 可能不足。
3. **统计证据不足**：simulation 主表与真机表没有报告多训练 seed、误差条或 paired significance；公开训练 recipe 固定 `seed=7`。真机每个任务/setting 只有 10 rollouts，且使用 partial credit。
4. **基线异构**：leaderboard 跨 0.5B–5B backbone、是否 policy pretraining、不同 action expert 和公开实现；只有内部 ablation 适合做因果归因。
5. **公开配方不一致**：论文附录写 LIBERO 为 8 GPUs、global batch `128`、`60K` steps；官方 README 的“fixed recipe used by this release”写 global/per-device batch `256/32`、`40K` steps、seed `7`，发布 checkpoint 也是 step 40K。代码与权重已经公开，但复现论文 headline 前需要作者澄清哪组配置生成主表。[官方 README](https://github.com/SpriteWithoutIce/JEPA_WAM) · [发布权重](https://huggingface.co/CokeAnd1ce/JEPA_WAM)
6. **算力与许可**：完整训练需 8 GPUs，论文/README 没有给 wall-clock 和完整能耗；代码 MIT，但 V-JEPA、Qwen、LIBERO/LIBERO-Plus 和 checkpoint 各受第三方许可约束。
7. **可复现性优势**：主仓提供训练、LIBERO-Plus 评估、regression tests、环境锁与 checkpoint；`π0.5` 集成另有完整 OpenPI 分支，明显优于近期只有 project-page placeholder 的机器人 JEPA 稿。[主代码](https://github.com/SpriteWithoutIce/JEPA_WAM) · [`π0.5` 代码](https://github.com/SpriteWithoutIce/openpi_jepawam/tree/main)

#### 博客价值

**很高，值得区别于追踪日报写原创技术博客。** 推荐角度是《不要只预测未来：JEPA-WAM 为什么联合编码“现在—未来关系”》，主线应围绕 three-way target ablation、共享 backbone 与专用 readout 的张力，以及“部署期裁掉 teacher 不等于策略没有计算成本”。在写作前最好先核对公开 40K recipe 能否复现论文 60K 表格。

### 2. AquaJEPA: An Action-Conditioned Multimodal JEPA Family for Underwater Robot Dynamics（v2）

#### 基本信息与版本身份

- **作者**：Alan-Barsag Gazzaev、Alexey Gavrilov、Sergey Muravyov。
- **机构**：ITMO University。
- **时间与出处**：arXiv:2607.29393 v2，更新于 2026-08-10 11:30:28 UTC；作者注明 submitted to IEEE ICRA 2027，不能写成已录用。[提交记录](https://arxiv.org/abs/2607.29393)
- **使用的 JEPA**：从头训练的 action-conditioned multimodal JEPA family；online encoder/predictor 预测 momentum `0.99` 的 EMA target latent，继承 I-JEPA/V-JEPA 的 target-prediction 范式，不加载其 checkpoint。
- **下游任务**：Stonefish BlueROV2 水下 goal reaching；partial observability 包含不同水体可见度、未知地图、流体/执行器 dynamics shift、定时 DVL loss 与 camera/sonar blackout。
- **版本进展**：v1 题目还是 *Action-Conditioned Multimodal Predictive Representations for Underwater Robot Dynamics*，已于 8 月 3 日登记但未纳入主解读；v2 改成明确的 JEPA family 定位，将训练语料从 8 个训练 episode 扩至 120 个，并新增/扩展三 seed 单 checkpoint 对照，使 state-only 主结论从“不确定”变为 paired intervals 排除零。这是实质新证据，不是排版修订。

#### 方法如何衔接 JEPA

RGB camera、raw forward-looking sonar 与 15-D proprioception 分别编码成 64-D feature，连同 validity mask 进入 fusion encoder。GRU 汇总未来五个 8-thruster commands；predictor 从当前 fused latent、action summary 与 elapsed time 预测五步后的 EMA latent，同时用 auxiliary heads 预测 velocity change 和 32-bin near-range sonar profile。[v2 方法](https://arxiv.org/html/2607.29393v2)

总损失为 `L_lat + L_vel + 0.5 L_sonar + 0.1 L_cm + 2.0 L_act`。`L_act` 要求真实 executed action 的 latent error 比 inverse/zero action 至少低 `0.02`，防止模型只复制当前 latent 或预测惯性均值。AquaJEPA-robust 另以 0.35 概率做 camera/sonar modality dropout 和 DVL dropout；在线 2 Hz planner 对同一离散候选 action library 做 0.5 秒 rollout。

因此它是实际 JEPA 下游，但不是“纯 latent cosine loss”实验：physical heads、cross-modal alignment、action margin、mask-aware fusion 和 planner 都是系统组成部分。

#### 数据、指标、基线与关键结果

**事实：数据与协议**

- 150 个同步 Stonefish episode，每个 30 秒、10 Hz：120 train（60 min）、15 validation、15 held-out test；episode-disjoint，无 test frame 进入训练。
- 18 AdamW epochs、batch 64、learning rate `3×10^-4`、weight decay `10^-4`、mixed precision；seeds `11/22/33`。九种方法/消融共 27 个独立训练 run。
- 主 closed-loop 矩阵：3 个 unseen layouts × 4 个 Jerlov visibility coefficients × 2 个 dynamics regimes × 5 replicates = 120 paired scenarios；每次 55 秒并在三个 5 秒窗口移除 DVL。六个 planner 共 720 runs。
- 三 seed 单 checkpoint study 在同一 120 场景上运行五种 family/control，共 2,160 runs；不依赖 ensemble averaging。
- 基线：reactive、state-only、matched supervised action-conditioned dynamics、matched recurrent world model；所有 learned methods 使用相同 data、action horizon、candidate library、task cost 与 planner。

**作者报告：主 ensemble 结果**

| 方法 | Success | Final error（m） |
|---|---:|---:|
| State-only | `76/120` | `0.806` |
| AquaJEPA-base | **`91/120`** | **`0.617`** |
| Supervised dynamics | `87/120` | `0.712` |
| Recurrent world model | `87/120` | `0.634` |
| AquaJEPA-robust | `84/120` | `0.766` |

AquaJEPA-base 相对 state-only 的 paired final error 差为 `-0.189 m [−0.239,−0.140]`，success 差为 `+0.125 [0.075,0.183]`；两者都支持正差异。相对 supervised dynamics 的 final error interval 排除零，但 success interval 跨零；相对 recurrent model 的 final error `-0.017 [−0.063,+0.028]`、success `+0.033 [−0.008,+0.083]`，均未建立优势。[v2 Table IV–V](https://arxiv.org/html/2607.29393v2)

**反例与机制结果**

- 三 seed single-checkpoint aggregate：AquaJEPA-base `219/360, 0.865 m`；supervised `238/360, 0.712 m`；recurrent `257/360, 0.710 m`。非 JEPA controls 的成功率更高。
- AquaJEPA-base 相对 sonar-only AquaJEPA-S 的 paired final error 改善 `0.118 m [0.047,0.181]`，三个 seed 分别改善 `0.178/0.077/0.099 m`；这支持 optical+acoustic 相对 acoustic-only，不支持对 camera-only 或所有融合方式的普遍优越。
- camera blackout 时 AquaJEPA-robust velocity MAE 保持 `0.0032`，matched no-modality-dropout 消融升至 `0.0088`；camera+DVL blackout 为 `0.0037 vs 0.0090`。明确支持训练期缺模态暴露，但 robust pooled closed-loop 反而弱于 base。
- 三个 dynamics planner 的 short-horizon velocity/sonar MAE 均优于 AquaJEPA；预测 MAE 与 closed-loop ranking 并不一致，论文的 action margin 是为 planner 排序接口专门设计的。

#### 事实、作者主张与本研究推断

- **事实**：v2 的 state-only paired comparison 已有较清楚支持；对 recurrent world model 仍 unresolved；多 seed 单 checkpoint 下传统 controls 的 aggregate success 更高。
- **作者主张**：完整 multimodal prediction 在本 benchmark 中优于 state-only 和 sonar-only，sensor-dropout training 能提高 sensor-loss robustness。
- **本研究推断**：v2 最有价值的是把“JEPA 有效”收窄成两个可检验命题：外感知相对 state-only 是否提升 goal reaching，以及 dropout 是否提升 blackout robustness。它没有证明 latent prediction objective 本身胜过 matched recurrent dynamics。
- **归因边界**：AquaJEPA-base 与 state-only 同属 family，但输入模态不同；它能说明 exteroception + predictive representation 的系统价值，不能单独拆出 JEPA loss。supervised/recurrent matched controls更接近 objective 对照，而这两组结论更保守。

#### 创新、局限、复现条件与风险

1. **创新**：将 camera/FLS/proprioception 的 missing-modality contract、action-sensitive latent margin 与 receding-horizon planner 放在同一 JEPA family 中；v2 的 paired factorial design与层级 bootstrap 比很多机器人预印本更严谨。
2. **单一仿真器/平台**：全部证据来自 Stonefish BlueROV2；没有真实水下机器人、真实 sonar artifact、时钟漂移或硬件故障。
3. **privileged evaluation**：predictive model 不读 simulator odometry，但 goal construction 与评分使用 privileged odometry；碰撞几何也只是近似。
4. **控制接口受限**：2 Hz 离散 action library 与固定 task cost；结果不能直接外推到连续 learned policy、长时域任务或不同 AUV 构型。
5. **objective 混合**：latent、velocity、sonar、cross-modal 与 action-margin 五类损失共同训练；虽然有单因素消融，仍没有 matched 的“只换 JEPA latent loss”完整闭环对照。
6. **复现缺口**：论文固定了 Stonefish/USIM 基础 commit `3f4b840`，但 arXiv 页面和 PDF 没有官方 code、collector extension、scenario manifest、checkpoint 或硬件/训练耗时入口；目前不能独立复跑 2,160-run 分析。
7. **发表状态**：仅为 ICRA 2027 投稿声明，不能把 v2 的统计改进写成同行评审确认。

#### 博客价值

**中高，最适合写“一个版本更新如何改变证据结论”的方法学原创博客。** 推荐比较 v1/v2：数据从 4 分钟训练扩到 60 分钟、state-only interval 从跨零变为排除零，同时保留 recurrent control 仍 unresolved 的反证。若写纯 AquaJEPA 方法博客，建议等代码/manifest 或真机数据。

## 横向比较

| 维度 | JEPA-WAM | AquaJEPA v2 |
|---|---|---|
| 今日身份 | 严格新投稿 | 严格窗口内实质新版本 |
| JEPA 血缘 | 直接使用冻结 V-JEPA 2.1 checkpoint | 从头训练 online/EMA JEPA family |
| 预测条件 | 当前视觉 → task-shared joint endpoint target；无显式 future action | 当前多模态 + 五步 thruster commands → future latent |
| predictor 下游角色 | 与 action-generating Qwen backbone 共享 | 直接为 MPC candidate scoring 提供 latent/physical rollout |
| 目标设计 | two-frame joint V-JEPA target，保留 patch grid | EMA future fused latent + physical heads + action margin |
| 下游证据 | LIBERO/Plus、RoboTwin、五项真机 | 120 paired Stonefish scenarios；三 seed 2,160 runs |
| 最强机制对照 | V-JEPA-only `77.0→79.2`；joint target 优于 future/difference | state-only paired gain；dropout blackout ablation |
| 主要反证 | RoboTwin Random `π0.5` 只增 `0.3 pp`；无 seed/CI | recurrent control 未输；single-checkpoint controls 成功率更高 |
| 复现状态 | 代码、模型、评估入口公开；论文/README 配方冲突 | 无官方代码、checkpoint、manifest |
| 真实部署证据 | 有五项真机，但每任务/setting 10 rollouts | 无真机，全为仿真 |

两篇论文共同说明 predictor 已不再只是“预训练完就丢掉”的附件：JEPA-WAM 让它成为 action backbone，AquaJEPA 让它成为 online planner 的查询接口。但两者也暴露相反风险：共享 predictor 可能把多目标训练混在一起，独立 MPC predictor 则可能只在精心固定的 candidate library 上有效。

## 值得继续追的问题

1. **JEPA-WAM 的公开 40K recipe 能否复现论文 60K 主表？** 需要固定 repo commit、checkpoint、global batch 与 seed，重跑 LIBERO-Plus 七类扰动并给出多 seed intervals。
2. **joint target 的收益是否来自 V-JEPA two-frame interaction，还是未来帧监督本身？** 论文已有 future-only/difference 对照；下一步应加入同架构 action-conditioned target、随机 future、不同时间 offset 与多未来采样。
3. **为什么 `π0.5 + Obj.` 在 RoboTwin Clean 大涨、Random 几乎不变？** 需要逐任务 failure breakdown、camera/object/layout perturbation 分层，以及 transition loss 与 policy pretraining 的交互消融。
4. **真机 partial-credit 是否转化为二值任务成功与安全收益？** 应扩大 rollouts、报告 bootstrap CI、失败类型、动作平滑/碰撞/干预次数，并区分 seen-object 与 unseen-object OOD。
5. **AquaJEPA 的 objective 与 sensor input 如何进一步拆开？** 同 full multimodal input、同 physical heads、同 planner 下比较 latent JEPA、supervised dynamics、recurrent transition 和 no-latent objective，避免用 state-only 代替 objective 对照。
6. **AquaJEPA 的 ensemble 排名能否由单 checkpoint 稳定复现？** 当前主表与 seed-wise 表排序不同，需要明确 ensemble variance reduction、checkpoint selection criterion 与 planner uncertainty term的作用。
7. **UA-JEPA 是否真正复用/改造 JEPA？** 取得 Pattern Recognition Letters 正文后先核验 target encoder、uncertainty head、retrieval datasets、mAP/ANMRR/Recall 基线与代码，再决定是否纳入；不能用论文名替代方法证据。
8. **ProtJEPA 全文何时可取？** 下一轮继续重试官方 XML/PDF与作者仓库；重点仍是 ten-teacher data leakage、target whitening fit scope 与 matched distillation baseline。
9. **A-JEPA / 音频 direct-use 为什么仍少？** 后续继续检查音频事件、音乐、语音与 audio-video 任务，但只纳入实际 checkpoint/objective 进入实验的工作。

## 博客价值判断

### 当日追踪博客

**应按「JEPA追踪」系列完整发布。** 今日不是空增量：JEPA-WAM 是严格新投稿，AquaJEPA v2 是足以改变旧判断的实质修订。博客标题下应优先呈现“V-JEPA target 进入共享策略 backbone”与“版本更新如何让不确定主比较变得可支持”两条结论。

### 区别于追踪日报的原创博客

1. **首选 JEPA-WAM 单篇机制审计**：主题是 joint endpoint target、shared predictor 与专用 action readout；可用公开代码进一步核对 40K/60K 配方。
2. **次选 AquaJEPA v1→v2 证据升级**：主题不是水下机器人介绍，而是数据量、paired design、multi-seed controls 怎样改变论文能说的话。
3. **暂缓 UA-JEPA 与 ProtJEPA**：两者都缺原文闭环，不能凭标题/摘要生成主题化原创博客。
4. **本轮不自行创建原创博客**：这里只做追踪价值判断。

### 配图判断

使用 JEPA-WAM 官方 `method-balanced.webp` 外链作为本日唯一论文图。原图 2806×1170、146,184 bytes（约 143 KiB），WebP 已足够压缩；页面限制最大宽度 820px 并启用 lazy loading，不新增本地图片文件。AquaJEPA PDF 本身仅约 508 KiB，但没有独立官方图像 URL，今日不从 PDF 截图另增仓库资产。

## 来源链接

### 第一方增量检索与核心引用链

- [arXiv 严格提交窗口：JEPA / 完整术语](https://export.arxiv.org/api/query?search_query=submittedDate%3A%5B202608100302%20TO%20202608112359%5D%20AND%20%28all%3AJEPA%20OR%20all%3A%22joint-embedding%20predictive%22%29&start=0&max_results=100&sortBy=submittedDate&sortOrder=descending)
- [arXiv 家族严格窗口：I-JEPA / V-JEPA / V-JEPA 2 / A-JEPA](https://export.arxiv.org/api/query?search_query=submittedDate%3A%5B202608100302%20TO%20202608112359%5D%20AND%20%28all%3A%22I-JEPA%22%20OR%20all%3A%22V-JEPA%22%20OR%20all%3A%22V-JEPA%202%22%20OR%20all%3A%22A-JEPA%22%20OR%20all%3A%22Joint-Embedding%20Predictive%20Architecture%22%29&start=0&max_results=100&sortBy=submittedDate&sortOrder=descending)
- [arXiv 按 lastUpdatedDate 排序](https://export.arxiv.org/api/query?search_query=all%3AJEPA%20OR%20all%3A%22joint-embedding%20predictive%22&start=0&max_results=100&sortBy=lastUpdatedDate&sortOrder=descending)
- OpenAlex：[I-JEPA 日期引用链](https://api.openalex.org/works?filter=cites%3AW4386076428%2Cfrom_publication_date%3A2026-08-10&sort=publication_date%3Adesc&per-page=100) · [V-JEPA 日期引用链](https://api.openalex.org/works?filter=cites%3AW4394861491%2Cfrom_publication_date%3A2026-08-10&sort=publication_date%3Adesc&per-page=100) · [V-JEPA 2 日期引用链](https://api.openalex.org/works?filter=cites%3AW4417261359%2Cfrom_publication_date%3A2026-08-10&sort=publication_date%3Adesc&per-page=100)
- [bioRxiv 2026-08-10 至 2026-08-11 官方列表](https://api.biorxiv.org/details/biorxiv/2026-08-10/2026-08-11/0/json) · [medRxiv 同期列表](https://api.biorxiv.org/details/medrxiv/2026-08-10/2026-08-11/0/json)

### JEPA-WAM 一手来源

- [arXiv 摘要与提交历史](https://arxiv.org/abs/2608.09381)
- [arXiv HTML 全文](https://arxiv.org/html/2608.09381v1) · [PDF](https://arxiv.org/pdf/2608.09381v1)
- [作者官方项目页](https://spritewithoutice.github.io/JEPA_WAM/) · [官方方法图](https://spritewithoutice.github.io/JEPA_WAM/assets/method-balanced.webp?v=20260805)
- [官方主代码与 README](https://github.com/SpriteWithoutIce/JEPA_WAM)
- [`π0.5` / OpenPI 官方实现](https://github.com/SpriteWithoutIce/openpi_jepawam/tree/main)
- [官方模型与 policy checkpoint](https://huggingface.co/CokeAnd1ce/JEPA_WAM)

### AquaJEPA v2 一手来源

- [arXiv 摘要、版本历史与 ICRA 2027 投稿声明](https://arxiv.org/abs/2607.29393)
- [v2 HTML 全文](https://arxiv.org/html/2607.29393v2) · [v2 PDF](https://arxiv.org/pdf/2607.29393v2)
- [v1 PDF：版本差异基线](https://arxiv.org/pdf/2607.29393v1)

### 待核验与排除项

- UA-JEPA：[DOI](https://doi.org/10.1016/j.patrec.2026.08.007) · [Crossref 元数据与参考文献](https://api.crossref.org/works/10.1016/j.patrec.2026.08.007)
- ProtJEPA：[bioRxiv 官方记录与摘要](https://api.biorxiv.org/details/biorxiv/10.64898/2026.08.03.742606/na/json) · [Crossref 元数据](https://api.crossref.org/works/10.64898/2026.08.03.742606) · [DOI](https://doi.org/10.64898/2026.08.03.742606)
