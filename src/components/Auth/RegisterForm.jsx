import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';
import { validateEmail, validatePassword, validateName } from '../../utils/validation';
import './AuthForms.css';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (name === 'password' && formData.confirmPassword) {
      if (value !== formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Пароли не совпадают'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
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
    } else if (name === 'name' && !validateName(value)) {
      error = 'Имя должно содержать не менее 2 символов';
    } else if (name === 'confirmPassword' && value !== formData.password) {
      error = 'Пароли не совпадают';
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
    
    if (!validateName(formData.name)) {
      newErrors.name = 'Имя должно содержать не менее 2 символов';
    }
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Некорректный email';
    }
    
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Пароль должен содержать не менее 6 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
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
      id: Date.now().toString(),
      email: formData.email,
      name: formData.name
    };
    
    dispatch({ type: 'REGISTER_SUCCESS', payload: user });
    addNotification('Регистрация выполнена успешно!', 'success');
  };

  const hasErrors = Object.values(errors).some(error => error) || 
                   !formData.name || 
                   !formData.email || 
                   !formData.password || 
                   !formData.confirmPassword;

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Имя"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`auth-input ${errors.name ? 'error' : touched.name && formData.name && !errors.name ? 'valid' : ''}`}
        />
      </div>

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

      <div className="form-group">
        <input
          type="password"
          name="confirmPassword"
          placeholder="Подтвердите пароль"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`auth-input ${errors.confirmPassword ? 'error' : touched.confirmPassword && formData.confirmPassword && !errors.confirmPassword ? 'valid' : ''}`}
        />
      </div>

      <button 
        type="submit" 
        className={`auth-submit-btn ${hasErrors ? 'disabled' : ''}`}
        disabled={hasErrors}
      >
        Зарегистрироваться
      </button>

      <div className="auth-switch">
        <span className="auth-switch-text">Уже есть аккаунт? </span>
        <span className="auth-switch-link" onClick={onSwitchToLogin}>
          Войдите здесь
        </span>
      </div>
    </form>
  );
};

export default RegisterForm;