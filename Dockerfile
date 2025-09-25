FROM node:22-slim

RUN apt update

RUN apt install chromium -y

WORKDIR /app
COPY ./package.json ./
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm install

COPY ./src ./src
COPY ./app.ts .
COPY ./.sequelizerc .
COPY ./tsconfig.json .

CMD ["npm", "start"]
