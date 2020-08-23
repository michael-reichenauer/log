import useFetch from './useFetch';

let logs = []
let logsSending = []
let isSending = false
let sendPromise = null

export const logInfo = msg => {
    const lm = { time: new Date(), msg: msg }
    logs.push(lm)
    console.log(`logInfo: ${JSON.stringify(lm)}`)
    postLogs()
}

export const clearLogs = async () => {
    try {
        console.log('clearLogs: clearing ...')
        logs = []
        logsSending = []
        const response = await fetch(`/api/ClearLogs`)
        if (!response.ok) {
            throw new Error('Error: Status Code: ' + response.status);
        }
        console.log('clearLogs: cleared')
    } catch (err) {
        console.error("Failed to clear: " + err)
    }
}

export const useLogs = (count) => {
    const { response, loading, error } = useFetch(
        "/api/GetLog", null, count
    );
    return { response, loading, error }
}

export const flushLogs = async () => {
    if (sendPromise != null) {
        await sendPromise
    }
    await sendLogs(false)
}

const postLogs = () => {
    if (isSending) {
        return
    }
    if (logs.length === 0 && logsSending.length === 0) {
        return
    }
    sendPromise = sendLogs(true)
}

const sendLogs = async (isDelayed = true) => {
    try {
        isSending = true

        // Allow a few more log rows to be collected before sending
        if (isDelayed) {
            await delay(100)
        }

        // Copy logs to send for this batch
        logsSending.push(...logs)
        logs = []
        if (logsSending.length === 0) {
            return
        }
        console.log("Sending logs ...");
        const data = { logs: logsSending }
        const startSend = Date.now()
        const response = await fetch(`/api/AddLogs`,
            {
                method: 'post',
                body: JSON.stringify(data)
            })

        if (!response.ok) {
            throw new Error('Error: Status Code: ' + response.status);
        }

        console.log(`Sent ${logsSending.length} logs in ${Date.now() - startSend} ms`);

        // Sent logs, retry again soon if more logs are to be sent
        logsSending = []
        if (logs.length !== 0) {
            setTimeout(postLogs, 10000)
        }
    }
    catch (err) {
        console.error("Failed to send logs: " + err)
        if (logs.length !== 0 && logsSending.length !== 0) {
            // Retry in a while again
            setTimeout(postLogs, 0)
        }
    }
    finally {
        isSending = false
    }
}

const delay = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}