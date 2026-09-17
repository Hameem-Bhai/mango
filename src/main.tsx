import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { initAnalytics } from './lib/analytics';
import { logDeveloperCredit } from './lib/devCredit';

initAnalytics();
logDeveloperCredit();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
