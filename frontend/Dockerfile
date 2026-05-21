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

# Force frontend container crash on startup by requiring a missing dependency
CMD ["node", "-e", "try { require('react-router-dom'); } catch (err) { console.error(err); process.exit(1); } console.error('Frontend startup crash test'); process.exit(1);"]
