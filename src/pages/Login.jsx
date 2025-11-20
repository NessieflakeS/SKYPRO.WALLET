import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import './Pages.css';

const Login = () => {
  const handleSwitchToRegister = () => {
    console.log('Switch to register');
  };

  const handleLoginSuccess = () => {
    console.log('Login successful');
  };

  return (
    <div className="page login-page">
      <div className="auth-container">
        <h1 className="auth-title">SkyproWallet</h1>
        <LoginForm 
          onSwitchToRegister={handleSwitchToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </div>
  );
};

export default Login;