import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { calculateCompleteTrustScore, TrustMetrics } from '../../../lib/trust-scoring'

// 获取用户信任评分
// GET /api/trust-scores?userId=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // 获取用户数据
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        trustScore: true,
        userSpecializations: {
          include: {
            specialization: true
          }
        },
        caseStudies: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // 如果已有信任评分，直接返回
    if (user.trustScore) {
      return NextResponse.json({
        trustScore: user.trustScore,
        user: {
          id: user.id,
          name: user.name,
          helpCount: user.helpCount,
          receiveCount: user.receiveCount
        }
      })
    }

    // 计算信任指标
    const metrics: TrustMetrics = {
      transactionCount: user.helpCount + user.receiveCount,
      completedCount: Math.floor((user.helpCount + user.receiveCount) * 0.8), // 假设80%完成率
      disputeCount: 0, // 暂时设为0
      avgResponseTime: 12, // 假设平均响应时间12小时
      onTimeRate: 0.85, // 假设85%准时率
      helpCount: user.helpCount,
      receiveCount: user.receiveCount
    }

    // 计算专长相关指标
    const specializationCount = user.userSpecializations.length
    const avgSpecializationScarcity = user.userSpecializations.length > 0
      ? user.userSpecializations.reduce((sum: number, us) => sum + us.specialization.scarcity, 0) / user.userSpecializations.length
      : 5
    const caseStudyCount = user.caseStudies.length

    // 计算信任评分
    const trustScoreResult = calculateCompleteTrustScore(
      metrics,
      specializationCount,
      avgSpecializationScarcity,
      caseStudyCount
    )

    // 创建或更新信任评分记录
    const trustScore = await prisma.trustScore.upsert({
      where: { userId },
      update: {
        responsibility: trustScoreResult.responsibility,
        consistency: trustScoreResult.consistency,
        safetyNet: trustScoreResult.safetyNet,
        overallScore: trustScoreResult.overallScore,
        transactionCount: metrics.transactionCount,
        completedCount: metrics.completedCount,
        disputeCount: metrics.disputeCount,
        disputeRate: trustScoreResult.disputeRate,
        avgResponseTime: metrics.avgResponseTime,
        onTimeRate: metrics.onTimeRate
      },
      create: {
        userId,
        responsibility: trustScoreResult.responsibility,
        consistency: trustScoreResult.consistency,
        safetyNet: trustScoreResult.safetyNet,
        overallScore: trustScoreResult.overallScore,
        transactionCount: metrics.transactionCount,
        completedCount: metrics.completedCount,
        disputeCount: metrics.disputeCount,
        disputeRate: trustScoreResult.disputeRate,
        avgResponseTime: metrics.avgResponseTime,
        onTimeRate: metrics.onTimeRate
      }
    })

    return NextResponse.json({
      trustScore,
      metrics: {
        completionRate: trustScoreResult.completionRate,
        disputeRate: trustScoreResult.disputeRate,
        responseScore: trustScoreResult.responseScore
      },
      user: {
        id: user.id,
        name: user.name,
        helpCount: user.helpCount,
        receiveCount: user.receiveCount
      }
    })

  } catch (error) {
    console.error('Error fetching trust score:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trust score' },
      { status: 500 }
    )
  }
}

// 更新用户信任评分
// POST /api/trust-scores
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, metrics } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // 获取用户数据用于计算
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userSpecializations: {
          include: {
            specialization: true
          }
        },
        caseStudies: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // 合并指标数据
    const currentMetrics: TrustMetrics = {
      transactionCount: user.helpCount + user.receiveCount,
      completedCount: Math.floor((user.helpCount + user.receiveCount) * 0.8),
      disputeCount: 0,
      avgResponseTime: 12,
      onTimeRate: 0.85,
      helpCount: user.helpCount,
      receiveCount: user.receiveCount,
      ...metrics
    }

    // 计算专长相关指标
    const specializationCount = user.userSpecializations.length
    const avgSpecializationScarcity = user.userSpecializations.length > 0
      ? user.userSpecializations.reduce((sum: number, us) => sum + us.specialization.scarcity, 0) / user.userSpecializations.length
      : 5
    const caseStudyCount = user.caseStudies.length

    // 计算信任评分
    const trustScoreResult = calculateCompleteTrustScore(
      currentMetrics,
      specializationCount,
      avgSpecializationScarcity,
      caseStudyCount
    )

    // 更新信任评分记录
    const updatedTrustScore = await prisma.trustScore.upsert({
      where: { userId },
      update: {
        responsibility: trustScoreResult.responsibility,
        consistency: trustScoreResult.consistency,
        safetyNet: trustScoreResult.safetyNet,
        overallScore: trustScoreResult.overallScore,
        transactionCount: currentMetrics.transactionCount,
        completedCount: currentMetrics.completedCount,
        disputeCount: currentMetrics.disputeCount,
        disputeRate: trustScoreResult.disputeRate,
        avgResponseTime: currentMetrics.avgResponseTime,
        onTimeRate: currentMetrics.onTimeRate
      },
      create: {
        userId,
        responsibility: trustScoreResult.responsibility,
        consistency: trustScoreResult.consistency,
        safetyNet: trustScoreResult.safetyNet,
        overallScore: trustScoreResult.overallScore,
        transactionCount: currentMetrics.transactionCount,
        completedCount: currentMetrics.completedCount,
        disputeCount: currentMetrics.disputeCount,
        disputeRate: trustScoreResult.disputeRate,
        avgResponseTime: currentMetrics.avgResponseTime,
        onTimeRate: currentMetrics.onTimeRate
      }
    })

    return NextResponse.json({
      trustScore: updatedTrustScore,
      metrics: {
        completionRate: trustScoreResult.completionRate,
        disputeRate: trustScoreResult.disputeRate,
        responseScore: trustScoreResult.responseScore
      }
    })

  } catch (error) {
    console.error('Error updating trust score:', error)
    return NextResponse.json(
      { error: 'Failed to update trust score' },
      { status: 500 }
    )
  }
}