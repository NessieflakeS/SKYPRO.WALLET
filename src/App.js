import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import './App.css';
import './styles/notifications.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  return !isAuthenticated ? children : <Navigate to="/expenses" />;
};

const AppContent = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/expenses" 
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/" element={<Navigate to="/login" />} />
          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <div className="container">
      <NotificationProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </NotificationProvider>
    </div>
  );
}

export default App;