/**
 * 街巷前端 API 客户端
 * 用于连接独立后端服务
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 通用请求函数
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// 用户相关 API
export const userApi = {
  // 获取所有用户
  getUsers: () => apiRequest('/api/users'),

  // 获取单个用户详情
  getUserById: (id: string) => apiRequest(`/api/users/${id}`),

  // 更新用户信息
  updateUser: (id: string, data: any) =>
    apiRequest(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// 需求相关 API
export const demandApi = {
  // 获取所有需求
  getDemands: (params?: { status?: string; type?: string; category?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.category) queryParams.append('category', params.category);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/demands?${queryString}` : '/api/demands';

    return apiRequest(endpoint);
  },

  // 创建新需求
  createDemand: (data: any) =>
    apiRequest('/api/demands', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 获取单个需求详情
  getDemandById: (id: string) => apiRequest(`/api/demands/${id}`),

  // 更新需求状态
  updateDemandStatus: (id: string, status: string) =>
    apiRequest(`/api/demands/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// 服务相关 API
export const serviceApi = {
  // 获取所有服务
  getServices: (params?: { status?: string; type?: string; category?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.category) queryParams.append('category', params.category);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/services?${queryString}` : '/api/services';

    return apiRequest(endpoint);
  },

  // 创建新服务
  createService: (data: any) =>
    apiRequest('/api/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 获取单个服务详情
  getServiceById: (id: string) => apiRequest(`/api/services/${id}`),

  // 更新服务状态
  updateServiceStatus: (id: string, status: string) =>
    apiRequest(`/api/services/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// 匹配相关 API
export const matchApi = {
  // 获取所有匹配
  getMatches: (params?: { type?: string; userId?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.userId) queryParams.append('userId', params.userId);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/matches?${queryString}` : '/api/matches';

    return apiRequest(endpoint);
  },

  // 创建新匹配
  createMatch: (data: any) =>
    apiRequest('/api/matches', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 获取推荐
  getRecommendations: (userId: string) =>
    apiRequest(`/api/matches/recommendations/${userId}`),
};

// 认证相关 API
export const authApi = {
  // 用户注册
  register: (data: any) =>
    apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 用户登录
  login: (data: any) =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 获取当前用户信息
  getMe: (token: string) =>
    apiRequest('/api/auth/me', {
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