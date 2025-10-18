import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 获取所有需求
router.get('/', async (req, res) => {
  try {
    const { status, type, category } = req.query;

    const where: any = {};

    if (status) where.status = status;
    if (type) where.type = type;
    if (category) where.category = category;

    const demands = await prisma.demand.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            locationText: true,
            trustLevel: true,
            helpCount: true,
            receiveCount: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 解析 JSON 字段
    const demandsWithParsedFields = demands.map(demand => ({
      ...demand,
      tags: demand.tags ? JSON.parse(demand.tags) : [],
      user: demand.user
    }));

    res.json({
      demands: demandsWithParsedFields
    });
  } catch (error) {
    console.error('获取需求列表错误:', error);
    res.status(500).json({
      error: '获取需求列表失败'
    });
  }
});

// 创建新需求
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      urgency,
      locationText,
      tags,
      category,
      deadline,
      userId
    } = req.body;

    const demand = await prisma.demand.create({
      data: {
        title,
        description,
        type: type || 'GENERAL',
        urgency: urgency || 3,
        locationText,
        tags: tags ? JSON.stringify(tags) : null,
        category: category || '其他',
        deadline: deadline ? new Date(deadline) : null,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            locationText: true,
            trustLevel: true
          }
        }
      }
    });

    // 解析 JSON 字段
    const demandWithParsedFields = {
      ...demand,
      tags: demand.tags ? JSON.parse(demand.tags) : []
    };

    res.status(201).json({
      message: '需求创建成功',
      demand: demandWithParsedFields
    });
  } catch (error) {
    console.error('创建需求错误:', error);
    res.status(500).json({
      error: '创建需求失败'
    });
  }
});

// 获取单个需求详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const demand = await prisma.demand.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            locationText: true,
            trustLevel: true,
            helpCount: true,
            receiveCount: true,
            skills: true
          }
        },
        responses: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                locationText: true,
                trustLevel: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!demand) {
      return res.status(404).json({
        error: '需求不存在'
      });
    }

    // 解析 JSON 字段
    const demandWithParsedFields = {
      ...demand,
      tags: demand.tags ? JSON.parse(demand.tags) : [],
      user: {
        ...demand.user,
        skills: demand.user.skills ? JSON.parse(demand.user.skills) : []
      }
    };

    res.json({
      demand: demandWithParsedFields
    });
  } catch (error) {
    console.error('获取需求详情错误:', error);
    res.status(500).json({
      error: '获取需求详情失败'
    });
  }
});

// 更新需求状态
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['ACTIVE', 'PENDING', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: '无效的状态值'
      });
    }

    const updatedDemand = await prisma.demand.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            locationText: true,
            trustLevel: true
          }
        }
      }
    });

    // 解析 JSON 字段
    const demandWithParsedFields = {
      ...updatedDemand,
      tags: updatedDemand.tags ? JSON.parse(updatedDemand.tags) : []
    };

    res.json({
      message: '需求状态更新成功',
      demand: demandWithParsedFields
    });
  } catch (error) {
    console.error('更新需求状态错误:', error);
    res.status(500).json({
      error: '更新需求状态失败'
    });
  }
});

export default router;