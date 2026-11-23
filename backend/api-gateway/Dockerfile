# FreshCart api-gateway
FROM node:22-alpine

WORKDIR /usr/src/app/api-gateway

COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
