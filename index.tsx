import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import AdminPanel from './components/AdminPanel.tsx';

const urlParams = new URLSearchParams(window.location.search);
const isAdminRoute = urlParams.get('admin') === 'true';

if (isAdminRoute) {
  const adminRootElement = document.getElementById('admin-root');
  if (adminRootElement) {
    const root = createRoot(adminRootElement);
    root.render(
      <React.StrictMode>
        <AdminPanel />
      </React.StrictMode>
    );
  }
} else {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}
