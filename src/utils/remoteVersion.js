import { useEffect } from 'react'
import axios from 'axios';
import log, { logger } from './log/log'
import { useGlobal } from 'reactn'
import { useActivity } from './activity'

const checkRemoteInterval = 1 * 60 * 1000
const retryFailedRemoteInterval = 5 * 60 * 1000

//const isDevelop = process.env.REACT_APP_SHA === "%REACT_APP_SHA%"
const startTime = dateToLocalISO(new Date().toISOString())
const localSha = process.env.REACT_APP_SHA === '%REACT_APP_SHA%' ? '' : dateToLocalISO(process.env.REACT_APP_SHA)
const localBuildTime = process.env.REACT_APP_BUILD_TIME === '%REACT_APP_BUILD_TIME%' ? startTime : process.env.REACT_APP_BUILD_TIME

// export let checkTime = Date.now()

export const useMonitorAppVersion = () => {
    const [, setRemoteVersion] = useGlobal('remoteVersion')
    const isActive = useActivity()

    useEffect(() => {
        let timeout
        const getRemoteVersion = async () => {
            if (!isActive) {
                return
            }
            try {
                console.log(`getting manifest ...`)
                const data = await axios.get('/manifest.json')
                const manifest = data.data
                console.log(`Got remote manifest`, manifest)
                const remoteSha = manifest.sha === '%REACT_APP_SHA%' ? '' : manifest.sha
                const remoteBuildTime = manifest.buildTime === '%REACT_APP_BUILD_TIME%' ? '' : dateToLocalISO(manifest.buildTime)
                log.info(`local: "${localSha.substring(0, 6)}" "${localBuildTime}"`)
                log.info(`remote: "${remoteSha.substring(0, 6)}" "${remoteBuildTime}"`)
                setRemoteVersion({ sha: remoteSha, buildTime: remoteBuildTime })
                if (localSha !== remoteSha && localSha !== '' && remoteSha !== '') {
                    logger.flush().then(() => window.location.reload(true))
                }
                timeout = setTimeout(getRemoteVersion, checkRemoteInterval)
            }
            catch (err) {
                console.error("Failed get remote manifest:", err)
                log.info(`local: "${localSha.substring(0, 6)}" "${localBuildTime}"`)
                timeout = setTimeout(getRemoteVersion, retryFailedRemoteInterval)
            }
        }
        getRemoteVersion()

        return () => { clearTimeout(timeout) }
    }, [setRemoteVersion, isActive])

    return
}


export const useAppVersion = () => {
    const [remoteVersion] = useGlobal('remoteVersion')
    return { localSha: localSha, localBuildTime: localBuildTime, remoteSha: remoteVersion.sha, remoteBuildTime: remoteVersion.buildTime }
}

// export const updateUIIfRemoteVersionNewer = () => {
//     if (isDevelop) {
//         // Running in developer mode, skip check.
//         localSha = ""
//         remoteSha = ""
//         localBuildTime = startTime
//         remoteBuildTime = startTime
//         console.log("Local debug version, no need to check remote version.")
//         return
//     }

//     // Limit remote check
//     if (checkTime + 1 * 60 * 1000 > Date.now()) {
//         console.log("No need to check remote version yet")
//         return
//     }
//     console.log("Checking remote version ...")
//     checkTime = Date.now()

//     localBuildTime = dateToLocalISO(process.env.REACT_APP_BUILD_TIME)
//     log.info(`local:  "${localSha}" "${localBuildTime}" `)

//     fetch(`/manifest.json`)
//         .then(response => {
//             if (response.status !== 200) {
//                 console.error('Error: Failed to get manifest, Status Code: ' + response.status);
//                 return;
//             }
//             response.json()
//                 .then(data => {
//                     remoteSha = data.sha;
//                     remoteBuildTime = dateToLocalISO(data.buildTime)
//                     console.log(`Manifest: "${JSON.stringify(data)}"`)
//                     log.info(`remote: "${remoteSha}" "${remoteBuildTime}"`)
//                     if (localSha && remoteSha && localSha !== remoteSha) {
//                         log.info("Remote version differs, reloading ...")
//                         log.flushLogs().then(() => setTimeout(() => { window.location.reload(true) }, 100))
//                     }
//                 });
//         })
//         .catch(err => {
//             console.error('Error: Failed to get manifest:-S', err);
//         });
// }

function dateToLocalISO(dateText) {
    const date = new Date(dateText)
    const off = date.getTimezoneOffset()
    const absoff = Math.abs(off)
    return (new Date(date.getTime() - off * 60 * 1000).toISOString().substr(0, 23) +
        (off > 0 ? '-' : '+') +
        (absoff / 60).toFixed(0).padStart(2, '0') + ':' +
        (absoff % 60).toString().padStart(2, '0'))
}

