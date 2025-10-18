/**
 * 街巷社区互助平台 - 数据类型定义
 * 基于 Prisma schema 的真实数据类型
 */

// 用户类型
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  locationLat?: number;
  locationLng?: number;
  locationText?: string;
  onlineStatus: boolean;
  isVerified: boolean;
  trustLevel: number;
  skills?: string[];
  interests?: string[];
  helpCount: number;
  receiveCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 需求类型
export interface Demand {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  urgency: number;
  locationLat?: number;
  locationLng?: number;
  locationText?: string;
  tags?: string[];
  category: string;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
}

// 服务类型
export interface Service {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  locationLat?: number;
  locationLng?: number;
  locationText?: string;
  tags?: string[];
  category: string;
  availableFrom?: Date;
  availableTo?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
}

// 匹配结果类型
export interface MatchResult {
  id: string;
  type: 'demand' | 'service';
  item: Demand | Service;
  user: User;
  matchScore: number; // 0-100 匹配分数
  trustScore: number; // 信任评分
  distanceScore: number; // 距离评分
  tagMatchScore: number; // 标签匹配评分
  urgencyScore: number; // 紧急程度评分
  explanation: string; // 匹配解释
}

// 匹配配置
export interface MatchingConfig {
  trustWeight: number; // 信任评分权重
  distanceWeight: number; // 距离权重
  tagWeight: number; // 标签匹配权重
  urgencyWeight: number; // 紧急程度权重
  maxDistance: number; // 最大匹配距离（公里）
}

// 默认匹配配置
export const defaultMatchingConfig: MatchingConfig = {
  trustWeight: 0.4, // 信任评分最重要
  distanceWeight: 0.3, // 距离也很重要
  tagWeight: 0.2, // 标签匹配
  urgencyWeight: 0.1, // 紧急程度
  maxDistance: 10 // 10公里内匹配
}