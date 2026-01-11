# 数据库迁移配置指南

本指南介绍如何将数据库初始化集成到 Vercel 自动部署流程中。

## 📋 概述

目前项目使用两种数据库管理方式：

| 方式 | 适用场景 | 自动化 | 风险 |
|------|---------|--------|------|
| **`prisma db push`** | 开发环境快速原型 | ❌ 不推荐 | ⚠️ 可能丢失数据 |
| **`prisma migrate`** | 生产环境部署 | ✅ 推荐 | ✅ 安全可控 |

## 🎯 当前配置

项目已配置自动迁移部署：

```json
// package.json
{
  "scripts": {
    "postbuild": "prisma migrate deploy"
  }
}
```

**工作原理：**
1. Vercel 运行 `pnpm build`
2. 构建 Next.js 应用
3. 自动执行 `postbuild` 钩子
4. 运行 `prisma migrate deploy` 应用数据库迁移
5. 部署完成

## 🚀 首次设置（必需）

在自动化生效之前，需要创建初始迁移文件。

### 场景 A：数据库是空的（推荐）

如果你的生产数据库还没有创建表：

```bash
# 1. 确保有 .env 文件
cat > .env << 'EOF'
DATABASE_URL="postgresql://neondb_owner:npg_EvM8xPnLTFY1@ep-polished-resonance-ah7lf8z1-pooler.c-3.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require"
DIRECT_URL="postgresql://neondb_owner:npg_EvM8xPnLTFY1@ep-polished-resonance-ah7lf8z1.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
EOF

# 2. 创建初始迁移（会自动应用到数据库）
npx prisma migrate dev --name initial_schema

# 3. 提交迁移文件
git add prisma/migrations
git commit -m "chore: add initial database migration"
git push origin claude/fix-database-url-env-bUNMw
```

### 场景 B：数据库已经有表了（你的情况）

如果你已经用 `prisma db push` 创建了表：

```bash
# 1. 创建迁移文件但不应用（因为表已存在）
npx prisma migrate dev --name initial_schema --create-only

# 2. 标记为已应用（告诉 Prisma 这个迁移已经在数据库中了）
npx prisma migrate resolve --applied 20240111000000_initial_schema

# 注意：替换时间戳为实际生成的迁移文件名

# 3. 提交迁移文件
git add prisma/migrations
git commit -m "chore: add initial database migration"
git push origin claude/fix-database-url-env-bUNMw
```

### 验证迁移已创建

检查迁移文件：

```bash
ls -la prisma/migrations/

# 应该看到类似这样的输出：
# drwxr-xr-x  20240111000000_initial_schema/
#   └── migration.sql
# -rw-r--r--  migration_lock.toml
```

查看迁移 SQL：

```bash
cat prisma/migrations/*/migration.sql

# 应该包含 CREATE TABLE 语句
```

## ✅ 自动部署工作流程

一旦迁移文件被提交，后续部署流程：

```
┌─────────────────────────────────────────┐
│  1. git push                            │
│     推送代码到 GitHub                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  2. Vercel 检测到代码变更                │
│     自动触发构建                         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  3. pnpm install                        │
│     安装依赖                            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  4. prisma generate (postinstall)       │
│     生成 Prisma Client                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  5. pnpm build                          │
│     构建 Next.js 应用                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  6. prisma migrate deploy (postbuild)   │
│     🔥 自动应用数据库迁移                │
│     - 检查哪些迁移未应用                 │
│     - 按顺序应用新迁移                   │
│     - 更新 _prisma_migrations 表         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  7. 部署成功                            │
│     应用上线，数据库已更新               │
└─────────────────────────────────────────┘
```

## 🔄 日常开发工作流

### 修改数据库 Schema

当你需要修改 `prisma/schema.prisma` 时：

```bash
# 1. 修改 schema.prisma
vim prisma/schema.prisma

# 2. 创建迁移（在开发环境）
npx prisma migrate dev --name add_user_avatar

# 这会：
# - 创建新的迁移文件
# - 应用到本地数据库
# - 重新生成 Prisma Client

# 3. 测试变更
pnpm dev

# 4. 提交代码
git add prisma/
git commit -m "feat: add user avatar field"
git push

# 5. Vercel 自动部署时会运行 prisma migrate deploy
# 生产数据库自动更新！✨
```

### 回滚迁移（如果需要）

```bash
# 注意：Prisma 不支持自动回滚
# 需要手动创建反向迁移

# 1. 创建反向迁移
npx prisma migrate dev --name revert_user_avatar

# 2. 编辑生成的 migration.sql，写入回滚 SQL
# 例如：ALTER TABLE "User" DROP COLUMN "avatar";

# 3. 提交并部署
```

## 🛡️ 安全特性

`prisma migrate deploy` 的安全特性：

1. ✅ **幂等性**：重复运行不会重复应用迁移
2. ✅ **顺序保证**：迁移按时间戳顺序应用
3. ✅ **事务保护**：每个迁移在事务中执行
4. ✅ **失败回滚**：如果迁移失败，不会部分应用
5. ✅ **历史追踪**：所有迁移记录在 `_prisma_migrations` 表中

## 📊 监控迁移状态

### 查看迁移历史

```bash
# 查看已应用的迁移
npx prisma migrate status

# 示例输出：
# Status: All migrations have been applied
#
# Database schema is up to date
#
# Applied migrations:
#   20240111000000_initial_schema
#   20240115120000_add_user_avatar
```

### 查看数据库中的迁移记录

连接到生产数据库后：

```sql
SELECT * FROM _prisma_migrations ORDER BY finished_at DESC;
```

## ⚠️ 重要注意事项

### 1. 不要直接修改生产数据库

❌ **不要做：**
```bash
# 直连生产数据库并运行 db push
DATABASE_URL="postgresql://..." npx prisma db push
```

✅ **应该做：**
```bash
# 创建迁移并通过 Git 部署
npx prisma migrate dev --name my_change
git push
```

### 2. 破坏性变更需要谨慎

如果迁移会删除数据（例如删除列、删除表）：

1. 先部署代码不使用该字段
2. 等待旧版本完全下线
3. 再部署删除字段的迁移

### 3. 大型数据迁移

对于需要很长时间的迁移（例如修改大表）：

```sql
-- migration.sql
-- 1. 添加新列（快速）
ALTER TABLE "Location" ADD COLUMN "new_field" TEXT;

-- 2. 不要在迁移中填充数据（可能超时）
-- 改用后台任务或分批处理
```

## 🔧 Vercel 特定配置

### 环境变量要求

确保 Vercel 中配置了：

```bash
# 必需
DATABASE_URL=${POSTGRES_PRISMA_URL}      # 用于应用运行
DIRECT_URL=${POSTGRES_URL_NON_POOLING}   # 用于迁移

# Vercel Postgres 自动提供
POSTGRES_PRISMA_URL=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...
```

### 构建日志检查

部署后在 Vercel Dashboard 查看构建日志：

```
✓ Running "pnpm run build"
✓ Prisma Client generated
✓ Next.js build completed
✓ Running "prisma migrate deploy"
✓ All migrations have been applied (2)
✓ Deployment successful
```

如果看到错误：

```
✗ Error: P3009: migrate found failed migration
```

说明之前的迁移失败了，需要手动修复。

## 📚 相关文档

- [Prisma Migrate 官方文档](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Vercel 部署钩子](https://vercel.com/docs/concepts/deployments/build-step)
- [数据库迁移最佳实践](https://www.prisma.io/docs/guides/migrate/production-troubleshooting)

## 🆘 常见问题

### Q: 迁移在 Vercel 构建时超时怎么办？

A:
1. 检查迁移 SQL 是否有耗时操作
2. 将数据填充操作移到应用代码中
3. 考虑使用 Vercel 的 Cron Jobs 执行大型迁移

### Q: 如何在不停机的情况下修改 schema？

A: 使用扩展-收缩模式（Expand-Contract）：
1. 扩展：添加新字段/表（兼容旧代码）
2. 部署新代码使用新字段
3. 收缩：删除旧字段/表

### Q: 迁移失败了怎么办？

A:
```bash
# 1. 查看失败的迁移
npx prisma migrate status

# 2. 修复数据库问题后，标记为已解决
npx prisma migrate resolve --rolled-back <migration-name>

# 3. 重新运行迁移
npx prisma migrate deploy
```

## ✅ 下一步

1. [ ] 在本地创建初始迁移
2. [ ] 提交 `prisma/migrations/` 目录
3. [ ] 推送到 GitHub
4. [ ] Vercel 自动部署并应用迁移
5. [ ] 验证数据库表已创建
6. [ ] 享受自动化部署！🎉
