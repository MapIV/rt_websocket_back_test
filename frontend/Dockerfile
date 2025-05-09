# FROM node:lts-alpine
# WORKDIR /vue
# COPY ./vue ./
# RUN apk update
# RUN npm install
# CMD ["yarn", "dev", "--host"]

# remote-robot-controller
FROM node:lts-alpine
WORKDIR /remote-robot-controller
COPY ./remote-robot-controller ./
RUN apk update
RUN npm install
CMD ["yarn", "run", "start"]