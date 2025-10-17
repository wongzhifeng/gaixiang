import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '../../../../lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// 验证JWT令牌并获取用户ID
function verifyToken(authHeader: string | null): { userId: string } | null {
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded
  } catch (error) {
    return null
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 验证用户认证
    const authHeader = request.headers.get('Authorization')
    const decoded = verifyToken(authHeader)

    if (!decoded) {
      return NextResponse.json(
        { error: '未授权访问，请先登录' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      locationText,
      skills
    } = body

    const user = await prisma.user.update({
      where: {
        id: decoded.userId
      },
      data: {
        name: name || undefined,
        locationText: locationText || undefined,
        skills: skills || undefined
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    )
  }
}