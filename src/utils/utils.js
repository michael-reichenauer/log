

const humanizeDuration = require("humanize-duration");

export const delay = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const durationString = duration => {
    return humanizeDuration(duration)
}
class TimeStamp {
    constructor() {
        this.start = new Date().getTime()
    }

    log = (arg) => {
        if (arg === undefined) {
            console.log(`time: ${durationString(this.time())}`)
            return
        }
        console.log(arg, `(${durationString(this.time())})`)
    }

    time = () => {
        return new Date().getTime() - this.start
    }
}

export const timeStamp = () => {
    return new TimeStamp()
}
