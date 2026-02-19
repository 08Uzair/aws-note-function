FROM node:20

WORKDIR /index.js

COPY . .

RUN npm install


CMD ["node", "index.js"]