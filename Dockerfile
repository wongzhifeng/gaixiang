# Next.js 全栈应用 Dockerfile
FROM node:18-slim
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
COPY prisma ./prisma/

# 安装所有依赖（包括 devDependencies，构建需要）
RUN npm install

# 生成 Prisma 客户端
RUN npx prisma generate

# 复制源代码
COPY src ./src/
COPY public ./public/

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_TYPESCRIPT_IGNORE_BUILD_ERRORS=true
ENV NEXT_ESLINT_IGNORE_BUILD_ERRORS=true

# 构建应用
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]