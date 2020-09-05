

export const delay = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class TimeStamp {
    constructor() {
        this.start = new Date().getTime()
    }

    log = (arg) => {
        if (arg === undefined) {
            console.log(`time: ${this.time()} ms`)
            return
        }
        console.log(arg, `(${this.time()} ms)`)
    }

    time = () => {
        return new Date().getTime() - this.start
    }
}

export const timeStamp = () => {
    return new TimeStamp()
}
