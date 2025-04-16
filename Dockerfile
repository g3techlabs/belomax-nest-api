FROM --platform=linux/amd64 node:22

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install
RUN npm install @css-inline/css-inline-linux-x64-gnu

COPY . .

CMD ["yarn", "start"]