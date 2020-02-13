FROM node:12.13.0-alpine

WORKDIR /usr/src/smart-brain-api

COPY ./ ./

RUN npm install

CMD ["sh"]


