import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from '@material-ui/core/IconButton';
import InputBase from "@material-ui/core/InputBase";
import Tooltip from '@material-ui/core/Tooltip';
import AppBar from "@material-ui/core/AppBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { fade } from "@material-ui/core";
import { ApplicationMenu } from "./ApplicationMenu"
import GetAppIcon from '@material-ui/icons/GetApp';
import { clearLogs, flushLogs } from '../utils/log'
import { localSha, localBuildTime } from '../utils/remoteVersion'
import ErrorIcon from '@material-ui/icons/Error';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { useSnackbar } from "notistack";

export const ApplicationBar = ({ isActive }) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const classes = useAppBarStyles();
    const clearList = async () => {
        await clearLogs()
        autoRenew()
    }
    const autoRenew = () => {
        flushLogs().then()
    }
    const handleError = () => {
        enqueueSnackbar(`Some error`, { variant: "error", onClick: () => closeSnackbar() })
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Tooltip title={`log - ${localSha.substring(0, 6)} ${localBuildTime}`} placement="bottom-start" >
                    <Typography className={classes.title} variant="h6" noWrap>log</Typography>
                </Tooltip>
                <Tooltip title="Error"><IconButton onClick={handleError}><ErrorIcon /></IconButton></Tooltip>
                <Tooltip title="Clear list"><IconButton onClick={clearList}><CheckBoxOutlineBlankIcon /></IconButton></Tooltip>
                <Tooltip title="Auto renew"><IconButton onClick={autoRenew}><GetAppIcon /></IconButton></Tooltip>
                <ApplicationMenu />
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                    </div>
                    <InputBase
                        placeholder="Search…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </div>

            </Toolbar>
        </AppBar >
    )
}


const useAppBarStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));