import React from 'react';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './AppRoutes'; 
import './App.css';
import './styles/notifications.css';

function App() {
  return (
    <NotificationProvider>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </NotificationProvider>
  );
}

export default App;