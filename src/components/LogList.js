import React, { useState } from 'react'
//import { useLogs } from '../utils/log';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { VirtualizedTable } from "./VirtualizedTable";
import { HashTable } from "../utils/hashTable"
import makeStyles from "@material-ui/core/styles/makeStyles";

const batchSize = 100
const maxBatches = 10
let batches = []
const fontSize = 12
const rowHeight = 15
const STATUS_LOADING = 1;
const totalRows = 2000000


const sample = [
    ['07:59:59.099', 'Frozen yoghurt'],
    ['01:59:59.099', 'Ice cream sandwich'],
    ['12:00:12.111', 'Eclair'],
    ['14:59:15.332', 'Cupcake'],
    ['03:59:09.543', 'Gingerbread'],
];

function createData(line, time, msg) {
    return { line, time, msg };
}


export default function LogList({ count }) {
    const classes = useTableStyles();
    const [items, setItems] = useState(new HashTable())
    const [rowsCount] = useState(totalRows)

    const isRowLoaded = ({ index }) => {
        //console.log(`Is row loaded: ${index}`)
        return items.hasItem(index)
    }

    const rowGetter = ({ index }) => {
        const it = items.getItem(index)
        if (it === undefined || it === STATUS_LOADING) {
            return { line: (<Typography className={classes.lineUnloaded}>{index}</Typography>) }
        }
        return {
            line: (<Typography noWrap className={classes.line}>{index}</Typography>),
            time: (<Typography noWrap className={classes.time}>{it.time}</Typography>),
            msg: (<Typography noWrap className={classes.time}>{it.msg}</Typography>),
        }
    }

    const loadMore = ({ startIndex, stopIndex }) => {
        console.log(`load ${startIndex},${stopIndex} ...`)
        const it = items
        for (let i = startIndex; i <= stopIndex; i += 1) {
            it.setItem(i, STATUS_LOADING)
        }
        setItems(it)

        return delay(50).then(() => {
            const it = items

            for (let i = startIndex; i <= stopIndex; i += 1) {
                const randomSelection = sample[i % sample.length];
                it.setItem(i, createData(i, ...randomSelection))
            }
            batches.push({ startIndex: startIndex, stopIndex: stopIndex })
            console.log(`loaded ${startIndex},${stopIndex}`)

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
        })
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
                        width: 65,
                        label: 'Line',
                        dataKey: 'line',
                    },
                    {
                        width: 98,
                        label: 'Time',
                        dataKey: 'time',
                    },
                    {
                        width: 120,
                        label: 'Message',
                        dataKey: 'msg',
                    }
                ]}
            />
        </Paper>

    );
}

const delay = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const useTableStyles = makeStyles((theme) => ({
    line: {
        fontSize: fontSize,
        fontFamily: "Monospace"
    },
    lineUnloaded: {
        fontFamily: "Monospace",
        fontSize: fontSize,
        color: "gray"
    },
    time: {
        fontSize: fontSize,
        fontFamily: "Monospace"
    },
    msg: {
        fontSize: fontSize,
    },
}));

// function dateToLocalISO(dateText) {
//     const date = new Date(dateText)
//     const off = date.getTimezoneOffset()
//     return (new Date(date.getTime() - off * 60 * 1000).toISOString().substr(0, 19))
// }