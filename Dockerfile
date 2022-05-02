FROM node:16.13.1-stretch AS builder
WORKDIR /build
COPY ["package.json", "package-lock.json*", "tsconfig.json", "./"]
RUN npm install --silent
RUN npm install --silent --global typescript
COPY src src/
RUN tsc -p tsconfig.json

FROM node:16.13.1-stretch
ENV NODE_ENV production
ENV CONFIG Release
WORKDIR /usr/src/app
RUN npm install --silent --global pm2
RUN mkdir /data
COPY --from=builder /build .
COPY ["Config.json", "./"]
ARG buildId
ENV RTIBOT_VERSION $buildId

CMD [ "pm2-runtime", "dist/src/App.js" ]