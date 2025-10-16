/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用压缩
  compress: true,
  // 优化图片
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif']
  },
}

export default nextConfig
