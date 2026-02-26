import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Applica Caratteri Grandi all'avvio (classe su html per scalare tutti i rem)
if (localStorage.getItem('setting_largeText') === 'true') {
  document.documentElement.classList.add('large-font-mode');
}

// Diagnostica per APK: mostra l'errore a schermo se il mount fallisce
try {
    const rootElement = document.getElementById('root');
    if (!rootElement) throw new Error("Elemento 'root' non trovato!");

    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );
} catch (error) {
    document.body.innerHTML = `
        <div style="padding: 20px; color: red; font-family: sans-serif;">
            <h1 style="font-size: 20px;">Errore Avvio App</h1>
            <p style="font-size: 14px;">${error.message}</p>
        </div>
    `;
}
