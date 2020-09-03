import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography';
import { VirtualizedTable } from "./VirtualizedTable";
import { HashTable } from "../utils/hashTable"
import makeStyles from "@material-ui/core/styles/makeStyles";
import axios from 'axios';

const batchSize = 500
const maxBatches = 10
let batches = []

const fontSize = 10
const rowHeight = 11
const STATUS_LOADING = 1;
const STATUS_ERROR = 2;



export default function LogList({ count, isActive }) {
    const [state, setState] = useLogData(isActive)
    const classes = useTableStyles(isActive);
    // const [items, setItems] = useState(new HashTable())
    // const [rowsCount, setCount] = useState(1000)
    const { total, cached } = state

    const columns = [
        {
            width: 50,
            label: (<Typography className={classes.columns}>Line</Typography>),
            dataKey: 'line',
        },
        {
            width: 75,
            label: (<Typography className={classes.columns}>Time</Typography>),
            dataKey: 'time',
        },
        {
            width: -1,
            label: (<Typography className={classes.columns}>Message ({total})</Typography>),
            dataKey: 'msg',
        }
    ]

    const isRowLoaded = ({ index }) => {
        //console.log(`Is row loaded: ${index}`)
        return cached.hasItem(index)
    }

    const rowGetter = ({ index }) => {
        const item = cached.getItem(index)
        if (item === undefined || item === STATUS_LOADING || item === STATUS_ERROR) {
            return { line: (<Typography className={classes.lineInvalid}>{index}</Typography>) }
        }

        const time = dateToLocalISO(new Date(item.time).toISOString())
        return {
            line: (<Typography noWrap className={classes.line}>{index}</Typography>),
            time: (<Typography noWrap className={classes.time}>{time}</Typography>),
            msg: (<Typography noWrap className={classes.time}>{item.msg}</Typography>),
        }
    }

    const loadMore = async ({ startIndex, stopIndex }) => {
        console.log(`load ${startIndex},${stopIndex} ...`)
        for (let i = startIndex; i <= stopIndex; i += 1) {
            cached.setItem(i, STATUS_LOADING)
        }
        setState(s => { return { total: s.total, cached: cached } })
        const url = `/api/GetLog?start=${startIndex}&count=${stopIndex - startIndex + 1}`
        console.log(`fetch "${url}"`)
        const startSend = Date.now()
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error: Status Code: ' + response.status);
            }
            const json = await response.json();

            for (let i = startIndex; i <= stopIndex; i += 1) {
                if (i < json.start || i >= json.start + json.count) {
                    continue
                }
                const item = json.lines[i - json.start]
                cached.setItem(i, item)
            }

            setState(s => { return { total: json.total, cached: cached } })

            console.log(`loaded ${startIndex},${stopIndex}`)
        }
        catch (err) {
            for (let i = startIndex; i <= stopIndex; i += 1) {
                cached.setItem(i, STATUS_ERROR)
            }
            setState(s => { return { total: s.total, cached: cached } })

        }
        finally {
            console.log(`fetch: time: ${Date.now() - startSend} ms for ${url}`)
            batches.push({ startIndex: startIndex, stopIndex: stopIndex })
            // Clean old loaded batches if needed
            if (batches.length > maxBatches) {
                for (let i = 0; i < maxBatches / 2; i += 1) {
                    const b = batches.shift()
                    console.log(`Unloading ${b.startIndex}, ${b.stopIndex}`)
                    for (let i = b.startIndex; i <= b.stopIndex; i += 1) {
                        cached.removeItem(i)
                    }
                }
                setState(s => { return { total: s.total, cached: cached } })
            }
        }
    }


    return (
        <div style={{ width: "99%", height: "85vh" }} >
            <VirtualizedTable
                rowCount={total}
                rowGetter={rowGetter}
                rowHeight={rowHeight}
                isRowLoaded={isRowLoaded}
                loadMoreRows={loadMore}
                minimumBatchSize={batchSize}
                threshold={2 * batchSize}
                columns={columns}
            />
        </div>
    );
}

// const delay = (milliseconds) => {
//     return new Promise(resolve => setTimeout(resolve, milliseconds))
// }

const useTableStyles = makeStyles((theme) => ({
    columns: {
        fontSize: fontSize + 2,
        fontWeight: "bold",
        color: isActive => isActive ? null : "gray"
    },
    line: {
        fontSize: fontSize,
        fontFamily: "Monospace",
        color: isActive => isActive ? null : "gray"
    },
    lineInvalid: {
        fontSize: fontSize,
        fontFamily: "Monospace",
        color: "gray"
    },
    time: {
        fontSize: fontSize,
        fontFamily: "Monospace",
        color: isActive => isActive ? null : "gray"
    },
    msg: {
        fontSize: fontSize,
        fontFamily: "Monospace",
        color: isActive => isActive ? null : "gray"
    },
}));

function dateToLocalISO(dateText) {
    const date = new Date(dateText)
    const off = date.getTimezoneOffset()
    return (new Date(date.getTime() - off * 60 * 1000).toISOString().substr(11, 12))
}

let timerId = null
let isUpdateActive = false

function useLogData(isActive) {
    const [state, setState] = useState({ total: 0, cached: new HashTable() })

    useEffect(() => {

        const updateLogData = async () => {
            const start = 0
            const count = 0
            const url = `/api/GetLog?start=${start}&count=${count}`
            console.log("Updating ...", url)
            try {
                const data = await axios.get(url)
                if (!isUpdateActive) {
                    console.log("Update no longer active")
                    return
                }
                console.log("Update: ", data.data)
                setState(s => { return { total: data.data.total, cached: s.cached } })

                console.log("Reschedule update ...")
                timerId = setTimeout(updateLogData, 5 * 1000)
            }
            catch (err) {
                console.error("Failed to update:", url, err)
                if (!isUpdateActive) {
                    console.log("Update no longer active")
                    return
                }
                timerId = setTimeout(updateLogData, 30 * 1000)
            }
        }


        if (isActive) {
            console.log("Start updating")
            isUpdateActive = true
            updateLogData()
        } else {
            console.log("Stop updating")
            isUpdateActive = false
            clearTimeout(timerId)
        }

        return () => {
            isUpdateActive = false
            clearTimeout(timerId)
        }
    }, [isActive])

    return [state, setState]
}