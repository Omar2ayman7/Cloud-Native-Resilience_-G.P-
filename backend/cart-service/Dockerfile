# FreshCart cart-service
FROM node:22-alpine

WORKDIR /usr/src/app/cart-service

COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src

ENV NODE_ENV=production

EXPOSE 3003

CMD ["npm", "start"]
