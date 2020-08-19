var log = require('../Shared/Store.js');

module.exports = async function (context, req) {
    context.log(`## Request: ClearLogs`);

    log.clearLogs()
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: ""
    };

};