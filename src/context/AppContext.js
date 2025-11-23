import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  user: null,
  expenses: [],
  isAuthenticated: false,
  currentPath: '/expenses',
  analyticsPeriod: {
    startDate: new Date().toISOString().split('T')[0], 
    endDate: new Date().toISOString().split('T')[0] 
  }
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        currentPage: 'expenses'
      };
    
    case 'LOGOUT':
      localStorage.removeItem('skyproWallet_user');
      localStorage.removeItem('skyproWallet_expenses');
      return {
        ...initialState,
        currentPage: 'login'
      };
    
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        currentPage: 'expenses'
      };
    
    case 'ADD_EXPENSE':
      const newExpenses = [...state.expenses, {
        ...action.payload,
        id: Date.now().toString()
      }];
      return {
        ...state,
        expenses: newExpenses
      };
    
    case 'DELETE_EXPENSE':
      const filteredExpenses = state.expenses.filter(expense => expense.id !== action.payload);
      return {
        ...state,
        expenses: filteredExpenses
      };
    
    case 'LOAD_EXPENSES':
      return {
        ...state,
        expenses: action.payload
      };
    
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload
      };
    
    case 'SET_ANALYTICS_PERIOD':
      return {
        ...state,
        analyticsPeriod: action.payload
      };

    case 'SET_CURRENT_PATH':
      return {
        ...state,
        currentPath: action.payload
      };
    
    default:
      return state;
  }
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedUser = localStorage.getItem('skyproWallet_user');
    const savedExpenses = localStorage.getItem('skyproWallet_expenses');
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('skyproWallet_user');
      }
    }
    
    if (savedExpenses) {
      try {
        const expenses = JSON.parse(savedExpenses);
        dispatch({ type: 'LOAD_EXPENSES', payload: expenses });
      } catch (error) {
        console.error('Error parsing saved expenses:', error);
        localStorage.removeItem('skyproWallet_expenses');
      }
    }
  }, []);

    useEffect(() => {
      const savedPath = localStorage.getItem('skyproWallet_currentPath');
      if (savedPath) {
        dispatch({ type: 'SET_CURRENT_PATH', payload: savedPath });
      }
    }, []);

    useEffect(() => {
      localStorage.setItem('skyproWallet_currentPath', state.currentPath);
    }, [state.currentPath]);

    useEffect(() => {
      if (state.user) {
        localStorage.setItem('skyproWallet_user', JSON.stringify(state.user));
      } else {
        localStorage.removeItem('skyproWallet_user');
      }
    }, [state.user]);

  useEffect(() => {
    localStorage.setItem('skyproWallet_expenses', JSON.stringify(state.expenses));
  }, [state.expenses]);

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