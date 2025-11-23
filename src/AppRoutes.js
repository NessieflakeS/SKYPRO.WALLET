import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext'; 
import RouteTracker from './components/RouteTracker'; 
import Login from './pages/Login';
import Register from './pages/Register'; 
import Expenses from './pages/Expenses'; 
import Analytics from './pages/Analytics';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  
  console.log('🛡️ ProtectedRoute check:', { isAuthenticated, path: window.location.pathname });
  
  if (!isAuthenticated) {
    console.log('🚫 Access denied, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  
  console.log('🌐 PublicRoute check:', { isAuthenticated, path: window.location.pathname });
  
  if (isAuthenticated) {
    console.log('✅ User authenticated, redirecting to /expenses');
    return <Navigate to="/expenses" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, currentPath } = useApp();

  const getStartRoute = () => {
    if (isAuthenticated) {
      const route = currentPath && currentPath !== '/login' && currentPath !== '/register' 
        ? currentPath 
        : '/expenses';
      console.log('🎯 Start route for authenticated user:', route);
      return route;
    }
    console.log('🎯 Start route for unauthenticated user: /login');
    return '/login';
  };

  const startRoute = getStartRoute();

  console.log('🚀 AppRoutes render:', {
    isAuthenticated,
    currentPath,
    startRoute,
    actualPath: window.location.pathname
  });

  return (
    <Router>
      <RouteTracker />
      <div className="App">
        <Routes>
          {/* ... остальные роуты ... */}
          <Route 
            path="/" 
            element={<Navigate to={startRoute} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;