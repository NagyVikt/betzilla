# 1. Use official Node.js LTS image
FROM node:18-alpine AS builder

# 2. Set working directory
WORKDIR /app

# 3. Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# 4. Copy all files
COPY . .

# 5. Build Next.js app
RUN npm run build

# 6. Production image, copy from builder
FROM node:18-alpine AS runner
WORKDIR /app

# Only copy necessary files for production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/tailwind.config.js ./tailwind.config.js
COPY --from=builder /app/postcss.config.js ./postcss.config.js

EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
