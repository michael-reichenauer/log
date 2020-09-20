import React, { useState } from 'react';
import Paper from "@material-ui/core/Paper";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { darkTheme } from "./theme";
import { useActivityMonitor } from './common/activity'
import { useIsOnline, useOnlineMonitor } from './common/online';
import { useAppVersionMonitor } from './common/appVersion'
import ApplicationBar from "./components/ApplicationBar"
import LogList from './components/LogList';
import Login from './components/Login';


export default function App() {
  const [theme] = useState(darkTheme)
  const [isOnline] = useIsOnline()
  useActivityMonitor()
  useAppVersionMonitor()
  useOnlineMonitor()


  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ height: "100vh", backgroundColor: "black" }} square>
        <ApplicationBar />
        {isOnline && <LogList />}
        {!isOnline && <Login />}
      </Paper>
    </ThemeProvider>
  );
}

