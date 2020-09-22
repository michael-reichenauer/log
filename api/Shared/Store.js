let allLogItems = {}
let defaultLogId = new Date().toISOString()
let defaultLastTime = new Date().toISOString()

exports.getLogs = (clientPrincipal, start, count) => {
    let logId = defaultLogId
    let lastTime = defaultLastTime
    let logItems = []
    let userLogItems = allLogItems[clientPrincipal.userId]
    if (userLogItems) {
        logId = userLogItems.logId
        lastTime = userLogItems.lastTime
        logItems = userLogItems.logItems
    }

    const total = logItems.length

    if (start >= total) {
        start = total
    }

    if (count < 0) {
        // requesting latest items, moving start to end of items
        count = -count
        let newStart = total - count
        if (newStart < start) {
            // Ensure new start is not less then requested start
            newStart = start
        }
        start = newStart
    }

    if (start + count > total) {
        count = total - start
    }

    // Copy the requested items
    let items = []
    for (let i = start; i < start + count; i += 1) {
        const item = logItems[i]
        items.push({ index: i, ...item })
    }

    return {
        id: logId,
        lastTime: lastTime,
        start: start, // Start might have been moved (if larger than total or count was negative)
        items: items,
        total: total
    }
}

exports.addLogs = (clientPrincipal, items, generalProperties) => {
    if (!items || items.length === 0) {
        // Nothing to add
        return
    }
    items.forEach(item => {
        if (item.properties) {
            item.properties = item.properties.concat(generalProperties)
        } else {
            item.properties = generalProperties
        }
    });

    let userLogItems = allLogItems[clientPrincipal.userId]
    if (!userLogItems) {
        // First add, init user log items
        userLogItems = { logId: new Date().toISOString(), logItems: [] }
    }

    userLogItems.logItems.push(...items)
    userLogItems.lastTime = new Date().toISOString()

    allLogItems[clientPrincipal.userId] = userLogItems
}

exports.clearLogs = (clientPrincipal) => {
    let userLogItems = allLogItems[clientPrincipal.userId]
    userLogItems.logItems = []
    userLogItems.logId = new Date().toISOString()
    userLogItems.lastTime = new Date().toISOString()
    allLogItems[clientPrincipal.userId] = userLogItems
}


