import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { setGlobal } from 'reactn';
import { getLocalInfo } from './utils/info'
import { SnackbarProvider } from 'notistack';

// Init an empty global state object, properties are initialized where they are uses 
setGlobal({
});

// Initialize local storage info
getLocalInfo()


// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
ReactDOM.render(
  <SnackbarProvider
    maxSnack={3}
    preventDuplicate={true}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'center'
    }}>
    <App />
  </SnackbarProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


