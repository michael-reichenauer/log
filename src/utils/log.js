import useFetch from './useFetch';

export const info = msg => {
    const lm = { time: new Date(), msg: msg }
    const uri = `/api/AddLogs?logs=[${JSON.stringify(lm)}]`

    fetch(uri)
        .then(response => {
            if (response.status !== 200) {
                console.error('Error: Status Code: ' + response.status);
                return;
            }
            console.log('info: ' + uri)
        }
        )
        .catch(err => {
            console.error('Fetch Error :-S', err);
        });
}

export const clear = () => {
    fetch(`/api/ClearLogs`)
        .then(response => {
            if (response.status !== 200) {
                console.error('Error: Status Code: ' + response.status);
                return;
            }
            console.log('clear: Cleared')
        }
        )
        .catch(err => {
            console.error('Fetch Error :-S', err);
        });
}


export const useLogs = (count) => {
    const { response, loading, error } = useFetch(
        "/api/GetLog", null, count
    );
    return { response, loading, error }
}