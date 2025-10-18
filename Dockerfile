# Next.js 前端应用 Dockerfile
FROM node:22-slim
LABEL "language"="nodejs"
LABEL "framework"="next.js"
WORKDIR /src

RUN apt-get update -y && apt-get install -y openssl

# 复制依赖配置
COPY package*.json ./
COPY next.config.* ./
COPY tailwind.config.* ./
COPY postcss.config.* ./
COPY tsconfig.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY src ./src/
COPY public ./public/

# 设置环境变量跳过 TypeScript 和 ESLint 检查
ENV NEXT_TYPESCRIPT_IGNORE_BUILD_ERRORS=true
ENV NEXT_ESLINT_IGNORE_BUILD_ERRORS=true

# 构建应用
RUN npm run build

EXPOSE 8080
CMD ["npm", "start"]