import React, { useState } from 'react';
import Paper from "@material-ui/core/Paper";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { darkTheme } from "./theme";
import { useActivityMonitor } from './utils/activity'
import { useAppVersionMonitor } from './utils/remoteVersion'
import ApplicationBar from "./components/ApplicationBar"
import LogList from './components/LogList';


export default function App() {
  const [theme] = useState(darkTheme)
  useActivityMonitor()
  useAppVersionMonitor()

  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ height: "100vh", backgroundColor: "black" }} square>
        <ApplicationBar />
        <LogList />
      </Paper>
    </ThemeProvider>
  );
}

