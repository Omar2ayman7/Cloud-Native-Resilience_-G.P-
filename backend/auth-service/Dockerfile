# FreshCart auth-service
FROM node:22-alpine

WORKDIR /usr/src/app/auth-service

COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src

ENV NODE_ENV=production

EXPOSE 3001

CMD ["npm", "start"]
