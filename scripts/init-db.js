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

if (!dbExists) {
  console.log('🗄️ 数据库文件不存在，开始初始化...');
  try {
    // 生成 Prisma 客户端
    console.log('📦 生成 Prisma 客户端...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // 初始化数据库
    console.log('🚀 初始化数据库表结构...');
    execSync('npx prisma db push --force-reset', { stdio: 'inherit' });

    console.log('✅ 数据库初始化完成！');
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ 数据库文件已存在，跳过初始化');
}

console.log('🎉 数据库初始化检查完成');