import React from 'react'
import { useLogs } from '../utils/log';
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

export const rowHeight = 0
const fontSize = 13

export default function LogList({ count }) {
    const classes = useTableStyles();
    const { response, error } = useLogs(count);
    if (error) {
        return <div>Error: {"" + error}</div>
    }

    return (
        <TableContainer className={classes.container}>
            <Table className={classes.table} size="small" padding="none">
                <TableBody>
                    {response && response.logs && response.logs.map((item, index) => (
                        <TableRow key={index} hover={true} className={classes.idColumn}>
                            <TableCell align={"left"} className={classes.idColumn}>
                                <Typography className={classes.idText}>{index}</Typography>
                            </TableCell>

                            <TableCell align={"left"} className={classes.timeColumn}>
                                <Typography className={classes.timeText}>{dateToLocalISO(item.time)}</Typography>
                            </TableCell>
                            <TableCell align={"left"} className={classes.msgColumn}>
                                <Typography className={classes.msgText}>{item.msg}xx</Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}


export const useTableStyles = makeStyles((theme) => ({
    table: {
        background: theme.palette.background
    },
    tableRow: {
        height: rowHeight,
    },
    idColumn: {
        width: 50,
        border: "none",
    },
    idText: {
        fontSize: fontSize,
    },
    timeColumn: {
        width: 140,
        border: "none",
    },
    timeText: {
        fontSize: fontSize,
    },
    msgColumn: {
        width: "auto",
        border: "none",
    },
    msgText: {
        fontSize: fontSize,
    },
}));

function dateToLocalISO(dateText) {
    const date = new Date(dateText)
    const off = date.getTimezoneOffset()
    return (new Date(date.getTime() - off * 60 * 1000).toISOString().substr(0, 19))
}