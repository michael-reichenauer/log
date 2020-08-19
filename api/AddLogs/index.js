var log = require('../Shared/Store.js');

module.exports = async function (context, req) {
    context.log(`## Request: AddLogs`);

    if (req.query.logs || (req.body && req.body.logs)) {
        let logsText = (req.query.logs) ? req.query.logs : req.body.logs

        var logs = JSON.parse(logsText);
        log.addLogs(logs)
        context.log(`## AddLogs: ${logsText}`);

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: ""
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Missing logs"
        };
    }
};