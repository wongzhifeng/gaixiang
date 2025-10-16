/**
 * 纳瓦尔信任评分系统
 * 基于纳瓦尔宝典理念：信任 = 责任 × 一致性² × 兜底能力
 */

// 信任评分接口定义
export interface TrustMetrics {
  // 交易统计
  transactionCount: number
  completedCount: number
  disputeCount: number

  // 响应指标
  avgResponseTime?: number // 平均响应时间(小时)
  onTimeRate?: number     // 准时率

  // 用户行为
  helpCount: number       // 帮助次数
  receiveCount: number    // 接受帮助次数
}

// 信任评分结果
export interface TrustScoreResult {
  // 纳瓦尔信任三要素
  responsibility: number  // 责任评分 0-100
  consistency: number     // 一致性评分 0-100
  safetyNet: number       // 兜底能力评分 0-100

  // 综合评分
  overallScore: number    // 综合信任评分

  // 详细指标
  completionRate: number  // 完成率
  disputeRate: number     // 纠纷率
  responseScore: number   // 响应评分
}

/**
 * 纳瓦尔信任公式：责任 × 一致性² × 兜底能力
 */
export function calculateTrustScore(
  responsibility: number,  // 0-100
  consistency: number,     // 0-100
  safetyNet: number        // 0-100
): number {
  const normalizedConsistency = consistency / 100
  return (responsibility * Math.pow(normalizedConsistency, 2) * safetyNet) / 10000
}

/**
 * 计算责任评分
 * 基于交易完成率、纠纷率、响应时间等指标
 */
export function calculateResponsibility(metrics: TrustMetrics): number {
  const { transactionCount, completedCount, disputeCount, avgResponseTime } = metrics

  // 基础完成率
  const completionRate = transactionCount > 0 ? completedCount / transactionCount : 0

  // 纠纷率惩罚
  const disputeRate = transactionCount > 0 ? disputeCount / transactionCount : 0
  const disputePenalty = 1 - Math.min(disputeRate, 0.5) // 最大惩罚50%

  // 响应时间评分 (48小时为基准)
  const responseScore = avgResponseTime
    ? Math.max(0, 1 - (avgResponseTime / 48))
    : 0.5 // 默认值

  // 加权计算责任评分
  return (completionRate * 0.4 + disputePenalty * 0.3 + responseScore * 0.3) * 100
}

/**
 * 计算一致性评分
 * 基于准时率、行为稳定性等指标
 */
export function calculateConsistency(metrics: TrustMetrics): number {
  const { onTimeRate, transactionCount, helpCount, receiveCount } = metrics

  // 准时率评分
  const onTimeScore = onTimeRate || 0.5 // 默认值

  // 行为稳定性评分 (帮助与接受帮助的平衡)
  const totalInteractions = helpCount + receiveCount
  const balanceScore = totalInteractions > 0
    ? 1 - Math.abs(helpCount - receiveCount) / totalInteractions
    : 0.5

  // 交易频率稳定性 (基于交易数量)
  const frequencyScore = Math.min(transactionCount / 10, 1) // 10次交易为满分

  // 加权计算一致性评分
  return (onTimeScore * 0.5 + balanceScore * 0.3 + frequencyScore * 0.2) * 100
}

/**
 * 计算兜底能力评分
 * 基于专长稀缺性、案例数量、用户评价等
 */
export function calculateSafetyNet(
  metrics: TrustMetrics,
  specializationCount: number,
  avgSpecializationScarcity: number,
  caseStudyCount: number
): number {
  const { helpCount, transactionCount } = metrics

  // 专长稀缺性评分
  const scarcityScore = Math.min(avgSpecializationScarcity / 10, 1)

  // 案例数量评分
  const caseScore = Math.min(caseStudyCount / 5, 1) // 5个案例为满分

  // 经验积累评分
  const experienceScore = Math.min((helpCount + transactionCount) / 20, 1) // 20次为满分

  // 专长多样性评分
  const diversityScore = Math.min(specializationCount / 3, 1) // 3个专长为满分

  // 加权计算兜底能力评分
  return (scarcityScore * 0.4 + caseScore * 0.3 + experienceScore * 0.2 + diversityScore * 0.1) * 100
}

/**
 * 完整信任评分计算
 */
export function calculateCompleteTrustScore(
  metrics: TrustMetrics,
  specializationCount: number = 0,
  avgSpecializationScarcity: number = 5,
  caseStudyCount: number = 0
): TrustScoreResult {
  // 计算三要素
  const responsibility = calculateResponsibility(metrics)
  const consistency = calculateConsistency(metrics)
  const safetyNet = calculateSafetyNet(metrics, specializationCount, avgSpecializationScarcity, caseStudyCount)

  // 计算综合评分
  const overallScore = calculateTrustScore(responsibility, consistency, safetyNet)

  // 计算详细指标
  const completionRate = metrics.transactionCount > 0
    ? metrics.completedCount / metrics.transactionCount
    : 0
  const disputeRate = metrics.transactionCount > 0
    ? metrics.disputeCount / metrics.transactionCount
    : 0
  const responseScore = metrics.avgResponseTime
    ? Math.max(0, 1 - (metrics.avgResponseTime / 48))
    : 0

  return {
    responsibility,
    consistency,
    safetyNet,
    overallScore,
    completionRate,
    disputeRate,
    responseScore
  }
}

/**
 * 信任等级分类
 */
export function getTrustLevel(score: number): {
  level: string
  color: string
  description: string
} {
  if (score >= 80) {
    return {
      level: '卓越',
      color: 'text-green-600',
      description: '高度可靠的合作伙伴'
    }
  } else if (score >= 60) {
    return {
      level: '优秀',
      color: 'text-blue-600',
      description: '值得信赖的社区成员'
    }
  } else if (score >= 40) {
    return {
      level: '良好',
      color: 'text-yellow-600',
      description: '可靠的社区参与者'
    }
  } else if (score >= 20) {
    return {
      level: '基础',
      color: 'text-orange-600',
      description: '正在建立信任的新成员'
    }
  } else {
    return {
      level: '初始',
      color: 'text-gray-600',
      description: '新加入的社区成员'
    }
  }
}

/**
 * 信任评分更新器
 * 基于新交易数据更新信任评分
 */
export function updateTrustScore(
  currentScore: TrustScoreResult,
  newMetrics: Partial<TrustMetrics>
): TrustScoreResult {
  // 这里可以实现增量更新逻辑
  // 目前返回重新计算的完整评分
  const updatedMetrics: TrustMetrics = {
    transactionCount: newMetrics.transactionCount || 0,
    completedCount: newMetrics.completedCount || 0,
    disputeCount: newMetrics.disputeCount || 0,
    avgResponseTime: newMetrics.avgResponseTime,
    onTimeRate: newMetrics.onTimeRate,
    helpCount: newMetrics.helpCount || 0,
    receiveCount: newMetrics.receiveCount || 0
  }

  return calculateCompleteTrustScore(updatedMetrics)
}