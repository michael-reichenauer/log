import React from 'react'
import useFetch from './utils/useFetch';



export default function TodoList({count}) {
    const { response, loading, error } = useFetch(
        "/api/GetLog?name=Michael", null, count
    );
    return (
        <div>
            Hello {count} "{JSON.stringify(response)}","{""+error}", "{JSON.stringify(loading)}"
        </div>
    )
}
