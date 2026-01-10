# 🗺️ Travel Map - 旅游足迹标注应用

一个现代化的旅游足迹记录与可视化应用，帮助你记录和分享去过的每一个地方。

![Tech Stack](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 快速部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/heggria/Skyloft)

**部署指南：**
- 📖 [5 分钟快速部署](./QUICKSTART.md) - 最简单的部署方式
- 📚 [详细部署指南](./DEPLOY_GUIDE.md) - 完整的步骤说明
- 🔧 [Vercel 配置文档](./DEPLOYMENT.md) - 深入的配置选项

## ✨ 特性

- 🗺️ **交互式世界地图** - 基于 Leaflet 的高性能地图组件
- 📍 **智能标注** - 点击地图即可添加旅行地点，自动获取地理信息
- 📊 **统计面板** - 实时显示旅行足迹统计（地点、国家、城市）
- 🎨 **现代化UI** - 参考 Claude 设计风格，简洁优雅
- 📱 **响应式设计** - 完美支持桌面和移动设备
- 🔐 **用户认证** - 支持 GitHub 和 Google OAuth 登录
- 💾 **数据持久化** - 基于 PostgreSQL + Prisma ORM
- 🚀 **一键部署** - 支持 Vercel 自动部署
- ⚡ **实时同步** - 所有操作即时保存到云端
- 🎯 **智能错误处理** - 完善的加载状态和错误提示

## 🚀 技术栈

### 前端
- **Next.js 15** - React 全栈框架 (App Router)
- **React 18** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 原子化 CSS 框架
- **Leaflet** + **React Leaflet** - 开源地图库

### 后端
- **Next.js API Routes** - 服务端 API
- **Prisma** - 下一代 ORM
- **PostgreSQL** - 生产数据库
- **NextAuth.js v5** - 身份认证解决方案
- **OAuth 2.0** - GitHub & Google 登录

### 状态管理 & 工具
- **Zustand** - 轻量级状态管理
- **React Hook Form** + **Zod** - 表单处理和验证
- **date-fns** - 日期处理

### DevOps
- **pnpm** - 高效的包管理器
- **ESLint** - 代码质量检查

## 📦 快速开始

### 前置要求

- Node.js 18+
- pnpm 8+

### 安装

```bash
# 克隆仓库
git clone https://github.com/heggria/Skyloft.git
cd Skyloft

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env

# 初始化数据库
pnpm db:push

# 启动开发服务器
pnpm dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可看到应用。

## 🛠️ 可用命令

```bash
# 开发模式
pnpm dev

# 生产构建
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint

# 数据库操作
pnpm db:push    # 推送数据库 schema 更改
pnpm db:studio  # 打开 Prisma Studio 可视化管理数据库
```

## 🚀 部署到 Vercel

本项目已配置好自动部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fheggria%2FSkyloft)

### 快速部署步骤

1. 点击上方按钮一键部署
2. 在 Vercel 中创建 PostgreSQL 数据库
3. 配置环境变量（自动从数据库获取）
4. 部署完成后运行 `npx prisma db push` 初始化数据库

详细部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🎯 功能规划

### ✅ 已完成
- [x] 项目初始化和技术栈搭建
- [x] 基础地图展示和交互
- [x] 地点标注功能
- [x] 自动地理编码（获取地点名称）
- [x] 数据库模型设计和 API 实现
- [x] 数据持久化（后端 API + Prisma）
- [x] 地点列表展示和删除功能
- [x] 响应式布局
- [x] Vercel 自动部署配置
- [x] 用户认证系统（GitHub & Google OAuth）
- [x] 现代化 UI 设计（参考 Claude 风格）
- [x] 完善的加载状态和错误处理
- [x] 空状态和边界情况处理
- [x] 统计面板（地点、国家、城市数量）

### 🚧 开发中
- [ ] 地点详情编辑功能
- [ ] 照片上传和展示
- [ ] 地点搜索和筛选功能

### 📋 计划中
- [ ] 统计面板（国家/城市数量、覆盖率）
- [ ] 时间轴视图
- [ ] 地图主题切换
- [ ] 分享功能
- [ ] 导出数据（PDF、图片）
- [ ] 多语言支持
- [ ] PWA 支持

## 📂 项目结构

```
Skyloft/
├── prisma/              # 数据库 schema 和迁移
│   └── schema.prisma
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── layout.tsx   # 根布局
│   │   ├── page.tsx     # 首页
│   │   └── globals.css  # 全局样式
│   ├── components/      # React 组件
│   │   └── Map.tsx      # 地图组件
│   └── lib/             # 工具函数和配置
│       ├── prisma.ts    # Prisma 客户端
│       └── utils.ts     # 工具函数
├── public/              # 静态资源
├── .env                 # 环境变量
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 🎨 设计灵感

本项目借鉴了以下优秀的旅行应用：

- **Been** - 简洁的国家标注应用
- **Visited** - 交互式地图标注
- **Polarsteps** - 旅行轨迹记录
- **Wanderlog** - 旅行规划与记录

## 🤝 贡献

欢迎贡献代码、报告问题或提出新功能建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 License

MIT License

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Leaflet](https://leafletjs.com/) - 开源地图库
- [OpenStreetMap](https://www.openstreetmap.org/) - 地图数据
- [Prisma](https://www.prisma.io/) - 数据库 ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件

---

**Made with ❤️ by Heggria**
