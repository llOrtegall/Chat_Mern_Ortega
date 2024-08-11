FROM node:lts-slim

WORKDIR /app

COPY . .

RUN sh -c 'yarn && yarn build'

EXPOSE 80

CMD ["yarn", "start"]