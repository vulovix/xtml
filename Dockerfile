# Use a slim Node.js image
FROM node:16-alpine as builder

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies (optional, remove if fs is already a dependency)
# RUN npm install -g fs

# Run the Node.js script to generate output
CMD [ "node", "main.js" ]

# # Stage 2: Nginx server
# FROM nginx:alpine

# # Copy the index.html from the builder stage
# COPY --from=builder /app/dist /usr/share/nginx/html/

# # Copy Nginx configuration file
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Expose port 80
# EXPOSE 80

# # Persist the generated output directory
# VOLUME /app/dist

# # Configure Nginx to serve index.html for all requests
# CMD ["nginx", "-g", "daemon off;"]


