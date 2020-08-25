import React from 'react'
//import { useLogs } from '../utils/log';
import Paper from '@material-ui/core/Paper';
import { VirtualizedTable } from "./VirtualizedTable";


export const rowHeight = 0
//const fontSize = 13

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

const rows = [];

for (let i = 0; i < 20000; i += 1) {
    const randomSelection = sample[Math.floor(Math.random() * sample.length)];
    rows.push(createData(i, ...randomSelection));
}


export default function LogList({ count }) {
    // const classes = useTableStyles();
    // const { response, error } = useLogs(count);
    // if (error) {
    //     return <div>Error: {"" + error}</div>
    // }

    return (

        <Paper style={{ height: '88vh', width: '100%' }}>
            <VirtualizedTable
                rowCount={rows.length}
                rowGetter={({ index }) => rows[index]}
                columns={[
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
                        label: 'Protein\u00A0(g)',
                        dataKey: 'protein',
                    },
                ]}
            />
        </Paper>

    );
}



// function dateToLocalISO(dateText) {
//     const date = new Date(dateText)
//     const off = date.getTimezoneOffset()
//     return (new Date(date.getTime() - off * 60 * 1000).toISOString().substr(0, 19))
// }