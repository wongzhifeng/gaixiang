/**
 * 街巷前端 API 客户端
 * 基于 context7 规范的高质量类型安全 API 客户端
 */

import type { User, Demand, Service, MatchResult, DemandStatusType, DemandTypeType, ServiceStatusType, ServiceTypeType } from './types';

// 环境配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// API 响应类型 - 严格类型定义
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// API 错误类型 - 详细错误信息
export interface ApiError {
  error: string;
  statusCode: number;
  message: string;
  details?: unknown;
}

// 请求配置接口
export interface RequestConfig extends RequestInit {
  timeout?: number;
  retryCount?: number;
}

// 请求上下文
export interface RequestContext {
  endpoint: string;
  method: string;
  timestamp: Date;
}

// 通用请求函数 - 增强错误处理和重试机制
async function apiRequest<T>(
  endpoint: string,
  options: RequestConfig = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const context: RequestContext = {
    endpoint,
    method: options.method || 'GET',
    timestamp: new Date()
  };

  const config: RequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const controller = new AbortController();
    const timeoutId = config.timeout
      ? setTimeout(() => controller.abort(), config.timeout)
      : null;

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    if (timeoutId) clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: 'Unknown error',
        statusCode: response.status,
        message: `HTTP error! status: ${response.status}`
      }));

      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'API request failed');
    }

    return data.data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, {
      context,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });

    // 重试逻辑
    const retryCount = options.retryCount || 0;
    if (retryCount > 0 && !(error instanceof DOMException)) {
      console.log(`Retrying request (${retryCount} attempts remaining)...`);
      return apiRequest<T>(endpoint, {
        ...options,
        retryCount: retryCount - 1
      });
    }

    throw error;
  }
}

// 用户相关 API
export const userApi = {
  // 获取所有用户
  getUsers: () => apiRequest<User[]>('/api/users'),

  // 获取单个用户详情
  getUserById: (id: string) => apiRequest<User>(`/api/users/${id}`),

  // 更新用户信息
  updateUser: (id: string, data: Partial<User>) =>
    apiRequest<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// 需求相关 API
export const demandApi = {
  // 获取所有需求
  getDemands: (params?: { status?: DemandStatusType; type?: DemandTypeType; category?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.category) queryParams.append('category', params.category);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/demands?${queryString}` : '/api/demands';

    return apiRequest<Demand[]>(endpoint);
  },

  // 创建新需求
  createDemand: (data: Omit<Demand, 'id' | 'createdAt' | 'updatedAt' | 'user'>) =>
    apiRequest<Demand>('/api/demands', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 获取单个需求详情
  getDemandById: (id: string) => apiRequest<Demand>(`/api/demands/${id}`),

  // 更新需求状态
  updateDemandStatus: (id: string, status: DemandStatusType) =>
    apiRequest<Demand>(`/api/demands/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// 服务相关 API
export const serviceApi = {
  // 获取所有服务
  getServices: (params?: { status?: ServiceStatusType; type?: ServiceTypeType; category?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.category) queryParams.append('category', params.category);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/services?${queryString}` : '/api/services';

    return apiRequest<Service[]>(endpoint);
  },

  // 创建新服务
  createService: (data: Omit<Service, 'id' | 'createdAt' | 'updatedAt' | 'user'>) =>
    apiRequest<Service>('/api/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 获取单个服务详情
  getServiceById: (id: string) => apiRequest<Service>(`/api/services/${id}`),

  // 更新服务状态
  updateServiceStatus: (id: string, status: ServiceStatusType) =>
    apiRequest<Service>(`/api/services/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// 匹配相关 API
export const matchApi = {
  // 获取所有匹配
  getMatches: (params?: { type?: 'demand' | 'service'; userId?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.userId) queryParams.append('userId', params.userId);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/matches?${queryString}` : '/api/matches';

    return apiRequest<MatchResult[]>(endpoint);
  },

  // 创建新匹配
  createMatch: (data: { demandId: string; serviceId: string }) =>
    apiRequest<MatchResult>('/api/matches', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 获取推荐
  getRecommendations: (userId: string) =>
    apiRequest<MatchResult[]>(`/api/matches/recommendations/${userId}`),
};

// 认证相关 API
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  // 用户注册
  register: (data: RegisterData) =>
    apiRequest<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 用户登录
  login: (data: LoginData) =>
    apiRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 获取当前用户信息
  getMe: (token: string) =>
    apiRequest<User>('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

// 健康检查
export const healthApi = {
  check: () => apiRequest('/health'),
};

export default {
  users: userApi,
  demands: demandApi,
  services: serviceApi,
  matches: matchApi,
  auth: authApi,
  health: healthApi,
};