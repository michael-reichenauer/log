import { useEffect } from 'react';
import { useActivity } from './activity'
import { useGlobal, setGlobal, getGlobal } from 'reactn'
import axios from 'axios';

const onlineRecheckInterval = 15 * 1000
const onlineCheckInterval = 20 * 1000

// Init global for isOnline
setGlobal({ ...getGlobal(), isOnline: false })


export function useIsOnline() {
    const [isOnline, setIsOnline] = useGlobal('isOnline')

    const setIsOnlineFromError = error => {
        console.log('network error', error)
        if (typeof error === "boolean") {
            // true or false
            console.log('Setting online=', error)
            setIsOnline(error)
        } else if (error.response) {
            console.warn('Some network error, (online)', error)
            // There was a response, not offline
            setIsOnline(true)
        } else if (error.request) {
            // There was no response, offline
            console.warn('No response, so offline', error)
            setIsOnline(false)
        } else {
            // Something happened in setting up the request that triggered an Error
            // Online status is unknown
            console.error('making request error, Unknown if online', error)
        }
    }

    return [isOnline, setIsOnlineFromError]
}


export function useOnlineMonitor() {
    const isActive = useActivity()
    const [isOnline, setIsOnline] = useIsOnline()

    useEffect(() => {
        if (!isActive) {
            // Not active, going offline as well
            if (isOnline) {
                setIsOnline(false)
            }
            return
        }

        let onlineTimeout
        const checkOnline = async () => {
            try {
                // console.log(`Check online ...`)
                const data = await axios.get(`/api/IsReady`)
                const response = data.data
                if (!response.ready) {
                    throw new Error(`'Unexpected ready response, retry in while: ${data}`)

                }
                if (!isOnline) {
                    setIsOnline(true)
                }
                if (onlineTimeout) {
                    onlineTimeout = setTimeout(checkOnline, onlineCheckInterval)
                }
            }
            catch (err) {
                // console.warn('Error checking online, retry in while:', err)
                if (isOnline) {
                    setIsOnline(false)
                }
                if (onlineTimeout) {
                    onlineTimeout = setTimeout(checkOnline, onlineRecheckInterval)
                }
            }
        }


        onlineTimeout = setTimeout(checkOnline, 0)

        return () => {
            clearTimeout(onlineTimeout)
            onlineTimeout = null
        }


    }, [isActive, isOnline, setIsOnline])
}
