import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 获取所有用户
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        locationText: true,
        onlineStatus: true,
        isVerified: true,
        trustLevel: true,
        skills: true,
        interests: true,
        helpCount: true,
        receiveCount: true,
        createdAt: true
      },
      orderBy: {
        trustLevel: 'desc'
      }
    });

    // 解析 JSON 字段
    const usersWithParsedFields = users.map(user => ({
      ...user,
      skills: user.skills ? JSON.parse(user.skills) : [],
      interests: user.interests ? JSON.parse(user.interests) : []
    }));

    res.json({
      users: usersWithParsedFields
    });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({
      error: '获取用户列表失败'
    });
  }
});

// 获取单个用户详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        locationText: true,
        onlineStatus: true,
        isVerified: true,
        trustLevel: true,
        skills: true,
        interests: true,
        helpCount: true,
        receiveCount: true,
        createdAt: true,
        demands: {
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            status: true,
            urgency: true,
            tags: true,
            category: true,
            createdAt: true
          },
          where: {
            status: 'ACTIVE'
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        services: {
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            status: true,
            tags: true,
            category: true,
            createdAt: true
          },
          where: {
            status: 'ACTIVE'
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        error: '用户不存在'
      });
    }

    // 解析 JSON 字段
    const userWithParsedFields = {
      ...user,
      skills: user.skills ? JSON.parse(user.skills) : [],
      interests: user.interests ? JSON.parse(user.interests) : [],
      demands: user.demands.map(demand => ({
        ...demand,
        tags: demand.tags ? JSON.parse(demand.tags) : []
      })),
      services: user.services.map(service => ({
        ...service,
        tags: service.tags ? JSON.parse(service.tags) : []
      }))
    };

    res.json({
      user: userWithParsedFields
    });
  } catch (error) {
    console.error('获取用户详情错误:', error);
    res.status(500).json({
      error: '获取用户详情失败'
    });
  }
});

// 更新用户信息
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, locationText, skills, interests } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(locationText && { locationText }),
        ...(skills && { skills: JSON.stringify(skills) }),
        ...(interests && { interests: JSON.stringify(interests) })
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        locationText: true,
        onlineStatus: true,
        isVerified: true,
        trustLevel: true,
        skills: true,
        interests: true,
        helpCount: true,
        receiveCount: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // 解析 JSON 字段
    const userWithParsedFields = {
      ...updatedUser,
      skills: updatedUser.skills ? JSON.parse(updatedUser.skills) : [],
      interests: updatedUser.interests ? JSON.parse(updatedUser.interests) : []
    };

    res.json({
      message: '用户信息更新成功',
      user: userWithParsedFields
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({
      error: '更新用户信息失败'
    });
  }
});

export default router;