import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import TopButton from "./components/shared/TopButton";

ReactDOM.render(
  <React.StrictMode>
    <App />
    <TopButton />
  </React.StrictMode>,
  document.getElementById('root')
);

