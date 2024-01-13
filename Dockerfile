FROM golang:1.19-alpine as go-builder
WORKDIR /app
COPY ./backend/go.mod ./
COPY ./backend/go.sum ./
RUN go mod download
COPY ./backend/*.go ./
COPY ./backend/docs ./docs
RUN go build -o bin/main

FROM node:13.12.0-alpine as react-builder
WORKDIR /app
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./ 
RUN npm ci --silent \
 && npm install react-scripts@3.4.1 -g --silent
COPY ./frontend ./
RUN npm run build

FROM alpine:3.16
RUN apk --no-cache add ca-certificates=20230506-r0
WORKDIR /usr/local/bin/
COPY ./data/ /usr/local/data/
COPY --from=go-builder /app/bin/main /usr/local/bin/
COPY --from=react-builder /app/build /usr/local/frontend/
EXPOSE 8080
CMD ["main"]