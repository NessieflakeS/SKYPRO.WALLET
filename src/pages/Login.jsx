import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import './Pages.css';

const Login = () => {
  const navigate = useNavigate();

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="page login-page">
      <div className="auth-container">
        <h1 className="auth-title">SkyproWallet</h1>
        <LoginForm 
          onSwitchToRegister={handleSwitchToRegister}
        />
      </div>
    </div>
  );
};

export default Login;