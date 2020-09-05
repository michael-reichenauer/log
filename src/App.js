import React, { useState } from 'react';
import Paper from "@material-ui/core/Paper";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import LogList from './components/LogList';
import { darkTheme } from "./theme";
import log, { logger } from './utils/log/log'
import { useActivity } from './utils/activity'
import { updateUIIfRemoteVersionNewer } from './utils/remoteVersion'
import { ApplicationBar } from "./components/ApplicationBar"
import { SnackbarProvider } from 'notistack';


export default function App() {
  const [count, setCount] = useState(0)
  const [isActive, isChanged] = useActivity();
  const [theme,] = useState(darkTheme)
  //const [isAutoScroll] = useGlobal('isAutoScroll')

  const refresh = () => {
    logger.flush().then(() => setCount(c => c + 1))
  };


  if (isChanged && isActive) {
    console.log(`Active = ${isActive}`)
    log.info("Active")
    updateUIIfRemoteVersionNewer()
    refresh()
  }

  if (isChanged && !isActive) {
    log.info("Inactive")
    refresh()
    console.log(`Active = ${isActive}`)
  }

  return (
    <SnackbarProvider
      maxSnack={3}
      preventDuplicate={true}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}>
      <ThemeProvider theme={theme}>
        <Paper style={{ height: "100vh", backgroundColor: "black" }} square>
          <ApplicationBar isActive={isActive} />
          <LogList count={count} isActive={isActive} />
        </Paper>

      </ThemeProvider>
    </SnackbarProvider>
  );
}

