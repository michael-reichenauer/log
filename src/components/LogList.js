import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography';
import { VirtualizedTable } from "./VirtualizedTable";
import { logger } from "../utils/log/log"
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useGlobal } from 'reactn'

const batchSize = 500

const fontSize = 10
const rowHeight = 11


export default function LogList({ count, isActive }) {
    const [state, setState] = useLogData(isActive)
    const classes = useTableStyles(isActive);
    const [isAutoScroll] = useGlobal('isAutoScroll')
    // const [items, setItems] = useState(new HashTable())
    // const [rowsCount, setCount] = useState(1000)
    const { total } = state

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
            label: (<Typography className={classes.columns}>Message {total === 0 ? '' : `(${total - 1})`}</Typography>),
            dataKey: 'msg',
        }
    ]

    const isRowLoaded = ({ index }) => {
        //console.log(`Is row loaded: ${index}`)
        return logger.isCached(index)
    }

    const rowGetter = ({ index }) => {
        const item = logger.getCached(index)
        if (item === undefined || item === null) {
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

        // Trigger rendering 'loading items'
        setState(s => { return { total: s.total } })

        try {
            const logs = await logger.getRemote(startIndex, stopIndex - startIndex + 1);
            console.log(`loaded ${startIndex},${stopIndex}`)
            setState(s => { return { total: logs.total } })
        }
        catch (err) {
            // Error 
            console.warn(`failed to load ${startIndex},${stopIndex}`)
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
                isAutoScroll={isAutoScroll}
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
    const [state, setState] = useState({ total: 0 })

    useEffect(() => {
        const updateLogData = async () => {
            console.log("Updating ...")
            try {
                const logs = await logger.getRemote(0, 0)
                if (!isUpdateActive) {
                    return
                }

                setState(s => { return { total: logs.total } })
                timerId = setTimeout(updateLogData, 5 * 1000)
            }
            catch (err) {
                console.error("Failed to update:", err)
                if (!isUpdateActive) {
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