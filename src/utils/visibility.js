export function usePageVisibility() {
    const [isVisible, setIsVisible] = React.useState(getIsDocumentHidden())
    const onVisibilityChange = () => setIsVisible(getIsDocumentHidden())
    React.useEffect(() => {
        const visibilityChange = getBrowserVisibilityProp()
        window.addEventListener(visibilityChange, onVisibilityChange, false)
        return () => {
            window.removeEventListener(visibilityChange, onVisibilityChange)
        }
    })
    return isVisible
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