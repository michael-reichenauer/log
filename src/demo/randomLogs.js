import { logInfo } from "../utils/log"

const logCount = 20

export const logRandom = () => {
    const st = Date.now()
    logInfo(`Logging ${logCount} messages >>>>>>>>>`);
    for (let i = 0; i < 20; i++) {
        logInfo(`Some message at ${i} ${Date.now()}`);
    }
    logInfo(`Logged ${logCount} messages in ${Date.now() - st} ms --------------------`);
}