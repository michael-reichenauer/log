//import useFetch from './useFetch';
import { LogSender } from './logSender'
import { LogGetter } from './logGetter'

// Log class for to use to log messages
class Log {
    constructor(logSender) {
        this.logSender = logSender
    }

    info = msg => { this.logSender.addMsg('info', msg) }
}

// Logger class to access less common log functionality
class Logger {
    constructor(logSender, logGetter) {
        this.logSender = logSender
        this.logGetter = logGetter
    }

    clear = async () => this.logSender.clear()
    flush = async () => this.logSender.flush()
}



const logSender = new LogSender()
const logGetter = new LogGetter()
export default new Log(logSender)
export const logger = new Logger(logSender, logGetter)

