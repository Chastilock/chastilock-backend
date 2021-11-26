const Bree = require('bree');
const Graceful = require('@ladjs/graceful')

const bree = new Bree({
    jobs: [
        /* {
            name: 'handleFreeze',
            timeout: '60m',
            interval: '60m'
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
            name: 'deleteExpiredImports',
            timeout: '10m',
            interval: '10m'
        },
        /* {
            name: 'linkLockeesToTransferedKH',
            timeout: '60s',
            interval: '2m'
        }, */
        // {
        //     //Looking to run this every 15 minutes in Prod
        //     name: 'botAction',
        //     timeout: '5m',
        //     interval: '15m'
        // },
    ]
});

const graceful = new Graceful({ brees: [bree] });
graceful.listen();

module.exports = bree;