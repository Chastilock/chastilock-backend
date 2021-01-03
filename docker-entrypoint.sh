#!/bin/sh

echo $@
echo $0

# Install dependencies using npm
npm install

# Run application
./node_modules/.bin/nodemon index.js