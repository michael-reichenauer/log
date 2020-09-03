var log = require('../Shared/Store.js');




module.exports = async function (context, req) {
    context.log('## Request: Get Log');

    // const logs = log.getLogs()
    // context.log(`## GetLog: count = ${logs.length}`)

    // context.res = {
    //     // status: 200, /* Defaults to 200 */
    //     body: JSON.stringify({ time: new Date().toLocaleString(), logs: logs })
    // };
    if (!req.query.start || !req.query.count) {
        context.log('## Request: Invalid args');
        context.res = {
            status: 400,
            body: "invalid args"
        };
        return
    }

    let start = parseInt(req.query.start)
    let count = parseInt(req.query.count)
    if (start === undefined || count == undefined || start < 0 || count < 0 || count > 5000) {
        context.log('## Request: Invalid args');
        context.res = {
            status: 400,
            body: "invalid args"
        };
        return
    }
    context.log(`## Request: getting ${start}, ${count}`);

    const logs = log.getLogs(start, count)

    context.log(`## Request: get ${logs.start}, ${logs.count}, ${logs.lines.length} (${logs.totalRows})`);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: JSON.stringify(logs)
    };
};