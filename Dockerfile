FROM node:22-slim
LABEL "language"="nodejs"
LABEL "framework"="next.js"
WORKDIR /src

RUN apt-get update -y && apt-get install -y openssl

COPY . .
RUN rm -rf .next node_modules backend

RUN npm ci --only=production
RUN npm run build

EXPOSE 8080
CMD ["npm", "start"]