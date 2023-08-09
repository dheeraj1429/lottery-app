# FROM node
# WORKDIR /app
# COPY package.json .
# RUN npm install
# COPY . .
# RUN npm run build
# EXPOSE 2001
# CMD [ "npm", "start" ]
FROM node
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 2001
CMD [ "npm", "run", "dev" ]