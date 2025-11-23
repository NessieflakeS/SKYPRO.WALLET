import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import RouteTracker from './components/RouteTracker';
import Login from './pages/Login';
import Register from './pages/Register';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  
  console.log('🛡️ ProtectedRoute check:', { 
    isAuthenticated, 
    path: window.location.pathname 
  });
  
  if (!isAuthenticated) {
    console.log('🚫 Access denied, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  
  console.log('🌐 PublicRoute check:', { 
    isAuthenticated, 
    path: window.location.pathname 
  });
  
  if (isAuthenticated) {
    console.log('✅ User authenticated, redirecting to /expenses');
    return <Navigate to="/expenses" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, currentPath } = useApp();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const getStartRoute = () => {
    if (!isInitialized) {
      return '/'; 
    }

    if (isAuthenticated) {
      const validPaths = ['/expenses', '/analytics'];
      const route = currentPath && validPaths.includes(currentPath) 
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
    actualPath: window.location.pathname,
    isInitialized
  });

  if (!isInitialized) {
    return <div>Loading...</div>; 
  }

  return (
    <Router>
      <RouteTracker />
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
          
          <Route 
            path="/" 
            element={<Navigate to={startRoute} replace />} 
          />
          
          <Route path="*" element={<Navigate to={startRoute} replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;