import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';
import { validateEmail, validatePassword } from '../../utils/validation';
import './AuthForms.css';

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const { dispatch } = useApp();
  const { addNotification } = useNotification();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    if (value.trim()) {
      let error = '';
      if (name === 'email' && !validateEmail(value)) {
        error = 'Некорректный email';
      } else if (name === 'password' && !validatePassword(value)) {
        error = 'Пароль должен содержать не менее 6 символов';
      }

      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Некорректный email';
    }
    
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Пароль должен содержать не менее 6 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addNotification('Упс! Введенные данные некорректны. Введите данные корректно и повторите попытку.', 'error');
      return;
    }

    const user = {
      id: '1',
      email: formData.email,
      name: 'User'
    };
    
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    addNotification('Вход выполнен успешно!', 'success');
  };

  const hasErrors = Object.values(errors).some(error => error) || 
                   !formData.email.trim() || 
                   !formData.password.trim();

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`auth-input ${errors.email ? 'error' : touched.email && formData.email && !errors.email ? 'valid' : ''}`}
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`auth-input ${errors.password ? 'error' : touched.password && formData.password && !errors.password ? 'valid' : ''}`}
        />
      </div>

      <button 
        type="submit" 
        className={`auth-submit-btn ${hasErrors ? 'disabled' : ''}`}
        disabled={hasErrors}
      >
        Войти
      </button>

      <div className="auth-switch">
        <span className="auth-switch-text">Нет аккаунта? </span>
        <span className="auth-switch-link" onClick={onSwitchToRegister}>
          Регистрируйтесь здесь
        </span>
      </div>
    </form>
  );
};

export default LoginForm;