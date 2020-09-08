const logLocalStorageName = 'logLocalStorage'

let localInfo

export const getLocalInfo = () => {
    if (localInfo) {
        return localInfo
    }

    let localText = localStorage.getItem(logLocalStorageName)
    if (!localText) {
        const id = Math.random().toString(36).substring(2, 15);
        console.log(`Initialize local storage`)
        localText = JSON.stringify({ id: id })
        localStorage.setItem(logLocalStorageName, localText)
    }
    localInfo = JSON.parse(localText)
    console.log(`Local storage: ${localText}`)
    return localInfo
}
