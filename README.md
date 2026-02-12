# 🏠 老九门 - LJM 的个人博客

[![Hexo](https://img.shields.io/badge/Hexo-6.0+-blue?logo=hexo)](https://hexo.io/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-success?logo=github)](https://luzhongqiu.github.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **寻龙分金看缠山，一重缠是一重关**

这是我的个人技术博客，使用 [Hexo](https://hexo.io/) 构建，托管在 [GitHub Pages](https://pages.github.com/) 上。

## 🌐 在线访问

**博客地址**: [https://luzhongqiu.github.io](https://luzhongqiu.github.io)

## 📝 博客内容

- 🤖 机器学习与深度学习
- 💻 编程技术与最佳实践
- 📷 摄影与后期处理
- 🎯 个人成长与思考

## 🚀 技术栈

- **静态站点生成器**: [Hexo](https://hexo.io/)
- **主题**: [Maupassant](https://github.com/tufu9441/maupassant-hexo)
- **部署**: GitHub Pages
- **评论系统**: Gitalk

## 🛠️ 本地开发

### 环境要求

- [Node.js](https://nodejs.org/) (>= 14.0.0)
- [Git](https://git-scm.com/)

### 安装依赖

```bash
# 克隆仓库
git clone git@github.com:luzhongqiu/luzhongqiu.github.io.git
cd luzhongqiu.github.io

# 安装依赖
npm install

# 安装 Hexo CLI（如果尚未安装）
npm install -g hexo-cli
```

### 本地预览

```bash
# 启动本地服务器
hexo server

# 或者
npm run server
```

访问 `http://localhost:4000` 查看效果。

### 新建文章

```bash
hexo new post "文章标题"
```

### 构建站点

```bash
hexo generate
# 或者
hexo g
```

### 部署到 GitHub Pages

```bash
hexo deploy
# 或者
hexo d
```

## 📂 目录结构

```
.
├── _config.yml          # 站点配置文件
├── package.json         # 依赖配置
├── scaffolds/           # 文章模板
├── source/              # 源代码
│   ├── _posts/          # 博客文章
│   └── about/           # 关于页面
└── themes/              # 主题目录
    └── maupassant/      # Maupassant 主题
```

## 🎨 装修记录

### 2025-02 装修更新

- ✅ 更新 Hexo 配置，优化 SEO
- ✅ 启用本地搜索功能
- ✅ 添加字数统计和阅读时间
- ✅ 启用不蒜子访问统计
- ✅ 添加动态背景效果
- ✅ 优化关于页面
- ✅ 配置 Gitalk 评论系统
- ✅ 添加文章版权信息

## 📜 许可证

本站内容采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 许可协议。

## 🙏 致谢

- [Hexo](https://hexo.io/) - 快速、简洁且高效的博客框架
- [Maupassant](https://github.com/tufu9441/maupassant-hexo) - 简洁优雅的 Hexo 主题

---

Made with ❤️ by [LJM](https://github.com/luzhongqiu)
