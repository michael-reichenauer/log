import React, { useState } from 'react';
import TodoList from './TodoList';
import { clearLogs, flushLogs, logInfo } from './utils/log'
import { useActivity } from './utils/activity'
import { updateUIIfRemoteVersionNewer, localSha, localBuildTime } from './utils/remoteVersion'
import { logRandom } from "./demo/randomLogs"

export default function App() {
  const [count, setCount] = useState(0)
  const [isActive, isChanged] = useActivity();

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

  if (isChanged && isActive) {
    console.log(`Active = ${isActive}`)
    logInfo("Active")
    updateUIIfRemoteVersionNewer()
    refresh()
  }

  if (isChanged && !isActive) {
    logInfo("Inactive")
    refresh()
    console.log(`Active = ${isActive}`)
  }

  return (
    <>
      <button onClick={reload}>Reload</button>
      <p>ui: active={"" + isActive} "{localSha}", "{localBuildTime}"</p>

      <button onClick={clear}>Clear</button>
      <button onClick={refresh}>Refresh</button>
      <button onClick={logSome}>Log Some</button>
      <TodoList count={count} />
    </>
  );
}

