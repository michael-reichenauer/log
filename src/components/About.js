import React from 'react'
import { Paper, Typography } from '@material-ui/core'
import { useAppVersion } from '../common/appVersion';


export default function About() {
    const version = useAppVersion();
    return (
        <Paper style={{ padding: 5, backgroundColor: '#1e1e1e' }}>
            <Typography variant="h4">About</Typography>
            <Typography >Local sha: {version.localSha.substring(0, 6)}</Typography>
            <Typography >Local build time: {version.localBuildTime}</Typography>
            <Typography >Remote sha: {version.remoteSha.substring(0, 6)}</Typography>
            <Typography >Remote build time: {version.remoteBuildTime}</Typography>
        </Paper>
    )
}
