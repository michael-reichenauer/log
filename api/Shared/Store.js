let logs = []

// let totalRows = 0
// const sampleTime = new Date(0)



exports.getLogs = (start, count) => {
    if (start >= logs.length) {
        start = logs.length
    }
    if (start + count > logs.length) {
        count = logs.length - start
    }

    let lines = []
    const stop = start + count

    for (let i = start; i < stop; i += 1) {
        // const randomSelection = sample[i % sample.length];
        // const time = new Date(sampleTime.getTime() + i * 31);
        const l = logs[i]
        lines.push({ line: i, time: l.time, msg: l.msg })
    }

    return {
        start: start,
        count: count,
        total: logs.length,
        lines: lines
    }
}

// exports.addLog = (msg) => {
//     const time = dateToLocalISO(new Date())
//     logs.push({ id: logs.length, time: time, msg: msg })
// }
exports.addLogs = (msgs) => {
    logs.push(...msgs)
}

exports.clearLogs = () => {
    logs = []
}


