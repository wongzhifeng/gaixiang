#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 开始数据库初始化检查...');

// 检查数据目录是否存在
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  console.log('📁 创建数据目录...');
  fs.mkdirSync(dataDir, { recursive: true });
}

// 检查数据库文件是否存在
const dbPath = path.join(dataDir, 'data.db');
const dbExists = fs.existsSync(dbPath);

// 总是运行数据库初始化，确保表结构正确
console.log('🗄️ 开始数据库初始化...');
try {
  // 生成 Prisma 客户端
  console.log('📦 生成 Prisma 客户端...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // 初始化数据库表结构
  console.log('🚀 初始化数据库表结构...');
  execSync('npx prisma db push --force-reset', { stdio: 'inherit' });

  console.log('✅ 数据库初始化完成！');
} catch (error) {
  console.error('❌ 数据库初始化失败:', error.message);
  console.log('🔄 尝试备用初始化方案...');

  // 备用方案：使用 migrate
  try {
    console.log('🔄 使用 migrate 方案初始化...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ 备用方案成功！');
  } catch (migrateError) {
    console.error('❌ 备用方案也失败:', migrateError.message);
    process.exit(1);
  }
}

console.log('🎉 数据库初始化检查完成');