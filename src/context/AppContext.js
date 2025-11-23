import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { validateExpensesArray } from '../utils/dataIntegrity';

const loadFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
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

const getInitialState = () => {
  console.log('🔄 Loading initial state from localStorage...');
  
  const user = loadFromStorage('skyproWallet_user', null);
  const rawExpenses = loadFromStorage('skyproWallet_expenses', []);
  const validatedExpenses = validateExpensesArray(rawExpenses);
  const currentPath = loadFromStorage('skyproWallet_currentPath', '/expenses');
  const analyticsPeriod = loadFromStorage('skyproWallet_analyticsPeriod', {
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  console.log('📥 Loaded from localStorage:', {
    user,
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
      newState = {
        ...state,
        expenses: [...state.expenses, {
          ...action.payload,
          id: Date.now().toString()
        }]
      };
      break;
    
    case 'DELETE_EXPENSE':
      newState = {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };
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
    
    default:
      return state;
  }

  console.log('=== NEW STATE ===', newState);

  if (action.type !== 'LOGOUT') {
    if (newState.user !== state.user) {
      console.log('💾 Saving user to localStorage:', newState.user);
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
      console.log('💾 Saving analyticsPeriod to localStorage:', newState.analyticsPeriod);
      saveToStorage('skyproWallet_analyticsPeriod', newState.analyticsPeriod);
    }
  }

  return newState;
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, getInitialState());

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