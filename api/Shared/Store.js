let logItems = []
let logId = new Date().toISOString()
let lastTime = new Date().toISOString()

exports.getLogs = (start, count) => {
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

exports.addLogs = (items) => {
    logItems.push(...items)
    lastTime = new Date()
}

exports.clearLogs = () => {
    logItems = []
    logId = new Date().toISOString()
    lastTime = new Date()
}


