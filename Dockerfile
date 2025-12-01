FROM node:18.16-slim

EXPOSE 8095

WORKDIR /process

RUN mkdir /process/logs

RUN mkdir /process/uploadedDocuments

COPY ./package.json /process/

RUN npm install

COPY . .

CMD [ "node","app.js" ]