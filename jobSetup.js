const Bree = require('bree');
const Graceful = require('@ladjs/graceful')

const bree = new Bree({
    jobs: [
        /* {
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
        }, */
        {
            //Looking to run this every 5 minutes in Prod
            name: 'botAction',
            timeout: '1s',
            interval: '20s'
        }
    ]
});

const graceful = new Graceful({ brees: [bree] });
graceful.listen();

module.exports = bree;