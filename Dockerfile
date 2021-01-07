# Development dockerfile
FROM node:14

WORKDIR /home/node/app

CMD /home/node/app/docker-entrypoint.sh