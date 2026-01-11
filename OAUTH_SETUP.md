# OAuth 配置指南

## Vercel 环境变量配置

访问 Vercel 项目设置 → Environment Variables，添加以下环境变量：

### 1. AUTH_SECRET（必需）
```
AUTH_SECRET=uOCmnomtiXGfEFEepgGrfpJxwBa2O4eE7uA41cgzb24=
```

### 2. GitHub OAuth App 设置

#### 步骤 1: 创建 GitHub OAuth App
1. 访问 https://github.com/settings/developers
2. 点击 "New OAuth App"
3. 填写应用信息：
   - **Application name**: Skyloft
   - **Homepage URL**: `https://skyloft-bysjjudxi-heggria-project.vercel.app`
   - **Authorization callback URL**: `https://skyloft-bysjjudxi-heggria-project.vercel.app/api/auth/callback/github`
4. 点击 "Register application"
5. 复制 **Client ID** 和生成 **Client Secret**

#### 步骤 2: 在 Vercel 中添加环境变量
```
GITHUB_ID=你的 GitHub Client ID
GITHUB_SECRET=你的 GitHub Client Secret
```

### 3. Google OAuth 设置（可选）

#### 步骤 1: 创建 Google OAuth Client
1. 访问 https://console.cloud.google.com/apis/credentials
2. 创建新项目或选择现有项目
3. 点击 "创建凭据" → "OAuth 客户端 ID"
4. 应用类型选择 "Web 应用"
5. 添加授权的重定向 URI：
   - `https://skyloft-bysjjudxi-heggria-project.vercel.app/api/auth/callback/google`
6. 点击 "创建"
7. 复制 **客户端 ID** 和**客户端密钥**

#### 步骤 2: 在 Vercel 中添加环境变量
```
GOOGLE_CLIENT_ID=你的 Google Client ID
GOOGLE_CLIENT_SECRET=你的 Google Client Secret
```

## 环境变量完整清单

在 Vercel 中设置以下环境变量（所有环境：Production, Preview, Development）：

```bash
# NextAuth
AUTH_SECRET=uOCmnomtiXGfEFEepgGrfpJxwBa2O4eE7uA41cgzb24=

# GitHub OAuth（必需）
GITHUB_ID=你的_github_client_id
GITHUB_SECRET=你的_github_client_secret

# Google OAuth（可选）
GOOGLE_CLIENT_ID=你的_google_client_id
GOOGLE_CLIENT_SECRET=你的_google_client_secret

# Database
DATABASE_URL=你的数据库连接字符串
DIRECT_URL=你的直连数据库字符串
```

## 注意事项

1. **回调 URL 必须精确匹配**：确保 OAuth 应用的回调 URL 与 Vercel 部署的域名一致
2. **多个域名配置**：如果有多个部署环境（production、preview），需要在 OAuth 应用中添加多个回调 URL
3. **环境变量应用范围**：建议为所有环境（Production, Preview, Development）设置相同的变量
4. **重新部署**：设置环境变量后，需要重新部署应用才能生效

## 常见问题

### 错误 401: invalid_client
- 检查 GITHUB_ID 和 GITHUB_SECRET 是否正确设置
- 确认 OAuth 应用的回调 URL 配置正确
- 验证环境变量已应用到当前部署环境

### MissingSecret 错误
- 确保设置了 AUTH_SECRET 环境变量
- 确认 src/lib/auth.ts 中有 `secret: process.env.AUTH_SECRET` 配置

### Preview 部署问题
对于 Preview 部署，需要在 GitHub/Google OAuth 应用中添加预览域名的回调 URL：
- GitHub: `https://你的预览域名.vercel.app/api/auth/callback/github`
- Google: `https://你的预览域名.vercel.app/api/auth/callback/google`
