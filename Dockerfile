FROM node:20.11-alpine3.19@sha256:201a9b31be9fb5148ca40c9e727d5e559c659ed9521b3175ba73847026257e32 as base-image

FROM base-image as builder
ENV NODE_ENV production

WORKDIR /app
COPY . .
RUN yarn --frozen-lockfile --prod
RUN yarn global add @zeit/ncc
RUN export NODE_OPTIONS=--openssl-legacy-provider && ncc build app.js -o dist


FROM base-image
ENV NODE_ENV production

COPY --from=builder /app/dist /app
WORKDIR /app
USER node


ENTRYPOINT [ "node" ]
CMD [ "index.js" ]
