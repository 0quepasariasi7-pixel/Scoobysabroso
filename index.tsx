import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const AdminPanel = React.lazy(() => import('./components/AdminPanel'));

const urlParams = new URLSearchParams(window.location.search);
const isAdminRoute = urlParams.get('admin') === 'true';

if (isAdminRoute) {
  const adminRootElement = document.getElementById('admin-root');
  if (adminRootElement) {
    const root = createRoot(adminRootElement);
    root.render(
      <React.StrictMode>
        <Suspense fallback={<div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Cargando panel de administrador...</div>}>
          <AdminPanel />
        </Suspense>
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
