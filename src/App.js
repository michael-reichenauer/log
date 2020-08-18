import React, { useState } from 'react';
import TodoList from './TodoList';
import preval from 'preval.macro'
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
    "/api/GetVersion", null, count
  );
  if (error) {
    return <div>Error: {"" + error}</div>
  }
  if (loading) {
    return <div>Loading ...</div>
  }

  return (
    <>
      <p>Build Date: {preval`module.exports = new Date().toLocaleString();`}</p>
      <p>Server Version2: "{response && "" + response.version}"</p>
      <button onClick={reload}>Reload</button>
      <button onClick={refresh}>Refresh</button>
      <TodoList count={count} />
    </>
  );
}

