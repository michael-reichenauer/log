import React, { useState } from 'react';
import TodoList from './TodoList';
import useFetch from './utils/useFetch';
import { info, clear } from './utils/log'

export default function App() {
  const [count, setCount] = useState(0)
  const refresh = () => {
    info("Refresh")
    setCount(c => c + 1)
  }
  const reload = () => {
    window.location.reload(true)
  }
  const clearLogs = () => {
    clear()
    refresh()
  }
  const { response, loading, error } = useFetch(
    "/manifest.json", null, 0
  );
  if (error) {
    return <div>Fetch manifest Error: {"" + error}</div>
  }
  if (loading) {
    return <div>Loading manifest ...</div>
  }

  return (
    <>
      <p>Local ui sha: "{"" + process.env.REACT_APP_SHA}"</p>
      <p>Remote ui sha: "{response && "" + response.sha}"</p>
      <button onClick={reload}>Reload</button>
      <button onClick={clearLogs}>Clear</button>
      <button onClick={refresh}>Refresh</button>
      <TodoList count={count} />
    </>
  );
}

