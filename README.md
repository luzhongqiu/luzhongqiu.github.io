# Lu Zhongqiu's Blog

[![Hexo](https://img.shields.io/badge/Hexo-8.0+-blue?logo=hexo)](https://hexo.io/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-success?logo=github)](https://luzhongqiu.github.io/)

个人博客，使用 Hexo + Icarus 主题构建，托管在 GitHub Pages。

**博客地址**: [https://luzhongqiu.github.io](https://luzhongqiu.github.io)

---

## ✍️ 如何添加文章

### 第一步：新建文章文件

在 `source/_posts/` 目录下创建一个 Markdown 文件，命名格式为：

```
YYYY-MM-DD-文章英文标识.md
```

例如：`2026-03-01-my-new-post.md`

### 第二步：填写文章头信息

文件开头必须包含以下 Front Matter：

```markdown
---
title: 文章标题
date: 2026-03-01 10:00:00
categories:
  - 分类名
tags:
  - 标签1
  - 标签2
---

正文从这里开始...
```

**常用字段说明：**

| 字段 | 说明 | 示例 |
|------|------|------|
| `title` | 文章标题（必填） | `我的新文章` |
| `date` | 发布时间（必填） | `2026-03-01 10:00:00` |
| `categories` | 分类，只选一个 | `AI` / `技术` / `随笔` |
| `tags` | 标签，可多个 | `机器学习`、`Python` |

### 第三步：本地预览（可选）

```bash
# 安装依赖（首次）
npm install
npm install --prefix themes/icarus

# 启动本地服务器
npm run server
```

打开 http://localhost:4000 预览效果。

### 第四步：发布

```bash
git add source/_posts/你的文章.md
git commit -m "新增文章：文章标题"
git push origin blog
```

push 后 GitHub Actions 会自动构建并部署，约 1 分钟后在 https://luzhongqiu.github.io 生效。

---

## 📂 目录结构

```
.
├── _config.yml           # Hexo 站点配置
├── _config.icarus.yml    # Icarus 主题配置（侧边栏、头像、链接等）
├── source/
│   ├── _posts/           # 📝 文章目录（在这里添加文章）
│   └── img/              # 图片资源
├── themes/
│   └── icarus/           # Icarus 主题（含自定义修改）
└── .github/workflows/
    └── pages.yml         # CI/CD 自动部署配置
```

## 🛠️ 技术栈

- **框架**: [Hexo](https://hexo.io/) 8.x
- **主题**: [Icarus](https://github.com/ppoffice/hexo-theme-icarus)
- **部署**: GitHub Pages（`master` 分支）
- **CI/CD**: GitHub Actions（push `blog` 分支自动触发）
