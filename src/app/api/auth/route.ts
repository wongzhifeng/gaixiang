import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../../lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// 生成JWT令牌
function generateToken(userId: string, email: string) {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// 用户注册
async function handleRegister(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json()

    // 验证必填字段
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: '姓名、邮箱和密码为必填项' },
        { status: 400 }
      )
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: '该邮箱已被注册' },
        { status: 400 }
      )
    }

    // 密码哈希
    const passwordHash = await bcrypt.hash(password, 12)

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
    })

    // 生成JWT令牌
    const token = generateToken(user.id, user.email)

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
    }

    return NextResponse.json({
      success: true,
      message: '注册成功',
      data: {
        user: userResponse,
        token
      }
    })

  } catch (error) {
    console.error('注册失败:', error)
    return NextResponse.json(
      { success: false, message: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
}

// 用户登录
async function handleLogin(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // 验证必填字段
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: '邮箱和密码为必填项' },
        { status: 400 }
      )
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, message: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    // 生成JWT令牌
    const token = generateToken(user.id, user.email)

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
    }

    return NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        user: userResponse,
        token
      }
    })

  } catch (error) {
    console.error('登录失败:', error)
    return NextResponse.json(
      { success: false, message: '登录失败，请稍后重试' },
      { status: 500 }
    )
  }
}

// 获取当前用户信息
async function handleGetProfile(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: '缺少认证令牌' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      })

      if (!user) {
        return NextResponse.json(
          { success: false, message: '用户不存在' },
          { status: 404 }
        )
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
      }

      return NextResponse.json({
        success: true,
        message: '获取用户信息成功',
        data: { user: userResponse }
      })

    } catch (jwtError) {
      return NextResponse.json(
        { success: false, message: '无效的认证令牌' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('获取用户信息失败:', error)
    return NextResponse.json(
      { success: false, message: '获取用户信息失败' },
      { status: 500 }
    )
  }
}

// 健康检查
async function handleHealthCheck() {
  return NextResponse.json({
    success: true,
    message: '认证服务运行正常',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  switch (action) {
    case 'register':
      return handleRegister(request)
    case 'login':
      return handleLogin(request)
    default:
      return NextResponse.json(
        { success: false, message: '无效的操作' },
        { status: 400 }
      )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  switch (action) {
    case 'profile':
      return handleGetProfile(request)
    case 'health':
      return handleHealthCheck()
    default:
      return NextResponse.json(
        { success: false, message: '无效的操作' },
        { status: 400 }
      )
  }
}