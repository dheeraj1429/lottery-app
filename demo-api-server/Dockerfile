FROM node
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 2000
CMD [ "node", "server.js" ]