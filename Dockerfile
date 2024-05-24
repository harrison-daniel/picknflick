# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container 
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

#Install dependencies
RUN npm install

#Copy the rest of the application code to the container
COPY . .

#Build the Next.js application
RUN npm run build


FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

#Expose the port the app runs on
EXPOSE 3000

CMD ["npm", "run", "start"]