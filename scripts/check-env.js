#!/usr/bin/env node

/**
 * 环境变量检查脚本
 * 用于验证所有必需的环境变量是否已配置
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'DIRECT_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'GITHUB_ID',
  'GITHUB_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
];

const optionalEnvVars = [
  'POSTGRES_URL',
  'POSTGRES_PRISMA_URL',
  'POSTGRES_URL_NON_POOLING',
];

console.log('🔍 环境变量检查\n');
console.log('=' .repeat(50));

let missingVars = [];
let configuredVars = [];

// 检查必需的环境变量
console.log('\n📋 必需的环境变量：\n');
requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${maskValue(value)}`);
    configuredVars.push(varName);
  } else {
    console.log(`❌ ${varName}: 未设置`);
    missingVars.push(varName);
  }
});

// 检查可选的环境变量
console.log('\n📋 可选的环境变量（Vercel Postgres）：\n');
optionalEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${maskValue(value)}`);
  } else {
    console.log(`⚠️  ${varName}: 未设置（如使用 Vercel Postgres 会自动设置）`);
  }
});

// 显示结果
console.log('\n' + '='.repeat(50));
console.log(`\n📊 结果：${configuredVars.length}/${requiredEnvVars.length} 必需变量已配置\n`);

if (missingVars.length > 0) {
  console.log('❌ 缺少以下环境变量：');
  missingVars.forEach((varName) => {
    console.log(`   - ${varName}`);
  });
  console.log('\n请在 .env.local 或 Vercel Dashboard 中配置这些变量。');
  console.log('参考 .env.example 文件查看示例配置。\n');
  process.exit(1);
} else {
  console.log('✅ 所有必需的环境变量已配置！\n');
  console.log('你可以运行以下命令开始使用：');
  console.log('  - npm run dev      # 本地开发');
  console.log('  - npm run build    # 构建生产版本');
  console.log('  - vercel --prod    # 部署到生产环境\n');
  process.exit(0);
}

/**
 * 隐藏敏感值，只显示前后几位
 */
function maskValue(value) {
  if (!value || value.length < 10) {
    return '***';
  }
  return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
}
