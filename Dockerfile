FROM node:20-alpine

WORKDIR /app

# Copy manifests first so the dependency layer is cached between code changes
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
USER node
CMD ["node", "server.js"]
