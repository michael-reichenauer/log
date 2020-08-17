import React from 'react'
import useFetch from './utils/useFetch';



export default function TodoList({ count }) {
    const { response, loading, error } = useFetch(
        "/api/GetLog?name=Michael", null, count
    );
    if (!response || !response.logs) {
        return null
    }

    return (
        <ul>
            {response.logs.map(item => {
                return <li key={item.id}> {item.id} {item.time} - {item.msg}</li>;
            })}
        </ul>
    )
}
