import log from '../utils/log'

const isDevelop = process.env.REACT_APP_SHA === "%REACT_APP_SHA%"
const startTime = dateToLocalISO(new Date().toISOString())
export let localSha = process.env.REACT_APP_SHA
export let remoteSha = "%REACT_APP_SHA%"
export let localBuildTime = process.env.REACT_APP_BUILD_TIME
export let remoteBuildTime = "%REACT_APP_BUILD_TIME%"
export let checkTime = Date.now()

export const updateUIIfRemoteVersionNewer = () => {
    if (isDevelop) {
        // Running in developer mode, skip check.
        localSha = ""
        remoteSha = ""
        localBuildTime = startTime
        remoteBuildTime = startTime
        console.log("Local debug version, no need to check remote version.")
        return
    }

    // Limit remote check
    if (checkTime + 1 * 60 * 1000 > Date.now()) {
        console.log("No need to check remote version yet")
        return
    }
    console.log("Checking remote version ...")
    checkTime = Date.now()

    localBuildTime = dateToLocalISO(process.env.REACT_APP_BUILD_TIME)
    log.info(`local:  "${localSha}" "${localBuildTime}" `)

    fetch(`/manifest.json`)
        .then(response => {
            if (response.status !== 200) {
                console.error('Error: Failed to get manifest, Status Code: ' + response.status);
                return;
            }
            response.json()
                .then(data => {
                    remoteSha = data.sha;
                    remoteBuildTime = dateToLocalISO(data.buildTime)
                    console.log(`Manifest: "${JSON.stringify(data)}"`)
                    log.info(`remote: "${remoteSha}" "${remoteBuildTime}"`)
                    if (localSha && remoteSha && localSha !== remoteSha) {
                        log.info("Remote version differs, reloading ...")
                        log.flushLogs().then(() => setTimeout(() => { window.location.reload(true) }, 100))
                    }
                });
        })
        .catch(err => {
            console.error('Error: Failed to get manifest:-S', err);
        });
}

function dateToLocalISO(dateText) {
    const date = new Date(dateText)
    const off = date.getTimezoneOffset()
    const absoff = Math.abs(off)
    return (new Date(date.getTime() - off * 60 * 1000).toISOString().substr(0, 23) +
        (off > 0 ? '-' : '+') +
        (absoff / 60).toFixed(0).padStart(2, '0') + ':' +
        (absoff % 60).toString().padStart(2, '0'))
}

