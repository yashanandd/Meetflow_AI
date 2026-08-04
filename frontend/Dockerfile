FROM node:18-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy frontend source code
COPY . .

EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]
