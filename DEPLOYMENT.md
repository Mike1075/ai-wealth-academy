# 🚀 AI创富实训营部署指南

本文档将指导你完成AI创富实训营从开发环境到生产环境的完整部署流程。

## 📋 部署前准备

### 1. 环境要求
- Node.js 18+ 
- npm 或 yarn
- Git
- Vercel CLI (可选，用于命令行部署)

### 2. 账户准备
- [Supabase](https://supabase.com) 账户
- [Vercel](https://vercel.com) 账户
- [GitHub](https://github.com) 仓库

## 🗄️ 数据库配置

### 1. Supabase项目设置

1. 登录 Supabase Dashboard
2. 创建新项目或使用现有项目
3. 获取项目配置信息：
   - Project URL
   - Anon Key
   - Service Role Key

### 2. 运行数据库迁移

在Supabase Dashboard的SQL编辑器中依次执行：

```sql
-- 1. 基础表结构（已完成）
-- 2. 认证系统设置（已完成）
-- 3. 文件上传系统（已完成）
```

### 3. 设置Storage Buckets

在Supabase Dashboard中创建以下Storage buckets：

1. **avatars** (公共)
   - 用途：用户头像
   - 访问：公共
   - 大小限制：2MB
   - 文件类型：jpg, png, webp

2. **course-images** (公共)
   - 用途：课程封面图片
   - 访问：公共
   - 大小限制：5MB
   - 文件类型：jpg, png, webp

3. **assignments** (私有)
   - 用途：作业文件
   - 访问：私有
   - 大小限制：10MB
   - 文件类型：pdf, doc, docx, txt, jpg, png

4. **documents** (私有)
   - 用途：文档文件
   - 访问：私有
   - 大小限制：20MB
   - 文件类型：pdf, doc, docx, xls, xlsx, txt

然后在SQL编辑器中执行 `scripts/setup-storage.sql` 中的策略设置。

## 🔧 环境变量配置

### 1. 复制环境变量模板

```bash
cp env.example .env.local
```

### 2. 填写生产环境变量

编辑 `.env.local` 文件：

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# API Configuration
API_KEY=your-secure-random-api-key

# Application Configuration
NODE_ENV=production
APP_URL=https://your-domain.com

# Security
SESSION_SECRET=your-very-secure-session-secret
```

### 3. 生成安全密钥

```bash
# 生成API密钥
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 生成会话密钥
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🌐 Vercel部署

### 方法1：GitHub集成部署（推荐）

1. **连接GitHub仓库**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 选择你的GitHub仓库
   - 选择 `ai-wealth-academy` 目录

2. **配置构建设置**
   - Framework Preset: Remix
   - Build Command: `npm run build`
   - Output Directory: `build/client`
   - Install Command: `npm install`

3. **添加环境变量**
   在Vercel项目设置中添加所有环境变量：
   ```
   SUPABASE_URL
   SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   API_KEY
   SESSION_SECRET
   NODE_ENV=production
   ```

4. **部署**
   - 点击 "Deploy"
   - 等待部署完成

### 方法2：命令行部署

1. **安装Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   cd ai-wealth-academy
   vercel --prod
   ```

4. **配置环境变量**
   ```bash
   vercel env add SUPABASE_URL production
   vercel env add SUPABASE_ANON_KEY production
   vercel env add API_KEY production
   # ... 添加其他环境变量
   ```

### 方法3：使用部署脚本

```bash
cd ai-wealth-academy
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## 🔒 安全配置

### 1. Supabase安全设置

1. **RLS策略检查**
   - 确保所有表都启用了Row Level Security
   - 验证策略是否正确配置

2. **API密钥管理**
   - 定期轮换API密钥
   - 使用环境变量存储敏感信息

### 2. Vercel安全设置

1. **域名配置**
   - 添加自定义域名
   - 启用HTTPS（自动）

2. **环境变量安全**
   - 使用Vercel环境变量管理
   - 不要在代码中硬编码敏感信息

## 📊 监控和分析

### 1. Vercel Analytics

1. 在Vercel项目设置中启用Analytics
2. 查看性能指标和用户行为

### 2. Supabase监控

1. 在Supabase Dashboard查看：
   - 数据库性能
   - API使用情况
   - 存储使用量

### 3. 错误监控（可选）

集成Sentry进行错误追踪：

```bash
npm install @sentry/remix
```

## 🔄 持续部署

### 1. 自动部署设置

GitHub集成会自动触发部署：
- 推送到main分支 → 生产部署
- 推送到其他分支 → 预览部署

### 2. 部署流程

```bash
# 开发流程
git add .
git commit -m "feat: 新功能"
git push origin main

# Vercel会自动构建和部署
```

### 3. 回滚策略

如果部署出现问题：
1. 在Vercel Dashboard中点击 "Rollback"
2. 或者推送修复代码到main分支

## 🧪 部署验证

### 1. 功能测试清单

部署完成后验证以下功能：

- [ ] 用户注册/登录
- [ ] 课程浏览
- [ ] 报名功能
- [ ] 管理员后台
- [ ] 文件上传
- [ ] API端点
- [ ] 数据分析

### 2. 性能检查

- [ ] 页面加载速度 < 3秒
- [ ] 移动端响应式正常
- [ ] SEO优化检查

### 3. 安全检查

- [ ] HTTPS正常工作
- [ ] 环境变量未泄露
- [ ] 数据库访问权限正确

## 🚨 故障排除

### 常见问题

1. **构建失败**
   - 检查环境变量是否正确
   - 查看构建日志中的错误信息
   - 确保依赖项版本兼容

2. **数据库连接失败**
   - 验证Supabase URL和密钥
   - 检查网络连接
   - 确认数据库服务状态

3. **文件上传失败**
   - 检查Storage bucket配置
   - 验证RLS策略
   - 确认文件大小和类型限制

### 获取帮助

- 查看Vercel部署日志
- 检查Supabase项目日志
- 参考官方文档
- 联系技术支持

## 📈 性能优化

### 1. 缓存策略

```javascript
// 在vercel.json中配置缓存
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. 图片优化

- 使用WebP格式
- 实现图片懒加载
- 配置适当的图片尺寸

### 3. 代码分割

- 使用动态导入
- 优化Bundle大小
- 实现路由级别的代码分割

## 🔄 维护和更新

### 1. 定期任务

- 每周检查系统性能
- 每月更新依赖项
- 每季度安全审计

### 2. 备份策略

- 数据库自动备份（Supabase提供）
- 代码版本控制（Git）
- 配置文件备份

### 3. 监控告警

设置关键指标监控：
- 响应时间
- 错误率
- 用户活跃度
- 系统资源使用

---

## 🎉 部署完成

恭喜！你已经成功部署了AI创富实训营应用。

### 下一步

1. 测试所有功能
2. 配置域名和SSL
3. 设置监控和告警
4. 开始运营推广

如有问题，请参考故障排除部分或联系技术支持。 