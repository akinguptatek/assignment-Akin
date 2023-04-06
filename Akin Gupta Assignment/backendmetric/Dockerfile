FROM node:19-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ENV MONGODB_USERNAME=akingupta
ENV MONGODB_PASSWORD=Nyru1rbXaBVaxjH6

CMD ["npm", "start"]