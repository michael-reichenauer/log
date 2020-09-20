import React from 'react'
import { Link, List } from '@material-ui/core'

export default function Login() {
    return (
        <List component="nav">
            <Link href="/.auth/login/github">
                Login using GitHub
            </Link>
        </List>
    )
}
