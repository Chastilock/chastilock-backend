const Bree = require('bree');
const Graceful = require('@ladjs/graceful')

const bree = new Bree({
    jobs: [
        {
            name: 'updateLock',
            timeout: '1s',
            interval: '1m'
        }
    ]
});

const graceful = new Graceful({ brees: [bree] });
graceful.listen();

module.exports = bree;