import React, { useEffect } from 'react'
import Typography from '@material-ui/core/Typography';
import { VirtualizedTable } from "./VirtualizedTable";
import { logger } from "../common/log/log"
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useGlobal, setGlobal, getGlobal } from 'reactn'
import { useSnackbar } from "notistack";
import { useActivity } from '../common/activity';
import { useIsOnline, networkError } from '../common/online';
const normalRefreshTimeout = 10 * 1000
const fastRefreshTimeout = 500
const refreshTimeout = 30 * 1000
const batchSize = 300
const fontSize = 10
const fontWidth = 5.8
const columnMargin = 8
const rowHeight = 11

setGlobal({ ...getGlobal(), count: 0, total: 0, logId: '', isAutoScroll: true, isTop: false })


export default function LogList() {
    const [isActive] = useActivity()
    const [count] = useGlobal('count')
    const [isTop, setIsTop] = useGlobal('isTop')
    const [total, setTotal] = useLogData(isActive, count)
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
            networkError(err)
        }
    }

    const onScroll = (s) => {
        // console.log('onScroll', s, s.scrollHeight - (s.scrollTop + s.clientHeight))
        if (s.clientHeight < 0) {
            return
        }
        if (s.scrollTop === 0) {
            console.log('Scroll to top')
            if (!isTop) {
                setIsTop(true)
            }
        }
        else {
            console.log('Not scroll top')
            if (isTop) {
                setIsTop(false)
            }
        }

        if ((s.scrollHeight - (s.scrollTop + s.clientHeight)) < 1) {
            console.log('Scroll to Bottom')
            if (!isAutoScroll) {
                setIsAutoScroll(true)
            }
        } else {
            console.log('Not scroll bottom')
            if (isAutoScroll) {
                setIsAutoScroll(false)
            }
        }
    }

    const scrollToIndex = isAutoScroll ? total - 1 : isTop ? 0 : undefined

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
                scrollToIndex={scrollToIndex}
                onScroll={onScroll}
                refreshId={logId}
            />
        </div>
    );
}


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


function useLogData(isActive, count) {
    const [total, setTotal] = useGlobal('total')
    const [isOnline] = useIsOnline()
    const [, setLogId] = useGlobal('logId')
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        let logTime
        let timerId
        let snackbar
        const handleError = () => {
            snackbar = enqueueSnackbar("Failed to access server to get log",
                {
                    variant: "error",
                    onClick: () => closeSnackbar(),
                    autoHideDuration: null
                })
        }

        const updateLogData = async () => {
            console.log("Updating ...")
            try {
                if (!isActive) {
                    return
                }
                const logs = await logger.getRemote(0, 0)

                setLogId(logs.id)
                setTotal(logs.total)
                let refreshTimeout = normalRefreshTimeout
                if (logTime !== logs.lastTime) {
                    // Log data has changed get new data a little faster
                    refreshTimeout = fastRefreshTimeout
                }
                logTime = logs.lastTime
                timerId = setTimeout(updateLogData, refreshTimeout)
                closeSnackbar(snackbar)
            }
            catch (err) {
                console.error("Failed to update:", err)
                handleError()
                networkError(err)
                timerId = setTimeout(updateLogData, refreshTimeout)
            }
        }

        if (!isOnline) {
            clearTimeout(timerId)
            return
        }

        if (isActive) {
            console.log("Start updating")
            updateLogData()
        } else {
            console.log("Stop updating")
            clearTimeout(timerId)
        }

        return () => {
            clearTimeout(timerId)
            closeSnackbar(snackbar)
        }
    }, [isActive, isOnline, setTotal, setLogId, count, enqueueSnackbar, closeSnackbar])

    return [total, setTotal]
}