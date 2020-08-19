var log = require('../Shared/Store.js');

module.exports = async function (context, req) {
    context.log('## Request: Get Log');

    const logs = log.getLogs()
    context.log(`## GetLog: count = ${logs.length}`)

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: JSON.stringify({ time: new Date().toLocaleString(), logs: logs })
    };
};