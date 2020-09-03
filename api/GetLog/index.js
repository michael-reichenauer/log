//var log = require('../Shared/Store.js');

let totalRows = 100
const sampleTime = new Date(0)

const sample = [
    ['Frozen yoghurt'],
    ['Eclair'],
    ['Ice cream sandwich'],
    ['Cupcake'],
    ['Gingerbread'],
];


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
    if (start + count > totalRows - 100) {
        totalRows = start + count + 300
    }

    if (start >= totalRows) {
        start = totalRows
    }
    if (start + count > totalRows) {
        count = totalRows - start
    }
    context.log(`## Request: get ${start}, ${count}`);
    let lines = []
    const stop = start + count

    for (let i = start; i < stop; i += 1) {
        const randomSelection = sample[i % sample.length];
        const time = new Date(sampleTime.getTime() + i * 31);
        lines.push({ line: i, time: time, msg: randomSelection })
    }

    context.log(`## Request: get ${start}, ${count}, ${lines.length} (${totalRows})`);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: JSON.stringify(
            {
                start: start,
                count: count,
                total: totalRows,
                lines: lines
            })
    };
};