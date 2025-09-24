# Dockerfile for React Vite App
FROM node:20-alpine AS build

# Define build argument for API URL
ARG VITE_API_URL=https://einvoiceapi.finosys.com

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# RUN npm install
RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Production image
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8001
CMD ["nginx", "-g", "daemon off;"]
