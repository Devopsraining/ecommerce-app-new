FROM node:18-alpine

# Set Node options for memory management and deprecation handling
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV NODE_ENV=development
ENV GENERATE_SOURCEMAP=true

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with cache optimization
RUN npm ci --legacy-peer-deps --loglevel=error

# Copy source code
COPY . .

EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["npm", "start"]
