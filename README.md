# 🗺️ Travel Map - 旅游足迹标注应用

一个现代化的旅游足迹记录与可视化应用，帮助你记录和分享去过的每一个地方。

![Tech Stack](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ 特性

- 🗺️ **交互式世界地图** - 基于 Leaflet 的高性能地图组件
- 📍 **智能标注** - 点击地图即可添加旅行地点，自动获取地理信息
- 📊 **统计面板** - 实时显示旅行足迹统计
- 🎨 **现代化UI** - 使用 Tailwind CSS 和 shadcn/ui 构建
- 📱 **响应式设计** - 完美支持桌面和移动设备
- 🔐 **用户认证** - 基于 NextAuth.js（待实现）
- 📸 **照片管理** - 为每个地点添加照片和笔记（待实现）
- 📅 **时间轴视图** - 按时间查看旅行历史（待实现）

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
- **SQLite** - 开发环境数据库（生产环境可切换到 PostgreSQL）

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

## 🎯 功能规划

### ✅ 已完成
- [x] 项目初始化和技术栈搭建
- [x] 基础地图展示和交互
- [x] 地点标注功能
- [x] 自动地理编码（获取地点名称）
- [x] 数据库模型设计
- [x] 响应式布局

### 🚧 开发中
- [ ] 用户认证系统（NextAuth.js）
- [ ] 地点详情编辑
- [ ] 照片上传和展示
- [ ] 地点搜索功能

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
