#!/bin/bash

# Vercel 部署辅助脚本
# 用法: ./scripts/deploy.sh

set -e

echo "🚀 Skyloft Vercel 部署助手"
echo "=========================="
echo ""

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装"
    echo "正在安装 Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI 安装完成"
fi

echo "📋 请选择操作："
echo "1. 首次部署（创建新项目）"
echo "2. 更新现有部署"
echo "3. 初始化数据库"
echo "4. 拉取环境变量"
echo "5. 查看部署状态"
echo ""
read -p "请输入选项 (1-5): " choice

case $choice in
  1)
    echo ""
    echo "🎯 开始首次部署..."
    echo "请按照提示完成配置"
    echo ""
    vercel
    echo ""
    echo "✅ 首次部署完成！"
    echo ""
    echo "📌 下一步："
    echo "1. 在 Vercel Dashboard 中配置数据库"
    echo "2. 在 Vercel Dashboard 中添加环境变量"
    echo "3. 运行此脚本选择选项 3 初始化数据库"
    ;;

  2)
    echo ""
    echo "🔄 更新部署到生产环境..."
    vercel --prod
    echo ""
    echo "✅ 部署更新完成！"
    ;;

  3)
    echo ""
    echo "🗄️ 初始化数据库..."

    if [ ! -f .env.local ]; then
        echo "📥 拉取环境变量..."
        npx vercel env pull .env.local
    fi

    echo "🔨 推送数据库 schema..."
    npx prisma db push

    echo "⚙️ 生成 Prisma Client..."
    npx prisma generate

    echo ""
    echo "✅ 数据库初始化完成！"
    ;;

  4)
    echo ""
    echo "📥 拉取环境变量..."
    npx vercel env pull .env.local
    echo ""
    echo "✅ 环境变量已保存到 .env.local"
    ;;

  5)
    echo ""
    echo "📊 查看部署状态..."
    vercel ls
    ;;

  *)
    echo "❌ 无效的选项"
    exit 1
    ;;
esac

echo ""
echo "=========================="
echo "🎉 操作完成！"
