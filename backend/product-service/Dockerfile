# FreshCart product-service
FROM node:22-alpine

WORKDIR /usr/src/app/product-service

COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src

ENV NODE_ENV=production

EXPOSE 3002

CMD ["npm", "start"]
