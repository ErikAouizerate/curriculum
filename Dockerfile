FROM node:23-alpine3.20

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm i

COPY . /app/

RUN npm run build

EXPOSE 3000

CMD ["npm","run", "start"]