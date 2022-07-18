FROM node:12.2.0-alpine
RUN mkdir /app
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . /app
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
