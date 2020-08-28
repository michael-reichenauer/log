import React, { useState } from 'react';
import Paper from "@material-ui/core/Paper";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import LogList from './components/LogList';
import { darkTheme } from "./theme";
import { flushLogs, logInfo } from './utils/log'
import { useActivity } from './utils/activity'
import { updateUIIfRemoteVersionNewer } from './utils/remoteVersion'
//import { logRandom } from "./demo/randomLogs"
import { ApplicationBar } from "./components/ApplicationBar"
import { SnackbarProvider } from 'notistack';


export default function App() {
  const [count, setCount] = useState(0)
  const [isActive, isChanged] = useActivity();
  const [theme,] = useState(darkTheme)

  const refresh = () => {
    flushLogs().then(() => setCount(c => c + 1))
  };



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

      <Paper style={{ height: "100vh", backgroundColor: "black" }} square>
        <SnackbarProvider
          maxSnack={3}
          preventDuplicate={true}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}>
          <ApplicationBar isActive={isActive} />
          <LogList count={count} isActive={isActive} />
        </SnackbarProvider>
      </Paper>
    </ThemeProvider>
  );
}

