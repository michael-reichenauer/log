var log = require('../Shared/Store.js');
var auth = require('../Shared/auth.js');


module.exports = async function (context, req) {
    context.log('## Request: Get Log');
    const clientPrincipal = auth.getClientPrincipal(req)

    if (!req.query.start || !req.query.count) {
        context.res = { status: 400, body: "invalid args" };
        return
    }

    let start = parseInt(req.query.start)
    let count = parseInt(req.query.count)
    if (start === undefined || count == undefined || start < 0) {
        context.res = { status: 400, body: "invalid args" };
        return
    }
    context.log(`## Request: getting ${start}, ${count}`);

    const logs = log.getLogs(clientPrincipal, start, count)

    context.log(`## Request: get ${logs.start}, ${logs.items.length} (${logs.total})`);

    context.res = { status: 200, body: JSON.stringify(logs) };
};