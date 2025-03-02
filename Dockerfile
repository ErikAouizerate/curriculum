FROM node:23-alpine3.20

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn config set network-timeout 180000 && yarn config delete proxy && yarn config delete https-proxy && yarn

COPY . /app/

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]