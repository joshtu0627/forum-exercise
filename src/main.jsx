import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './index.css';
import 'semantic-ui-css/semantic.min.css';

const styleLink = document.createElement('link');
styleLink.rel = 'stylesheet';
styleLink.href = 'https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
