# -----------------------
# Stage 1: build Strapi
# -----------------------
    FROM node:18-alpine AS builder
    WORKDIR /app
    
    # Copy only package.json and yarn.lock
    COPY package.json yarn.lock ./
    
    # Install dependencies in locked mode
    RUN yarn install --frozen-lockfile
    
    # Copy the rest of Strapi source
    COPY . .
    
    # Build the admin UI
    RUN yarn build
    
    # -----------------------
    # Stage 2: runtime image
    # -----------------------
    FROM node:18-alpine AS runner
    WORKDIR /app
    
    # Copy only needed artifacts from builder
    COPY --from=builder /app/package.json /app/yarn.lock ./
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/build ./build
    COPY --from=builder /app/src ./src
    COPY --from=builder /app/config ./config
    COPY --from=builder /app/public ./public
    
    # Production environment
    ENV NODE_ENV=production
    # Override default Strapi port if desired
    ENV PORT=3000
    ENV HOST=0.0.0.0
    
    EXPOSE 3000
    
    # Start Strapi in production
    # Ensure in package.json: "start": "strapi start"
    CMD ["yarn", "start"]
    