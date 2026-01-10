# 🚀 Vercel 部署快速指南

## 方式一：通过 Vercel Web 界面部署（推荐，最简单）

### 第 1 步：导入项目

1. 访问 [Vercel Dashboard](https://vercel.com/new)
2. 点击 "Add New..." → "Project"
3. 导入你的 GitHub 仓库 `heggria/Skyloft`
4. 选择分支 `claude/complete-pr-vercel-deploy-oErcd`（或合并到 main 后选择 main）
5. Vercel 会自动检测 Next.js 项目配置

### 第 2 步：配置 PostgreSQL 数据库

#### 使用 Vercel Postgres（推荐）

1. 在 Vercel 项目页面，点击 "Storage" 标签
2. 点击 "Create Database" → 选择 "Postgres"
3. 数据库命名为 `skyloft-db`
4. 选择地区（建议选择离你最近的）
5. 点击 "Create"

Vercel 会自动添加以下环境变量：
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

### 第 3 步：配置 OAuth 应用

#### 3.1 创建 GitHub OAuth App

1. 访问 https://github.com/settings/developers
2. 点击 "New OAuth App"
3. 填写信息：
   ```
   Application name: Skyloft Travel Map
   Homepage URL: https://你的项目名.vercel.app
   Authorization callback URL: https://你的项目名.vercel.app/api/auth/callback/github
   ```
4. 点击 "Register application"
5. 复制 **Client ID**
6. 点击 "Generate a new client secret"，复制 **Client Secret**

#### 3.2 创建 Google OAuth App

1. 访问 https://console.cloud.google.com/
2. 创建新项目或选择现有项目
3. 启用 "Google+ API"（在 APIs & Services → Library 中搜索）
4. 前往 "APIs & Services" → "Credentials"
5. 点击 "Create Credentials" → "OAuth 2.0 Client ID"
6. 如果是第一次，需要先配置 OAuth consent screen
7. 选择 "Web application"
8. 添加授权重定向 URI：
   ```
   https://你的项目名.vercel.app/api/auth/callback/google
   ```
9. 复制 **Client ID** 和 **Client Secret**

### 第 4 步：配置环境变量

在 Vercel 项目设置 → "Environment Variables" 中添加：

#### 必需的环境变量：

```bash
# Database (如果使用 Vercel Postgres，添加以下映射)
DATABASE_URL=${POSTGRES_PRISMA_URL}
DIRECT_URL=${POSTGRES_URL_NON_POOLING}

# NextAuth.js
NEXTAUTH_URL=https://你的项目名.vercel.app
NEXTAUTH_SECRET=在本地运行: openssl rand -base64 32 生成

# GitHub OAuth
GITHUB_ID=你的GitHub OAuth Client ID
GITHUB_SECRET=你的GitHub OAuth Client Secret

# Google OAuth
GOOGLE_CLIENT_ID=你的Google Client ID
GOOGLE_CLIENT_SECRET=你的Google Client Secret
```

**生成 NEXTAUTH_SECRET：**
在终端运行：
```bash
openssl rand -base64 32
```

### 第 5 步：部署

1. 确认所有环境变量已配置
2. 点击 "Deploy"
3. 等待部署完成（约 2-3 分钟）

### 第 6 步：初始化数据库

部署成功后，需要推送数据库 schema：

```bash
# 1. 拉取 Vercel 环境变量到本地
npx vercel env pull .env.local

# 2. 推送数据库 schema
npx prisma db push

# 3. 生成 Prisma Client
npx prisma generate
```

### 第 7 步：验证部署

1. 访问你的 Vercel 应用 URL
2. 应该会自动跳转到登录页面
3. 尝试使用 GitHub 或 Google 登录
4. 登录成功后，点击地图添加地点
5. 刷新页面，确认数据已保存

---

## 方式二：通过 Vercel CLI 部署

### 前置要求

确保已安装 Vercel CLI：
```bash
npm install -g vercel
```

### 部署步骤

1. **登录 Vercel**
   ```bash
   vercel login
   ```

2. **首次部署**
   ```bash
   vercel
   ```

   按提示选择：
   - Set up and deploy? Yes
   - Which scope? 选择你的账号
   - Link to existing project? No
   - Project name? skyloft (或其他名称)
   - In which directory is your code located? ./
   - Override settings? No

3. **配置数据库和环境变量**（在 Vercel Dashboard 完成步骤 2-4）

4. **生产部署**
   ```bash
   vercel --prod
   ```

5. **初始化数据库**
   ```bash
   npx vercel env pull .env.local
   npx prisma db push
   ```

---

## 常见问题

### Q: 登录后显示 "未授权" 错误
**A:** 检查：
1. NEXTAUTH_URL 是否设置为正确的 Vercel URL
2. OAuth callback URLs 是否正确配置
3. 环境变量是否已保存并重新部署

### Q: 数据库连接失败
**A:**
1. 确认 DATABASE_URL 和 DIRECT_URL 已正确设置
2. 确认已运行 `npx prisma db push`
3. 检查 Vercel Postgres 数据库状态

### Q: OAuth 登录重定向到错误的 URL
**A:**
1. 确认 NEXTAUTH_URL 环境变量正确
2. 确认 OAuth 应用的 callback URL 匹配
3. 清除浏览器缓存后重试

### Q: 如何更新已部署的应用？
**A:**
```bash
git add .
git commit -m "update: 描述"
git push origin 分支名
```
Vercel 会自动重新部署。

---

## 🎯 部署检查清单

- [ ] GitHub 仓库已推送最新代码
- [ ] Vercel 项目已创建
- [ ] PostgreSQL 数据库已创建并连接
- [ ] GitHub OAuth App 已创建
- [ ] Google OAuth App 已创建
- [ ] 所有环境变量已配置
- [ ] NEXTAUTH_SECRET 已生成并设置
- [ ] 数据库 schema 已推送
- [ ] 应用可以正常访问
- [ ] OAuth 登录功能正常
- [ ] 数据可以正常保存和读取

---

## 📞 需要帮助？

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [NextAuth.js 文档](https://next-auth.js.org/)
- [Prisma 文档](https://www.prisma.io/docs)

部署成功后，你的旅游足迹应用就上线了！🎉
