import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './js/App';
import 'bootstrap/dist/css/bootstrap.css';
import reportWebVitals from '../src/js/reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();