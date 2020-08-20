import { info } from './log'

export const localSha = process.env.REACT_APP_SHA
export let remoteSha = "%REACT_APP_SHA%"
export const localBuildTime = process.env.REACT_APP_BUILD_TIME
export let remoteBuildTime = "%REACT_APP_BUILD_TIME%"

export const updateUIIfRemoteVersionNewer = () => {
    if (localSha === "%REACT_APP_SHA%") {
        // Running in developer mode, skip check.
        return
    }
    info(`local:  "${localSha}" "${localBuildTime}" `)
    fetch(`/manifest.json`)
        .then(response => {
            if (response.status !== 200) {
                console.error('Error: Failed to get manifest, Status Code: ' + response.status);
                return;
            }
            response.json()
                .then(data => {
                    remoteSha = data.sha;
                    remoteBuildTime = data.buildTime
                    info(`remote: "${remoteSha}" "${remoteBuildTime}"`)
                    if (localSha && remoteSha && localSha !== remoteSha) {
                        window.setTimeout(() => { window.location.reload(true) }, 300);
                    }
                });
        })
        .catch(err => {
            console.error('Error: Failed to get manifest:-S', err);
        });
}

