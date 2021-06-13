const Bree = require('bree');
const Graceful = require('graceful')

const bree = new Bree({
    jobs: [
        {
            name: 'foo',
            timeout: '1m',
            interval: '5m'
        }
    ]
});

module.exports = bree;