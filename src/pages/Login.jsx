import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import LoginForm from '../components/Auth/LoginForm';
import './Pages.css';

const Login = () => {
  const navigate = useNavigate();

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="page login-page">
      <Header />
      <div className="auth-wrapper">
        <div className="auth-form-container">
          <h2 className="auth-form-title">Вход</h2>
          <LoginForm 
            onSwitchToRegister={handleSwitchToRegister}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;