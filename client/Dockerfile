# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY index.html ./
COPY public ./public
COPY src ./src
COPY tailwind.config.js postcss.config.js vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./

# Copy Docker-specific env (empty VITE_API_URL → relative paths → Nginx proxies)
COPY .env.docker .env

# Build the Vite app (env vars baked in at build time)
RUN npm run build

# ---- Production Stage (Nginx) ----
FROM nginx:alpine AS runner

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
