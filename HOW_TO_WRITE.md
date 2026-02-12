# 📝 如何发布新文章 - 完整教程

> 本文档记录如何在老九门博客发布新文章，防止忘记操作步骤。

---

## 📋 目录

1. [快速开始（极简版）](#快速开始极简版)
2. [详细步骤](#详细步骤)
3. [文章格式说明](#文章格式说明)
4. [常用命令](#常用命令)
5. [常见问题](#常见问题)

---

## 🚀 快速开始（极简版）

如果你已经配置好环境，只需三步：

```bash
# 1. 进入项目目录
cd /Users/nic/Documents/workspace/luzhongqiu.github.io

# 2. 创建新文章
hexo new post "文章标题"

# 3. 编辑文章 → 保存 → 部署
./deploy.sh
```

---

## 📖 详细步骤

### 第一步：进入项目目录

```bash
cd /Users/nic/Documents/workspace/luzhongqiu.github.io
```

### 第二步：创建新文章

#### 方式 A：使用 Hexo 命令（推荐）

```bash
# 基本用法
hexo new post "我的文章标题"

# 带分类的文章
hexo new post "TensorFlow 入门教程"

# 带日期的文章
hexo new post "2017-03-26-tensorflow-guide"
```

执行后，Hexo 会在 `source/_posts/` 目录下创建一个 Markdown 文件。

#### 方式 B：手动创建文件

直接在 `source/_posts/` 目录下新建 `.md` 文件，文件名格式：
```
YYYY-MM-DD-文章标题.md
```

例如：
```
2025-02-12-how-to-use-git.md
```

---

### 第三步：编辑文章内容

#### 3.1 打开生成的文件

创建后会输出文件路径，例如：
```
INFO  Created: ~/workspace/luzhongqiu.github.io/source/_posts/我的文章标题.md
```

用你喜欢的编辑器打开：
```bash
# VS Code
code source/_posts/我的文章标题.md

# Vim
vim source/_posts/我的文章标题.md

# 或其他编辑器
```

#### 3.2 文章头部格式（Front-matter）

每篇文章开头必须包含 YAML 格式的头部信息：

```yaml
---
title: 文章标题                    # 文章标题
date: 2025-02-12 14:30:00         # 发布时间
categories:                       # 分类（只能有一个）
  - Machine Learning              # 主分类
  - Tutorial                      # 子分类（可选）
tags:                             # 标签（可以有多个）
  - tensorflow
  - python
  - deep-learning
# 以下是可选字段
description: 文章简介              # 文章描述（SEO用）
updated: 2025-02-12 16:00:00      # 更新时间
toc: true                         # 是否显示目录
donate: false                     # 是否显示打赏按钮
copyright: true                   # 是否显示版权信息
---
```

#### 3.3 文章正文格式

头部下方就是正文，使用 Markdown 语法：

```markdown
---
title: TensorFlow 入门指南
date: 2025-02-12 14:30:00
categories:
  - Machine Learning
tags:
  - tensorflow
  - python
---

# 引言

这是一篇关于 TensorFlow 的入门教程。

## 环境安装

```bash
pip install tensorflow
```

## 基本用法

```python
import tensorflow as tf

# 创建常量
a = tf.constant([1, 2, 3])
print(a)
```

## 总结

本文介绍了 TensorFlow 的基础知识...

---

> 参考资料：
> - [TensorFlow 官方文档](https://tensorflow.org)
```

#### 3.4 Markdown 语法速查

| 语法 | 效果 |
|------|------|
| `# 标题` | 一级标题 |
| `## 标题` | 二级标题 |
| `**加粗**` | **加粗** |
| `*斜体*` | *斜体* |
| `` `代码` `` | `代码` |
| ```` ```python ```` | 代码块 |
| `- 列表项` | 无序列表 |
| `1. 列表项` | 有序列表 |
| `[链接文字](URL)` | [链接](URL) |
| `![图片描述](图片URL)` | 插入图片 |
| `> 引用` | 引用块 |
| `---` | 分隔线 |

---

### 第四步：本地预览

发布前先在本地查看效果：

```bash
# 启动本地服务器
hexo server

# 或简写
hexo s

# 带草稿预览（包括 _drafts 文件夹的文章）
hexo s --draft
```

打开浏览器访问：**http://localhost:4000**

看到满意的效果后，按 `Ctrl+C` 停止服务器。

---

### 第五步：发布部署

#### 方式 A：使用部署脚本（最简单）

```bash
./deploy.sh
```

这个脚本会自动：
1. 清理旧的构建文件
2. 生成静态网站
3. 部署到 GitHub Pages

#### 方式 B：手动部署

```bash
# 清理
hexo clean

# 生成
hexo generate

# 部署
hexo deploy
```

#### 方式 C：使用 npm 命令

```bash
npm run clean
npm run build
npm run deploy
```

---

### 第六步：验证发布

部署完成后，访问博客查看：

🔗 **https://luzhongqiu.github.io**

等待 1-2 分钟让 GitHub Pages 刷新缓存。

---

## 🎯 文章格式模板

保存这个模板，写新文章时直接复制使用：

```markdown
---
title: 在这里填写文章标题
date: 2025-02-12 14:30:00
categories:
  - 分类名称
tags:
  - 标签1
  - 标签2
  - 标签3
description: 文章简介，会显示在首页和搜索结果中
toc: true
---

# 前言

简单介绍文章背景。

## 正文第一部分

详细内容...

### 小节标题

更详细的内容...

```代码示例
console.log("Hello World");
```

## 正文第二部分

更多内容...

## 总结

总结全文要点。

---

> 参考链接：
> - [参考1](https://example.com)
> - [参考2](https://example.com)
```

---

## ⌨️ 常用命令速查表

```bash
# ========== 创建文章 ==========
hexo new post "文章标题"              # 创建新文章
hexo new draft "草稿标题"             # 创建草稿（不会发布）
hexo new page "页面名称"              # 创建新页面（如 about）

# ========== 本地预览 ==========
hexo server                          # 启动本地服务器
hexo s                               # 简写
hexo s -p 5000                       # 指定端口 5000
hexo s --draft                       # 包含草稿一起预览
hexo s --debug                       # 调试模式

# ========== 构建 ==========
hexo generate                        # 生成静态文件
hexo g                               # 简写
hexo g --watch                       # 监视文件变化自动重新生成
hexo clean                           # 清理缓存和已生成的文件

# ========== 部署 ==========
hexo deploy                          # 部署到 GitHub Pages
hexo d                               # 简写
hexo clean && hexo g && hexo d       # 完整流程

# ========== 组合命令 ==========
hexo g -d                            # 生成并部署
hexo clean && hexo g -d              # 清理、生成、部署
```

---

## ❓ 常见问题

### Q1: 文章发布后不显示？

**可能原因：**
- 文章头部 YAML 格式错误（注意空格、冒号）
- 文章日期设置在未来时间
- 缓存问题

**解决方法：**
```bash
hexo clean
hexo g
hexo d
```

### Q2: 如何插入图片？

**方法 A：使用图床（推荐）**
```markdown
![图片描述](https://你的图床地址/图片.png)
```

**方法 B：使用相对路径**
将图片放在 `source/images/` 目录：
```markdown
![图片描述](/images/图片名称.png)
```

### Q3: 如何保存草稿，暂时不发布？

```bash
# 创建草稿
hexo new draft "草稿标题"
```

草稿保存在 `source/_drafts/` 目录，默认不会发布。

发布时移动到 `source/_posts/` 或运行：
```bash
hexo publish draft "草稿标题"
```

### Q4: 如何修改已发布的文章？

直接编辑 `source/_posts/` 下的对应文件，保存后重新部署即可。

### Q5: 如何删除文章？

```bash
# 1. 删除文件
rm source/_posts/要删除的文章.md

# 2. 清理并重新部署
hexo clean && hexo g && hexo d
```

### Q6: 如何添加文章目录？

在文章头部添加 `toc: true`：
```yaml
---
title: 我的文章
toc: true    # 启用目录
---
```

### Q7: 本地预览正常，但网站显示异常？

可能是浏览器缓存或 CDN 缓存问题：
1. 清除浏览器缓存（Ctrl+Shift+R 强制刷新）
2. 等待 2-5 分钟让 GitHub Pages 刷新
3. 检查 `_config.yml` 中的 URL 配置是否正确

### Q8: 忘记了命令怎么办？

```bash
# 查看所有可用命令
hexo help

# 查看具体命令帮助
hexo help new
```

---

## 💡 写作小贴士

1. **文章命名**：用英文或拼音，不要有特殊字符
   - ✅ 好：`2025-02-12-tensorflow-guide.md`
   - ❌ 差：`2025-02-12-TensorFlow入门!!!.md`

2. **定期备份**：虽然 Git 已经备份，但重要文章可以多一份本地备份

3. **图片优化**：博客图片建议压缩后再上传，提升加载速度

4. **标签管理**：使用已有标签，保持分类清晰
   - 查看现有标签：https://luzhongqiu.github.io/tags/

5. **文章摘要**：在文章正文开头写一段摘要，Hexo 会自动提取显示在首页

6. **写作频率**：建议固定更新频率，比如每周一篇

---

## 📚 延伸阅读

- [Hexo 官方文档](https://hexo.io/zh-cn/docs/)
- [Markdown 语法指南](https://www.markdownguide.org/)
- [Maupassant 主题文档](https://github.com/tufu9441/maupassant-hexo)

---

**最后更新**：2025-02-12

如有疑问，查看本文档或询问 Kimi 😊
