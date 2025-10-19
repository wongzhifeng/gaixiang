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

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001
CMD ["npm", "start"]