import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';
import './Auth.css';

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { dispatch } = useApp();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (formData.password.length >= 6) {
        const user = {
          email: formData.email,
          name: formData.email.split('@')[0]
        };
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        addNotification('Вход выполнен успешно', 'success');
        navigate('/expenses');
      } else {
        setErrors({ submit: 'Неверный email или пароль' });
      }
    } catch (error) {
      setErrors({ submit: 'Ошибка при входе' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <form onSubmit={handleSubmit} className="auth-form__content">
        <div className={`input-group ${errors.email ? 'error' : formData.email ? 'valid' : ''}`}>
          <input
            type="email"
            name="email"
            placeholder="Эл. почта"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
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
            disabled={isLoading}
          />
          {errors.password && <span className="error-icon">*</span>}
        </div>

        {errors.submit && (
          <div className="error-message">{errors.submit}</div>
        )}

        <button 
          type="submit" 
          className={`auth-button ${isFormValid ? 'active' : 'inactive'}`}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>
      
      <div className="auth-switch">
        <span>Нужно зарегистрироваться? </span>
        <button 
          onClick={onSwitchToRegister}
          className="switch-button"
          disabled={isLoading}
          type="button"
        >
          Регистрируйтесь здесь
        </button>
      </div>
    </div>
  );
};

export default LoginForm;