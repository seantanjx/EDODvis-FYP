FROM node:16-alpine3.14
WORKDIR /edodvis
COPY package.json .
RUN yarn
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]