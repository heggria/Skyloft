# ⚡ 5 分钟快速部署到 Vercel

## 🎯 最快部署路径

### 步骤 1：点击部署按钮（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/heggria/Skyloft)

或访问：https://vercel.com/new/clone?repository-url=https://github.com/heggria/Skyloft

### 步骤 2：配置必需项

部署页面会引导你完成：

1. **连接 GitHub**
2. **创建 Vercel 项目**
3. **添加 Postgres 数据库**（点击 Add Storage）
4. **设置环境变量**（见下方）

### 步骤 3：配置环境变量

在 Vercel 部署页面设置以下变量：

```bash
# 数据库（Vercel Postgres 会自动提供）
DATABASE_URL=${POSTGRES_PRISMA_URL}
DIRECT_URL=${POSTGRES_URL_NON_POOLING}

# 生成 NEXTAUTH_SECRET（在终端运行: openssl rand -base64 32）
NEXTAUTH_SECRET=你生成的随机字符串

# NEXTAUTH_URL 会在部署后自动设置，或手动设置为：
NEXTAUTH_URL=https://你的项目名.vercel.app

# GitHub OAuth（临时使用测试值，稍后更新）
GITHUB_ID=临时值
GITHUB_SECRET=临时值

# Google OAuth（临时使用测试值，稍后更新）
GOOGLE_CLIENT_ID=临时值
GOOGLE_CLIENT_SECRET=临时值
```

### 步骤 4：首次部署

点击 **Deploy** 按钮，等待 2-3 分钟。

### 步骤 5：获取部署 URL

部署完成后，Vercel 会给你一个 URL，例如：
```
https://skyloft-abc123.vercel.app
```

### 步骤 6：配置真实的 OAuth

#### GitHub OAuth
1. 访问 https://github.com/settings/developers
2. New OAuth App
3. 填写：
   - Homepage URL: `https://你的项目名.vercel.app`
   - Callback URL: `https://你的项目名.vercel.app/api/auth/callback/github`
4. 获取 Client ID 和 Secret

#### Google OAuth
1. 访问 https://console.cloud.google.com/apis/credentials
2. Create Credentials → OAuth 2.0 Client ID
3. 添加重定向 URI: `https://你的项目名.vercel.app/api/auth/callback/google`
4. 获取 Client ID 和 Secret

### 步骤 7：更新环境变量

在 Vercel Dashboard → Settings → Environment Variables 中：
1. 更新 `GITHUB_ID` 和 `GITHUB_SECRET`
2. 更新 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`
3. 更新 `NEXTAUTH_URL` 为你的实际 URL（如果还没有的话）

### 步骤 8：重新部署

环境变量更新后，点击 "Redeploy" 或推送新的代码触发部署。

### 步骤 9：初始化数据库

在本地运行：

```bash
# 拉取环境变量
npx vercel env pull .env.local

# 推送数据库 schema
npx prisma db push
```

### 步骤 10：测试

访问你的应用 URL，尝试：
1. ✅ 使用 GitHub 登录
2. ✅ 使用 Google 登录
3. ✅ 在地图上添加地点
4. ✅ 刷新页面确认数据已保存

---

## 🐛 常见问题快速修复

### 问题：登录失败
```bash
# 检查 OAuth callback URL 是否正确
# GitHub: https://你的域名/api/auth/callback/github
# Google: https://你的域名/api/auth/callback/google
```

### 问题：数据库连接失败
```bash
# 确保在 Vercel 创建了 Postgres 数据库
# 确保运行了 npx prisma db push
```

### 问题：环境变量未生效
```bash
# 更新环境变量后需要重新部署
# 在 Vercel Dashboard 点击 "Redeploy"
```

---

## 📞 需要详细指南？

查看完整文档：
- [详细部署指南](./DEPLOY_GUIDE.md)
- [Vercel 部署文档](./DEPLOYMENT.md)

---

**就是这么简单！🎉 你的旅游足迹应用现在已经上线了！**
