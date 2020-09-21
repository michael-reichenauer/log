var log = require('../Shared/Store.js');

module.exports = async function (context, req) {
    context.log(`## Request: AddLogs`);

    const header = req.headers["x-ms-client-principal"];
    let clientPrincipal

    if (header) {
        const encoded = Buffer.from(header, "base64");
        const decoded = encoded.toString("ascii");
        clientPrincipal = JSON.parse(decoded)
    }

    if (!clientPrincipal) {
        clientPrincipal = {
            "identityProvider": "local",
            "userId": 'local',
            "userDetails": 'local',
            "userRoles": ["anonymous", "authenticated"]
        }
    }

    if (req.query.logs || (req.body && req.body.logs)) {
        let logs = []
        if (req.query.logs) {
            logs = JSON.parse(req.query.logs);
        } else {
            logs = req.body.logs
        }

        log.addLogs(logs, [clientPrincipal])
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