import { prisma } from './db'

// 匹配算法配置
export interface MatchingConfig {
  weights: {
    specialization: number // 专长匹配权重
    location: number      // 地理位置权重
    trust: number         // 信任评分权重
    time: number          // 时间可用性权重
    urgency: number       // 紧急程度权重
    history: number       // 历史互动权重
  }
  maxDistance: number     // 最大匹配距离(km)
  minTrustScore: number   // 最低信任评分
}

// 默认配置
export const defaultMatchingConfig: MatchingConfig = {
  weights: {
    specialization: 0.35,
    location: 0.25,
    trust: 0.20,
    time: 0.10,
    urgency: 0.05,
    history: 0.05
  },
  maxDistance: 50, // 50公里
  minTrustScore: 30 // 最低信任评分
}

// 匹配结果接口
export interface MatchResult {
  score: number           // 综合匹配分数 0-100
  reasons: string[]       // 匹配原因
  details: {
    specialization: number
    location: number
    trust: number
    time: number
    urgency: number
    history: number
  }
}

// 计算两个坐标之间的距离(km)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // 地球半径(km)
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// 专长匹配计算
export async function calculateSpecializationMatch(
  demandSpecializationId: string | null,
  serviceSpecializationId: string | null
): Promise<number> {
  if (!demandSpecializationId || !serviceSpecializationId) {
    return 0
  }

  // 完全匹配
  if (demandSpecializationId === serviceSpecializationId) {
    return 100
  }

  // 检查专长分类匹配
  const [demandSpec, serviceSpec] = await Promise.all([
    prisma.specialization.findUnique({
      where: { id: demandSpecializationId },
      select: { category: true, subcategory: true }
    }),
    prisma.specialization.findUnique({
      where: { id: serviceSpecializationId },
      select: { category: true, subcategory: true }
    })
  ])

  if (!demandSpec || !serviceSpec) {
    return 0
  }

  // 同分类同子分类
  if (demandSpec.category === serviceSpec.category &&
      demandSpec.subcategory === serviceSpec.subcategory) {
    return 80
  }

  // 同分类不同子分类
  if (demandSpec.category === serviceSpec.category) {
    return 60
  }

  return 0
}

// 地理位置匹配计算
export function calculateLocationMatch(
  demandLat: number | null,
  demandLng: number | null,
  serviceLat: number | null,
  serviceLng: number | null,
  maxDistance: number
): number {
  if (!demandLat || !demandLng || !serviceLat || !serviceLng) {
    return 50 // 无位置信息时给中等分数
  }

  const distance = calculateDistance(demandLat, demandLng, serviceLat, serviceLng)

  if (distance > maxDistance) {
    return 0
  }

  // 距离越近分数越高
  return Math.max(0, 100 - (distance / maxDistance) * 100)
}

// 信任评分匹配计算
export async function calculateTrustMatch(
  serviceUserId: string,
  minTrustScore: number
): Promise<number> {
  const trustScore = await prisma.trustScore.findUnique({
    where: { userId: serviceUserId },
    select: { overallScore: true }
  })

  if (!trustScore || trustScore.overallScore < minTrustScore) {
    return 0
  }

  // 信任评分越高分数越高
  return Math.min(100, (trustScore.overallScore / 100) * 100)
}

// 时间可用性匹配计算
export function calculateTimeMatch(
  demandDeadline: Date | null,
  serviceAvailableFrom: Date | null,
  serviceAvailableTo: Date | null
): number {
  if (!demandDeadline || !serviceAvailableFrom || !serviceAvailableTo) {
    return 50 // 无时间信息时给中等分数
  }

  const deadline = new Date(demandDeadline)
  const availableFrom = new Date(serviceAvailableFrom)
  const availableTo = new Date(serviceAvailableTo)

  // 需求截止时间在服务可用时间内
  if (deadline >= availableFrom && deadline <= availableTo) {
    return 100
  }

  // 需求截止时间接近服务可用时间
  const timeDiff = Math.abs(deadline.getTime() - availableFrom.getTime())
  const daysDiff = timeDiff / (1000 * 3600 * 24)

  if (daysDiff <= 7) { // 7天内
    return 80
  } else if (daysDiff <= 14) { // 14天内
    return 60
  }

  return 20
}

// 紧急程度匹配计算
export function calculateUrgencyMatch(demandUrgency: number): number {
  // 紧急程度越高，匹配分数越高
  return (demandUrgency / 5) * 100
}

// 历史互动匹配计算
export async function calculateHistoryMatch(
  demandUserId: string,
  serviceUserId: string
): Promise<number> {
  if (demandUserId === serviceUserId) {
    return 0 // 不能匹配自己
  }

  // 检查历史合作记录
  const historyMatches = await prisma.match.count({
    where: {
      OR: [
        { userAId: demandUserId, userBId: serviceUserId },
        { userAId: serviceUserId, userBId: demandUserId }
      ]
    }
  })

  // 检查历史对话记录
  const conversationCount = await prisma.conversationParticipant.count({
    where: {
      conversation: {
        participants: {
          some: {
            userId: demandUserId
          }
        }
      }
    }
  })

  // 有历史合作加分
  if (historyMatches > 0) {
    return 80
  }

  // 有历史对话加分
  if (conversationCount > 0) {
    return 60
  }

  return 30 // 无历史互动给基础分
}

// 主匹配算法
export async function calculateMatch(
  demandId: string,
  serviceId: string,
  config: MatchingConfig = defaultMatchingConfig
): Promise<MatchResult> {
  // 获取需求和服务的详细信息
  const [demand, service] = await Promise.all([
    prisma.demand.findUnique({
      where: { id: demandId },
      include: {
        requiredSpecialization: true,
        user: {
          select: {
            id: true,
            locationLat: true,
            locationLng: true
          }
        }
      }
    }),
    prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        specialization: true,
        user: {
          select: {
            id: true,
            locationLat: true,
            locationLng: true,
            trustScore: {
              select: { overallScore: true }
            }
          }
        }
      }
    })
  ])

  if (!demand || !service) {
    throw new Error('需求或服务不存在')
  }

  // 计算各维度分数
  const specializationScore = await calculateSpecializationMatch(
    demand.requiredSpecializationId,
    service.specializationId
  )

  const locationScore = calculateLocationMatch(
    demand.locationLat || demand.user.locationLat,
    demand.locationLng || demand.user.locationLng,
    service.locationLat || service.user.locationLat,
    service.locationLng || service.user.locationLng,
    config.maxDistance
  )

  const trustScore = await calculateTrustMatch(
    service.user.id,
    config.minTrustScore
  )

  const timeScore = calculateTimeMatch(
    demand.deadline,
    service.availableFrom,
    service.availableTo
  )

  const urgencyScore = calculateUrgencyMatch(demand.urgency)

  const historyScore = await calculateHistoryMatch(
    demand.user.id,
    service.user.id
  )

  // 计算综合分数
  const totalScore =
    specializationScore * config.weights.specialization +
    locationScore * config.weights.location +
    trustScore * config.weights.trust +
    timeScore * config.weights.time +
    urgencyScore * config.weights.urgency +
    historyScore * config.weights.history

  // 生成匹配原因
  const reasons: string[] = []
  if (specializationScore > 80) reasons.push('专长高度匹配')
  if (locationScore > 80) reasons.push('地理位置相近')
  if (trustScore > 80) reasons.push('信任评分优秀')
  if (timeScore > 80) reasons.push('时间安排合适')
  if (urgencyScore > 80) reasons.push('紧急需求优先')
  if (historyScore > 60) reasons.push('有历史合作基础')

  return {
    score: Math.round(totalScore),
    reasons,
    details: {
      specialization: specializationScore,
      location: locationScore,
      trust: trustScore,
      time: timeScore,
      urgency: urgencyScore,
      history: historyScore
    }
  }
}

// 批量匹配：为需求找到最合适的服务
export async function findBestMatchesForDemand(
  demandId: string,
  limit: number = 10,
  config: MatchingConfig = defaultMatchingConfig
): Promise<Array<{ serviceId: string; match: MatchResult }>> {
  // 获取所有活跃服务
  const activeServices = await prisma.service.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true }
  })

  // 为每个服务计算匹配分数
  const matches = await Promise.all(
    activeServices.map(async (service) => {
      const match = await calculateMatch(demandId, service.id, config)
      return {
        serviceId: service.id,
        match
      }
    })
  )

  // 按分数排序并返回前N个
  return matches
    .filter(match => match.match.score > 0) // 过滤掉分数为0的匹配
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, limit)
}

// 批量匹配：为服务找到最合适的需求
export async function findBestMatchesForService(
  serviceId: string,
  limit: number = 10,
  config: MatchingConfig = defaultMatchingConfig
): Promise<Array<{ demandId: string; match: MatchResult }>> {
  // 获取所有活跃需求
  const activeDemands = await prisma.demand.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true }
  })

  // 为每个需求计算匹配分数
  const matches = await Promise.all(
    activeDemands.map(async (demand) => {
      const match = await calculateMatch(demand.id, serviceId, config)
      return {
        demandId: demand.id,
        match
      }
    })
  )

  // 按分数排序并返回前N个
  return matches
    .filter(match => match.match.score > 0) // 过滤掉分数为0的匹配
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, limit)
}