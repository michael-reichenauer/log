import React, { useState } from 'react';

let isWindowShown = false
export function usePageVisibility() {
    const [isVisible, setIsVisible] = useState(getIsDocumentHidden())
    //const onVisibilityChange = () => setIsVisible(getIsDocumentHidden())
    const onVisibilityShow = (e) => setIsVisible(true)


    React.useEffect(() => {
        const visibilityChange = getBrowserVisibilityProp()
        // window.addEventListener(visibilityChange, onVisibilityChange, false)
        window.onpageshow = onVisibilityShow

        return () => {
            // window.removeEventListener(visibilityChange, onVisibilityChange)
        }
    })
    const isShown = isVisible && !isWindowShown
    const isHidden = !isVisible && isWindowShown
    isWindowShown = isVisible
    return [isVisible, isShown, isHidden]
}

function getBrowserVisibilityProp() {
    if (typeof document.hidden !== "undefined") {
        // Opera 12.10 and Firefox 18 and later support
        return "visibilitychange"
    } else if (typeof document.msHidden !== "undefined") {
        return "msvisibilitychange"
    } else if (typeof document.webkitHidden !== "undefined") {
        return "webkitvisibilitychange"
    }
}

function getBrowserDocumentHiddenProp() {
    if (typeof document.hidden !== "undefined") {
        return "hidden"
    } else if (typeof document.msHidden !== "undefined") {
        return "msHidden"
    } else if (typeof document.webkitHidden !== "undefined") {
        return "webkitHidden"
    }
}

function getIsDocumentHidden() {
    return !document[getBrowserDocumentHiddenProp()]
}