import { useEffect } from 'react';
import { useActivity } from './activity'
import { useGlobal, setGlobal, getGlobal } from 'reactn'
import { isLocalDev } from './info'
import axios from 'axios';

const onlineRecheckInterval = 15 * 1000
const onlineCheckInterval = 20 * 1000

// Init global for isOnline
setGlobal({ ...getGlobal(), isOnline: false })
const onlineEventName = 'isOnlineEvent'


export const networkError = (error) => {
    console.log('network error', error)
    if (error.response) {
        console.warn('Some network error, (online)', error)
        // There was a response, not offline
        document.dispatchEvent(new CustomEvent(onlineEventName, { detail: true }));
    } else if (error.request) {
        // There was no response, offline
        console.warn('No response, so offline', error)
        document.dispatchEvent(new CustomEvent(onlineEventName, { detail: false }));
    } else {
        // Something happened in setting up the request that triggered an Error
        // Online status is unknown
        console.error('making request error, Unknown if online', error)
    }
}


export function useIsOnline() {
    const [isOnline, setIsOnline] = useGlobal('isOnline')

    useEffect(() => {
        const onEvent = e => {
            setIsOnline(e.detail)
        }

        document.addEventListener(onlineEventName, onEvent)

        return () => {
            document.removeEventListener(onlineEventName, onEvent)
        }
    }, [isOnline, setIsOnline])

    return [isOnline, setIsOnline]
}


export function useOnlineMonitor() {
    const [isActive] = useActivity()
    const [isOnline, setIsOnline] = useIsOnline()
    const [, setUser] = useGlobal('user')

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
                if (isLocalDev) {
                    const data = await axios.get(`/api/IsReady`)
                    const response = data.data
                    if (!response.ready) {
                        throw new Error(`'Unexpected ready response, retry in while: ${data}`)
                    }
                    setUser('local')
                    console.log('user:local')
                } else {
                    const data = await axios.get("/.auth/me")
                    const userData = data.data
                    console.log(`Got user data`, userData)
                    setUser('remote')
                    console.log('user:remote')
                }


                if (!isOnline) {
                    setIsOnline(true)
                }
                if (onlineTimeout) {
                    onlineTimeout = setTimeout(checkOnline, onlineCheckInterval)
                }
            }
            catch (err) {
                console.warn('Error checking online, retry in while:', err)
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


    }, [isActive, isOnline, setIsOnline, setUser])
}
