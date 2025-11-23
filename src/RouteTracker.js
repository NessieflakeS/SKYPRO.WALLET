import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const RouteTracker = () => {
  const { dispatch, currentPath } = useApp();
  const location = useLocation();

  useEffect(() => {
    console.log('📍 Route changed:', {
      from: currentPath,
      to: location.pathname
    });
    
    dispatch({ 
      type: 'SET_CURRENT_PATH', 
      payload: location.pathname 
    });
  }, [location, dispatch, currentPath]);

  return null;
};

export default RouteTracker;