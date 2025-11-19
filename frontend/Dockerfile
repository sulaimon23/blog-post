FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --fetch-retries=5 --fetch-retry-factor=2

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
