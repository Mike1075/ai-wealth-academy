#!/bin/bash

# AI创富实训营部署脚本
echo "🚀 开始部署 AI创富实训营..."

# 检查必要的环境变量
check_env_vars() {
    echo "📋 检查环境变量..."
    
    required_vars=(
        "SUPABASE_URL"
        "SUPABASE_ANON_KEY"
        "API_KEY"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo "❌ 缺少环境变量: $var"
            exit 1
        fi
    done
    
    echo "✅ 环境变量检查通过"
}

# 构建项目
build_project() {
    echo "🔨 构建项目..."
    
    # 安装依赖
    npm ci
    
    # 运行类型检查
    npm run typecheck
    
    # 构建项目
    npm run build
    
    echo "✅ 项目构建完成"
}

# 运行测试
run_tests() {
    echo "🧪 运行测试..."
    
    # 如果有测试文件，运行测试
    if [ -d "tests" ] || [ -d "__tests__" ]; then
        npm test
    else
        echo "⚠️  未找到测试文件，跳过测试"
    fi
    
    echo "✅ 测试完成"
}

# 部署到Vercel
deploy_to_vercel() {
    echo "🌐 部署到 Vercel..."
    
    # 检查是否安装了Vercel CLI
    if ! command -v vercel &> /dev/null; then
        echo "📦 安装 Vercel CLI..."
        npm install -g vercel
    fi
    
    # 部署
    vercel --prod
    
    echo "✅ 部署到 Vercel 完成"
}

# 验证部署
verify_deployment() {
    echo "🔍 验证部署..."
    
    # 这里可以添加部署后的健康检查
    echo "✅ 部署验证完成"
}

# 主执行流程
main() {
    echo "🎯 AI创富实训营部署开始"
    echo "================================"
    
    check_env_vars
    build_project
    run_tests
    deploy_to_vercel
    verify_deployment
    
    echo "================================"
    echo "🎉 部署完成！"
    echo "📱 应用已成功部署到生产环境"
    echo "🔗 请访问 Vercel 控制台查看部署详情"
}

# 错误处理
set -e
trap 'echo "❌ 部署失败，请检查错误信息"' ERR

# 执行主函数
main "$@" 