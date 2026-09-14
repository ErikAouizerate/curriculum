FROM node:24-alpine AS base

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app/

RUN pnpm install --frozen-lockfile

FROM base AS dev

COPY . /app/

RUN chown -R node:node /app

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["pnpm", "dev"]

FROM base AS production

COPY . /app/

RUN pnpm build && chown -R node:node /app

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["pnpm", "start"]
