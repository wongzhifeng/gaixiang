# Express 后端 API Dockerfile
FROM node:18-slim
LABEL "language"="nodejs"
LABEL "framework"="express"
WORKDIR /src

RUN apt-get update -y && apt-get install -y openssl

# 复制依赖配置
COPY package*.json ./
COPY prisma ./prisma/

# 安装所有依赖（包括 devDependencies，构建需要）
RUN npm install

# 生成 Prisma Client
RUN npx prisma generate

# 复制源代码
COPY src ./src/

# 构建应用
RUN npm run build

# 创建启动脚本
RUN echo '#!/bin/bash\nset -e\necho "初始化数据库..."\nnpx prisma db push\necho "启动后端服务..."\nnpm start' > /start.sh
RUN chmod +x /start.sh

# 创建数据目录
RUN mkdir -p /data

EXPOSE 3001
CMD ["/start.sh"]