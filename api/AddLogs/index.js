var log = require('../Shared/Store.js');
var auth = require('../Shared/auth.js');
var clientInfo = require('../Shared/clientInfo.js');

module.exports = async function (context, req) {
    try {
        context.log(`## Request: AddLogs`);
        const clientPrincipal = auth.getClientPrincipal(req)
        const info = clientInfo.getInfo(context, req)

        if (!req.query.logs && (!req.body || !req.body.logs)) {
            throw new Error('No log items provided')
        }
        let logs = (req.query.logs) ? JSON.parse(req.query.logs) : req.body.logs

        context.log(`## AddLogs: adding ${logs.length} logs`);
        await log.addLogs(context, clientPrincipal, logs, [info])
        context.log(`## AddLogs: added ${logs.length} logs`);

        context.res = { status: 200, body: "" };
    } catch (err) {
        context.log(`## AddLogs error: '${err}'`);
        context.res = { status: 400, body: "Error: " + err.message }
    }
    context.log(`## Request: AddLogs done`);
}