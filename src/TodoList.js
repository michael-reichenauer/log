import React from 'react'
import useFetch from './utils/useFetch';



export default function TodoList({ count }) {
    const { response, loading, error } = useFetch(
        "/api/GetLog?name=Michael", null, count
    );
    if (error) {
        return <div>Error: {"" + error}</div>
    }
    if (loading) {
        return <div>Loading ...</div>
    }

    return (
        <ul>
            {response && response.logs && response.logs.map(item => {
                return <li key={item.id}> {item.id} {item.time} - {item.msg}</li>;
            })}
        </ul>
    )
}
