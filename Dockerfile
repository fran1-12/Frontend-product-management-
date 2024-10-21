FROM node:20.12.2

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install 

EXPOSE 3000

CMD ["npm"]
