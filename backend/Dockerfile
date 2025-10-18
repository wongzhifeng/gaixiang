# 街巷后端服务 Dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./
COPY prisma ./prisma/

# 安装依赖
RUN npm ci --only=production

# 生成 Prisma 客户端
RUN npx prisma generate

# 复制源代码
COPY . .

# 构建 TypeScript
RUN npm run build

# 创建数据目录
RUN mkdir -p ./data

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["npm", "start"]