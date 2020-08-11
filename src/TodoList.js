import React from 'react'
import useFetch from './utils/useFetch';



export default function TodoList() {
    const { response, loading, error } = useFetch(
        "/api/GetLog?name=Michael"
    );
    return (
        <div>
            Hell "{JSON.stringify(response)}","{""+error}", "{JSON.stringify(loading)}"
        </div>
    )
}
