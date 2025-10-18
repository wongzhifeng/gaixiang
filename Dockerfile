# Next.js 全栈应用 Dockerfile - 优化 Prisma 版本冲突解决方案
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

# 复制源代码
COPY src ./src/
COPY public ./public/

# 跳过 Prisma 生成，直接构建（避免版本冲突）
# 在运行时初始化数据库，而不是构建时
RUN npm run build

# 创建数据目录
RUN mkdir -p /src/data

# 创建启动脚本
RUN echo '#!/bin/bash\nset -e\necho "初始化数据库..."\nif [ -d "prisma" ]; then\n  npx prisma generate\n  npx prisma db push\nfi\necho "启动 Next.js 应用..."\nnpm start' > /start.sh
RUN chmod +x /start.sh

EXPOSE 8080
CMD ["/start.sh"]