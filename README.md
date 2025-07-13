# 🤖 爱学AI创富实训营官方网站

## 📖 项目介绍

这是一个现代化的全栈Web应用，展示了如何使用最新的技术栈构建专业的商业网站。

### 🛠️ 技术栈

- **前端框架**: Remix (React Router v7)
- **样式**: Tailwind CSS
- **后端服务**: Supabase
- **部署平台**: Netlify
- **开发工具**: Cursor + Supabase MCP

### ✨ 功能特性

#### 前台功能
- 🏠 现代化响应式首页
- 📚 课程展示和介绍
- 👤 用户注册和登录
- 📝 课程报名系统
- 📱 移动端适配

#### 后台功能
- 🔐 管理员认证系统
- 📊 数据统计仪表板
- 👥 用户管理
- 📈 报名数据分析

### 🚀 快速开始

#### 1. 安装依赖
\`\`\`bash
npm install
\`\`\`

#### 2. 环境配置
复制 \`env.example\` 为 \`.env\` 并配置：
\`\`\`
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

#### 3. 启动开发服务器
\`\`\`bash
npm run dev
\`\`\`

#### 4. 构建生产版本
\`\`\`bash
npm run build
\`\`\`

### 📁 项目结构

\`\`\`
ai-wealth-academy/
├── app/
│   ├── routes/          # 页面路由
│   ├── lib/             # 工具库
│   └── components/      # 组件库
├── public/              # 静态资源
├── netlify.toml         # Netlify配置
└── package.json         # 依赖管理
\`\`\`

### 🎯 教学目标

这个项目主要用于演示：

1. **现代全栈开发流程**
   - Remix框架的使用
   - Supabase集成
   - Tailwind CSS样式

2. **Cursor + Supabase MCP集成**
   - AI辅助编程
   - 数据库操作
   - 实时数据同步

3. **自动化部署流程**
   - Git版本控制
   - Netlify自动部署
   - 环境变量管理

### 🔄 开发流程

1. **本地开发** → 修改代码
2. **Git提交** → 推送到GitHub
3. **自动部署** → Netlify自动构建和部署
4. **实时更新** → 网站立即更新

### 📝 数据库设计

#### 核心表结构
- \`users\` - 用户信息
- \`courses\` - 课程信息
- \`enrollments\` - 报名记录
- \`clients\` - 客户咨询记录

### 🌟 特色亮点

- ✅ **现代化UI设计** - 渐变色彩，动画效果
- ✅ **响应式布局** - 完美适配所有设备
- ✅ **性能优化** - 快速加载，流畅体验
- ✅ **SEO友好** - 搜索引擎优化
- ✅ **类型安全** - TypeScript支持

### 🚀 部署说明

1. 连接GitHub仓库到Netlify
2. 设置构建命令：\`npm run build\`
3. 设置发布目录：\`build/client\`
4. 配置环境变量
5. 自动部署完成

### 📞 联系方式

- 📧 Email: contact@aiwealth.academy
- 📱 Phone: 400-888-9999
- 🏢 Address: 北京市朝阳区AI大厦

---

© 2025 爱学AI创富实训营. All rights reserved.
