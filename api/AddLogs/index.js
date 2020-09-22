var log = require('../Shared/Store.js');
var auth = require('../Shared/auth.js');

module.exports = async function (context, req) {
    context.log(`## Request: AddLogs`);

    const clientPrincipal = auth.getClientPrincipal(req)

    if (req.query.logs || (req.body && req.body.logs)) {
        let logs = []
        if (req.query.logs) {
            logs = JSON.parse(req.query.logs);
        } else {
            logs = req.body.logs
        }

        log.addLogs(clientPrincipal, logs, [clientPrincipal])
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