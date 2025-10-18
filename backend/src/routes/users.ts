import express from 'express';
import { prisma } from '../index';

const router = express.Router();

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
        skills: true,
        trustLevel: true,
        helpCount: true,
        receiveCount: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户列表失败'
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
        skills: true,
        trustLevel: true,
        helpCount: true,
        receiveCount: true,
        createdAt: true,
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

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('获取用户详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户详情失败'
    });
  }
});

// 更新用户信息
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, avatar, locationText, skills } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        phone,
        avatar,
        locationText,
        skills
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        locationText: true,
        skills: true,
        trustLevel: true,
        helpCount: true,
        receiveCount: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      message: '用户信息更新成功',
      data: updatedUser
    });

  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '更新用户信息失败'
    });
  }
});

export default router;