import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { TemaProvider } from './tema/TemaContext.jsx';
import App from './App.jsx';
import './stil/ortak.css';
import './stil/temalar/manzara.css';
import './stil/temalar/sistem.css';
import './stil/temalar/gece.css';
import './stil/site.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><TemaProvider><HashRouter><App /></HashRouter></TemaProvider></React.StrictMode>);
