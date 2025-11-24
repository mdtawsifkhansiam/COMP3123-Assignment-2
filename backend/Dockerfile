FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p src/uploads
EXPOSE 5000
CMD ["node", "src/index.js"]