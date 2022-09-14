# Creates a container that runs the react app contained in the current directory
#
# Build with:
#   docker build -t my-react-docker-app .
#
# Run with: 
#  docker run -d --rm -p 3000:3000 --name reactor my-react-docker-app:latest
#
# Access it:
#  http://localhost:3000


FROM node:current-alpine AS builder
WORKDIR /app
COPY . .
RUN npm run build

FROM node:current-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/build .
CMD ["serve", "-s", "."]