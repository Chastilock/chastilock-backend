const Bree = require('bree');

const bree = new Bree({
    jobs: [
        {
            name: 'foo',
            timeout: '1m',
            interval: '5m'
        }
    ]
});

//const graceful = new Graceful({ brees: [bree] });
//graceful.listen();

// start all jobs (this is the equivalent of reloading a crontab):
bree.start();
export default bree;