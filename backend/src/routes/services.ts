import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 获取所有服务
router.get('/', async (req, res) => {
  try {
    const { status, type, category } = req.query;

    const where: any = {};

    if (status) where.status = status;
    if (type) where.type = type;
    if (category) where.category = category;

    const services = await prisma.service.findMany({
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
    const servicesWithParsedFields = services.map(service => ({
      ...service,
      tags: service.tags ? JSON.parse(service.tags) : [],
      user: service.user
    }));

    res.json({
      services: servicesWithParsedFields
    });
  } catch (error) {
    console.error('获取服务列表错误:', error);
    res.status(500).json({
      error: '获取服务列表失败'
    });
  }
});

// 创建新服务
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      locationText,
      tags,
      category,
      availableFrom,
      availableTo,
      userId
    } = req.body;

    const service = await prisma.service.create({
      data: {
        title,
        description,
        type: type || 'GENERAL',
        locationText,
        tags: tags ? JSON.stringify(tags) : null,
        category: category || '其他',
        availableFrom: availableFrom ? new Date(availableFrom) : null,
        availableTo: availableTo ? new Date(availableTo) : null,
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
    const serviceWithParsedFields = {
      ...service,
      tags: service.tags ? JSON.parse(service.tags) : []
    };

    res.status(201).json({
      message: '服务创建成功',
      service: serviceWithParsedFields
    });
  } catch (error) {
    console.error('创建服务错误:', error);
    res.status(500).json({
      error: '创建服务失败'
    });
  }
});

// 获取单个服务详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
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

    if (!service) {
      return res.status(404).json({
        error: '服务不存在'
      });
    }

    // 解析 JSON 字段
    const serviceWithParsedFields = {
      ...service,
      tags: service.tags ? JSON.parse(service.tags) : [],
      user: {
        ...service.user,
        skills: service.user.skills ? JSON.parse(service.user.skills) : []
      }
    };

    res.json({
      service: serviceWithParsedFields
    });
  } catch (error) {
    console.error('获取服务详情错误:', error);
    res.status(500).json({
      error: '获取服务详情失败'
    });
  }
});

// 更新服务状态
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['ACTIVE', 'PAUSED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: '无效的状态值'
      });
    }

    const updatedService = await prisma.service.update({
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
    const serviceWithParsedFields = {
      ...updatedService,
      tags: updatedService.tags ? JSON.parse(updatedService.tags) : []
    };

    res.json({
      message: '服务状态更新成功',
      service: serviceWithParsedFields
    });
  } catch (error) {
    console.error('更新服务状态错误:', error);
    res.status(500).json({
      error: '更新服务状态失败'
    });
  }
});

export default router;