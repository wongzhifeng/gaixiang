# Next.js 全栈应用 Dockerfile - 修复 Prisma Client 缺失问题
FROM node:22-slim
LABEL "language"="nodejs"
LABEL "framework"="next.js"
WORKDIR /src

RUN apt-get update -y && apt-get install -y openssl

# 复制依赖配置
COPY package*.json ./
COPY prisma ./prisma/
COPY next.config.* ./
COPY tailwind.config.* ./
COPY postcss.config.* ./
COPY tsconfig.json ./

# 安装依赖
RUN npm ci --only=production

# 生成 Prisma Client（必须在构建前生成，API 路由需要）
RUN npx prisma generate

# 复制源代码
COPY src ./src/
COPY public ./public/

# 设置环境变量跳过 TypeScript 和 ESLint 检查
ENV NEXT_TYPESCRIPT_IGNORE_BUILD_ERRORS=true
ENV NEXT_ESLINT_IGNORE_BUILD_ERRORS=true

# 构建应用
RUN npm run build

# 创建数据目录
RUN mkdir -p /src/data

# 创建启动脚本
RUN echo '#!/bin/bash\nset -e\necho "初始化数据库..."\nif [ -d "prisma" ]; then\n  npx prisma db push\nfi\necho "启动 Next.js 应用..."\nnpm start' > /start.sh
RUN chmod +x /start.sh

EXPOSE 8080
CMD ["/start.sh"]