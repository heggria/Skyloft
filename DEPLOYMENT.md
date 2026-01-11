# Vercel 部署指南

本文档介绍如何将 Travel Map 应用部署到 Vercel。

## ⚠️ 快速修复：DATABASE_URL 错误

如果你遇到 `Environment variable not found: DATABASE_URL` 错误，请按以下步骤操作：

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入你的项目 → Settings → Environment Variables
3. 确保已创建 Vercel Postgres 数据库（如果没有，请先创建）
4. **添加以下两个环境变量**（重要！）：
   ```
   DATABASE_URL = ${POSTGRES_PRISMA_URL}
   DIRECT_URL = ${POSTGRES_URL_NON_POOLING}
   ```
   注意：使用 `${...}` 语法引用 Vercel 自动生成的变量
5. 保存后，重新部署项目（Deployments → 最新部署 → Redeploy）

详细步骤请参考下方的完整部署指南。

---

## 前置要求

1. GitHub 账号
2. Vercel 账号（可使用 GitHub 登录）
3. 本项目已推送到 GitHub 仓库

## 部署步骤

### 1. 导入项目到 Vercel

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New..." → "Project"
3. 选择你的 GitHub 仓库 `heggria/Skyloft`
4. Vercel 会自动检测到这是一个 Next.js 项目

### 2. 配置数据库

#### 方式一：使用 Vercel Postgres（推荐）

1. 在 Vercel 项目设置中，进入 "Storage" 标签
2. 点击 "Create Database" → 选择 "Postgres"
3. 为数据库命名（例如：`travel-map-db`）
4. 点击 "Create"
5. Vercel 会自动添加以下环境变量到你的项目：
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`

6. **🔴 重要：手动添加 Prisma 所需的环境变量**

   Vercel 自动生成的变量名与 Prisma 要求的不同，你需要手动创建映射：

   在 Settings → Environment Variables 中点击 "Add New" 添加：

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | `${POSTGRES_PRISMA_URL}` |
   | `DIRECT_URL` | `${POSTGRES_URL_NON_POOLING}` |

   注意事项：
   - ✅ 使用 `${...}` 语法引用其他环境变量
   - ✅ 这两个变量对于所有环境（Production, Preview, Development）都要添加
   - ❌ 不要直接复制数据库连接字符串，使用变量引用

   完成后应该看到类似这样的配置：
   ```
   DATABASE_URL = ${POSTGRES_PRISMA_URL}
   DIRECT_URL = ${POSTGRES_URL_NON_POOLING}
   ```

#### 方式二：使用外部 PostgreSQL 数据库

如果你已有 PostgreSQL 数据库（如 Supabase、Railway、Neon 等），在 Vercel 环境变量中添加：

```
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
DIRECT_URL=postgresql://user:password@host:5432/database?sslmode=require
```

### 3. 配置 OAuth 认证

#### 3.1 GitHub OAuth App

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写信息：
   - Application name: `Skyloft Travel Map`
   - Homepage URL: `https://your-app.vercel.app`
   - Authorization callback URL: `https://your-app.vercel.app/api/auth/callback/github`
4. 创建后，复制 Client ID 和生成 Client Secret

#### 3.2 Google OAuth 2.0

1. 访问 [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. 创建新项目或选择现有项目
3. 启用 "Google+ API"
4. 创建 OAuth 2.0 Client ID：
   - Application type: Web application
   - Authorized JavaScript origins: `https://your-app.vercel.app`
   - Authorized redirect URIs: `https://your-app.vercel.app/api/auth/callback/google`
5. 复制 Client ID 和 Client Secret

#### 3.3 配置环境变量

在 Vercel 项目设置的 "Environment Variables" 中添加：

```bash
# NextAuth.js
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-random-secret-here

# GitHub OAuth
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

生成 NEXTAUTH_SECRET：
```bash
openssl rand -base64 32
```

### 4. 初始化数据库

⚠️ **重要：** 部署后必须初始化数据库表结构，否则应用会报错 `The table 'public.Location' does not exist`

> 💡 **高级选项：** 想要自动化数据库部署？查看 [数据库迁移配置指南](./MIGRATION_SETUP.md) 了解如何配置自动迁移。

#### 方法 A：使用 Vercel CLI（推荐）

```bash
# 1. 登录 Vercel
npx vercel login

# 2. 链接项目
npx vercel link
# 在交互提示中选择你的项目（skyloft-iota）

# 3. 拉取生产环境变量
npx vercel env pull .env.local

# 4. 初始化数据库（创建所有表）
npx prisma db push
```

#### 方法 B：手动配置

如果你不想使用 Vercel CLI：

1. 在 Vercel Dashboard 复制数据库连接字符串：
   - Settings → Environment Variables
   - 复制 `POSTGRES_PRISMA_URL` 的值
   - 复制 `POSTGRES_URL_NON_POOLING` 的值

2. 创建本地 `.env.local` 文件：
   ```bash
   DATABASE_URL="<粘贴 POSTGRES_PRISMA_URL 的值>"
   DIRECT_URL="<粘贴 POSTGRES_URL_NON_POOLING 的值>"
   ```

3. 运行数据库推送：
   ```bash
   npx prisma db push
   ```

#### 验证数据库初始化成功

初始化后，你应该看到类似输出：
```
✔ Generated Prisma Client
✔ Database synchronized with schema

Your database is now in sync with your Prisma schema.
```

访问你的应用，刷新页面，应该可以正常使用了。

### 5. 部署

1. 点击 "Deploy" 按钮
2. 等待构建和部署完成
3. 访问分配的 URL 查看应用

## 自动部署

配置完成后，每次推送代码到 GitHub 主分支，Vercel 会自动触发部署：

- ✅ 自动安装依赖
- ✅ 自动生成 Prisma Client（通过 `postinstall` 脚本）
- ✅ 自动构建 Next.js 应用
- ✅ 自动部署到全球 CDN

## 环境配置

### 开发环境

开发环境使用 `.env` 文件（不要提交到 Git）：

```bash
# 本地开发可以使用 SQLite（更简单）
DATABASE_URL="file:./dev.db"
DIRECT_URL="file:./dev.db"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret"
```

### 生产环境

生产环境在 Vercel Dashboard 配置环境变量（使用 PostgreSQL）。

## 常见问题

### 1. DATABASE_URL 环境变量未找到

**错误信息：**
```
Error [PrismaClientInitializationError]: Invalid `prisma.xxx()` invocation:
error: Environment variable not found: DATABASE_URL.
```

**原因：** Vercel Postgres 自动生成的变量名（`POSTGRES_PRISMA_URL`）与 Prisma 期望的变量名（`DATABASE_URL`）不匹配。

**解决方案：**

1. 进入 Vercel Dashboard → 你的项目 → Settings → Environment Variables
2. 确认存在 `POSTGRES_PRISMA_URL` 和 `POSTGRES_URL_NON_POOLING` 变量
3. 添加以下两个环境变量：
   ```
   DATABASE_URL = ${POSTGRES_PRISMA_URL}
   DIRECT_URL = ${POSTGRES_URL_NON_POOLING}
   ```
4. 选择应用范围：Production, Preview, Development（全选）
5. 保存后重新部署项目

**验证：** 部署成功后，访问你的应用，数据库操作应该正常工作。

### 2. Prisma Client 未生成

确保 `package.json` 中包含：
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build"
  }
}
```

### 3. 数据库连接失败

- 检查环境变量是否正确配置
- 确保 `DATABASE_URL` 和 `DIRECT_URL` 已正确设置
- 确保数据库允许来自 Vercel IP 的连接
- 确认连接字符串包含 `?sslmode=require`

### 4. 构建超时

如果构建时间过长：
- 检查依赖包大小
- 考虑使用 Vercel Pro 计划（更长的构建时间限制）

## 性能优化

1. **启用 Edge Runtime**（可选）
   - Next.js 15 支持 Edge Runtime
   - 更快的响应速度

2. **配置 ISR（增量静态再生）**
   - 对于不常变化的页面使用 ISR
   - 减少服务器负载

3. **图片优化**
   - 使用 Next.js Image 组件
   - 自动优化和响应式图片

## 监控和日志

1. 在 Vercel Dashboard 查看：
   - 部署日志
   - 运行时日志
   - 性能分析
   - 错误追踪

2. 集成第三方监控（可选）：
   - Sentry（错误追踪）
   - Vercel Analytics（性能分析）

## 数据库管理

使用 Prisma Studio 远程管理数据库：

```bash
# 1. 拉取生产环境变量
vercel env pull .env.production

# 2. 使用生产环境变量启动 Prisma Studio
dotenv -e .env.production -- npx prisma studio
```

## 回滚

如果新部署出现问题：

1. 在 Vercel Dashboard 的 "Deployments" 标签
2. 找到上一个正常的部署
3. 点击 "Promote to Production"

## 更多资源

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Prisma 部署指南](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
