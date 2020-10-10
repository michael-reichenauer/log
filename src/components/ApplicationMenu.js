import React, { useState } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Tooltip from '@material-ui/core/Tooltip';
import makeStyles from "@material-ui/core/styles/makeStyles";
import log, { logger } from '../common/log/log'
import { isLocalDev } from '../common/info'
import { useUser } from "../common/auth";
import { Popover } from "@material-ui/core";
import About from "./About";
import { useGlobal } from "reactn";

const useMenuStyles = makeStyles((theme) => ({
    menuButton: {
        marginLeft: theme.spacing(2),
    },
}));


export function ApplicationMenu() {
    const classes = useMenuStyles();
    const [user, setUser] = useUser()
    const [count, setCount] = useGlobal('count')

    const [menu, setMenu] = useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleLogout = async () => {
        setMenu(null);
        log.info(`Logging out ${user.userId} from ${user.identityProvider}`)
        await logger.flush()

        if (isLocalDev) {
            setUser(undefined)
            return
        }
        window.location.assign("/.auth/logout")
    };

    const handleAddRandomLogs = () => {
        setMenu(null);
        for (let i = 0; i < 10; i += 1) {
            log.info(sample[i % sample.length])
        }
        logger.flush().then(() => setCount(count + 1))
    }

    const handleReload = () => {
        setMenu(null);
        logger.flush().then(() => window.location.reload(true))
    };



    const handleAbout = (event) => {
        setMenu(null);
        setAnchorEl(event.currentTarget);
    };

    const handleCloseAbout = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <>
            <Tooltip title="Customize and control">
                <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    onClick={e => setMenu(e.currentTarget)}
                >
                    <MenuIcon />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={menu}
                keepMounted
                open={Boolean(menu)}
                onClose={() => setMenu(null)}
                PaperProps={{
                    style: {
                        backgroundColor: "#333333"
                    },
                }}
            >
                <MenuItem disabled={!user} onClick={handleLogout}>Logout</MenuItem>
                <MenuItem onClick={handleAddRandomLogs}>Add some random log rows</MenuItem>
                <MenuItem onClick={handleReload}>Reload</MenuItem>
                <MenuItem onClick={handleAbout}>About</MenuItem>
            </Menu>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleCloseAbout}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 200, left: 400 }}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
            >
                <About />
            </Popover>
        </>
    )
}


const sample = [
    'Frozen yoghurt',
    'Eclair',
    'Ice cream sandwich',
    'Cupcake',
    'Gingerbread',
];
