# 🚀 快速发文章指南

> 老九门博客发文章 - 极简版速查

---

## ⚡ 三步发布

```bash
# 1. 进入目录
cd /Users/nic/Documents/workspace/luzhongqiu.github.io

# 2. 创建文章
hexo new post "文章标题"

# 3. 编辑保存后，一键部署
./deploy.sh
```

---

## ✍️ 文章模板

复制以下内容，修改后使用：

```markdown
---
title: 文章标题
date: 2025-02-12 14:30:00
categories:
  - 技术分类
tags:
  - 标签1
  - 标签2
---

# 引言

文章简介...

## 正文

内容...

## 总结

总结...
```

---

## 📂 文件位置

| 内容 | 路径 |
|------|------|
| 已发布文章 | `source/_posts/` |
| 草稿 | `source/_drafts/` |
| 关于页面 | `source/about/index.md` |

---

## 🛠️ 常用命令

```bash
hexo new post "标题"       # 新建文章
hexo server                # 本地预览 http://localhost:4000
./deploy.sh                # 部署发布
hexo clean                 # 清理缓存
```

---

## 🆘 遇到问题？

查看完整教程 → [HOW_TO_WRITE.md](./HOW_TO_WRITE.md)

博客地址 → https://luzhongqiu.github.io
