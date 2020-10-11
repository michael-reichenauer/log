import { CircularProgress, Fade } from '@material-ui/core';
import React from 'react'
const { useGlobal, setGlobal, getGlobal } = require("reactn");

setGlobal({ ...getGlobal(), isLoading: false })

export function useLoading() {
    return useGlobal('isLoading')
}

export default function LoadProgress() {
    const [isLoading] = useLoading()
    return (
        <Fade
            in={isLoading}
            style={{
                transitionDelay: isLoading ? '800ms' : '0ms',
            }}
            unmountOnExit
        >
            <CircularProgress color="secondary" />
        </Fade>
    )
}
