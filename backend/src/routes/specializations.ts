import express from 'express';
import { prisma } from '../index';

const router = express.Router();

// 获取所有专长
router.get('/', async (req, res) => {
  try {
    const specializations = await prisma.specialization.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    res.json({
      success: true,
      data: specializations
    });

  } catch (error) {
    console.error('获取专长列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取专长列表失败'
    });
  }
});

export default router;