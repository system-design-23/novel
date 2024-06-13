import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import PreferencesContextProvider from './contexts/Preferences.jsx';
import AuthContextProvider from './contexts/Auth.jsx';

async function enableMocking() {
  if (process.env.NODE_ENV === 'development') {
    // const { server } = await import('./mocks/novel.js');
    // return server.start();
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <AuthContextProvider>
        <PreferencesContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PreferencesContextProvider>
      </AuthContextProvider>
    </React.StrictMode>
  );
});