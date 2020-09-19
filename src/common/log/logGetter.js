import axios from 'axios';
// import { timeStamp } from '../../utils/utils'

var LRUCache = require('mnemonist/lru-cache');

export class LogGetter {
    _cache = new LRUCache(5000)
    _logId = ''
    _total = 0


    isCached = index => {
        //console.log(`Is row loaded: ${index}`)
        return this._cache.has(index)
    }

    getCached = index => {
        return this._cache.get(index)
    }

    getTotal = () => {
        return this._total
    }

    clear = () => {
        this._cache.clear()
        this._logId = ''
    }

    getRemote = async (start, count) => {
        const url = `/api/GetLog?start=${start}&count=${count}`
        // console.log(`Getting ${url}...`)
        if (count > 0) {
            for (let i = start; i < start + count; i += 1) {
                this._setCached(i, null)
            }
        }

        // var st = timeStamp();
        try {
            const data = await axios.get(url)
            const logs = data.data
            this._total = logs.total
            // console.log(`Got logs;`, [logs.start, logs.items.length, logs.total, logs.id])
            if (logs.id !== this._logId) {
                this._cache.clear()
                this._logId = logs.id
            }

            for (let i = 0; i < logs.items.length; i += 1) {
                const item = logs.items[i]
                this._setCached(item.index, item)
            }
            this._total = logs.total
            return data.data
        }
        catch (err) {
            console.error("Failed to update:", url, err)
            this.clear()
            throw err
        }
        finally {
            //st.log('getRemote done')
        }
    }


    _setCached = (index, item) => {
        this._cache.set(index, item)
    }
}