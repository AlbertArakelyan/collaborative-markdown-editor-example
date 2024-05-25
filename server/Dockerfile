FROM node:20.13.1

WORKDIR /app

COPY ./package*.json ./

RUN yarn install

COPY . .

EXPOSE 5000

CMD ["yarn", "start"]