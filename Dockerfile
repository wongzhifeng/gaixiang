# Next.js 全栈应用 Dockerfile
FROM node:22-slim
LABEL "language"="nodejs"
LABEL "framework"="next.js"
WORKDIR /src

RUN apt-get update -y && apt-get install -y openssl

# 复制配置文件
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

# 生成 Prisma Client
RUN npx prisma generate

# 构建 Next.js 应用
RUN npm run build

# 创建数据目录
RUN mkdir -p /src/data

# 创建启动脚本
RUN echo '#!/bin/bash\nset -e\necho "初始化数据库..."\nnpx prisma db push\necho "启动 Next.js 应用..."\nnpm start' > /start.sh
RUN chmod +x /start.sh

EXPOSE 8080
CMD ["/start.sh"]