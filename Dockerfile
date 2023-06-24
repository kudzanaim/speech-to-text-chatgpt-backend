FROM node:18

WORKDIR /app

COPY package.json /app

COPY . /app

RUN npm install

EXPOSE 5050

CMD ["node","index"]