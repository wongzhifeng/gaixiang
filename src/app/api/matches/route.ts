import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import {
  calculateMatch,
  findBestMatchesForDemand,
  findBestMatchesForService,
  defaultMatchingConfig
} from '../../../lib/matching'

// 获取需求的匹配推荐
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const demandId = searchParams.get('demandId')
    const serviceId = searchParams.get('serviceId')
    const type = searchParams.get('type') || 'demand' // demand 或 service
    const limit = parseInt(searchParams.get('limit') || '10')

    if (type === 'demand' && demandId) {
      // 为需求找匹配服务
      const matches = await findBestMatchesForDemand(demandId, limit)

      // 获取服务的详细信息
      const matchesWithDetails = await Promise.all(
        matches.map(async (match) => {
          const service = await prisma.service.findUnique({
            where: { id: match.serviceId },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  locationText: true,
                  trustLevel: true,
                  trustScore: {
                    select: { overallScore: true }
                  }
                }
              },
              specialization: {
                select: {
                  id: true,
                  name: true,
                  category: true
                }
              }
            }
          })

          return {
            service,
            match: match.match
          }
        })
      )

      return NextResponse.json({
        success: true,
        data: {
          matches: matchesWithDetails,
          total: matchesWithDetails.length
        }
      })
    } else if (type === 'service' && serviceId) {
      // 为服务找匹配需求
      const matches = await findBestMatchesForService(serviceId, limit)

      // 获取需求的详细信息
      const matchesWithDetails = await Promise.all(
        matches.map(async (match) => {
          const demand = await prisma.demand.findUnique({
            where: { id: match.demandId },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  locationText: true,
                  trustLevel: true
                }
              },
              requiredSpecialization: {
                select: {
                  id: true,
                  name: true,
                  category: true
                }
              }
            }
          })

          return {
            demand,
            match: match.match
          }
        })
      )

      return NextResponse.json({
        success: true,
        data: {
          matches: matchesWithDetails,
          total: matchesWithDetails.length
        }
      })
    } else {
      return NextResponse.json(
        { success: false, message: '缺少需求ID或服务ID' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('获取匹配推荐失败:', error)
    return NextResponse.json(
      { success: false, message: '获取匹配推荐失败' },
      { status: 500 }
    )
  }
}

// 计算两个特定项目的匹配分数
export async function POST(request: NextRequest) {
  try {
    const { demandId, serviceId } = await request.json()

    if (!demandId || !serviceId) {
      return NextResponse.json(
        { success: false, message: '需求ID和服务ID为必填项' },
        { status: 400 }
      )
    }

    const matchResult = await calculateMatch(demandId, serviceId)

    // 获取详细数据用于返回
    const [demand, service] = await Promise.all([
      prisma.demand.findUnique({
        where: { id: demandId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              locationText: true
            }
          },
          requiredSpecialization: {
            select: {
              id: true,
              name: true,
              category: true
            }
          }
        }
      }),
      prisma.service.findUnique({
        where: { id: serviceId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              locationText: true,
              trustScore: {
                select: { overallScore: true }
              }
            }
          },
          specialization: {
            select: {
              id: true,
              name: true,
              category: true
            }
          }
        }
      })
    ])

    // 创建匹配记录
    const matchRecord = await prisma.match.create({
      data: {
        score: matchResult.score,
        reason: matchResult.reasons.join('、'),
        type: 'DEMAND_SERVICE',
        demandId,
        serviceId,
        userAId: demand?.userId || '',
        userBId: service?.userId || ''
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        match: matchResult,
        demand,
        service,
        matchRecord
      }
    })
  } catch (error) {
    console.error('计算匹配分数失败:', error)
    return NextResponse.json(
      { success: false, message: '计算匹配分数失败' },
      { status: 500 }
    )
  }
}

