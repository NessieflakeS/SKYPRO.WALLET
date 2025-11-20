import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Auth.css';
import { validateEmail, validatePassword, validateName } from '../../utils/validation';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { dispatch } = useApp();
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
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Имя обязательно';
        } else {
          delete newErrors.name;
        }
        break;
        case 'name':
        if (!validateName(value)) {
            newErrors.name = 'Имя должно содержать не менее 2 символов';
        } else {
            delete newErrors.name;
        }
        break;
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
        
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Пароли не совпадают';
        } else if (formData.confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          newErrors.confirmPassword = 'Пароли не совпадают';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const isFormValid = formData.name && formData.email && formData.password && 
                     formData.confirmPassword && Object.keys(errors).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        name: formData.name,
        email: formData.email
      };
      
      dispatch({ type: 'REGISTER_SUCCESS', payload: user });
      navigate('/expenses');
    } catch (error) {
      setErrors({ submit: 'Ошибка при регистрации' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className={`input-group ${errors.name ? 'error' : formData.name ? 'valid' : ''}`}>
          <input
            type="text"
            name="name"
            placeholder="Имя"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
          />
          {errors.name && <span className="error-icon">*</span>}
        </div>
        
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

        <div className={`input-group ${errors.confirmPassword ? 'error' : formData.confirmPassword ? 'valid' : ''}`}>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Подтвердите пароль"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
          />
          {errors.confirmPassword && <span className="error-icon">*</span>}
        </div>

        {errors.submit && (
          <div className="error-message">{errors.submit}</div>
        )}

        <button 
          type="submit" 
          className={`auth-button ${isFormValid ? 'active' : 'inactive'}`}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
      
      <button 
        onClick={onSwitchToLogin}
        className="switch-button"
        disabled={isLoading}
      >
        Войдите здесь
      </button>
    </div>
  );
};

export default RegisterForm;