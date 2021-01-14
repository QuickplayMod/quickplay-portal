# syntax=docker/dockerfile:experimental
FROM node:14 as build-stage
WORKDIR /usr/src/app

COPY ./package.json .
COPY ./package-lock.json .
RUN --mount=type=secret,id=npmrc,dst=/root/.npmrc npm install
COPY . .

ARG DOCKER_ENV
ENV NODE_ENV=${DOCKER_ENV}
RUN npm run build

FROM nginx as production-stage
RUN mkdir /usr/src/app
COPY --from=build-stage /usr/src/app/dist /usr/src/app
COPY nginx.conf /etc/nginx/nginx.conf
