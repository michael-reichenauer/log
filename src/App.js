import React, { useState } from 'react';
import Paper from "@material-ui/core/Paper";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { Typography } from "@material-ui/core";
import { darkTheme } from "./theme";
import { useActivity, useActivityMonitor } from './common/activity'
import { useIsOnline, useOnlineMonitor } from './common/online';
import { useAppVersionMonitor } from './common/appVersion'
import ApplicationBar from "./components/ApplicationBar"
import LogList from './components/LogList';


export default function App() {
  const [theme] = useState(darkTheme)
  useActivityMonitor()
  useAppVersionMonitor()
  useOnlineMonitor()
  const isActive = useActivity()
  const [isOnline] = useIsOnline()

  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ height: "100vh", backgroundColor: "black" }} square>
        <ApplicationBar />
        {(isActive && isOnline) && <LogList />}
        {!isActive && <Typography noWrap>User was inactive for while</Typography>}
        {!isOnline && <Typography noWrap>Not online</Typography>}
      </Paper>
    </ThemeProvider>
  );
}

