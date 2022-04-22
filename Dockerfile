FROM node:14-alpine

WORKDIR /home/node/app
COPY . /home/node/app

RUN npm install -g yarn
RUN yarn

CMD /home/node/app/sbin/docker-entrypoint.sh