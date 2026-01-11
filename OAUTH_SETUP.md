# OAuth 配置详细指南

本指南将帮助你为 Skyloft 项目配置 GitHub 和 Google OAuth 登录。

## 第一步：生成 AUTH_SECRET

AUTH_SECRET 是 NextAuth.js (Auth.js v5) 的必需环境变量，用于加密 session token。

```bash
# 已为你生成好的密钥：
AUTH_SECRET=uOCmnomtiXGfEFEepgGrfpJxwBa2O4eE7uA41cgzb24=
```

---

## 第二步：配置 GitHub OAuth

### 2.1 创建 GitHub OAuth App

1. **访问 GitHub Developer Settings**
   - 打开 https://github.com/settings/developers
   - 或者：GitHub 头像 → Settings → 左侧菜单最下方 "Developer settings"

2. **创建新的 OAuth App**
   - 点击左侧 "OAuth Apps"
   - 点击右上角 "New OAuth App" 按钮

3. **填写应用信息**

   **Application name（应用名称）**
   ```
   Skyloft
   ```

   **Homepage URL（主页 URL）**
   ```
   https://skyloft-bysjjudxi-heggria-project.vercel.app
   ```

   **Application description（应用描述 - 可选）**
   ```
   Skyloft location management application
   ```

   **Authorization callback URL（授权回调 URL）** ⚠️ **最关键**
   ```
   https://skyloft-bysjjudxi-heggria-project.vercel.app/api/auth/callback/github
   ```

   > 🔴 **重要提示**：
   > - 回调 URL 必须完全匹配，包括协议（https://）
   > - 路径必须是 `/api/auth/callback/github`
   > - 如果有多个部署环境（production、preview），需要稍后添加多个回调 URL

4. **注册应用**
   - 点击 "Register application" 按钮

5. **获取凭据**

   注册成功后，你会看到应用详情页面：

   - **Client ID** - 直接显示，复制它
     ```
     示例：Iv1.a629723000000000
     ```

   - **Client Secret** - 需要生成
     - 点击 "Generate a new client secret" 按钮
     - ⚠️ **重要**：立即复制 Secret，它只会显示一次！
     ```
     示例：ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ```

6. **（可选）添加 Preview 部署的回调 URL**

   如果你的 Vercel preview 部署使用不同的域名，在同一页面下方的 "Authorization callback URL" 部分：
   - 点击 "Update application"
   - 你可以添加多个回调 URL，例如：
     ```
     https://skyloft-bysjjudxi-heggria-project.vercel.app/api/auth/callback/github
     https://skyloft-git-your-branch-name-heggria-project.vercel.app/api/auth/callback/github
     https://skyloft-preview-hash.vercel.app/api/auth/callback/github
     ```

### 2.2 在 Vercel 中设置 GitHub 环境变量

1. 访问你的 Vercel 项目：https://vercel.com/heggria-project/skyloft
2. 点击顶部 "Settings" 标签
3. 左侧菜单选择 "Environment Variables"
4. 添加以下变量：

**变量 1：GITHUB_ID**
- Name: `GITHUB_ID`
- Value: `你的 GitHub Client ID`（从上面复制）
- Environments: 勾选 ✅ Production ✅ Preview ✅ Development

**变量 2：GITHUB_SECRET**
- Name: `GITHUB_SECRET`
- Value: `你的 GitHub Client Secret`（从上面复制）
- Environments: 勾选 ✅ Production ✅ Preview ✅ Development

---

## 第三步：配置 Google OAuth

### 3.1 创建 Google Cloud 项目

1. **访问 Google Cloud Console**
   - 打开 https://console.cloud.google.com/

2. **创建新项目或选择现有项目**
   - 点击顶部项目选择器
   - 点击 "NEW PROJECT"（新建项目）
   - 项目名称：`Skyloft` 或你喜欢的名字
   - 点击 "CREATE"（创建）

### 3.2 配置 OAuth 同意屏幕

在创建凭据之前，必须先配置 OAuth 同意屏幕：

1. **访问 OAuth 同意屏幕页面**
   - 左侧菜单：APIs & Services → OAuth consent screen
   - 或访问：https://console.cloud.google.com/apis/credentials/consent

2. **选择用户类型**
   - 选择 **External**（外部）
   - 点击 "CREATE"

3. **填写应用信息（第 1 步：OAuth 同意屏幕）**

   **App name（应用名称）** - 必填
   ```
   Skyloft
   ```

   **User support email（用户支持电子邮件）** - 必填
   ```
   你的邮箱地址
   ```

   **Application logo（应用徽标）** - 可选
   （可以暂时跳过）

   **App domain（应用网域）** - 可选但推荐
   - Application home page: `https://skyloft-bysjjudxi-heggria-project.vercel.app`
   - Application privacy policy link: `https://skyloft-bysjjudxi-heggria-project.vercel.app/privacy`
   - Application terms of service link: `https://skyloft-bysjjudxi-heggria-project.vercel.app/terms`

   **Authorized domains（已获授权的网域）**
   ```
   vercel.app
   ```

   **Developer contact information（开发者联系信息）** - 必填
   ```
   你的邮箱地址
   ```

   点击 "SAVE AND CONTINUE"

4. **Scopes（第 2 步：范围）**
   - 点击 "ADD OR REMOVE SCOPES"
   - 勾选以下权限：
     - `../auth/userinfo.email`
     - `../auth/userinfo.profile`
     - `openid`
   - 或者直接跳过，NextAuth 会自动请求必要的权限
   - 点击 "SAVE AND CONTINUE"

5. **Test users（第 3 步：测试用户 - 仅在测试模式需要）**
   - 如果应用处于测试模式，添加测试用户的邮箱
   - 否则点击 "SAVE AND CONTINUE"

6. **Summary（第 4 步：摘要）**
   - 检查信息
   - 点击 "BACK TO DASHBOARD"

### 3.3 创建 OAuth 客户端 ID

1. **访问凭据页面**
   - 左侧菜单：APIs & Services → Credentials
   - 或访问：https://console.cloud.google.com/apis/credentials

2. **创建凭据**
   - 点击顶部 "+ CREATE CREDENTIALS"
   - 选择 "OAuth client ID"

3. **配置 OAuth 客户端**

   **Application type（应用类型）**
   ```
   Web application（Web 应用）
   ```

   **Name（名称）**
   ```
   Skyloft Web Client
   ```

   **Authorized JavaScript origins（已获授权的 JavaScript 来源）** - 可选
   ```
   https://skyloft-bysjjudxi-heggria-project.vercel.app
   ```

   **Authorized redirect URIs（已获授权的重定向 URI）** ⚠️ **最关键**

   点击 "+ ADD URI" 添加：
   ```
   https://skyloft-bysjjudxi-heggria-project.vercel.app/api/auth/callback/google
   ```

   如果有 preview 部署，继续添加：
   ```
   https://skyloft-git-your-branch-name-heggria-project.vercel.app/api/auth/callback/google
   ```

   > 🔴 **重要提示**：
   > - URI 必须完全匹配，包括协议（https://）
   > - 路径必须是 `/api/auth/callback/google`
   > - Google 允许添加多个重定向 URI

4. **创建并获取凭据**
   - 点击 "CREATE"
   - 会弹出对话框显示你的凭据：

   **Your Client ID（客户端 ID）**
   ```
   示例：123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
   ```

   **Your Client Secret（客户端密钥）**
   ```
   示例：GOCSPX-AbCdEf_1234567890-EXAMPLE
   ```

   - 复制这两个值（也可以稍后在凭据页面查看）

### 3.4 在 Vercel 中设置 Google 环境变量

1. 返回 Vercel 项目 → Settings → Environment Variables
2. 添加以下变量：

**变量 3：GOOGLE_CLIENT_ID**
- Name: `GOOGLE_CLIENT_ID`
- Value: `你的 Google Client ID`（从上面复制）
- Environments: 勾选 ✅ Production ✅ Preview ✅ Development

**变量 4：GOOGLE_CLIENT_SECRET**
- Name: `GOOGLE_CLIENT_SECRET`
- Value: `你的 Google Client Secret`（从上面复制）
- Environments: 勾选 ✅ Production ✅ Preview ✅ Development

---

## 第四步：在 Vercel 设置所有环境变量

访问 Vercel 项目 → Settings → Environment Variables，添加以下所有变量：

### 完整的环境变量清单

| 变量名 | 值 | 说明 | 必需 |
|--------|-----|------|------|
| `AUTH_SECRET` | `uOCmnomtiXGfEFEepgGrfpJxwBa2O4eE7uA41cgzb24=` | NextAuth 加密密钥 | ✅ 是 |
| `GITHUB_ID` | 从 GitHub OAuth App 获取 | GitHub Client ID | ✅ 是 |
| `GITHUB_SECRET` | 从 GitHub OAuth App 获取 | GitHub Client Secret | ✅ 是 |
| `GOOGLE_CLIENT_ID` | 从 Google Cloud 获取 | Google Client ID | ⚠️ 可选 |
| `GOOGLE_CLIENT_SECRET` | 从 Google Cloud 获取 | Google Client Secret | ⚠️ 可选 |
| `DATABASE_URL` | 你的数据库连接字符串 | Vercel Postgres | ✅ 是 |
| `DIRECT_URL` | 你的直连数据库字符串 | Vercel Postgres Direct | ✅ 是 |

### 设置示例

```bash
# NextAuth (必需)
AUTH_SECRET=uOCmnomtiXGfEFEepgGrfpJxwBa2O4eE7uA41cgzb24=

# GitHub OAuth（必需 - 至少配置一个登录方式）
GITHUB_ID=Iv1.a629723000000000
GITHUB_SECRET=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google OAuth（可选 - 如果想同时支持 Google 登录）
GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEf_1234567890-EXAMPLE

# Database（必需）
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
DIRECT_URL=postgresql://user:password@host:5432/database?sslmode=require
```

### 重要提示

✅ **所有环境变量都要勾选三个环境**：
- ✅ Production
- ✅ Preview
- ✅ Development

---

## 第五步：重新部署应用

设置好所有环境变量后：

1. **触发重新部署**
   - 在 Vercel Dashboard 中，点击 "Redeploy" 按钮
   - 或者推送一个新的 commit 到 GitHub

2. **验证部署**
   - 等待部署完成
   - 访问你的应用 URL
   - 尝试登录功能

---

## 回调 URL 参考

### 你的 Production 域名
```
https://skyloft-bysjjudxi-heggria-project.vercel.app
```

### GitHub 回调 URL
```
https://skyloft-bysjjudxi-heggria-project.vercel.app/api/auth/callback/github
```

### Google 回调 URL
```
https://skyloft-bysjjudxi-heggria-project.vercel.app/api/auth/callback/google
```

### Preview 部署回调 URL（示例）
如果你有 preview 部署，回调 URL 格式通常是：
```
https://skyloft-git-[branch-name]-heggria-project.vercel.app/api/auth/callback/github
https://skyloft-git-[branch-name]-heggria-project.vercel.app/api/auth/callback/google
```

你可以在 Vercel Dashboard 的 Deployments 页面查看每次部署的具体域名。

---

## 常见问题与解决方案

### ❌ 错误 401: invalid_client

**原因：**
- OAuth Client ID 或 Secret 配置错误
- 环境变量未正确设置或未应用到当前部署

**解决方案：**
1. 检查 Vercel 环境变量中的 `GITHUB_ID` 和 `GITHUB_SECRET` 是否正确
2. 确认环境变量已勾选 Production、Preview、Development
3. 在 GitHub OAuth App 设置页面验证 Client ID 和 Secret
4. 重新部署应用

### ❌ MissingSecret: Please define a `secret`

**原因：**
- 缺少 `AUTH_SECRET` 环境变量
- `AUTH_SECRET` 未应用到当前环境

**解决方案：**
1. 在 Vercel 中添加 `AUTH_SECRET=uOCmnomtiXGfEFEepgGrfpJxwBa2O4eE7uA41cgzb24=`
2. 确保勾选所有环境（Production、Preview、Development）
3. 确认 `src/lib/auth.ts` 中有 `secret: process.env.AUTH_SECRET` 配置
4. 重新部署应用

### ❌ Callback URL mismatch (回调 URL 不匹配)

**原因：**
- OAuth 应用中配置的回调 URL 与实际请求的 URL 不一致

**解决方案：**

**GitHub:**
1. 访问 https://github.com/settings/developers
2. 选择你的 OAuth App
3. 检查 "Authorization callback URL" 是否为：
   ```
   https://skyloft-bysjjudxi-heggria-project.vercel.app/api/auth/callback/github
   ```
4. 如果不匹配，更新并保存

**Google:**
1. 访问 https://console.cloud.google.com/apis/credentials
2. 选择你的 OAuth 客户端 ID
3. 在 "Authorized redirect URIs" 中检查是否有：
   ```
   https://skyloft-bysjjudxi-heggria-project.vercel.app/api/auth/callback/google
   ```
4. 如果不匹配，添加正确的 URI 并保存

### ❌ Preview 部署无法登录

**原因：**
- Preview 部署使用不同的域名，但 OAuth 应用未配置该域名的回调 URL

**解决方案：**

1. **找到 Preview 部署的域名**
   - 在 Vercel Dashboard → Deployments
   - 找到你的 preview 部署
   - 复制域名（例如：`skyloft-git-main-heggria-project.vercel.app`）

2. **在 GitHub OAuth App 中添加回调 URL**
   - 访问 https://github.com/settings/developers
   - 编辑你的 OAuth App
   - 注意：GitHub 只允许一个回调 URL，但可以使用通配符或更新为当前需要的 URL

3. **在 Google OAuth 客户端中添加回调 URL**
   - 访问 https://console.cloud.google.com/apis/credentials
   - 编辑 OAuth 客户端
   - 添加 preview 域名的回调 URL（Google 允许多个）
   - 例如：`https://skyloft-git-main-heggria-project.vercel.app/api/auth/callback/google`

### ❌ Google OAuth: Access blocked - This app's request is invalid

**原因：**
- OAuth 同意屏幕未正确配置
- 重定向 URI 未授权

**解决方案：**
1. 确保已完成 OAuth 同意屏幕配置（参见第三步 3.2）
2. 在 "Authorized domains" 中添加 `vercel.app`
3. 在 OAuth 客户端的 "Authorized redirect URIs" 中添加完整的回调 URL
4. 如果应用处于测试模式，确保测试用户已添加

### ❌ This app is blocked

**原因：**
- Google OAuth 应用未发布，且当前用户不在测试用户列表中

**解决方案：**

**选项 1：添加测试用户（推荐用于开发）**
1. 访问 https://console.cloud.google.com/apis/credentials/consent
2. 在 "Test users" 部分点击 "+ ADD USERS"
3. 添加你的 Google 账号邮箱
4. 保存

**选项 2：发布应用（用于生产）**
1. 访问 OAuth 同意屏幕页面
2. 点击 "PUBLISH APP"
3. 确认发布（可能需要 Google 审核）

---

## 快速检查清单

配置完成后，使用此清单验证：

### GitHub OAuth
- [ ] 已创建 GitHub OAuth App
- [ ] 已复制 Client ID 和 Client Secret
- [ ] 回调 URL 设置为：`https://skyloft-bysjjudxi-heggria-project.vercel.app/api/auth/callback/github`
- [ ] 在 Vercel 中设置了 `GITHUB_ID` 环境变量
- [ ] 在 Vercel 中设置了 `GITHUB_SECRET` 环境变量
- [ ] 环境变量已勾选 Production、Preview、Development

### Google OAuth（如果使用）
- [ ] 已创建 Google Cloud 项目
- [ ] 已配置 OAuth 同意屏幕
- [ ] 已创建 OAuth 客户端 ID
- [ ] 已复制 Client ID 和 Client Secret
- [ ] 重定向 URI 设置为：`https://skyloft-bysjjudxi-heggria-project.vercel.app/api/auth/callback/google`
- [ ] 在 Vercel 中设置了 `GOOGLE_CLIENT_ID` 环境变量
- [ ] 在 Vercel 中设置了 `GOOGLE_CLIENT_SECRET` 环境变量
- [ ] 环境变量已勾选 Production、Preview、Development
- [ ] 已添加测试用户或发布应用

### NextAuth
- [ ] 在 Vercel 中设置了 `AUTH_SECRET` 环境变量
- [ ] `AUTH_SECRET` 值为：`uOCmnomtiXGfEFEepgGrfpJxwBa2O4eE7uA41cgzb24=`
- [ ] 环境变量已勾选 Production、Preview、Development

### 部署
- [ ] 已触发重新部署
- [ ] 部署成功
- [ ] 已测试登录功能

---

## 获取帮助

如果仍然遇到问题：

1. **检查 Vercel 部署日志**
   - Vercel Dashboard → Deployments → 选择部署 → Functions 标签
   - 查看错误信息

2. **检查浏览器控制台**
   - 按 F12 打开开发者工具
   - 查看 Console 和 Network 标签的错误

3. **参考官方文档**
   - NextAuth.js: https://authjs.dev/
   - GitHub OAuth: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps
   - Google OAuth: https://developers.google.com/identity/protocols/oauth2

4. **常见错误参考**
   - NextAuth Errors: https://errors.authjs.dev/
