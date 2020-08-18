import React, { useState } from 'react';
import TodoList from './TodoList';
import useFetch from './utils/useFetch';

export default function App() {


  const [count, setCount] = useState(0)
  const refresh = () => {
    setCount(c => c + 1)
  }
  const reload = () => {
    window.location.reload(true)
  }
  const { response, loading, error } = useFetch(
    "/manifest.json", null, count
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
      <button onClick={refresh}>Refresh</button>
      <TodoList count={count} />
    </>
  );
}

