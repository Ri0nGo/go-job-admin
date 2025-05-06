FROM node:22.14 AS builder

WORKDIR /app

COPY go-job-admin/ ./

RUN npm install

RUN npm run build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
