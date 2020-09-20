import React, { useState } from 'react';
import Paper from "@material-ui/core/Paper";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { darkTheme } from "./theme";
import { useActivityMonitor } from './common/activity'
import { useOnlineMonitor } from './common/online';
import { useAppVersionMonitor } from './common/appVersion'
import ApplicationBar from "./components/ApplicationBar"
import LogList from './components/LogList';
import Login from './components/Login';
import { useUser } from './common/auth';


export default function App() {
  const [theme] = useState(darkTheme)
  const [user] = useUser()
  useActivityMonitor()
  useAppVersionMonitor()
  useOnlineMonitor()


  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ height: "100vh", backgroundColor: "black" }} square>
        <ApplicationBar />
        {user && <LogList />}
        {!user && <Login />}
      </Paper>
    </ThemeProvider>
  );
}

