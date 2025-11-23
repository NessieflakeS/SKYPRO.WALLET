import React, { createContext, useContext, useReducer, useEffect } from 'react';

const loadFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    
    try {
      return JSON.parse(item);
    } catch (parseError) {
      return defaultValue;
    }
  } catch (error) {
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
  }
};

const cleanupCorruptedData = () => {
  const keys = [
    'skyproWallet_user',
    'skyproWallet_expenses', 
    'skyproWallet_currentPath',
    'skyproWallet_analyticsPeriod'
  ];
  
  keys.forEach(key => {
    try {
      const item = localStorage.getItem(key);
      let isValid = true;
      
      if (item !== null) {
        try {
          JSON.parse(item);
        } catch (e) {
          isValid = false;
        }
        
        if (!isValid || item.includes('\\\\')) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
    }
  });
};

const getInitialState = () => {
  cleanupCorruptedData();
  
  const user = loadFromStorage('skyproWallet_user', null);
  const rawExpenses = loadFromStorage('skyproWallet_expenses', []);
  const currentPath = loadFromStorage('skyproWallet_currentPath', '/expenses');
  const analyticsPeriod = loadFromStorage('skyproWallet_analyticsPeriod', {
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const validatedExpenses = Array.isArray(rawExpenses) ? rawExpenses : [];
  
  let validatedCurrentPath = '/expenses';
  if (typeof currentPath === 'string' && 
      (currentPath === '/expenses' || currentPath === '/analytics' || currentPath === '/login')) {
    validatedCurrentPath = currentPath;
  }

  return {
    user: user,
    expenses: validatedExpenses,
    isAuthenticated: !!user,
    currentPath: validatedCurrentPath,
    analyticsPeriod: analyticsPeriod
  };
};

const appReducer = (state, action) => {
  let newState;
  
  switch (action.type) {
    case 'LOGIN_SUCCESS': {
      newState = {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        currentPath: '/expenses'
      };
      break;
    }
    
    case 'LOGOUT': {
      newState = {
        ...getInitialState(),
        isAuthenticated: false,
        currentPath: '/login'
      };
      localStorage.removeItem('skyproWallet_user');
      localStorage.removeItem('skyproWallet_currentPath');
      break;
    }
    
    case 'REGISTER_SUCCESS': {
      newState = {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        currentPath: '/expenses'
      };
      break;
    }
    
    case 'ADD_EXPENSE': {
      const newExpense = {
        ...action.payload,
        id: Date.now().toString()
      };
      newState = {
        ...state,
        expenses: [...state.expenses, newExpense]
      };
      break;
    }
    
    case 'DELETE_EXPENSE': {
      newState = {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };
      break;
    }
    
    case 'SET_CURRENT_PATH': {
      const validPaths = ['/expenses', '/analytics', '/login', '/register'];
      const pathToSave = validPaths.includes(action.payload) ? action.payload : '/expenses';
      
      newState = {
        ...state,
        currentPath: pathToSave
      };
      break;
    }
    
    case 'SET_ANALYTICS_PERIOD': {
      newState = {
        ...state,
        analyticsPeriod: action.payload
      };
      break;
    }
    
    case 'LOAD_EXPENSES': {
      newState = {
        ...state,
        expenses: action.payload
      };
      break;
    }
    
    default:
      return state;
  }

  if (action.type !== 'LOGOUT') {
    if (newState.user !== state.user) {
      saveToStorage('skyproWallet_user', newState.user);
    }
    if (newState.expenses !== state.expenses) {
      saveToStorage('skyproWallet_expenses', newState.expenses);
    }
    if (newState.currentPath !== state.currentPath) {
      saveToStorage('skyproWallet_currentPath', newState.currentPath);
    }
    if (newState.analyticsPeriod !== state.analyticsPeriod) {
      saveToStorage('skyproWallet_analyticsPeriod', newState.analyticsPeriod);
    }
  }

  return newState;
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, getInitialState());

  useEffect(() => {
    if (state.isAuthenticated && state.expenses.length === 0) {
      const savedExpenses = loadFromStorage('skyproWallet_expenses', []);
      if (savedExpenses.length > 0) {
        dispatch({ type: 'LOAD_EXPENSES', payload: savedExpenses });
      }
    }
  }, [state.isAuthenticated, state.expenses.length]);

  const value = {
    ...state,
    dispatch
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};