# Development dockerfile
FROM node:14

WORKDIR /home/node/app

ENTRYPOINT /home/node/app/docker-entrypoint.sh
# CMD ls -lah
# CMD ['/home/node/app/docker-entrypoint.sh']