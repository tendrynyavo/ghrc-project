# Dockerfile

# 1. Start from an official base image (Node 20 on lightweight Alpine Linux)
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy dependency files FIRST (smart: Docker caches this layer)
COPY package*.json ./

# 4. Install dependencies
RUN npm install --production

# 5. Copy the rest of your source code
COPY . .

# 6. Build your app (if you have a build step)
RUN npm run build

# 7. Tell Docker which port your app listens on (documentation only)
EXPOSE 3000

# 8. The command to run when the container starts
CMD ["node", "server.js"]