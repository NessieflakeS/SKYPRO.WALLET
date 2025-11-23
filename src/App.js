import React from 'react';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './AppRoutes';
import './App.css';
import './styles/notifications.css';

const StorageCleaner = () => {
  const clearStorage = () => {
    localStorage.removeItem('skyproWallet_user');
    localStorage.removeItem('skyproWallet_expenses');
    localStorage.removeItem('skyproWallet_currentPath');
    localStorage.removeItem('skyproWallet_analyticsPeriod');
    console.log('🧹 LocalStorage cleared');
    window.location.reload();
  };

  return (
    <button 
      onClick={clearStorage}
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#ff4444',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        zIndex: 10000
      }}
    >
      Clear Storage
    </button>
  );
};

function App() {
  return (
    <NotificationProvider>
      <AppProvider>
        <AppRoutes />
        {process.env.NODE_ENV === 'development' && <StorageCleaner />}
      </AppProvider>
    </NotificationProvider>
  );
}

export default App;