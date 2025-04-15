FROM node:22.14 as builder

WORKDIR /app

COPY ./ ./


RUN npm install prod && npm build prod