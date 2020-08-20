let logs = []

exports.getLogs = () => {
    return logs
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


