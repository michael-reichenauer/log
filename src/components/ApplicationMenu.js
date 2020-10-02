import React, { useState } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Tooltip from '@material-ui/core/Tooltip';
import makeStyles from "@material-ui/core/styles/makeStyles";
import { logger } from '../common/log/log'
import { isLocalDev } from '../common/info'
import { useUser } from "../common/auth";
import { Popover } from "@material-ui/core";
import About from "./About";

const useMenuStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
}));


export function ApplicationMenu() {
    const classes = useMenuStyles();
    const [, setUser] = useUser()

    const [menu, setMenu] = useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleLogout = () => {
        setMenu(null);
        if (isLocalDev) {
            setUser(undefined)
            return
        }
        window.location.assign("/.auth/logout")
    };

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
                <MenuItem disabled={false} onClick={handleLogout}>Logout</MenuItem>
                <MenuItem disabled={false} onClick={handleReload}>Reload</MenuItem>
                <MenuItem disabled={false} onClick={handleAbout}>About</MenuItem>
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