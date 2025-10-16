import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

// 获取所有用户专长关联
// GET /api/user-specializations
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const specializationId = searchParams.get('specializationId')

    let whereClause = {}

    if (userId && specializationId) {
      whereClause = {
        userId,
        specializationId,
      }
    } else if (userId) {
      whereClause = { userId }
    } else if (specializationId) {
      whereClause = { specializationId }
    }

    const userSpecializations = await prisma.userSpecialization.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            locationText: true,
            trustLevel: true,
            helpCount: true,
            receiveCount: true,
          },
        },
        specialization: true,
      },
      orderBy: {
        proficiency: 'desc', // 按熟练度降序排列
      },
    })

    return NextResponse.json(userSpecializations)

  } catch (error) {
    console.error('Error fetching user specializations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user specializations' },
      { status: 500 }
    )
  }
}

// 创建用户专长关联
// POST /api/user-specializations
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      userId,
      specializationId,
      proficiency = 3,
      experienceYears,
      uniqueAdvantage,
      teachingMethod,
      serviceArea,
      serviceTypes,
      pricingModel = 'TIME_BASED',
    } = body

    // 验证必填字段
    if (!userId || !specializationId) {
      return NextResponse.json(
        { error: 'User ID and Specialization ID are required' },
        { status: 400 }
      )
    }

    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // 检查专长是否存在
    const specialization = await prisma.specialization.findUnique({
      where: { id: specializationId },
    })

    if (!specialization) {
      return NextResponse.json(
        { error: 'Specialization not found' },
        { status: 404 }
      )
    }

    // 检查关联是否已存在
    const existingAssociation = await prisma.userSpecialization.findUnique({
      where: {
        userId_specializationId: {
          userId,
          specializationId,
        },
      },
    })

    if (existingAssociation) {
      return NextResponse.json(
        { error: 'User already has this specialization' },
        { status: 409 }
      )
    }

    // 创建用户专长关联
    const userSpecialization = await prisma.userSpecialization.create({
      data: {
        userId,
        specializationId,
        proficiency,
        experienceYears,
        uniqueAdvantage,
        teachingMethod,
        serviceArea,
        serviceTypes: serviceTypes ? JSON.stringify(serviceTypes) : null,
        pricingModel,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            locationText: true,
          },
        },
        specialization: true,
      },
    })

    return NextResponse.json(userSpecialization, { status: 201 })

  } catch (error) {
    console.error('Error creating user specialization:', error)
    return NextResponse.json(
      { error: 'Failed to create user specialization' },
      { status: 500 }
    )
  }
}