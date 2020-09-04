import { delay } from '../utils'


// LogSender private class to send log messages to server
export class LogSender {
    logs = []
    logsSending = []
    isSending = false
    sendPromise = new Promise((resolve, reject) => { resolve() })

    addMsg = (level, msg) => {
        const logMsg = { level: level, time: new Date(), msg: msg }
        this.logs.push(logMsg)
        console.log(`log: ${JSON.stringify(logMsg)}`)
        this.postLogs()
    }


    clear = async () => {
        try {
            console.log('clearLogs: clearing ...')
            this.logs = []
            this.logsSending = []
            const response = await fetch(`/api/ClearLogs`)
            if (!response.ok) {
                throw new Error('Error: Status Code: ' + response.status);
            }
            console.log('clearLogs: cleared')
        } catch (err) {
            console.error("Failed to clear: " + err)
        }
    }

    flush = async () => {
        await this.sendPromise
        this.sendPromise = this.sendLogs(false)

        await this.sendPromise
    }

    postLogs = () => {
        if (this.isSending) {
            return
        }
        if (this.logs.length === 0 && this.logsSending.length === 0) {
            return
        }
        this.sendPromise = this.sendLogs(true)
    }

    sendLogs = async (isDelayed = true) => {
        if (this.isSending) {
            return
        }
        try {
            this.isSending = true

            // Allow a few more log rows to be collected before sending
            if (isDelayed) {
                await delay(100)
            }

            // Copy logs to send for this batch
            this.logsSending.push(...this.logs)
            this.logs = []
            if (this.logsSending.length === 0) {
                return
            }
            const body = JSON.stringify({ logs: this.logsSending })
            console.log(`Sending logs ${body}...`);
            const startSend = Date.now()
            const response = await fetch(`/api/AddLogs`, { method: 'post', body: body })

            if (!response.ok) {
                throw new Error('Error: Status Code: ' + response.status);
            }

            console.log(`Sent ${this.logsSending.length} logs in ${Date.now() - startSend} ms`);

            // Sent logs, retry again soon if more logs are to be sent
            this.logsSending = []
            if (this.logs.length !== 0) {
                setTimeout(this.postLogs, 10000)
            }
        }
        catch (err) {
            console.error("Failed to send logs: " + err)
            if (this.logs.length !== 0 && this.logsSending.length !== 0) {
                // Retry in a while again
                setTimeout(this.postLogs, 0)
            }
        }
        finally {
            this.isSending = false
        }
    }
}