var log = require('../Shared/Store.js');

module.exports = async function (context, req) {
    context.log(`## Request: AddLogs`);

    if (req.query.logs || (req.body && req.body.logs)) {
        let logs = []
        if (req.query.logs) {
            logs = JSON.parse(req.query.logs);
        } else {
            logs = req.body.logs
        }

        log.addLogs(logs)
        context.log(`## AddLogs: added ${logs.length} logs`);

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