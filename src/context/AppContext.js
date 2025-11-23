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
      console.warn(`Failed to parse ${key} as JSON, returning as string:`, item);
      return item;
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

const cleanupLocalStorage = () => {
  const keys = [
    'skyproWallet_user',
    'skyproWallet_expenses', 
    'skyproWallet_currentPath',
    'skyproWallet_analyticsPeriod'
  ];
  
  keys.forEach(key => {
    try {
      const item = localStorage.getItem(key);
      if (item && !item.startsWith('{') && !item.startsWith('[') && item !== 'null') {
        console.log(`Cleaning up invalid ${key}:`, item);
        saveToStorage(key, item);
      }
    } catch (error) {
      console.error(`Error cleaning up ${key}:`, error);
    }
  });
};

const getInitialState = () => {
  console.log('🔄 Loading initial state from localStorage...');
  
  cleanupLocalStorage();
  
  const user = loadFromStorage('skyproWallet_user', null);
  const rawExpenses = loadFromStorage('skyproWallet_expenses', []);
  const currentPath = loadFromStorage('skyproWallet_currentPath', '/expenses');
  const analyticsPeriod = loadFromStorage('skyproWallet_analyticsPeriod', {
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const validatedExpenses = Array.isArray(rawExpenses) ? rawExpenses : [];

  console.log('📥 Loaded from localStorage:', {
    user: !!user,
    expensesCount: validatedExpenses.length,
    currentPath,
    analyticsPeriod
  });

  return {
    user: user,
    expenses: validatedExpenses,
    isAuthenticated: !!user,
    currentPath: currentPath,
    analyticsPeriod: analyticsPeriod
  };
};

const appReducer = (state, action) => {
  let newState;
  
  console.log('=== REDUCER ACTION ===', {
    actionType: action.type,
    actionPayload: action.payload,
    currentState: state
  });
  
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      newState = {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        currentPath: '/expenses'
      };
      break;
    
    case 'LOGOUT':
      newState = {
        ...getInitialState(),
        isAuthenticated: false,
        currentPath: '/login'
      };
      localStorage.removeItem('skyproWallet_user');
      localStorage.removeItem('skyproWallet_currentPath');
      break;
    
    case 'REGISTER_SUCCESS':
      newState = {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        currentPath: '/expenses'
      };
      break;
    
    case 'ADD_EXPENSE':
      const newExpense = {
        ...action.payload,
        id: Date.now().toString()
      };
      newState = {
        ...state,
        expenses: [...state.expenses, newExpense]
      };
      console.log('➕ Added expense:', newExpense);
      break;
    
    case 'DELETE_EXPENSE':
      newState = {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };
      console.log('🗑️ Deleted expense:', action.payload);
      break;
    
    case 'SET_CURRENT_PATH':
      newState = {
        ...state,
        currentPath: action.payload
      };
      break;
    
    case 'SET_ANALYTICS_PERIOD':
      newState = {
        ...state,
        analyticsPeriod: action.payload
      };
      break;
    
    case 'LOAD_EXPENSES':
      newState = {
        ...state,
        expenses: action.payload
      };
      break;
    
    default:
      return state;
  }

  console.log('=== NEW STATE ===', newState);

  if (action.type !== 'LOGOUT') {
    if (newState.user !== state.user) {
      console.log('💾 Saving user to localStorage');
      saveToStorage('skyproWallet_user', newState.user);
    }
    if (newState.expenses !== state.expenses) {
      console.log('💾 Saving expenses to localStorage. Count:', newState.expenses.length);
      saveToStorage('skyproWallet_expenses', newState.expenses);
    }
    if (newState.currentPath !== state.currentPath) {
      console.log('💾 Saving currentPath to localStorage:', newState.currentPath);
      saveToStorage('skyproWallet_currentPath', newState.currentPath);
    }
    if (newState.analyticsPeriod !== state.analyticsPeriod) {
      console.log('💾 Saving analyticsPeriod to localStorage');
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
        console.log('🔄 Loading expenses from localStorage on init');
        dispatch({ type: 'LOAD_EXPENSES', payload: savedExpenses });
      }
    }
  }, [state.isAuthenticated]);

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