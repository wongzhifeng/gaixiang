import express from 'express';
import { prisma } from '../index';

const router = express.Router();

// 获取所有匹配
router.get('/', async (req, res) => {
  try {
    const matches = await prisma.match.findMany({
      include: {
        demand: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        },
        service: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        },
        userA: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        userB: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: matches
    });

  } catch (error) {
    console.error('获取匹配列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取匹配列表失败'
    });
  }
});

export default router;