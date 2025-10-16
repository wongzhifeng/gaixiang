import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

export async function GET() {
  try {
    const startTime = Date.now()

    // 检查数据库连接
    await prisma.$queryRaw`SELECT 1`
    const dbCheckTime = Date.now() - startTime

    // 获取系统信息
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    }

    // 获取数据库统计信息
    const userCount = await prisma.user.count()
    const demandCount = await prisma.demand.count()
    const serviceCount = await prisma.service.count()

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: {
          status: 'healthy',
          responseTime: `${dbCheckTime}ms`,
          details: {
            provider: 'sqlite',
            connected: true
          }
        },
        api: {
          status: 'healthy',
          responseTime: `${Date.now() - startTime}ms`
        }
      },
      system: systemInfo,
      statistics: {
        users: userCount,
        demands: demandCount,
        services: serviceCount
      },
      endpoints: {
        users: '/api/users',
        demands: '/api/demands',
        services: '/api/services',
        health: '/api/health'
      }
    }

    return NextResponse.json(healthStatus)

  } catch (error) {
    console.error('Health check failed:', error)

    const errorStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: {
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown database error'
        },
        api: {
          status: 'healthy'
        }
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime()
      }
    }

    return NextResponse.json(errorStatus, { status: 503 })
  }
}