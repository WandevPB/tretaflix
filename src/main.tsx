import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { Toaster } from './components/ui/toaster';

// Debug das variáveis de ambiente
console.log('Variáveis de ambiente:');
console.log('VITE_ADMIN_USERNAME está definido?', !!import.meta.env.VITE_ADMIN_USERNAME);
console.log('VITE_ADMIN_PASSWORD está definido?', !!import.meta.env.VITE_ADMIN_PASSWORD);
console.log('VITE_TMDB_API_KEY está definido?', !!import.meta.env.VITE_TMDB_API_KEY);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>,
);
