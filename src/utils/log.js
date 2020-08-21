import useFetch from './useFetch';


let logs = []
let logsSending = []
let isSending = false
let sendPromise = null

export const logInfo = msg => {
    const lm = { time: new Date(), msg: msg }
    logs.push(lm)
    postLogs()
}

export const flushLogs = async () => {
    if (sendPromise != null) {
        await sendPromise
    }
    await sendLogs(false)
}

const postLogs = () => {
    if (isSending) {
        console.log("Is already sending");
        return
    }
    if (logs.length === 0 && logsSending.length === 0) {
        console.log("Nothing to send");
        return
    }
    sendPromise = sendLogs()
}

const sendLogs = async (isDelayed = true) => {
    try {
        console.log("Sending logs ...");
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

        const logsText = JSON.stringify(logsSending)
        const uri = `/api/AddLogs?logs=${logsText}`
        const response = await fetch(uri)

        if (response.status !== 200) {
            console.error('Error: Status Code: ' + response.status);
            throw new Error('Error: Status Code: ' + response.status);
        }

        // Sent logs, retry again soon if more logs are to be sent
        logsSending = []
        if (logs.length !== 0) {
            setTimeout(sendLogs, 1000)
        }
    }
    catch (err) {
        console.error("Failed to send logs: " + err)
        if (logs.length !== 0 && logsSending.length !== 0) {
            // Retry in a while again
            setTimeout(sendLogs, 30000)
        }
    }
    finally {
        console.log("Sent logs");
        isSending = false
    }
}


export const clearLogs = async () => {
    try {
        logs = []
        logsSending = []
        const response = await fetch(`/api/ClearLogs`)
        if (response.status !== 200) {
            console.error('Error: Status Code: ' + response.status);
            throw new Error('Error: Status Code: ' + response.status);
        }
        console.log('clear: Cleared')
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

const delay = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}