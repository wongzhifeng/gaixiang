# 街巷社区互助平台 Dockerfile
FROM node:18-alpine

# 元数据标签
LABEL "framework"="next.js"
LABEL "version"="1.1.0"
LABEL "description"="社区互助平台"

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 生成 Prisma 客户端
RUN npx prisma generate

# 创建数据目录
RUN mkdir -p ./data

# 初始化数据库
RUN npx prisma db push --force-reset

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]