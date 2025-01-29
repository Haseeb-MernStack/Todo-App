import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Global styles
import App from './App.jsx'; // Main App component
import { Toaster } from 'react-hot-toast';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <App />
      <div><Toaster /></div>
    </MantineProvider>
  </StrictMode>
);
