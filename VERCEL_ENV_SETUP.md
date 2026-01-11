# Vercel 环境变量快速配置指南

这是一个快速参考指南，帮助你在 Vercel 上正确配置环境变量。

## 🚨 正在遇到 DATABASE_URL 错误？

如果你看到以下错误：
```
Error: Environment variable not found: DATABASE_URL
```

**立即执行以下步骤：**

### 步骤 1：访问环境变量设置
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**

### 步骤 2：添加必需的数据库环境变量

点击 "Add New" 按钮，添加以下变量：

#### 第一个变量
- **Key:** `DATABASE_URL`
- **Value:** `${POSTGRES_PRISMA_URL}`
- **Environments:** 选择 Production, Preview, Development（全选）

#### 第二个变量
- **Key:** `DIRECT_URL`
- **Value:** `${POSTGRES_URL_NON_POOLING}`
- **Environments:** 选择 Production, Preview, Development（全选）

> **重要提示：** 确保使用 `${...}` 语法！这会引用 Vercel 自动生成的数据库变量。

### 步骤 3：重新部署

1. 保存环境变量
2. 进入 **Deployments** 标签
3. 找到最新的部署
4. 点击右侧的 "..." 菜单
5. 选择 **Redeploy**

### 步骤 4：初始化数据库表结构

重新部署完成后，你还需要创建数据库表：

#### 选项 A：使用 Vercel CLI（推荐）

```bash
# 在本地项目目录执行：

# 1. 登录 Vercel
npx vercel login

# 2. 链接项目
npx vercel link

# 3. 拉取环境变量
npx vercel env pull .env.local

# 4. 初始化数据库
npx prisma db push
```

#### 选项 B：手动配置

1. 在 Vercel Dashboard 找到并复制 `POSTGRES_PRISMA_URL` 和 `POSTGRES_URL_NON_POOLING` 的值
2. 创建本地 `.env.local` 文件：
   ```
   DATABASE_URL="<POSTGRES_PRISMA_URL 的值>"
   DIRECT_URL="<POSTGRES_URL_NON_POOLING 的值>"
   ```
3. 运行：
   ```bash
   npx prisma db push
   ```

### 步骤 5：验证

访问你的应用，刷新页面。数据库操作应该可以正常工作了。

---

## 📋 完整环境变量清单

以下是生产环境需要的所有环境变量：

### 数据库（必需）
```bash
DATABASE_URL = ${POSTGRES_PRISMA_URL}
DIRECT_URL = ${POSTGRES_URL_NON_POOLING}
```

### 认证（必需）
```bash
AUTH_SECRET = <生成一个随机字符串>
```

生成 AUTH_SECRET：
```bash
openssl rand -base64 32
```

### GitHub OAuth（必需）
```bash
GITHUB_ID = <你的 GitHub OAuth App Client ID>
GITHUB_SECRET = <你的 GitHub OAuth App Client Secret>
```

设置 GitHub OAuth：
1. 访问 https://github.com/settings/developers
2. 创建新的 OAuth App
3. Callback URL: `https://your-app.vercel.app/api/auth/callback/github`

### Google OAuth（必需）
```bash
GOOGLE_CLIENT_ID = <你的 Google Client ID>
GOOGLE_CLIENT_SECRET = <你的 Google Client Secret>
```

设置 Google OAuth：
1. 访问 https://console.cloud.google.com/apis/credentials
2. 创建 OAuth 2.0 Client ID
3. Authorized redirect URI: `https://your-app.vercel.app/api/auth/callback/google`

---

## ✅ 检查清单

在部署前，确保你已经：

- [ ] 创建了 Vercel Postgres 数据库
- [ ] 添加了 `DATABASE_URL` 环境变量
- [ ] 添加了 `DIRECT_URL` 环境变量
- [ ] 添加了 `AUTH_SECRET` 环境变量
- [ ] 创建并配置了 GitHub OAuth App
- [ ] 添加了 `GITHUB_ID` 和 `GITHUB_SECRET`
- [ ] 创建并配置了 Google OAuth 2.0 Client
- [ ] 添加了 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`
- [ ] 所有环境变量都选择了所有环境（Production, Preview, Development）
- [ ] 重新部署了项目

---

## 🔍 常见错误

### 错误 1：数据库表不存在

**错误信息：**
```
The table 'public.Location' does not exist in the current database
```

**原因：** 数据库连接成功了，但表结构还没创建。

**解决：** 运行 `npx prisma db push` 初始化数据库（参考上面的步骤 4）

### 错误 2：环境变量语法错误

❌ **错误写法：**
```
DATABASE_URL = $POSTGRES_PRISMA_URL
```

✅ **正确写法：**
```
DATABASE_URL = ${POSTGRES_PRISMA_URL}
```

### 错误 2：忘记选择环境

确保为每个环境变量选择了所有环境：
- ✅ Production
- ✅ Preview
- ✅ Development

### 错误 3：使用了硬编码的数据库 URL

❌ **不推荐：**
```
DATABASE_URL = postgresql://user:pass@host:5432/db
```

✅ **推荐（使用变量引用）：**
```
DATABASE_URL = ${POSTGRES_PRISMA_URL}
```

---

## 📚 更多帮助

- [完整部署指南](./DEPLOYMENT.md)
- [Vercel 环境变量文档](https://vercel.com/docs/concepts/projects/environment-variables)
- [Prisma + Vercel 部署指南](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

如有问题，请查看 [GitHub Issues](https://github.com/heggria/Skyloft/issues)
