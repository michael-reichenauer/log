import React, { useState } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Tooltip from '@material-ui/core/Tooltip';
import makeStyles from "@material-ui/core/styles/makeStyles";
import { logger } from '../common/log/log'
import { useAppVersion } from '../common/appVersion'
import { isLocalDev } from '../common/info'
import { useUser } from "../common/auth";

const useMenuStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
}));


export function ApplicationMenu() {
    const classes = useMenuStyles();
    const version = useAppVersion();
    const [, setUser] = useUser()

    const [menu, setMenu] = useState(null);

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

    return (
        <><Tooltip title="Customize and control">
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
                <MenuItem disabled={true} >Local: '{version.localSha.substring(0, 6)}'</MenuItem>
                <MenuItem disabled={true} >  {version.localBuildTime}</MenuItem>
                <MenuItem disabled={true} >Remote: '{version.remoteSha.substring(0, 6)}'</MenuItem>
                <MenuItem disabled={true} >  {version.remoteBuildTime}</MenuItem>
            </Menu>
        </>
    )
}