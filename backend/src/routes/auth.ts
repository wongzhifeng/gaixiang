import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 生成JWT令牌
function generateToken(userId: string, email: string) {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // 验证必填字段
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: '姓名、邮箱和密码为必填项'
      });
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被注册'
      });
    }

    // 密码哈希
    const passwordHash = await bcrypt.hash(password, 12);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone,
        trustLevel: 0,
        helpCount: 0,
        receiveCount: 0
      }
    });

    // 生成JWT令牌
    const token = generateToken(user.id, user.email);

    // 返回用户信息（不包含密码哈希）
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      locationText: user.locationText,
      skills: user.skills,
      trustLevel: user.trustLevel,
      helpCount: user.helpCount,
      receiveCount: user.receiveCount,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      message: '注册成功',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({
      success: false,
      message: '注册失败，请稍后重试'
    });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 验证必填字段
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码为必填项'
      });
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 生成JWT令牌
    const token = generateToken(user.id, user.email);

    // 返回用户信息
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      locationText: user.locationText,
      skills: user.skills,
      trustLevel: user.trustLevel,
      helpCount: user.helpCount,
      receiveCount: user.receiveCount,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      success: false,
      message: '登录失败，请稍后重试'
    });
  }
});

// 获取当前用户信息
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '缺少认证令牌'
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      // 返回用户信息（不包含密码哈希）
      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        locationText: user.locationText,
        skills: user.skills,
        trustLevel: user.trustLevel,
        helpCount: user.helpCount,
        receiveCount: user.receiveCount,
        createdAt: user.createdAt
      };

      res.json({
        success: true,
        message: '获取用户信息成功',
        data: { user: userResponse }
      });

    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: '无效的认证令牌'
      });
    }

  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败'
    });
  }
});

export default router;