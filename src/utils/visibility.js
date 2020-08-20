import React, { useState } from 'react';

let isDocumentShown = false

export function usePageVisibility() {
    const [isVisible, setIsVisible] = useState(!document.hidden)
    const onVisibilityShow = (e) => { setIsVisible(!document.hidden) }

    React.useEffect(() => {
        document.onvisibilitychange = onVisibilityShow

        return () => {
            document.onvisibilitychange = null
        }
    })

    const isShown = isVisible && !isDocumentShown
    const isHidden = !isVisible && isDocumentShown
    isDocumentShown = isVisible
    return [isVisible, isShown, isHidden]
}
