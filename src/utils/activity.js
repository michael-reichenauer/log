import React, { useState } from 'react';


const activityTimeout = 30000
const activityMargin = 1000

let activityTime = 0
let checkTimer = null
let isDocumentActive = false
const activeEvents = ["mousemove", "mousedown", "touchstart", "touchmove", "keydown", "wheel"]

export function useActivity() {
    const [isActive, setIsActive] = useState(!document.hidden)

    React.useEffect(() => {

        const onVisibilityShow = (e) => {
            setIsActive(!document.hidden)
            console.log(`visibility=${!document.hidden}`)
            if (!document.hidden) {
                onActive()
            } else {
                cancelCheckIfInactive()
            }
        }

        const onActive = () => {
            const now = Date.now()
            const previousActivityTime = activityTime
            activityTime = now
            if (now - previousActivityTime < activityTimeout) {
                return
            }
            activityTime = now
            cancelCheckIfInactive()

            console.log("Active")
            setIsActive(true)
            const timeout = activityTimeout + activityMargin
            checkTimer = setTimeout(checkIfInactive, timeout)
        }

        const cancelCheckIfInactive = () => {
            if (checkTimer != null) {
                console.log("Inactive")
                setIsActive(false)
                clearTimeout(checkTimer);
            }
        }

        const checkIfInactive = () => {
            const now = Date.now()
            if (now - activityTime < activityTimeout) {
                const timeout = activityTimeout + activityMargin - (now - activityTime)
                checkTimer = setTimeout(checkIfInactive, timeout)
                return
            }
            console.log("Inactive")
            setIsActive(false)
            checkTimer = null
        }

        document.onvisibilitychange = onVisibilityShow
        activeEvents.forEach(name => document.addEventListener(name, onActive))


        setTimeout(onActive, 1)

        return () => {
            document.onvisibilitychange = null
            activeEvents.forEach(name => document.removeEventListener(name, onActive))
        }
    }, [])

    const isChanged = (isActive && !isDocumentActive) || (!isActive && isDocumentActive)
    isDocumentActive = isActive

    return [isActive, isChanged]
}
