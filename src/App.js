import React, { useState } from 'react';
import TodoList from './TodoList';
import { info, clear } from './utils/log'
import { usePageVisibility } from './utils/visibility'
import { updateUIIfRemoteVersionNewer, localSha, remoteSha, localBuildTime, remoteBuildTime } from './utils/remoteVersion'

export default function App() {
  const [count, setCount] = useState(0)
  const [isVisible, isShown, isHidden] = usePageVisibility();

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
    updateUIIfRemoteVersionNewer()
    refresh()
  }

  if (isHidden) {
    info(`Is Hidden (isVisible= ${isVisible})`)
  }

  return (
    <>
      <p>Local ui sha: "{localSha}, time: "{localBuildTime}"</p>
      <p>Remote ui sha: "{remoteSha}", time: "{remoteBuildTime}"</p>
      <button onClick={reload}>Reload</button>
      <button onClick={clearLogs}>Clear</button>
      <button onClick={refresh}>Refresh</button>
      <TodoList count={count} />
    </>
  );
}

