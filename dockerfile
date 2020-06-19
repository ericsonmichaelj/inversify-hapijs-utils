FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install & npm install -g typescript & npm install -g ts-node
COPY . .
CMD [ "gulp" ]