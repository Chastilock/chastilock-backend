const Bree = require('bree');
const Graceful = require('@ladjs/graceful')

const bree = new Bree({
    jobs: [
        {
            name: 'handleFreeze',
            timeout: '1s',
            interval: '20s'
        },
        {
            name: 'handleAutoResets',
            timeout: '1s',
            interval: '20s'
        },
        {
            name: 'updateChancesLeft',
            timeout: '1s',
            interval: '20s'
        }
    ]
});

const graceful = new Graceful({ brees: [bree] });
graceful.listen();

module.exports = bree;