# FreshCart order-service
FROM node:22-alpine

WORKDIR /usr/src/app/order-service

COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src

ENV NODE_ENV=production

EXPOSE 3004

CMD ["npm", "start"]
