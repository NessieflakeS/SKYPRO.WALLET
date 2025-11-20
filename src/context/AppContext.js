import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  user: null,
  expenses: [],
  isAuthenticated: false,
  currentPage: 'login',
  analyticsPeriod: {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], // Первое число текущего месяца
    endDate: new Date().toISOString().split('T')[0] // Сегодня
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
      return {
        ...state,
        expenses: [...state.expenses, {
          ...action.payload,
          id: Date.now().toString()
        }]
      };
    
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
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
      dispatch({ type: 'LOGIN_SUCCESS', payload: JSON.parse(savedUser) });
    }
    
    if (savedExpenses) {
      console.log('Loaded expenses:', JSON.parse(savedExpenses));
    }
  }, []);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('skyproWallet_user', JSON.stringify(state.user));
    }
    localStorage.setItem('skyproWallet_expenses', JSON.stringify(state.expenses));
  }, [state.user, state.expenses]);

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