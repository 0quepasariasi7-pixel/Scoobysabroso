import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import AdminPanel from './components/AdminPanel.tsx';

const RootSelector: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const isAdminRoute = urlParams.get('admin') === 'true';

  if (isAdminRoute) {
    return <AdminPanel />;
  }
  
  return <App />;
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RootSelector />
    </React.StrictMode>
  );
}
