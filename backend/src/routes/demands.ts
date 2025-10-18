import express from 'express';
import { prisma } from '../index';

const router = express.Router();

// 获取所有需求
router.get('/', async (req, res) => {
  try {
    const demands = await prisma.demand.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            locationText: true
          }
        },
        responses: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: demands
    });

  } catch (error) {
    console.error('获取需求列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取需求列表失败'
    });
  }
});

// 创建需求
router.post('/', async (req, res) => {
  try {
    const { userId, title, description, type, urgency, locationText, tags, category, deadline } = req.body;

    if (!userId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: '用户ID、标题和描述为必填项'
      });
    }

    const demand = await prisma.demand.create({
      data: {
        userId,
        title,
        description,
        type: type || 'GENERAL',
        urgency: urgency || 3,
        locationText,
        tags,
        category: category || '其他',
        deadline: deadline ? new Date(deadline) : null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            locationText: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: '需求创建成功',
      data: demand
    });

  } catch (error) {
    console.error('创建需求失败:', error);
    res.status(500).json({
      success: false,
      message: '创建需求失败'
    });
  }
});

export default router;