import React, { useState } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import makeStyles from "@material-ui/core/styles/makeStyles";


const useMenuStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
}));


export function ApplicationMenu() {
    const classes = useMenuStyles();

    const [menu, setMenu] = useState(null);

    const handleLogout = () => {
        setMenu(null);
        // rpc.close()
        // dispatch(SetConnected(false))
    };

    return (
        <>
            <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                onClick={e => setMenu(e.currentTarget)}
            >
                <MenuIcon />
            </IconButton>
            <Menu
                anchorEl={menu}
                keepMounted
                open={Boolean(menu)}
                onClose={() => setMenu(null)}
            >
                <MenuItem disabled={false} onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    )
}