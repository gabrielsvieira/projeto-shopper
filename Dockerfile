FROM node

WORKDIR  /index.ts

COPY /index.ts .

EXPOSE 3000

CMD [ "node", "/index.ts" ]