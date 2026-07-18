# JEPA 调研追踪博客系列实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将五份现有 JEPA 研究记录发布为独立追踪博客，并把 `jepa` 每日自动化改为研究、成文、构建、提交和推送 `blog` 分支的完整闭环。

**Architecture:** `research/jepa/` 继续作为去重与修订的事实源，`source/_posts/` 保存带 Hexo front matter 和统一系列声明的公开副本。Hexo 原生分类与标签生成聚合页；自动化仅精确暂存当日研究记录和对应博客，构建成功后推送 `origin blog`，由既有 GitHub Actions 发布站点。

**Tech Stack:** Hexo 8、Markdown、YAML front matter、Icarus theme、Codex automation、Git、shell/rg/diff 校验

**约束:** 当前工作分支必须为 `blog`；不修改 `themes/icarus/` 和既有原创 JEPA 文章；不暂存 `source/_drafts/`、`public/` 或其它无关文件；绝不直接操作 `master`。

---

## 文件结构

- `research/jepa/2026-07-15.md` 至 `2026-07-18.md`：五份研究事实源，包含 7 月 16 日文本检索专题。
- `source/_posts/2026-07-15-jepa-research-tracking.md` 至 `2026-07-18-jepa-research-tracking.md`：五篇公开追踪博客，包含 7 月 16 日专题文章。
- `docs/superpowers/specs/2026-07-17-jepa-research-tracking-series-design.md`：已确认的发布和自动化安全边界。
- `docs/superpowers/plans/2026-07-17-jepa-research-tracking-series.md`：本实施计划。
- Codex automation `jepa`：保留当前调度与模型配置，仅替换任务提示词。

### Task 1: 建立发布基线

**Files:**
- Read: `research/jepa/*.md`
- Read: `source/_posts/2026-04-21-world-model-jepa-conversation.md`
- Read: `source/_posts/2026-07-13-jepa-from-prediction-to-planning.md`

- [ ] **Step 1: 确认分支与远端**

Run:

```bash
git branch --show-current
git remote get-url origin
git status --short --branch
```

Expected: 当前分支为 `blog`；`origin` 指向 `luzhongqiu/luzhongqiu.github.io.git`；`source/_drafts/` 等无关文件保持未暂存。

- [ ] **Step 2: 记录不可变文件校验和**

Run:

```bash
shasum \
  research/jepa/2026-07-15.md \
  research/jepa/2026-07-16.md \
  research/jepa/2026-07-16-text-embedding-retrieval.md \
  research/jepa/2026-07-17.md \
  research/jepa/2026-07-18.md \
  source/_posts/2026-04-21-world-model-jepa-conversation.md \
  source/_posts/2026-07-13-jepa-from-prediction-to-planning.md
```

Expected: 输出七行 SHA-1，供 Task 3 复核；博客转换期间不改写这些文件。

### Task 2: 完成五篇静态追踪文章

**Files:**
- Verify: `source/_posts/2026-07-15-jepa-research-tracking.md`
- Verify: `source/_posts/2026-07-16-jepa-research-tracking.md`
- Verify: `source/_posts/2026-07-16-jepa-text-embedding-retrieval-tracking.md`
- Verify: `source/_posts/2026-07-17-jepa-research-tracking.md`
- Create: `source/_posts/2026-07-18-jepa-research-tracking.md`

- [ ] **Step 1: 验证前四篇文章的统一元数据**

每篇必须使用单一分类 `JEPA研究追踪`、标签 `JEPA` 与 `JEPA追踪`，并包含以下声明：

```markdown
> 本文属于「JEPA追踪」系列，记录每日论文检索、原文核验与阶段性判断；它保留研究日志的证据密度，与经过主题化重写的原创博客区分。
```

Run:

```bash
for file in \
  source/_posts/2026-07-15-jepa-research-tracking.md \
  source/_posts/2026-07-16-jepa-research-tracking.md \
  source/_posts/2026-07-16-jepa-text-embedding-retrieval-tracking.md \
  source/_posts/2026-07-17-jepa-research-tracking.md; do
  rg -q '^  - JEPA研究追踪$' "$file" || exit 1
  rg -q '^  - JEPA$' "$file" || exit 1
  rg -q '^  - JEPA追踪$' "$file" || exit 1
  rg -q '^> 本文属于「JEPA追踪」系列' "$file" || exit 1
done
```

Expected: exit code 0，无输出。

- [ ] **Step 2: 创建 2026-07-18 日报文章**

文件头和声明必须为：

```markdown
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

```

声明后逐字追加 `research/jepa/2026-07-18.md` 全文。

### Task 3: 校验正文映射与不可变边界

**Files:**
- Test: `source/_posts/*jepa*tracking.md`
- Verify: `research/jepa/*.md`
- Verify: two existing original JEPA posts

- [ ] **Step 1: 校验五篇正文逐字映射**

Run:

```bash
for mapping in \
  'source/_posts/2026-07-15-jepa-research-tracking.md research/jepa/2026-07-15.md' \
  'source/_posts/2026-07-16-jepa-research-tracking.md research/jepa/2026-07-16.md' \
  'source/_posts/2026-07-16-jepa-text-embedding-retrieval-tracking.md research/jepa/2026-07-16-text-embedding-retrieval.md' \
  'source/_posts/2026-07-17-jepa-research-tracking.md research/jepa/2026-07-17.md' \
  'source/_posts/2026-07-18-jepa-research-tracking.md research/jepa/2026-07-18.md'; do
  post="${mapping%% *}"
  research="${mapping#* }"
  diff -u \
    <(perl -0pe 's/\n+\z/\n/' "$research") \
    <(tail -n +13 "$post" | perl -0pe 's/\n+\z/\n/') || exit 1
done
```

Expected: exit code 0，无 diff；仅规范化文件末尾空行数量，不忽略正文中的任何空行差异。

- [ ] **Step 2: 校验日期、分类、标签与声明**

Run:

```bash
rg -n '^date: 2026-07-(15 10:00:00|16 10:00:00|16 18:00:00|17 10:00:00|18 10:00:00)$' \
  source/_posts/*jepa*tracking.md
for file in source/_posts/*jepa*tracking.md; do
  test "$(rg -c '^  - JEPA研究追踪$' "$file")" = 1 || exit 1
  test "$(rg -c '^  - JEPA$' "$file")" = 1 || exit 1
  test "$(rg -c '^  - JEPA追踪$' "$file")" = 1 || exit 1
  test "$(rg -c '^> 本文属于「JEPA追踪」系列' "$file")" = 1 || exit 1
done
```

Expected: 日期命令输出五行；循环 exit code 0。

- [ ] **Step 3: 复核不可变文件**

重新执行 Task 1 Step 2 的 `shasum` 命令并确认完全一致，再运行：

```bash
if rg -q '^  - JEPA追踪$' \
  source/_posts/2026-04-21-world-model-jepa-conversation.md \
  source/_posts/2026-07-13-jepa-from-prediction-to-planning.md; then
  exit 1
fi
```

Expected: SHA-1 无变化；原创文章不含 `JEPA追踪` 标签。

### Task 4: 执行 Hexo 构建验证

**Files:**
- Read generated output only: `public/`

- [ ] **Step 1: 清理并生成站点**

Run:

```bash
npm run clean
npm run build
```

Expected: 两个命令均返回 exit code 0；Hexo 无 YAML、Markdown renderer 或 permalink 冲突错误。

- [ ] **Step 2: 验证文章页与聚合页**

Run:

```bash
test -d public/categories/JEPA研究追踪
test -d public/tags/JEPA追踪
test -f public/2026/07/15/jepa-research-tracking/index.html
test -f public/2026/07/16/jepa-research-tracking/index.html
test -f public/2026/07/16/jepa-text-embedding-retrieval-tracking/index.html
test -f public/2026/07/17/jepa-research-tracking/index.html
test -f public/2026/07/18/jepa-research-tracking/index.html
rg -q '本文属于「JEPA追踪」系列' public/2026/07/18/jepa-research-tracking/index.html
```

Expected: 八条检查均成功且无输出。

### Task 5: 提交并推送首次系列内容

**Files:**
- Stage: plan、五份研究记录、五篇追踪博客
- Exclude: `source/_drafts/`, `public/`

- [ ] **Step 1: 精确暂存目标文件**

Run:

```bash
git add -- \
  docs/superpowers/plans/2026-07-17-jepa-research-tracking-series.md \
  research/jepa/2026-07-15.md \
  research/jepa/2026-07-16.md \
  research/jepa/2026-07-16-text-embedding-retrieval.md \
  research/jepa/2026-07-17.md \
  research/jepa/2026-07-18.md \
  source/_posts/2026-07-15-jepa-research-tracking.md \
  source/_posts/2026-07-16-jepa-research-tracking.md \
  source/_posts/2026-07-16-jepa-text-embedding-retrieval-tracking.md \
  source/_posts/2026-07-17-jepa-research-tracking.md \
  source/_posts/2026-07-18-jepa-research-tracking.md
git diff --cached --check -- \
  docs/superpowers/plans/2026-07-17-jepa-research-tracking-series.md
diff -u \
  <(git diff --cached --name-only | sort) \
  <(printf '%s\n' \
    docs/superpowers/plans/2026-07-17-jepa-research-tracking-series.md \
    research/jepa/2026-07-15.md \
    research/jepa/2026-07-16.md \
    research/jepa/2026-07-16-text-embedding-retrieval.md \
    research/jepa/2026-07-17.md \
    research/jepa/2026-07-18.md \
    source/_posts/2026-07-15-jepa-research-tracking.md \
    source/_posts/2026-07-16-jepa-research-tracking.md \
    source/_posts/2026-07-16-jepa-text-embedding-retrieval-tracking.md \
    source/_posts/2026-07-17-jepa-research-tracking.md \
    source/_posts/2026-07-18-jepa-research-tracking.md | sort)
```

Expected: 暂存区与上述 11 个文件完全一致；`source/_drafts/` 和 `public/` 不出现。研究记录与博客中的行尾双空格是 Markdown 强制换行语义，已由正文逐字映射和 Hexo 构建覆盖，不对这些内容执行会误报的通用空白检查。

- [ ] **Step 2: 提交系列内容**

Run:

```bash
git commit -m "post: publish JEPA research tracking series"
```

Expected: commit 成功，包含 5 份研究记录、5 篇博客和 1 份实施计划。

- [ ] **Step 3: 推送 `blog` 分支**

Run:

```bash
git push origin blog
git rev-parse HEAD
git ls-remote origin refs/heads/blog
```

Expected: 推送成功；本地 HEAD 与远端 `blog` 哈希一致，并包含设计文档 commit `4d847c5`。

### Task 6: 更新每日自动化发布闭环

**External object:**
- Modify: Codex automation `jepa`

- [ ] **Step 1: 保留自动化非提示词字段**

保持名称 `JEPA 下游论文每日研究`、状态 `ACTIVE`、每日 11:00 调度、模型 `gpt-5.6-sol`、推理强度 `xhigh`、本地执行环境和当前项目目录不变。

- [ ] **Step 2: 替换为完整发布提示词**

提示词保留原有研究要求，并加入以下原文：

```text
6. 将本次完整研究记录写入 research/jepa/YYYY-MM-DD.md；即使没有新增论文，也保留检索范围、未纳入结果及原因。
7. 将当日研究记录同步生成最终博客 source/_posts/YYYY-MM-DD-jepa-research-tracking.md。使用单一分类 JEPA研究追踪，标签 JEPA 与 JEPA追踪，并在 front matter 后加入统一的「JEPA追踪」系列声明；正文完整承载研究记录。不要修改其它原创博客或 source/_drafts/。
8. 确认当前分支为 blog，运行 npm run clean 和 npm run build，并验证当日文章页、JEPA研究追踪分类页与 JEPA追踪标签页。构建失败时停止并报告。
9. 构建成功后，只精确暂存当日 research/jepa/YYYY-MM-DD.md 和对应博客，检查暂存区不含其它文件，提交信息为 research: publish JEPA tracking YYYY-MM-DD，然后执行 git push origin blog。绝不直接操作 master，不提交 public/、source/_drafts/ 或其它无关改动；分支错误、暂存范围异常、提交或推送失败时停止并报告，不使用破坏性命令清理工作区。
10. 向用户发送中文进展通知，包含新增论文结论、博客路径、构建结果、提交哈希和推送状态；结尾询问是否继续深挖某篇论文或把某个主题改写为区别于追踪日报的原创技术博客。
```

Expected: 原有去重、引用链发现、一手来源核验、论文解读字段和“今日无高可信新增”要求均仍存在。

- [ ] **Step 3: 查看更新后的自动化**

Expected: automation `jepa` 仍为 ACTIVE 且调度不变；提示词不再禁止写博客或推送，并明确 `JEPA`、`JEPA追踪`、`JEPA研究追踪`。

### Task 7: 最终核验

**Files:**
- Verify: repository state
- Verify: Codex automation `jepa`

- [ ] **Step 1: 核验本地与远端状态**

Run:

```bash
git status --short --branch
git rev-parse HEAD
git ls-remote origin refs/heads/blog
```

Expected: 本地 `blog` 与 `origin/blog` 哈希一致；仅用户原有 `source/_drafts/` 保持未跟踪，目标系列文件均已提交。

- [ ] **Step 2: 汇报结果**

报告五篇文章、分类/标签、构建状态、commit 哈希、远端分支和自动化更新结果，并明确 `source/_drafts/` 未纳入提交。
