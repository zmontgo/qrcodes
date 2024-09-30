# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# This is necessary to run sharp
RUN npm install -g --arch=x64 --platform=linux --libc=glibc sharp@0.33.0-rc.2

# Path to global installation of sharp
ENV NEXT_SHARP_PATH=/usr/local/lib/node_modules/sharp

# Install the application's dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN yarn next build

# Expose port 3000 for the application
EXPOSE 3000

# Start the application
CMD ["yarn", "next", "start"]
