# FreshCart Angular frontend (SSR)
FROM node:22-alpine AS build

WORKDIR /usr/src/app/freshcart-frontend

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /usr/src/app/freshcart-frontend

ENV NODE_ENV=production
ENV PORT=4000

COPY --from=build /usr/src/app/freshcart-frontend/dist ./dist
COPY --from=build /usr/src/app/freshcart-frontend/package*.json ./
RUN npm ci --omit=dev

EXPOSE 4000

CMD ["node", "dist/Freach-Cart/server/server.mjs"]
