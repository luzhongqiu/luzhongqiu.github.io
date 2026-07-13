# JEPA 文章视觉增强实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 JEPA 延续追踪文章新增四张原创技术 SVG，并把它们嵌入对应叙事节点，使关键概念可以通过图像理解。

**Architecture:** 四张 SVG 各自承担一个独立概念，统一存放在 `source/img/jepa/`，正文只负责引用与图注。SVG 使用固定 `viewBox`、系统字体、本地形状和统一颜色，不依赖外部资源；最终由 Hexo 构建和生成 HTML 检查验证。

**Tech Stack:** SVG 1.1、Markdown/HTML、Hexo 8、Icarus theme、xmllint

---

## 文件结构

- Create: `source/img/jepa/jepa-evolution-map.svg` — 三阶段演进路线图。
- Create: `source/img/jepa/llm-jepa-training-inference.svg` — LLM-JEPA 训练与推理分流图。
- Create: `source/img/jepa/predictable-vs-plannable.svg` — 隔墙场景的潜空间几何对照图。
- Create: `source/img/jepa/value-guided-planning-loop.svg` — Value-Guided MPC/MPPI 闭环图。
- Modify: `source/_posts/2026-07-13-jepa-from-prediction-to-planning.md` — 插入图片、alt 和图注。

### Task 1：创建 JEPA 演进总览

**Files:**

- Create: `source/img/jepa/jepa-evolution-map.svg`

- [ ] **Step 1：建立 720×430 的统一画布**

定义白底、圆角卡片、阴影、箭头 marker 和系统字体。颜色固定为蓝 `#0969da`、黄 `#bf8700`、绿 `#1a7f37`，保证与现有 JEPA 图一致。

- [ ] **Step 2：绘制三张连续卡片**

卡片标题和核心短句必须分别为：

```text
I-JEPA                 LLM-JEPA                 Value-Guided JEPA
预测被遮挡区域的表示    预测另一种语言表达的表示   让表示距离近似行动代价
```

卡片内分别使用图像网格/遮挡块、`Text → [PRED] → Code`、带墙路径/价值等高线三个微型图标。

- [ ] **Step 3：加入底部演进轴**

演进轴从“可预测的表示”经过“跨视图语义”到“可规划的几何”，终点标签为“从预测什么，到为了什么而预测”。

- [ ] **Step 4：校验 XML**

Run:

```bash
xmllint --noout source/img/jepa/jepa-evolution-map.svg
```

Expected: exit 0，无输出。

### Task 2：创建 LLM-JEPA 训练/推理分流图

**Files:**

- Create: `source/img/jepa/llm-jepa-training-inference.svg`

- [ ] **Step 1：绘制训练期双目标**

上半部分以自然语言 `Text` 为输入，经同一个 `LLM` 分成两条支路：

```text
生成支路：hidden states → next-token prediction → Code / Answer
JEPA 支路：[PRED] hidden state → cosine alignment ← target embedding
```

用黄色表示 NTP、蓝色表示表示编码、紫色表示 `[PRED]` 对齐。

- [ ] **Step 2：绘制推理期单支路**

下半部分只保留：

```text
Prompt → 同一个 LLM → 自回归生成
```

在灰色虚线框中标记 `[PRED] / cosine branch removed` 和“无额外推理开销”。

- [ ] **Step 3：校验 XML**

Run:

```bash
xmllint --noout source/img/jepa/llm-jepa-training-inference.svg
```

Expected: exit 0，无输出。

### Task 3：创建“可预测不等于可规划”对照图

**Files:**

- Create: `source/img/jepa/predictable-vs-plannable.svg`

- [ ] **Step 1：绘制左右两个相同迷宫**

两侧均包含起点 `S`、目标 `G` 和一堵纵向墙，标题分别为“普通 latent distance”和“value-shaped distance”。

- [ ] **Step 2：绘制错误距离与可行路径**

左侧用红色虚线直连 `S` 和 `G`，在撞墙处画叉，标签为“看起来很近，但不可达”。右侧用绿色曲线绕过墙，沿路径标注 `V ↑`，标签为“允许先变远，再真正到达”。

- [ ] **Step 3：加入底部结论条**

```text
预测准确：知道每一步会到哪里  ≠  规划容易：知道哪条路值得走
```

- [ ] **Step 4：校验 XML**

Run:

```bash
xmllint --noout source/img/jepa/predictable-vs-plannable.svg
```

Expected: exit 0，无输出。

### Task 4：创建 Value-Guided MPC 闭环图

**Files:**

- Create: `source/img/jepa/value-guided-planning-loop.svg`

- [ ] **Step 1：绘制中心数据流**

按顺序绘制：

```text
当前状态 s_t → Encoder E → latent z_t → Predictor rollout → 候选未来
```

Predictor rollout 画出三条不同颜色的候选轨迹。

- [ ] **Step 2：绘制评分、选择与回路**

候选未来进入 `value / quasi-distance` 评分，再进入 `MPPI`，输出第一步动作 `a_t*`。动作经过“执行 + 新观察”回到当前状态，形成闭环箭头。

- [ ] **Step 3：加入分阶段训练提示**

图右上角用两行编号说明：

```text
① value loss 塑造 Encoder 几何
② 冻结 Encoder，再训练 Predictor
```

- [ ] **Step 4：校验 XML**

Run:

```bash
xmllint --noout source/img/jepa/value-guided-planning-loop.svg
```

Expected: exit 0，无输出。

### Task 5：将插图嵌入文章

**Files:**

- Modify: `source/_posts/2026-07-13-jepa-from-prediction-to-planning.md`

- [ ] **Step 1：在四个叙事节点插图**

统一使用：

```html
<p align="center">
  <img src="/img/jepa/<filename>.svg" alt="<准确描述>" width="720">
</p>
<p align="center"><em>图注</em></p>
```

插入位置依次为：开篇流程图之后、LLM-JEPA `Pred` 解释之后、隔墙比喻之后、分阶段训练步骤之后。

- [ ] **Step 2：保持正文边界不变**

只增加指图句与图注，不改变损失公式、实验数字、论文成熟度和局限性结论。

- [ ] **Step 3：检查四个引用和 alt**

Run:

```bash
rg -n '<img src="/img/jepa/.*\.svg" alt=".+" width="720">' source/_posts/2026-07-13-jepa-from-prediction-to-planning.md
```

Expected: 新文章中匹配 4 行。

### Task 6：视觉、构建与版本控制验证

**Files:**

- Verify: `source/img/jepa/*.svg`
- Verify: `source/_posts/2026-07-13-jepa-from-prediction-to-planning.md`

- [ ] **Step 1：逐张视觉检查**

使用本地图片查看器检查四张 SVG，确认无文字溢出、遮挡、断箭头、低对比度或移动端缩放后无法辨认的问题；若发现问题，直接修正对应 SVG 并重新执行 `xmllint`。

- [ ] **Step 2：运行 Hexo 构建**

Run:

```bash
npm run build
```

Expected: exit 0，并生成 `2026/07/13/jepa-from-prediction-to-planning/index.html` 和四个 `img/jepa/*.svg` 资产。

- [ ] **Step 3：检查生成 HTML**

Run:

```bash
rg -o '/img/jepa/(jepa-evolution-map|llm-jepa-training-inference|predictable-vs-plannable|value-guided-planning-loop)\.svg' public/2026/07/13/jepa-from-prediction-to-planning/index.html
```

Expected: 四个不同路径各出现一次。

- [ ] **Step 4：提交并推送 blog 分支**

```bash
git add docs/superpowers/plans/2026-07-13-jepa-article-visual-enrichment.md source/_posts/2026-07-13-jepa-from-prediction-to-planning.md source/img/jepa/jepa-evolution-map.svg source/img/jepa/llm-jepa-training-inference.svg source/img/jepa/predictable-vs-plannable.svg source/img/jepa/value-guided-planning-loop.svg
git commit -m "post: add visual guide to JEPA continuation"
git push origin blog
```

现有 `source/_drafts/` 文件不加入提交。
