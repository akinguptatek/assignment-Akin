FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8083

ENV MONGODB_USERNAME=akingupta
ENV MONGODB_PASSWORD=Nyru1rbXaBVaxjH6

CMD ["npm", "start"]