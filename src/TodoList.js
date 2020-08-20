import React from 'react'
import { useLogs } from './utils/log';


export default function TodoList({ count }) {
    const { response, error } = useLogs(count);
    if (error) {
        return <div>Error: {"" + error}</div>
    }
    return (
        <ul>
            {response && response.logs && response.logs.map((item, i) => {
                return <li key={i}>{i} {dateToLocalISO(item.time)} - {item.msg}</li>;
            })}
        </ul>
    )
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