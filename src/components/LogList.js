import React, { useEffect } from 'react'
import Typography from '@material-ui/core/Typography';
import { VirtualizedTable } from "./VirtualizedTable";
import { logger } from "../utils/log/log"
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useGlobal, setGlobal, getGlobal } from 'reactn'

const batchSize = 300
const fontSize = 10
const fontWidth = 5.8
const columnMargin = 8
const rowHeight = 11

setGlobal({ ...getGlobal(), total: 0, logId: '', isAutoScroll: true, })



export default function LogList({ count, isActive }) {
    const [total, setTotal] = useLogData(isActive)
    const classes = useTableStyles(isActive);
    const [isAutoScroll, setIsAutoScroll] = useGlobal('isAutoScroll')
    const [logId, setLogId] = useGlobal('logId')
    const lineColumnWidth = total.toString().length * fontWidth + columnMargin
    const timeColumnWidth = 12 * fontWidth + columnMargin

    const columns = [
        {
            dataKey: 'line',
            width: lineColumnWidth,
            label: (<Typography className={classes.columns}>Line</Typography>),
        },
        {
            dataKey: 'time',
            width: timeColumnWidth,
            label: (<Typography className={classes.columns}>Time</Typography>),
        },
        {
            dataKey: 'msg',
            width: -1,
            label: (<Typography className={classes.columns}>Message ({total})</Typography>),
        }
    ]

    const isRowLoaded = ({ index }) => {
        //console.log(`Is row loaded: ${index}`)
        return logger.isCached(index)
    }

    const rowGetter = ({ index }) => {
        const item = logger.getCached(index)
        if (item === undefined || item === null) {
            return { line: (<Typography className={classes.lineInvalid}>{index + 1}</Typography>) }
        }

        const time = dateToLocalISO(new Date(item.time).toISOString())
        return {
            line: (<Typography noWrap className={classes.line}>{index + 1}</Typography>),
            time: (<Typography noWrap className={classes.time}>{time}</Typography>),
            msg: (
                <>
                    <Typography noWrap className={classes.msg}>{item.msg}</Typography>
                    <Typography noWrap className={classes.properties}>{JSON.stringify(item.properties)}</Typography>
                </>
            ),
        }
    }

    const loadMore = async ({ startIndex, stopIndex }) => {
        console.log(`load ${startIndex},${stopIndex} ...`)

        // Trigger rendering 'loading items'
        setTotal(total)

        try {
            const logs = await logger.getRemote(startIndex, stopIndex - startIndex + 1);
            console.log(`loaded ${startIndex},${stopIndex}`)
            setLogId(logs.id)
            setTotal(logs.total)
        }
        catch (err) {
            // Error 
            console.warn(`failed to load ${startIndex},${stopIndex}`)
        }
    }

    const onScroll = (s) => {
        if (s.clientHeight < 0) {
            return
        }

        if ((s.scrollHeight - (s.scrollTop + s.clientHeight)) < 1) {
            console.log('Bottom')
            if (!isAutoScroll) {
                setIsAutoScroll(true)
            }

            return
        }
        if (isAutoScroll) {
            setIsAutoScroll(false)
        }

        // if (s.scrollTop === 0) {
        //     console.log('Top')
        // }
        //console.log('onScroll', s, s.scrollHeight - (s.scrollTop + s.clientHeight))

    }
    console.log(`isAutoScroll=${isAutoScroll}`)

    return (
        <div style={{ width: "calc(100% - 2px)", height: "calc(100vh - 70px)" }} >
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
                onScroll={onScroll}
                refreshId={logId}
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
    properties: {
        fontSize: fontSize,
        fontFamily: "Monospace",
        paddingLeft: 5,
        color: "gray"
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
    const [total, setTotal] = useGlobal('total')
    const [, setLogId] = useGlobal('logId')

    useEffect(() => {
        let logTime
        const updateLogData = async () => {
            console.log("Updating ...")
            try {
                const logs = await logger.getRemote(0, 0)
                if (!isUpdateActive) {
                    return
                }
                let updateTimeout = 5 * 1000
                setLogId(logs.id)
                setTotal(logs.total)
                if (logTime !== logs.lastTime) {
                    console.log(`Log time: differs !!!!!!!!`)
                    updateTimeout = 500
                }
                logTime = logs.lastTime
                timerId = setTimeout(updateLogData, updateTimeout)
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
    }, [isActive, setTotal, setLogId])

    return [total, setTotal]
}