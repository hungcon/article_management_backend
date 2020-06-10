FROM node:12.18.0
WORKDIR /app
COPY package.json ./
RUN npm i
COPY . .
CMD [ "node", "index.js" ]
