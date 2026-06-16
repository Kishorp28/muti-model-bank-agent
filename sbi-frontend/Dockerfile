FROM node:20-alpine

WORKDIR /app

# Copy dependency configs
COPY package.json package-lock.json* ./
RUN npm install

# Copy application files
COPY . .

# Expose dev server port
EXPOSE 3000
CMD ["npm", "run", "dev"]
