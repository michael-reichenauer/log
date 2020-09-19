const infoLocalStorageName = 'info'

let localInfo

export const getLocalInfo = () => {
    if (localInfo) {
        return localInfo
    }

    let localText = localStorage.getItem(infoLocalStorageName)
    if (!localText) {
        const id = Math.random().toString(36).substring(2, 15);
        console.log(`Initialize local storage`)
        localText = JSON.stringify({ id: id })
        localStorage.setItem(infoLocalStorageName, localText)
    }
    localInfo = JSON.parse(localText)
    console.log(`Info local storage: ${localText}`)
    return localInfo
}
