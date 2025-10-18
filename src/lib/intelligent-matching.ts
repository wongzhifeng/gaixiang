/**
 * 智能匹配算法 - 基于纳瓦尔信任系统的智能需求匹配
 * 实现基于信任评分、距离、标签匹配的综合匹配算法
 */

import { Demand, Service, User, MatchResult, MatchingConfig, defaultMatchingConfig } from './types'

export { MatchResult, MatchingConfig, defaultMatchingConfig }

/**
 * 计算距离评分
 * @param userLocation 用户位置文本
 * @param itemLocation 需求/服务位置文本
 * @param maxDistance 最大距离
 */
function calculateDistanceScore(
  userLocation: string | undefined,
  itemLocation: string | undefined,
  maxDistance: number
): number {
  // 如果位置信息为空，返回默认分数
  if (!userLocation || !itemLocation) return 50;

  // 简化版距离计算 - 实际项目中应该使用地理编码API
  const locationMap: Record<string, number> = {
    '西湖区': 1,
    '江干区': 2,
    '上城区': 3,
    '下城区': 4,
    '拱墅区': 5,
    '滨江区': 6
  }

  const userZone = locationMap[userLocation] || 0
  const itemZone = locationMap[itemLocation] || 0

  if (userZone === 0 || itemZone === 0) return 50 // 未知位置默认分数

  const distance = Math.abs(userZone - itemZone)
  const normalizedDistance = Math.max(0, 1 - distance / maxDistance)

  return Math.round(normalizedDistance * 100)
}

/**
 * 计算标签匹配评分
 * @param userTags 用户技能标签
 * @param itemTags 需求/服务标签
 */
function calculateTagMatchScore(userTags: string[] | undefined, itemTags: string[] | undefined): number {
  if (!userTags || !itemTags || !userTags.length || !itemTags.length) return 0

  const matchedTags = userTags.filter(tag =>
    itemTags.some(itemTag =>
      itemTag.toLowerCase().includes(tag.toLowerCase()) ||
      tag.toLowerCase().includes(itemTag.toLowerCase())
    )
  )

  const matchRatio = matchedTags.length / Math.max(userTags.length, itemTags.length)
  return Math.round(matchRatio * 100)
}

/**
 * 计算紧急程度评分
 * @param urgency 紧急程度 (1-5)
 */
function calculateUrgencyScore(urgency: number): number {
  // 紧急程度越高，匹配优先级越高
  return Math.round((urgency / 5) * 100)
}

/**
 * 智能匹配算法主函数
 * @param demands 需求列表
 * @param services 服务列表
 * @param users 用户列表
 * @param config 匹配配置
 */
export function intelligentMatching(
  demands: Demand[],
  services: Service[],
  users: User[],
  config: MatchingConfig = defaultMatchingConfig
): MatchResult[] {
  const matches: MatchResult[] = []

  // 需求匹配服务
  demands.forEach(demand => {
    const demandUser = demand.user
    if (!demandUser) return

    services.forEach(service => {
      const serviceUser = service.user
      if (!serviceUser || serviceUser.id === demandUser.id) return

      // 计算各项评分
      const distanceScore = calculateDistanceScore(
        demandUser.locationText,
        serviceUser.locationText,
        config.maxDistance
      )

      const tagMatchScore = calculateTagMatchScore(
        serviceUser.skills,
        demand.tags
      )

      const urgencyScore = calculateUrgencyScore(demand.urgency)

      // 综合匹配分数
      const matchScore = Math.round(
        (serviceUser.trustLevel * config.trustWeight) +
        (distanceScore * config.distanceWeight) +
        (tagMatchScore * config.tagWeight) +
        (urgencyScore * config.urgencyWeight)
      )

      // 生成匹配解释
      const explanation = generateMatchExplanation(
        serviceUser,
        demand,
        serviceUser.trustLevel,
        distanceScore,
        tagMatchScore,
        urgencyScore
      )

      matches.push({
        id: `${demand.id}-${service.id}`,
        type: 'demand',
        item: demand,
        user: serviceUser,
        matchScore,
        trustScore: serviceUser.trustLevel,
        distanceScore,
        tagMatchScore,
        urgencyScore,
        explanation
      })
    })
  })

  // 服务匹配需求
  services.forEach(service => {
    const serviceUser = service.user
    if (!serviceUser) return

    demands.forEach(demand => {
      const demandUser = demand.user
      if (!demandUser || demandUser.id === serviceUser.id) return

      // 计算各项评分
      const distanceScore = calculateDistanceScore(
        serviceUser.locationText,
        demandUser.locationText,
        config.maxDistance
      )

      const tagMatchScore = calculateTagMatchScore(
        serviceUser.skills,
        demand.tags
      )

      const urgencyScore = calculateUrgencyScore(demand.urgency)

      // 综合匹配分数
      const matchScore = Math.round(
        (serviceUser.trustLevel * config.trustWeight) +
        (distanceScore * config.distanceWeight) +
        (tagMatchScore * config.tagWeight) +
        (urgencyScore * config.urgencyWeight)
      )

      // 生成匹配解释
      const explanation = generateMatchExplanation(
        serviceUser,
        demand,
        serviceUser.trustLevel,
        distanceScore,
        tagMatchScore,
        urgencyScore
      )

      matches.push({
        id: `${service.id}-${demand.id}`,
        type: 'service',
        item: service,
        user: demandUser,
        matchScore,
        trustScore: serviceUser.trustLevel,
        distanceScore,
        tagMatchScore,
        urgencyScore,
        explanation
      })
    })
  })

  // 按匹配分数降序排列
  return matches.sort((a, b) => b.matchScore - a.matchScore)
}

/**
 * 生成匹配解释
 */
function generateMatchExplanation(
  user: User,
  item: Demand | Service,
  trustScore: number,
  distanceScore: number,
  tagMatchScore: number,
  urgencyScore: number
): string {
  const explanations: string[] = []

  if (trustScore >= 80) {
    explanations.push('高信任用户')
  } else if (trustScore >= 60) {
    explanations.push('良好信任用户')
  }

  if (distanceScore >= 80) {
    explanations.push('近距离匹配')
  }

  if (tagMatchScore >= 80) {
    explanations.push('技能高度匹配')
  } else if (tagMatchScore >= 60) {
    explanations.push('技能匹配')
  }

  if ('urgency' in item && urgencyScore >= 80) {
    explanations.push('紧急需求')
  }

  return explanations.length > 0
    ? explanations.join('、')
    : '基础匹配'
}

/**
 * 获取高信任用户推荐
 * @param users 用户列表
 * @param limit 推荐数量
 */
export function getHighTrustRecommendations(
  users: User[],
  limit: number = 5
): User[] {
  return users
    .filter(user => user.trustLevel >= 70) // 信任评分70分以上
    .sort((a, b) => b.trustLevel - a.trustLevel)
    .slice(0, limit)
}

/**
 * 获取个性化推荐
 * @param targetUser 目标用户
 * @param users 用户列表
 * @param demands 需求列表
 * @param services 服务列表
 */
export function getPersonalizedRecommendations(
  targetUser: User,
  users: User[],
  demands: Demand[],
  services: Service[]
): MatchResult[] {
  // 过滤掉目标用户自己的需求和服务的匹配
  const filteredDemands = demands.filter(d => d.userId !== targetUser.id)
  const filteredServices = services.filter(s => s.userId !== targetUser.id)

  const matches = intelligentMatching(filteredDemands, filteredServices, users)

  // 返回前10个最相关的匹配
  return matches.slice(0, 10)
}