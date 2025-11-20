// pages/Register.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm';
import './Pages.css';

const Register = () => {
  const navigate = useNavigate();

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="page register-page">
      <div className="auth-wrapper">
        <div className="auth-form-container">
          <h2 className="auth-form-title">Регистрация</h2>
          <RegisterForm 
            onSwitchToLogin={handleSwitchToLogin}
          />
        </div>
      </div>
    </div>
  );
};

export default Register;