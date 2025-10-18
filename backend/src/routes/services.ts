import express from 'express';
import { prisma } from '../index';

const router = express.Router();

// 获取所有服务
router.get('/', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
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
      data: services
    });

  } catch (error) {
    console.error('获取服务列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取服务列表失败'
    });
  }
});

// 创建服务
router.post('/', async (req, res) => {
  try {
    const { userId, title, description, type, locationText, tags, category, availableFrom, availableTo } = req.body;

    if (!userId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: '用户ID、标题和描述为必填项'
      });
    }

    const service = await prisma.service.create({
      data: {
        userId,
        title,
        description,
        type: type || 'GENERAL',
        locationText,
        tags,
        category: category || '其他',
        availableFrom: availableFrom ? new Date(availableFrom) : null,
        availableTo: availableTo ? new Date(availableTo) : null
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
      message: '服务创建成功',
      data: service
    });

  } catch (error) {
    console.error('创建服务失败:', error);
    res.status(500).json({
      success: false,
      message: '创建服务失败'
    });
  }
});

export default router;