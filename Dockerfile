FROM node:24-alpine

WORKDIR /app

RUN corepack enable

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app/

RUN pnpm install --frozen-lockfile

COPY . /app/

RUN chown -R node:node /app

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["pnpm", "dev"]
