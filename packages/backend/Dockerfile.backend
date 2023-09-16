FROM node:20-alpine

WORKDIR /app

RUN yarn global add nodemon typescript

COPY ./package.json ./yarn.lock ./

RUN yarn install

COPY . .

CMD [ "yarn", "run", "dev" ]
