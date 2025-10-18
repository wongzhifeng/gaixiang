import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone, locationText } = req.body;

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        error: '用户已存在'
      });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
        phone,
        locationText,
        trustLevel: 50, // 初始信任等级
        isVerified: false,
        onlineStatus: true
      }
    });

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '注册成功',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        locationText: user.locationText,
        trustLevel: user.trustLevel,
        isVerified: user.isVerified,
        onlineStatus: user.onlineStatus
      },
      token
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      error: '注册失败'
    });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.passwordHash) {
      return res.status(400).json({
        error: '邮箱或密码错误'
      });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(400).json({
        error: '邮箱或密码错误'
      });
    }

    // 更新在线状态
    await prisma.user.update({
      where: { id: user.id },
      data: { onlineStatus: true }
    });

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: '登录成功',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        locationText: user.locationText,
        trustLevel: user.trustLevel,
        isVerified: user.isVerified,
        onlineStatus: true,
        helpCount: user.helpCount,
        receiveCount: user.receiveCount
      },
      token
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      error: '登录失败'
    });
  }
});

// 获取当前用户信息
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: '未提供认证令牌'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
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

    if (!user) {
      return res.status(404).json({
        error: '用户不存在'
      });
    }

    res.json({
      user: {
        ...user,
        skills: user.skills ? JSON.parse(user.skills) : [],
        interests: user.interests ? JSON.parse(user.interests) : []
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(401).json({
      error: '认证失败'
    });
  }
});

export default router;