const Bree = require('bree');
const Graceful = require('@ladjs/graceful')

const bree = new Bree({
    jobs: [
        {
            name: 'foo',
            timeout: '1m',
            interval: '5m'
        }
    ]
});

const graceful = new Graceful({ brees: [bree] });
graceful.listen();

module.exports = bree;