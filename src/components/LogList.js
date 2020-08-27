import React, { useState } from 'react'
//import { useLogs } from '../utils/log';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { VirtualizedTable } from "./VirtualizedTable";
import { HashTable } from "../utils/hashTable"
import makeStyles from "@material-ui/core/styles/makeStyles";

const batchSize = 500
const maxBatches = 10
let batches = []
const fontSize = 12
const rowHeight = 15
const STATUS_LOADING = 1;
const STATUS_ERROR = 2;

export default function LogList({ count, isActive }) {
    const classes = useTableStyles(isActive);
    const [items, setItems] = useState(new HashTable())
    const [rowsCount, setCount] = useState(1000)

    const isRowLoaded = ({ index }) => {
        //console.log(`Is row loaded: ${index}`)
        return items.hasItem(index)
    }

    const rowGetter = ({ index }) => {
        const it = items.getItem(index)
        if (it === undefined || it === STATUS_LOADING || it === STATUS_ERROR) {
            return { line: (<Typography className={classes.lineInvalid}>{index}</Typography>) }
        }

        const time = dateToLocalISO(new Date(it.time).toISOString())
        return {
            line: (<Typography noWrap className={classes.line}>{index}</Typography>),
            time: (<Typography noWrap className={classes.time}>{time}</Typography>),
            msg: (<Typography noWrap className={classes.time}>{it.msg}</Typography>),
        }
    }

    const loadMore = async ({ startIndex, stopIndex }) => {
        console.log(`load ${startIndex},${stopIndex} ...`)
        const it = items
        for (let i = startIndex; i <= stopIndex; i += 1) {
            it.setItem(i, STATUS_LOADING)
        }
        setItems(it)
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
                it.setItem(i, item)
            }
            setCount(json.total)

            console.log(`loaded ${startIndex},${stopIndex}`)
        }
        catch (err) {
            for (let i = startIndex; i <= stopIndex; i += 1) {
                it.setItem(i, STATUS_ERROR)
            }
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
                        it.removeItem(i)
                    }
                }
            }
            setItems(it)
        }
    }


    return (
        <Paper style={{ height: '85%', width: '100%' }}>
            <VirtualizedTable
                rowCount={rowsCount}
                rowGetter={rowGetter}
                rowHeight={rowHeight}
                isRowLoaded={isRowLoaded}
                loadMoreRows={loadMore}
                minimumBatchSize={batchSize}
                threshold={2 * batchSize}
                columns={[
                    {
                        width: 70,
                        label: 'Line',
                        dataKey: 'line',
                    },
                    {
                        width: 110,
                        label: 'Time',
                        dataKey: 'time',
                    },
                    {
                        width: 300,
                        label: `Message (${rowsCount})`,
                        dataKey: 'msg',
                    }
                ]}
            />
        </Paper>
    );
}

// const delay = (milliseconds) => {
//     return new Promise(resolve => setTimeout(resolve, milliseconds))
// }

const useTableStyles = makeStyles((theme) => ({
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