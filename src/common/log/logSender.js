import { delay } from '../../utils/utils'
import { getLocalInfo } from '../info'


// LogSender private class to send log messages to server
export class LogSender {
    _logs = []
    _logsSending = []
    _isSending = false
    _sendPromise = new Promise((resolve) => { resolve() })
    _defaultProperties = getLocalInfo()


    addMsg = (level, msg, properties) => {
        const prop = [this._defaultProperties]
        prop.push(...properties)

        const logMsg = { level: level, time: new Date(), msg: msg, properties: prop }
        this._logs.push(logMsg)
        console.log(`log: ${JSON.stringify(logMsg)}`)
        this.postLogs()
    }

    clear = async () => {
        try {
            console.log('clearLogs: clearing ...')
            this._logs = []
            this._logsSending = []
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
        await this._sendPromise
        this._sendPromise = this.sendLogs(false)

        await this._sendPromise
    }

    postLogs = () => {
        if (this._isSending) {
            return
        }
        if (this._logs.length === 0 && this._logsSending.length === 0) {
            return
        }
        this._sendPromise = this.sendLogs(true)
    }

    sendLogs = async (isDelayed = true) => {
        if (this._isSending) {
            return
        }
        try {
            this._isSending = true

            // Allow a few more log rows to be collected before sending
            if (isDelayed) {
                await delay(100)
            }

            // Copy logs to send for this batch
            this._logsSending.push(...this._logs)
            this._logs = []
            if (this._logsSending.length === 0) {
                return
            }
            const body = JSON.stringify({ logs: this._logsSending })
            // console.log(`Sending logs ${this._logsSending.length}...`);
            //const startSend = Date.now()
            const response = await fetch(`/api/AddLogs`, { method: 'post', body: body })

            if (!response.ok) {
                throw new Error('Error: Status Code: ' + response.status);
            }

            // console.log(`Sent ${this._logsSending.length} logs in ${Date.now() - startSend} ms`);

            // Sent logs, retry again soon if more logs are to be sent
            this._logsSending = []
            if (this._logs.length !== 0) {
                setTimeout(this.postLogs, 10000)
            }
        }
        catch (err) {
            console.error("Failed to send logs: " + err)
            if (this._logs.length !== 0 && this._logsSending.length !== 0) {
                // Retry in a while again
                setTimeout(this.postLogs, 0)
            }
        }
        finally {
            this._isSending = false
        }
    }
}