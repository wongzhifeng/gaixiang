import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 确保 DATABASE_URL 环境变量存在
if (!process.env.DATABASE_URL) {
  // 在 Zeabur 生产环境中使用默认路径
  if (process.env.NODE_ENV === 'production') {
    process.env.DATABASE_URL = 'file:/data/data.db'
  } else {
    process.env.DATABASE_URL = 'file:./dev.db'
  }
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma