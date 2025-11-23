import React from 'react';
import { useApp } from '../../context/AppContext';

const DebugInfo = () => {
  const { user, expenses, isAuthenticated, currentPath } = useApp();
  
  const storageInfo = {
    user: localStorage.getItem('skyproWallet_user'),
    expenses: localStorage.getItem('skyproWallet_expenses'),
    currentPath: localStorage.getItem('skyproWallet_currentPath')
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 10, 
      right: 10, 
      background: 'rgba(0,0,0,0.9)', 
      color: 'white', 
      padding: 15, 
      fontSize: 12,
      fontFamily: 'monospace',
      zIndex: 1000,
      maxWidth: '400px',
      maxHeight: '300px',
      overflow: 'auto',
      borderRadius: '8px',
      border: '2px solid #7334EA'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#7334EA' }}>🔧 Debug Info</h4>
      
      <div><strong>State:</strong></div>
      <div>• User: {user ? user.email : 'null'}</div>
      <div>• Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</div>
      <div>• Current Path: {currentPath}</div>
      <div>• Expenses Count: {expenses.length}</div>
      
      <div style={{ marginTop: '10px' }}><strong>LocalStorage:</strong></div>
      <div>• User: {storageInfo.user ? '✅' : '❌'}</div>
      <div>• Expenses: {storageInfo.expenses ? `✅ (${JSON.parse(storageInfo.expenses).length} items)` : '❌'}</div>
      <div>• Current Path: {storageInfo.currentPath || '❌'}</div>
      
      <div style={{ marginTop: '10px' }}><strong>Expenses IDs:</strong></div>
      <div>{expenses.map(exp => exp.id).join(', ') || 'None'}</div>
      
      <button 
        onClick={() => {
          console.log('=== DEBUG STATE ===', { user, expenses, isAuthenticated, currentPath });
          console.log('=== DEBUG LOCALSTORAGE ===', storageInfo);
        }}
        style={{
          marginTop: '10px',
          background: '#7334EA',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Log to Console
      </button>
    </div>
  );
};

export default DebugInfo;