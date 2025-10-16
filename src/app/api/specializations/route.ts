import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

// 获取所有专长定义
// GET /api/specializations
export async function GET() {
  try {
    const specializations = await prisma.specialization.findMany({
      orderBy: {
        scarcity: 'desc', // 按稀缺性降序排列
      },
      include: {
        userSpecializations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                locationText: true,
                trustLevel: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(specializations)

  } catch (error) {
    console.error('Error fetching specializations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch specializations' },
      { status: 500 }
    )
  }
}

// 创建新的专长定义
// POST /api/specializations
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      category,
      subcategory,
      scarcity = 5,
      demandLevel = 5,
      avgPrice,
      verificationType = 'NONE',
      minCaseCount = 0
    } = body

    // 验证必填字段
    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      )
    }

    // 检查专长是否已存在
    const existingSpecialization = await prisma.specialization.findFirst({
      where: {
        name: {
          equals: name,
        },
      },
    })

    if (existingSpecialization) {
      return NextResponse.json(
        { error: 'Specialization with this name already exists' },
        { status: 409 }
      )
    }

    // 创建新的专长定义
    const specialization = await prisma.specialization.create({
      data: {
        name,
        description,
        category,
        subcategory,
        scarcity,
        demandLevel,
        avgPrice,
        verificationType,
        minCaseCount,
      },
    })

    return NextResponse.json(specialization, { status: 201 })

  } catch (error) {
    console.error('Error creating specialization:', error)
    return NextResponse.json(
      { error: 'Failed to create specialization' },
      { status: 500 }
    )
  }
}