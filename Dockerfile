 #Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app
# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .
EXPOSE 3000
# # Build the React app
# RUN npm run build

# Specify the command to run when the container starts
CMD [ "npm", "run", "dev" ]


# FROM node:latest as BUILD_IMAGE
# WORKDIR /app
# COPY package.json .
# RUN npm i
# COPY . .

# RUN npm run build

# FROM node:latest as PRODUCTION_IMAGE
# WORKDIR /app

# ## EXPOSE [Port you mentioned in the vite.config file]
# EXPOSE 3000
# CMD ["npm", "run", "dev"]