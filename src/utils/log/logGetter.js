import axios from 'axios';
import { timeStamp } from '../../utils/utils'

var LRUCache = require('mnemonist/lru-cache');

export class LogGetter {
    constructor() {
        this.cache = new LRUCache(5000)
        this.total = 0
    }

    isCached = index => {
        //console.log(`Is row loaded: ${index}`)
        return this.cache.has(index)
    }

    getCached = index => {
        return this.cache.get(index)
    }

    setCached = (index, item) => {
        this.cache.set(index, item)
    }

    getTotal = () => {
        return this.total
    }

    getRemote = async (start, count) => {
        const url = `/api/GetLog?start=${start}&count=${count}`
        console.log(`Getting ${url}...`)
        for (let i = start; i < start + count; i += 1) {
            this.setCached(i, null)
        }
        var st = timeStamp();
        try {
            const data = await axios.get(url)
            const logs = data.data
            this.total = logs.total
            console.log(`Got logs;`, [logs.start, logs.items.length, logs.total])

            for (let i = 0; i < logs.items.length; i += 1) {
                const item = logs.items[i]
                this.setCached(item.index, item)
            }
            this.total = logs.total
            return data.data
        }
        catch (err) {
            console.error("Failed to update:", url, err)
            throw err
        }
        finally {
            st.log('getRemote done')
        }
    }
}