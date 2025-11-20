import React, { useState } from 'react';
import './Auth.css';

const LoginForm = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (!value.includes('@')) {
          newErrors.email = 'Некорректный email';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (value.length < 6) {
          newErrors.password = 'Пароль должен быть не менее 6 символов';
        } else {
          delete newErrors.password;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const isFormValid = formData.email && formData.password && Object.keys(errors).length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      onLoginSuccess();
    }
  };

  return (
    <div className="auth-container">
      <h2>Вход</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className={`input-group ${errors.email ? 'error' : formData.email ? 'valid' : ''}`}>
          <input
            type="email"
            name="email"
            placeholder="Эл. почта"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && <span className="error-icon">*</span>}
        </div>
        
        <div className={`input-group ${errors.password ? 'error' : formData.password ? 'valid' : ''}`}>
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.password && <span className="error-icon">*</span>}
        </div>

        <button 
          type="submit" 
          className={`auth-button ${isFormValid ? 'active' : 'inactive'}`}
          disabled={!isFormValid}
        >
          Войти
        </button>
      </form>
      
      <button 
        onClick={onSwitchToRegister}
        className="switch-button"
      >
        Регистрируйтесь здесь
      </button>
    </div>
  );
};

export default LoginForm;