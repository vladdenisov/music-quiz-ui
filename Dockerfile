# Stage 1: Build the React app
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .
ENV VITE_API_URL="/api/"

# Mock Authentication (set to 'true' to bypass real API calls)
ENV VITE_MOCK_AUTH=false
# Build the application
RUN pnpm run build

FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html
RUN mkdir /etc/nginx/templates
COPY .nginx/prod.nginx.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80