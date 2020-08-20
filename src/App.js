import React, { useState } from 'react';
import TodoList from './TodoList';
import useFetch from './utils/useFetch';
import { info, clear } from './utils/log'
import { usePageVisibility } from './utils/visibility'

let versionCount = 0

export default function App() {
  const [count, setCount] = useState(0)
  const [isVisible, isShown, isHidden] = usePageVisibility();
  const { response, loading, error } = useFetch(
    "/manifest.json", null, versionCount
  );

  const refresh = () => {
    info(`Refresh ${count}`)
    window.setTimeout(() => { setCount(c => c + 1) }, 300);
  }

  const reload = () => {
    window.location.reload(true)
  }

  const clearLogs = () => {
    clear()
    refresh()
  }

  if (isShown) {
    info(`Is Shown (isVisible= ${isVisible})`)
    refresh()
  }
  if (isHidden) {
    info(`Is Hidden (isVisible= ${isVisible})`)
  }



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

