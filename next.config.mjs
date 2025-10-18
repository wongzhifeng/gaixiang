/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用压缩
  compress: true,
  // 优化图片
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif']
  },
  // 排除后端目录，避免 Next.js 编译后端代码
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
  // 排除后端目录的编译
  experimental: {
    externalDir: true,
  },
}

export default nextConfig
