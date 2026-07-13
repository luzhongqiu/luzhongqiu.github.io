# JEPA 延续追踪正式博客实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 发布一篇以“能预测未来，不等于容易规划未来”为核心论点、准确追踪 LLM-JEPA 与 Value-Guided JEPA 的中文正式博客。

**Architecture:** 只新增一个正式博文文件，不修改主题和站点配置。文章以旧 JEPA 博文为起点，按“表示预测—跨模态语义对齐—价值引导的可规划几何”推进，并在独立对照表中澄清三种 Predictor 的角色。

**Tech Stack:** Hexo 8、Markdown、Icarus theme、npm build

---

## 文件结构

- 创建 `source/_posts/2026-07-13-jepa-from-prediction-to-planning.md`：正式发布的完整正文、front matter、公式、表格与来源链接。
- 保留 `source/_drafts/llm-jepa-2509-14252-research-notes.md`：LLM-JEPA 的研究过程笔记，不纳入正式文章提交。
- 保留 `source/_drafts/value-guided-jepa-2601-00844-research-notes.md`：Value-Guided JEPA 的研究过程笔记，不纳入正式文章提交。

### Task 1：建立文章骨架与开篇论点

**Files:**

- Create: `source/_posts/2026-07-13-jepa-from-prediction-to-planning.md`

- [ ] **Step 1：写入符合站点约定的 front matter**

```yaml
---
title: 能预测未来，不等于容易规划未来：JEPA 的两次延续
date: 2026-07-13 10:00:00
categories:
  - AI
tags:
  - JEPA
  - 世界模型
  - LLM-JEPA
  - 表征学习
  - 强化学习
---
```

- [ ] **Step 2：写开篇并突出核心金句**

开篇链接旧文 `/2026/04/21/world-model-jepa-conversation/`，用不超过三段回顾 I-JEPA 的表示预测思想，随后单独放置：

```markdown
> ## 能预测未来，不等于容易规划未来。
```

- [ ] **Step 3：建立完整章节骨架**

章节依次为：从上一站继续出发、LLM-JEPA、从预测到规划的断层、Value-Guided JEPA、三个 Predictor 对照、目的塑造的几何、结语。

### Task 2：完成 LLM-JEPA 章节

**Files:**

- Modify: `source/_posts/2026-07-13-jepa-from-prediction-to-planning.md`

- [ ] **Step 1：解释任务与损失目标**

使用自然语言—代码双视图例子，给出以下纯文本公式并逐项解释：

```text
L = L_NTP + λ · [1 - cos(Pred(Enc(Text)), Enc(Code))]
```

- [ ] **Step 2：准确解释 `[PRED]`**

明确写出它是追加到同一个 LLM 输入末尾的特殊 token；预测表示来自最后一个 `[PRED]` token 的隐藏状态。说明该分支训练时使用、生成时移除，避免把它描述成独立的未来世界模拟器。

- [ ] **Step 3：加入结果与证据边界**

至少列出 Llama 在 NL-RX、GSM8K、Spider、HellaSwag 上的提升，并写清：纯 JEPA 目标导致空输出、主实验约两倍训练计算、有限设置下 dropout 可降到约 1.25 倍、超参数筛选与预训练结果仍需更大规模验证。

- [ ] **Step 4：链接一手来源**

链接 arXiv 摘要、PDF、公开代码和 ICLR 2026 官方页面；关于实现细节使用“从公开代码看”的限定措辞。

### Task 3：完成 Value-Guided JEPA 章节

**Files:**

- Modify: `source/_posts/2026-07-13-jepa-from-prediction-to-planning.md`

- [ ] **Step 1：用迷宫反例建立问题**

用“墙两侧的点在欧氏距离上很近，但行动距离很远”说明：预测准确不保证潜在空间适合动作优化。

- [ ] **Step 2：解释行动条件世界模型**

加入：

```text
z_t = E(s_t)
ẑ_{t+1} = Pred(z_t, a_t)
```

说明这里的 Predictor 是独立 MLP，推理时被 MPC/MPPI 用于候选动作滚动。

- [ ] **Step 3：解释价值引导几何**

写出 `V(s, g) = -||E(s) - E(g)||` 的直觉，说明 IQL/expectile TD、stop-gradient bootstrap target、普通距离与 quasi-distance 的作用。写清最佳方案是先以价值目标塑造并冻结编码器，再训练预测器，而联合损失更差。

- [ ] **Step 4：加入结果与证据边界**

写入相对最佳标准基线的结果：WS `0.55 → 0.71`、WB `0.89 → 0.96`、Maze `0.54 → 0.63`。同时说明实验仅覆盖简化墙体/迷宫环境，缺少多种子误差条、预测精度、延迟、计算量和公开代码。

### Task 4：完成综合观点与全文自检

**Files:**

- Modify: `source/_posts/2026-07-13-jepa-from-prediction-to-planning.md`

- [ ] **Step 1：加入 Predictor 对照表**

表格逐项比较 I-JEPA、LLM-JEPA、Value-Guided JEPA 的输入输出、是否独立、推理时是否保留和主要作用。

- [ ] **Step 2：形成单一结论**

将“预测目标会塑造表示空间”和“规划需要与价值、可达性、控制代价一致的几何”串联起来，避免把第二篇论文写成第一篇论文的直接扩展或统一框架。

- [ ] **Step 3：用推进后的金句收束**

```markdown
> 能预测未来，是世界模型的起点；能在未来里找到一条路，才是规划的开始。
```

- [ ] **Step 4：执行文本检查**

运行：

```bash
rg -n "TBD|TODO|2509\.14252|2601\.00844|能预测未来" source/_posts/2026-07-13-jepa-from-prediction-to-planning.md
```

预期：无 `TBD` 或 `TODO`；两篇论文编号均出现；核心金句在开头与结尾各有呼应。

- [ ] **Step 5：检查 Markdown 与字数**

运行：

```bash
git diff --check -- source/_posts/2026-07-13-jepa-from-prediction-to-planning.md
wc -m source/_posts/2026-07-13-jepa-from-prediction-to-planning.md
```

预期：`git diff --check` 无输出；全文约 5000–7000 个中文字符，允许因链接和 front matter 略有浮动。

### Task 5：构建验证与提交

**Files:**

- Verify: `source/_posts/2026-07-13-jepa-from-prediction-to-planning.md`

- [ ] **Step 1：运行 Hexo 构建**

运行：

```bash
npm run build
```

预期：Hexo 退出码为 0，生成文章对应的静态页面，无 YAML、Markdown renderer 或链接语法错误。

- [ ] **Step 2：确认只提交目标文件**

运行：

```bash
git status --short
```

预期：可见新博文和本计划；研究笔记与用户已有 draft 保持未跟踪状态，不加入提交。

- [ ] **Step 3：提交计划与正式文章**

```bash
git add docs/superpowers/plans/2026-07-13-jepa-continuation-article.md source/_posts/2026-07-13-jepa-from-prediction-to-planning.md
git commit -m "post: trace JEPA from prediction to planning"
```
