FROM node:22-slim
LABEL "language"="nodejs"
LABEL "framework"="express"
WORKDIR /src

RUN apt-get update -y && apt-get install -y openssl

COPY . .
RUN rm -rf src/app src/components src/contexts src/hooks src/styles
RUN rm -rf .next public tailwind.config.ts next.config.mjs postcss.config.js

WORKDIR /src/backend
RUN npm ci --only=production
RUN npm run build

RUN mkdir -p /src/backend/data
RUN echo '#!/bin/bash
set -e
cd /src
npx prisma db push --force-reset
cd /src/backend
npm start' > /src/start.sh
RUN chmod +x /src/start.sh

EXPOSE 8080
CMD ["/src/start.sh"]