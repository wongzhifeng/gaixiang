import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 启用压缩
  compress: true,
  // 优化图片
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif']
  },
  // 实验性功能
  experimental: {
    optimizeCss: true
  }
}

export default nextConfig