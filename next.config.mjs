/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用压缩
  compress: true,
  // 优化图片
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif']
  },
  // 实验性功能
  experimental: {
    // optimizeCss: true // 禁用CSS优化以避免critters依赖问题
  }
}

export default nextConfig
