import { Link, makeStyles, Paper, Popover, Typography } from '@material-ui/core'
import React from 'react'
import Highlight from 'react-highlight.js';

const fontSize = 10

const useStyles = makeStyles((theme) => ({
    msg: {
        cursor: 'pointer',
        fontSize: fontSize,
        fontFamily: "Monospace",
        color: isActive => isActive ? 'inherit' : "gray"
    },
}));


export default function LogItem({ isActive, index, item }) {
    const classes = useStyles(isActive);
    // <Typography noWrap className={classes.properties}>{JSON.stringify(item.properties)}</Typography>

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    return (
        <>
            <Link underline='none' className={classes.msg} onClick={handleClick}>{item.msg}</Link>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Popup index={index} item={item} />
            </Popover>
        </>
    )
}

function Popup({ index, item }) {
    const classes = useStyles();
    const time = dateToLocalISO(new Date(item.time).toISOString())
    const text = `${JSON.stringify(JSON.parse(item.properties), null, 2)}`

    return (
        <Paper style={{ padding: 5, backgroundColor: '#1e1e1e' }}>
            <Typography noWrap className={classes.msg}>{index} {time} {item.level}:</Typography>
            <Typography noWrap className={classes.msg}>{item.msg}</Typography>
            <Highlight language={'json'} style={{ fontSize: 10 }}>
                {text}
            </Highlight>
        </Paper>
    )
}

function dateToLocalISO(dateText) {
    const date = new Date(dateText)
    const off = date.getTimezoneOffset()
    return (new Date(date.getTime() - off * 60 * 1000).toISOString().substr(11, 12))
}

