import React from 'react';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './AppRoutes';
import DebugInfo from './components/Debug/DebugInfo'; // Импортируем компонент отладки
import './App.css';
import './styles/notifications.css';

function App() {
  return (
    <NotificationProvider>
      <AppProvider>
        <AppRoutes />
        {process.env.NODE_ENV === 'development' && <DebugInfo />}
      </AppProvider>
    </NotificationProvider>
  );
}

export default App;