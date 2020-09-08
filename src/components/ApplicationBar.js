import React from "react";
import { Typography, fade, AppBar, Toolbar, IconButton, InputBase, Tooltip } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { ApplicationMenu } from "./ApplicationMenu"
import log, { logger } from '../utils/log/log'

//import ErrorIcon from '@material-ui/icons/Error';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import GetAppIcon from '@material-ui/icons/GetApp';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import SearchIcon from '@material-ui/icons/Search';
//import { useSnackbar } from "notistack";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useGlobal } from 'reactn'
import { useAppVersion } from '../utils/remoteVersion'

export const ApplicationBar = ({ isActive }) => {
    //const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [isAutoScroll, setIsAutoScroll] = useGlobal('isAutoScroll')
    const [total, setTotal] = useGlobal('total')
    const version = useAppVersion()
    const classes = useAppBarStyles();
    const clearList = async () => {
        await logger.clear()
        logger.flush()
    }
    const handleAutoScroll = () => {
        console.log('handleAutoScroll')
        setTotal(total)
        setIsAutoScroll(!isAutoScroll)
        logger.flush()

    }
    // const handleError = () => {
    //     enqueueSnackbar(`Some error`, { variant: "error", onClick: () => closeSnackbar() })
    // }
    const handleAddRandomLogs = () => {
        for (let i = 0; i < 1000; i += 1) {
            log.info(sample[i % sample.length])
        }
    }


    return (
        <AppBar position="static">
            <Toolbar>
                <Typography className={classes.title} variant="h6" noWrap>log</Typography>
                <Typography className={classes.title} variant="code" noWrap>{version.localSha} {version.localBuildTime}</Typography>
                <Tooltip title="Auto scroll">
                    <ToggleButtonGroup
                        size="small"
                        value={isAutoScroll ? 'isAutoScroll' : ''}
                        exclusive
                        onChange={handleAutoScroll}
                    >
                        <ToggleButton value="isAutoScroll" ><GetAppIcon /></ToggleButton>
                    </ToggleButtonGroup>
                </Tooltip>
                <Tooltip title="Add random logs"><IconButton onClick={handleAddRandomLogs}><PlaylistAddIcon /></IconButton></Tooltip>
                <Tooltip title="Clear list"><IconButton onClick={clearList}><CheckBoxOutlineBlankIcon /></IconButton></Tooltip>
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


const sample = [
    ['Frozen yoghurt'],
    ['Eclair'],
    ['Ice cream sandwich'],
    ['Cupcake'],
    ['Gingerbread'],
];


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
            width: '8ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));