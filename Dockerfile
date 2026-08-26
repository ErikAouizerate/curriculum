FROM node:23-alpine3.20 AS base

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app/

RUN pnpm install --frozen-lockfile

FROM base AS dev

COPY . /app/

EXPOSE 3000

CMD ["pnpm", "dev"]

FROM base AS production

COPY . /app/

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
