import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const RouteTracker = () => {
  const { dispatch, currentPath } = useApp();
  const location = useLocation();
  const previousPathRef = useRef(currentPath);

  useEffect(() => {
    if (location.pathname !== previousPathRef.current && 
        (location.pathname === '/expenses' || 
         location.pathname === '/analytics' || 
         location.pathname === '/login' ||
         location.pathname === '/register')) {
      
      console.log('📍 Route changed:', {
        from: previousPathRef.current,
        to: location.pathname
      });
      
      dispatch({ 
        type: 'SET_CURRENT_PATH', 
        payload: location.pathname 
      });
      
      previousPathRef.current = location.pathname;
    }
  }, [location, dispatch]);

  return null;
};

export default RouteTracker;