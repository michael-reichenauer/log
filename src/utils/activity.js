import React, { useState } from 'react';


const activityTimeout = 10000
const activityMargin = 1000

let activityTime = 0
let checkTimer = null
let isDocumentActive = false

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
            console.log(`Check in ${timeout} ms`)
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
                console.log(`Recheck in ${timeout} ms`)
                checkTimer = setTimeout(checkIfInactive, timeout)
                return
            }
            console.log("Inactive")
            setIsActive(false)
            checkTimer = null
        }

        document.onvisibilitychange = onVisibilityShow
        document.addEventListener("mousemove", onActive)
        document.addEventListener("mousedown", onActive)
        document.addEventListener("touchstart", onActive)
        document.addEventListener("keydown", onActive)

        setTimeout(onActive, 1)

        return () => {
            document.onvisibilitychange = null
            document.removeEventListener("mousemove", onActive)
            document.removeEventListener("mousedown", onActive)
            document.removeEventListener("touchstart", onActive)
            document.removeEventListener("keydown", onActive)
        }
    }, [])

    const isChanged = (isActive && !isDocumentActive) || (!isActive && isDocumentActive)
    isDocumentActive = isActive

    return [isActive, isChanged]
}
