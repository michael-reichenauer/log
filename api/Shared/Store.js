let logs = ['first']

exports.getLogs = () => {
    return logs
}

exports.addLog = (msg) => {
    logs.push(msg)
}
