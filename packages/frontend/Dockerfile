FROM node:20-alpine

WORKDIR /app

RUN yarn global add react-scripts typescript

COPY ./package.json ./yarn.lock ./

RUN yarn install

COPY . .

CMD [ "yarn", "start" ]
