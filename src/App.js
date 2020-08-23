import React, { useState } from 'react';
import TodoList from './TodoList';
import { clearLogs, flushLogs } from './utils/log'
import { usePageVisibility } from './utils/visibility'
import { updateUIIfRemoteVersionNewer, localSha, localBuildTime } from './utils/remoteVersion'
import { logRandom } from "./demo/randomLogs"

export default function App() {
  const [count, setCount] = useState(0)
  const [isVisible, isShown, isHidden] = usePageVisibility();

  const refresh = () => {
    flushLogs().then(() => setCount(c => c + 1))
  };

  const reload = () => {
    flushLogs().then(() => window.location.reload(true))
  }

  const clear = async () => {
    await clearLogs()
    refresh()
  }

  const logSome = () => {
    logRandom()
  }

  if (isShown) {
    console.log(`Is Shown (isVisible= ${isVisible})`)
    updateUIIfRemoteVersionNewer()
    refresh()
  }

  if (isHidden) {
    console.log(`Is Hidden (isVisible= ${isVisible})`)
  }

  return (
    <>
      <button onClick={reload}>Reload</button>
      <p>ui: "{localSha}", "{localBuildTime}"</p>

      <button onClick={clear}>Clear</button>
      <button onClick={refresh}>Refresh</button>
      <button onClick={logSome}>Log Some</button>
      <TodoList count={count} />
    </>
  );
}

