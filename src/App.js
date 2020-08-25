import React, { useState } from 'react';
import Paper from "@material-ui/core/Paper";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import LogList from './components/LogList';
import { darkTheme } from "./theme";
import { clearLogs, flushLogs, logInfo } from './utils/log'
import { useActivity } from './utils/activity'
import { updateUIIfRemoteVersionNewer, localSha, localBuildTime } from './utils/remoteVersion'
import { logRandom } from "./demo/randomLogs"
import { ApplicationBar } from "./components/ApplicationBar"


export default function App() {


  const [count, setCount] = useState(0)
  const [isActive, isChanged] = useActivity();
  const [theme,] = useState(darkTheme)

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
    <ThemeProvider theme={theme}>

      <Paper style={{ height: "100vh", backgroundColor: "black" }}>
        <ApplicationBar isActive={isActive} />
        <button onClick={reload}>Reload</button>
        <p>ui: active={isActive} "{localSha}", "{localBuildTime}"</p>

        <button onClick={clear}>Clear</button>
        <button onClick={refresh}>Refresh</button>
        <button onClick={logSome}>Log Some</button>
        <LogList count={count} />
      </Paper>
    </ThemeProvider>
  );
}

