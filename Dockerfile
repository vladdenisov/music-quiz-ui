# Stage 1: Build the React app
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Vite inlines VITE_* at build time; Helm ConfigMap vars are runtime-only (nginx proxy).
ARG VITE_API_URL=/api/
ARG VITE_SOCKET_URL=
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

RUN echo "Build env: VITE_API_URL=$VITE_API_URL VITE_SOCKET_URL=${VITE_SOCKET_URL:-<same-origin>}" \
  && pnpm run build

FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html
RUN mkdir /etc/nginx/templates
COPY .nginx/prod.nginx.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80