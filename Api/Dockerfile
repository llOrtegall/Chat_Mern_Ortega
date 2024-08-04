FROM node:lts-slim

WORKDIR /app

COPY . .

RUN sh -c 'yarn && yarn build'

EXPOSE 4040

CMD ["yarn", "start"]