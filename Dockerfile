FROM node:22
WORKDIR /app

# Copy package files first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Set build arg and env
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy the rest of the application
COPY . .

# Build the app
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview"]