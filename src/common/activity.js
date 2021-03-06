import { useEffect, useState } from 'react';
import log from './log/log'
import { durationString } from '../utils/utils'
import { getLocalInfo } from './info';

const activityTimeout = 60 * 1000
const activityMargin = 1000

let activityTime = 0
let activityStartTime = 0
let activityCheckTimer = null

let isDocumentActive = false
const monitorEvents = ["mousemove", "mousedown", "touchstart", "touchmove", "keydown", "wheel"]
const activityEventName = 'customActivityChange'
const id = getLocalInfo().logInstanceID.substring(0, 6)

export function useActivityMonitor() {
    useEffect(() => {
        // Called by monitored event handlers on activity = true events
        const onActive = () => {
            activityTime = Date.now()
            if (activityCheckTimer !== null) {
                // Already active
                return
            }

            // Toggle active = true
            log.info(`Active ${id}`)
            isDocumentActive = true
            activityStartTime = activityTime

            // Schedule check if still active
            const timeout = activityTimeout + activityMargin
            activityCheckTimer = setTimeout(checkIfActive, timeout)

            // Post activity=true event
            const activityEvent = new CustomEvent(activityEventName, { detail: true });
            document.dispatchEvent(activityEvent);
        }

        // Called by check activity timeout or visibility hidden event handler
        const onInactive = () => {
            if (activityCheckTimer === null) {
                // Already inactive
                return
            }

            // Toggle active = false
            log.info(`Inactive ${id} (total: ${durationString(Date.now() - activityStartTime)})`)
            isDocumentActive = false
            activityStartTime = 0

            // Clear timeout
            clearTimeout(activityCheckTimer);
            activityCheckTimer = null

            // Post activity=false event
            const activityEvent = new CustomEvent(activityEventName, { detail: false });
            document.dispatchEvent(activityEvent);
        }

        const checkIfActive = () => {
            if (activityCheckTimer === null) {
                // Already set to inactive
                return
            }

            const now = Date.now()
            if (now - activityTime < activityTimeout) {
                // Still active, reschedule check
                console.log(`Still active (total: ${durationString(Date.now() - activityStartTime)})`)
                const timeout = activityTimeout - (now - activityTime) + activityMargin
                activityCheckTimer = setTimeout(checkIfActive, timeout)
                return
            }

            // console.log(`No longer active (${now - activityTime}), recheck..  (total: ${Date.now() - activityStartTime})`)
            onInactive()
        }

        const onVisibilityChange = (e) => {
            // console.log(`onVisibilityChange visible=${!document.hidden}`)
            if (!document.hidden) {
                onActive()
                return
            }

            onInactive()
        }

        // Register monitored events handler
        document.onvisibilitychange = onVisibilityChange
        monitorEvents.forEach(name => document.addEventListener(name, onActive))

        setTimeout(onActive, 1)

        return () => {
            // Unregister monitored events handler
            document.onvisibilitychange = null
            monitorEvents.forEach(name => document.removeEventListener(name, onActive))
        }
    }, [])
}

export function useActivity() {
    const [isActive, setIsActive] = useState(isDocumentActive)

    useEffect(() => {
        const onActivityEvent = e => {
            setIsActive(e.detail)
        }

        document.addEventListener(activityEventName, onActivityEvent)

        return () => {
            document.removeEventListener(activityEventName, onActivityEvent)
        }
    }, [])

    return [isActive]
}

export function useActivityChanged() {
    const [isChanged, setIsChanged] = useState(false)

    useEffect(() => {
        const onActivityEvent = e => {
            setIsChanged(true)
        }

        document.addEventListener(activityEventName, onActivityEvent)

        return () => {
            document.removeEventListener(activityEventName, onActivityEvent)
        }
    }, [])

    if (isChanged) {
        setIsChanged(false)
    }

    return isChanged
}
