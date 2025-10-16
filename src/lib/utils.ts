import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 计算两点间距离（公里）- Haversine公式
 * @param lat1 纬度1
 * @param lng1 经度1
 * @param lat2 纬度2
 * @param lng2 经度2
 * @returns 距离（公里）
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // 地球半径（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

/**
 * 计算用户匹配分数
 * @param distance 距离（公里）
 * @param tagMatches 标签匹配数
 * @param totalTags 总标签数
 * @param urgency 紧急程度 (1-5)
 * @returns 匹配分数 (0-100)
 */
export function calculateMatchScore(
  distance: number,
  tagMatches: number,
  totalTags: number,
  urgency: number
): number {
  // 距离分数（距离越近分数越高）
  const distanceScore = Math.max(0, 100 - (distance * 10))

  // 标签分数
  const tagScore = totalTags > 0 ? (tagMatches / totalTags) * 100 : 0

  // 紧急程度分数
  const urgencyScore = urgency * 20

  // 加权计算总分
  const totalScore = (distanceScore * 0.4) + (tagScore * 0.3) + (urgencyScore * 0.3)
  return Math.min(100, Math.max(0, totalScore))
}

/**
 * 计算信任进度
 * @param messageCount 消息数量
 * @param maxMessages 最大消息数
 * @returns 信任进度百分比
 */
export function calculateTrustProgress(messageCount: number, maxMessages: number = 6): number {
  return Math.min((messageCount / maxMessages) * 100, 100)
}

/**
 * 判断是否可以交换联系方式
 * @param messageCount 消息数量
 * @param minMessages 最小消息数
 * @returns 是否可以交换
 */
export function canExchangeContact(messageCount: number, minMessages: number = 3): boolean {
  return messageCount >= minMessages
}

/**
 * 识别需求场景
 * @param text 用户输入文本
 * @returns 场景类型和置信度
 */
export function identifyScenario(text: string): { scenario: string; confidence: number } {
  const scenarios = {
    emergency: ['紧急', '急', '马上', '立即', '帮忙', '救命'],
    repair: ['修', '维修', '坏了', '故障', '漏水', '电器'],
    care: ['照顾', '看护', '老人', '孩子', '病人'],
    shopping: ['买', '购', '代购', '超市', '药店'],
    moving: ['搬家', '搬运', '抬', '重物'],
    learning: ['教', '学习', '辅导', '作业']
  }

  let bestMatch = { scenario: 'general', confidence: 0 }

  for (const [scenario, keywords] of Object.entries(scenarios)) {
    const matches = keywords.filter(keyword => text.includes(keyword)).length
    const confidence = matches / keywords.length
    if (confidence > bestMatch.confidence) {
      bestMatch = { scenario, confidence }
    }
  }

  return bestMatch
}

/**
 * 格式化距离显示
 * @param distance 距离（公里）
 * @returns 格式化后的距离字符串
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}米`
  }
  return `${distance.toFixed(1)}公里`
}

/**
 * 格式化时间显示
 * @param date 日期对象
 * @returns 格式化后的时间字符串
 */
export function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 60 * 1000) {
    return '刚刚'
  } else if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))}分钟前`
  } else if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}小时前`
  } else {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`
  }
}