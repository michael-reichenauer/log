import React, { useState } from 'react';
import TodoList from './TodoList';
import { logInfo, clearLogs, flushLogs } from './utils/log'
import { usePageVisibility } from './utils/visibility'
import { updateUIIfRemoteVersionNewer, localSha, remoteSha, localBuildTime, remoteBuildTime } from './utils/remoteVersion'

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

  if (isShown) {
    logInfo(`Is Shown (isVisible= ${isVisible})`)
    updateUIIfRemoteVersionNewer()
    refresh()
  }

  if (isHidden) {
    logInfo(`Is Hidden (isVisible= ${isVisible})`)
  }

  return (
    <>
      <button onClick={reload}>Reload</button>
      <p>Local ui sha: "{localSha}, time: "{localBuildTime}"</p>
      <p>Remote ui sha: "{remoteSha}", time: "{remoteBuildTime}"</p>

      <button onClick={clear}>Clear</button>
      <button onClick={refresh}>Refresh</button>
      <TodoList count={count} />
    </>
  );
}

