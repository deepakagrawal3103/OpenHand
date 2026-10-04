# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all deps (including devDependencies for TypeScript compilation)
RUN npm ci

# Copy source code and prisma schema
COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./

# Generate Prisma client
RUN npx prisma generate

# ---- Production Stage ----
FROM node:20-alpine AS runner

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy generated Prisma client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy Prisma schema (needed at runtime for migrations/queries)
COPY prisma ./prisma

# Copy source (we run with tsx directly - no tsc build needed)
COPY src ./src

# Copy tsx from builder (it's a devDependency)
COPY --from=builder /app/node_modules/tsx ./node_modules/tsx
COPY --from=builder /app/node_modules/.bin/tsx ./node_modules/.bin/tsx

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Entrypoint: push DB schema then start server
CMD ["sh", "-c", "npx prisma db push --skip-generate && node node_modules/tsx/dist/cli.mjs src/index.ts"]
