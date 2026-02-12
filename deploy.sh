#!/bin/bash

# Hexo 博客部署脚本
# 使用方法: ./deploy.sh

echo "🚀 开始部署博客..."

# 清理并构建
echo "📦 清理并构建..."
hexo clean
hexo generate

# 部署到 GitHub Pages
echo "📤 部署到 GitHub Pages..."
hexo deploy

echo "✅ 部署完成！"
echo "🌐 访问地址: https://luzhongqiu.github.io"
