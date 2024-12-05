FROM node:18.12.0

WORKDIR /app

COPY . .

RUN npm install

CMD ["node" , "app.js"]
