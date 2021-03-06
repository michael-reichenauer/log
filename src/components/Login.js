import React from 'react'
import { List, Typography } from '@material-ui/core'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useUser } from '../common/auth'
import { isLocalDev } from '../common/info'

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

export default function Login() {
    const [, setUser] = useUser()

    const loginLocal = name => {
        setUser({
            "identityProvider": "local",
            "userId": name,
            "userDetails": name,
            "userRoles": ["anonymous", "authenticated"]
        })
    }

    return (
        <>
            <Typography variant="h6" >Login using:</Typography>

            <List component="nav" style={{ padding: 10 }}>
                {!isLocalDev &&
                    <ListItemLink href="/.auth/login/github">
                        <ListItemText primary="GitHub" />
                    </ListItemLink>
                }
                {!isLocalDev &&
                    <ListItemLink href="/.auth/login/google">
                        <ListItemText primary="Google" />
                    </ListItemLink>
                }
                {!isLocalDev &&
                    <ListItemLink href="/.auth/login/aad">
                        <ListItemText primary="Microsoft" />
                    </ListItemLink>
                }
                {isLocalDev &&
                    <ListItemLink onClick={() => loginLocal('local1')}>
                        <ListItemText primary="Local1" />
                    </ListItemLink>
                }
            </List>
        </>
    )
}
