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
      <div className="auth-container">
        <h1 className="auth-title">SkyproWallet</h1>
        <RegisterForm 
          onSwitchToLogin={handleSwitchToLogin}
        />
      </div>
    </div>
  );
};

export default Register;