import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 获取所有匹配
router.get('/', async (req, res) => {
  try {
    const { type, userId } = req.query;

    const where: any = {};

    if (type) where.type = type;
    if (userId) {
      where.OR = [
        { userAId: userId },
        { userBId: userId }
      ];
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        userA: {
          select: {
            id: true,
            name: true,
            locationText: true,
            trustLevel: true
          }
        },
        userB: {
          select: {
            id: true,
            name: true,
            locationText: true,
            trustLevel: true
          }
        },
        demand: {
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            urgency: true
          }
        },
        service: {
          select: {
            id: true,
            title: true,
            description: true,
            type: true
          }
        }
      },
      orderBy: {
        score: 'desc'
      }
    });

    res.json({
      matches
    });
  } catch (error) {
    console.error('获取匹配列表错误:', error);
    res.status(500).json({
      error: '获取匹配列表失败'
    });
  }
});

// 创建新匹配
router.post('/', async (req, res) => {
  try {
    const {
      userAId,
      userBId,
      demandId,
      serviceId,
      score,
      reason,
      type
    } = req.body;

    // 验证用户存在
    const userA = await prisma.user.findUnique({
      where: { id: userAId }
    });
    const userB = await prisma.user.findUnique({
      where: { id: userBId }
    });

    if (!userA || !userB) {
      return res.status(404).json({
        error: '用户不存在'
      });
    }

    // 验证需求或服务存在
    if (demandId) {
      const demand = await prisma.demand.findUnique({
        where: { id: demandId }
      });
      if (!demand) {
        return res.status(404).json({
          error: '需求不存在'
        });
      }
    }

    if (serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: serviceId }
      });
      if (!service) {
        return res.status(404).json({
          error: '服务不存在'
        });
      }
    }

    const match = await prisma.match.create({
      data: {
        userAId,
        userBId,
        demandId,
        serviceId,
        score: score || 50,
        reason,
        type: type || 'USER_USER'
      },
      include: {
        userA: {
          select: {
            id: true,
            name: true,
            locationText: true,
            trustLevel: true
          }
        },
        userB: {
          select: {
            id: true,
            name: true,
            locationText: true,
            trustLevel: true
          }
        },
        demand: {
          select: {
            id: true,
            title: true,
            description: true
          }
        },
        service: {
          select: {
            id: true,
            title: true,
            description: true
          }
        }
      }
    });

    res.status(201).json({
      message: '匹配创建成功',
      match
    });
  } catch (error) {
    console.error('创建匹配错误:', error);
    res.status(500).json({
      error: '创建匹配失败'
    });
  }
});

// 智能匹配推荐
router.get('/recommendations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        demands: {
          where: { status: 'ACTIVE' }
        },
        services: {
          where: { status: 'ACTIVE' }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        error: '用户不存在'
      });
    }

    // 获取其他用户的需求和服务
    const otherDemands = await prisma.demand.findMany({
      where: {
        status: 'ACTIVE',
        userId: { not: userId }
      },
      include: {
        user: true
      }
    });

    const otherServices = await prisma.service.findMany({
      where: {
        status: 'ACTIVE',
        userId: { not: userId }
      },
      include: {
        user: true
      }
    });

    // 简化的匹配逻辑
    const recommendations = [];

    // 为用户的需求匹配服务
    for (const demand of user.demands) {
      for (const service of otherServices) {
        // 简单的匹配分数计算
        let score = 50;

        // 位置匹配
        if (user.locationText && service.user.locationText &&
            user.locationText === service.user.locationText) {
          score += 20;
        }

        // 信任等级
        score += service.user.trustLevel * 0.3;

        if (score > 60) {
          recommendations.push({
            type: 'demand_service',
            demand,
            service,
            score: Math.min(score, 100),
            reason: '位置和信任度匹配'
          });
        }
      }
    }

    // 为用户的服务匹配需求
    for (const service of user.services) {
      for (const demand of otherDemands) {
        // 简单的匹配分数计算
        let score = 50;

        // 位置匹配
        if (user.locationText && demand.user.locationText &&
            user.locationText === demand.user.locationText) {
          score += 20;
        }

        // 信任等级
        score += user.trustLevel * 0.3;

        if (score > 60) {
          recommendations.push({
            type: 'service_demand',
            service,
            demand,
            score: Math.min(score, 100),
            reason: '位置和信任度匹配'
          });
        }
      }
    }

    // 按分数排序
    recommendations.sort((a, b) => b.score - a.score);

    res.json({
      recommendations: recommendations.slice(0, 10) // 返回前10个推荐
    });
  } catch (error) {
    console.error('获取推荐错误:', error);
    res.status(500).json({
      error: '获取推荐失败'
    });
  }
});

export default router;