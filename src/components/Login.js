import React from 'react'
import { Link, List, Typography } from '@material-ui/core'

export default function Login() {
    return (
        <>
            <Typography variant="h6" >Login using:</Typography>

            <List component="nav" style={{ padding: 10 }}>
                <Typography >
                    <Link href="/.auth/login/github" color="inherit">
                        - GitHub
                    </Link>
                </Typography>
            </List>
        </>
    )
}
