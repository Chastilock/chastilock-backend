# Development dockerfile
FROM node:14

WORKDIR /home/node/app

ENTRYPOINT /home/node/app/docker-entrypoint.sh