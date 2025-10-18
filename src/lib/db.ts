import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 确保 DATABASE_URL 环境变量存在
let databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  // 在 Zeabur 生产环境中使用默认路径
  if (process.env.NODE_ENV === 'production') {
    databaseUrl = 'file:/src/data/data.db'
  } else {
    databaseUrl = 'file:./dev.db'
  }
}

// 验证 DATABASE_URL 格式
if (!databaseUrl.startsWith('file:')) {
  console.warn('Invalid DATABASE_URL format, falling back to default SQLite database')
  databaseUrl = 'file:/data/data.db'
}

// 设置环境变量以供 Prisma 使用
process.env.DATABASE_URL = databaseUrl

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma