import React from 'react'
import { useLogs, info } from './utils/log';


export default function TodoList({ count }) {
    const { response, error } = useLogs(count);
    if (error) {
        return <div>Error: {"" + error}</div>
    }
    return (
        <ul>
            {response && response.logs && response.logs.map((item, i) => {
                return <li key={i}>{i} {item.time} - {item.msg}</li>;
            })}
        </ul>
    )
}
