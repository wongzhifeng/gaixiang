// API 客户端配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 通用请求函数
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// 认证相关 API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProfile: (token: string) =>
    request('/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

// 用户相关 API
export const userAPI = {
  getUsers: () => request('/api/users'),

  getUser: (id: string) => request(`/api/users/${id}`),

  updateUser: (id: string, data: any, token: string) =>
    request(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),
};

// 需求相关 API
export const demandAPI = {
  getDemands: () => request('/api/demands'),

  createDemand: (data: any) =>
    request('/api/demands', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// 服务相关 API
export const serviceAPI = {
  getServices: () => request('/api/services'),

  createService: (data: any) =>
    request('/api/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// 匹配相关 API
export const matchAPI = {
  getMatches: () => request('/api/matches'),
};

// 专长相关 API
export const specializationAPI = {
  getSpecializations: () => request('/api/specializations'),
};

// 信任评分相关 API
export const trustScoreAPI = {
  getTrustScore: (userId: string) =>
    request(`/api/trust-scores?userId=${userId}`),
};

// 健康检查
export const healthAPI = {
  check: () => request('/api/health'),
};