const infoLocalStorageName = 'instanceInfo'

let localInfo
export const isLocalDev = process.env.REACT_APP_SHA === '%REACT_APP_SHA%'

export const getLocalInfo = () => {
    if (localInfo) {
        return localInfo
    }

    let localText = localStorage.getItem(infoLocalStorageName)
    if (!localText) {
        const logInstanceID = Math.random().toString(36).substring(2, 15);
        console.log(`Initialize local storage`)
        localText = JSON.stringify({ logInstanceID: logInstanceID })
        localStorage.setItem(infoLocalStorageName, localText)
    }
    localInfo = JSON.parse(localText)
    console.log(`Info local storage: ${localText}`)
    return localInfo
}
