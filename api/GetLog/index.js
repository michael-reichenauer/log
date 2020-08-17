var log = require('../Shared/Store.js');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    log.addLog("" + new Date().toLocaleString() + " - some text")

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: JSON.stringify({ time: new Date().toLocaleString(), logs: log.getLogs() })
    };

};