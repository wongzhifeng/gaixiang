import express from 'express';
import { prisma } from '../index';

const router = express.Router();

// 获取用户信任评分
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: '用户ID为必填项'
      });
    }

    // 获取用户数据
    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      include: {
        trustScore: true,
        userSpecializations: {
          include: {
            specialization: true
          }
        },
        caseStudies: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 如果已有信任评分，直接返回
    if (user.trustScore) {
      return res.json({
        success: true,
        data: {
          trustScore: user.trustScore,
          user: {
            id: user.id,
            name: user.name,
            helpCount: user.helpCount,
            receiveCount: user.receiveCount
          }
        }
      });
    }

    // 计算信任指标
    const metrics = {
      transactionCount: user.helpCount + user.receiveCount,
      completedCount: Math.floor((user.helpCount + user.receiveCount) * 0.8),
      disputeCount: 0,
      avgResponseTime: 12,
      onTimeRate: 0.85,
      helpCount: user.helpCount,
      receiveCount: user.receiveCount
    };

    // 计算专长相关指标
    const specializationCount = user.userSpecializations.length;
    const avgSpecializationScarcity = user.userSpecializations.length > 0
      ? user.userSpecializations.reduce((sum: number, us: any) => sum + us.specialization.scarcity, 0) / user.userSpecializations.length
      : 5;
    const caseStudyCount = user.caseStudies.length;

    // 创建信任评分记录
    const trustScore = await prisma.trustScore.upsert({
      where: { userId: user.id },
      update: {
        responsibility: 50,
        consistency: 50,
        safetyNet: 50,
        overallScore: 12.5,
        transactionCount: metrics.transactionCount,
        completedCount: metrics.completedCount,
        disputeCount: metrics.disputeCount,
        disputeRate: 0,
        avgResponseTime: metrics.avgResponseTime,
        onTimeRate: metrics.onTimeRate
      },
      create: {
        userId: user.id,
        responsibility: 50,
        consistency: 50,
        safetyNet: 50,
        overallScore: 12.5,
        transactionCount: metrics.transactionCount,
        completedCount: metrics.completedCount,
        disputeCount: metrics.disputeCount,
        disputeRate: 0,
        avgResponseTime: metrics.avgResponseTime,
        onTimeRate: metrics.onTimeRate
      }
    });

    res.json({
      success: true,
      data: {
        trustScore,
        metrics: {
          completionRate: 0.8,
          disputeRate: 0,
          responseScore: 85
        },
        user: {
          id: user.id,
          name: user.name,
          helpCount: user.helpCount,
          receiveCount: user.receiveCount
        }
      }
    });

  } catch (error) {
    console.error('获取信任评分失败:', error);
    res.status(500).json({
      success: false,
      message: '获取信任评分失败'
    });
  }
});

export default router;