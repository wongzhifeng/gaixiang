import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '../../../lib/db'

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

export async function GET() {
  try {
    const services = await prisma.service.findMany({
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
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
      title,
      description,
      type,
      locationText,
      tags,
      category,
      availableFrom,
      availableTo
    } = body

    const service = await prisma.service.create({
      data: {
        title,
        description,
        type: type || 'GENERAL',
        locationText,
        tags: JSON.stringify(tags || []),
        category: category || 'general',
        availableFrom: availableFrom ? new Date(availableFrom) : null,
        availableTo: availableTo ? new Date(availableTo) : null,
        userId: decoded.userId
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
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}