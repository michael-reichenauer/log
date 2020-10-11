import React from "react";
import { Typography, fade, AppBar, Toolbar, IconButton, Tooltip } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { ApplicationMenu } from "./ApplicationMenu"
import PublishIcon from '@material-ui/icons/Publish';
import GetAppIcon from '@material-ui/icons/GetApp';

// import SearchIcon from '@material-ui/icons/Search';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useGlobal } from 'reactn'
import RefreshIcon from '@material-ui/icons/Refresh';
import { useUser } from "../common/auth";
import log from "../common/log/log";

export default function ApplicationBar({ commands }) {
    const [isTop, setIsTop] = useGlobal('isTop')
    const [isAutoScroll, setIsAutoScroll] = useGlobal('isAutoScroll')
    const [user] = useUser()
    const classes = useAppBarStyles();

    const handleScroll = (_, newScroll) => {
        if (!isTop && newScroll.includes('isTop')) {
            log.info(`Scroll to top`)
            setIsTop(true)
            setIsAutoScroll(false)
            return
        }

        log.info(`Scroll to ${newScroll}`)
        setIsTop(newScroll.includes('isTop'))
        setIsAutoScroll(newScroll.includes('isAutoScroll'))
    }


    return (
        <AppBar position="static" style={{ height: "55px" }}>
            <Toolbar>
                <Typography className={classes.title} variant="h6" noWrap>log</Typography>
                {
                    user && <>
                        <Tooltip title="Refresh list" ><IconButton onClick={commands.refresh}><RefreshIcon /></IconButton></Tooltip>
                        <Tooltip title="Scroll list">
                            <ToggleButtonGroup
                                size="small"
                                value={isAutoScroll && isTop ? ['isAutoScroll', 'isTop'] : isAutoScroll ? ['isAutoScroll'] : isTop ? ['isTop'] : []}
                                onChange={handleScroll}
                            >
                                <ToggleButton value="isTop" ><PublishIcon /></ToggleButton>
                                <ToggleButton value="isAutoScroll" ><GetAppIcon /></ToggleButton>

                            </ToggleButtonGroup>
                        </Tooltip>

                        {/* <div className={classes.search}>
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
                        </div> */}
                    </>
                }

                <ApplicationMenu />

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
            width: '8ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));