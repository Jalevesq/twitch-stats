FROM node:22-alpine

WORKDIR /app

COPY ../package.json ../package-lock.json* ./
COPY ../prisma ./prisma
COPY ../prisma.config.ts ./

RUN npm install

CMD ["sh", "-c", "npx prisma generate && npm run dev"]