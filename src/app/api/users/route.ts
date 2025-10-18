import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

export async function GET() {
  try {
    // 首先检查数据库表是否存在
    try {
      await prisma.user.findFirst()
    } catch (tableError: any) {
      if (tableError.message?.includes('does not exist')) {
        return NextResponse.json(
          { error: 'Database tables not initialized. Please run database setup.' },
          { status: 503 }
        )
      }
      throw tableError
    }

    // 简化查询，避免复杂关联
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        locationText: true,
        trustLevel: true,
        helpCount: true,
        receiveCount: true,
        skills: true,
        onlineStatus: true
      },
      take: 50 // 限制返回数量
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, locationText, skills } = body

    const user = await prisma.user.create({
      data: {
        name,
        email,
        locationText,
        skills: JSON.stringify(skills || []),
        trustLevel: 0,
        helpCount: 0,
        receiveCount: 0,
        onlineStatus: false
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}