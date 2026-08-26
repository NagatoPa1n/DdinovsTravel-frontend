FROM node:20-alpine AS builder
WORKDIR /app
# Cap V8 heap so the build GCs aggressively and isn't OOM-killed by the
# kernel on low-memory servers (this build needs well under this).
ENV NODE_OPTIONS=--max-old-space-size=512
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
