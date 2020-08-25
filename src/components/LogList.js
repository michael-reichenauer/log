import React, { useState } from 'react'
//import { useLogs } from '../utils/log';
import Paper from '@material-ui/core/Paper';
import { VirtualizedTable } from "./VirtualizedTable";
import { HashTable } from "../utils/hashTable"


const sample = [
    ['Frozen yoghurt', 159, 6.0, 24, 4.0],
    ['Ice cream sandwich', 237, 9.0, 37, 4.3],
    ['Eclair', 262, 16.0, 24, 6.0],
    ['Cupcake', 305, 3.7, 67, 4.3],
    ['Gingerbread', 356, 16.0, 49, 3.9],
];

function createData(id, dessert, calories, fat, carbs, protein) {
    return { id, dessert, calories, fat, carbs, protein };
}


// for (let i = 0; i < 20000; i += 1) {
//     const randomSelection = sample[Math.floor(Math.random() * sample.length)];
//     rows.push(createData(i, ...randomSelection));
// }


export default function LogList({ count }) {
    const [items, setItems] = useState(new HashTable())
    const [rowsCount] = useState(20000)

    // const classes = useTableStyles();
    // const { response, error } = useLogs(count);
    // if (error) {
    //     return <div>Error: {"" + error}</div>
    // }

    const rowGetter = ({ index }) => {
        //console.log(`Get index: ${index}`)
        if (!items.hasItem(index)) {
            return {}
        }
        return items.getItem(index)
    }

    const loadMore = ({ startIndex, stopIndex }) => {
        console.log(`load ${startIndex},${stopIndex} ...`)
        return delay(50).then(() => {
            const it = items
            for (let i = startIndex; i <= stopIndex; i += 1) {
                const randomSelection = sample[Math.floor(Math.random() * sample.length)];
                it.setItem(i, createData(i, ...randomSelection))
            }
            setItems(it)
            console.log(`loaded ${startIndex},${stopIndex}`)
        })
    }

    const isRowLoaded = ({ index }) => {
        //console.log(`Is row loaded: ${index}`)
        return items.hasItem(index)
    }


    return (
        <Paper style={{ height: 200, width: '100%' }}>
            <VirtualizedTable
                rowCount={rowsCount}
                rowGetter={rowGetter}
                isRowLoaded={isRowLoaded}
                loadMoreRows={loadMore}
                minimumBatchSize={100}
                threshold={50}
                columns={[
                    {
                        width: 50,
                        label: 'Index',
                        dataKey: 'id',
                    },
                    {
                        width: 200,
                        label: 'Dessert',
                        dataKey: 'dessert',
                    },
                    {
                        width: 120,
                        label: 'Calories\u00A0(g)',
                        dataKey: 'calories',
                        numeric: true,
                    },
                    {
                        width: 120,
                        label: 'Fat\u00A0(g)',
                        dataKey: 'fat',
                        numeric: true,
                    },
                    {
                        width: 120,
                        label: 'Carbs\u00A0(g)',
                        dataKey: 'carbs',
                        numeric: true,
                    },
                    {
                        width: 200,
                        label: 'Protein\u00A0(g)',
                        dataKey: 'protein',
                    },
                ]}
            />
        </Paper>

    );
}

const delay = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// function dateToLocalISO(dateText) {
//     const date = new Date(dateText)
//     const off = date.getTimezoneOffset()
//     return (new Date(date.getTime() - off * 60 * 1000).toISOString().substr(0, 19))
// }