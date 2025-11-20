import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';
import CategorySelector from './CategorySelector';
import { validateAmount } from '../../utils/validation';
import './Expenses.css';

const AddExpenseForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0], 
    amount: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const { dispatch } = useApp();
  const { addNotification } = useNotification();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
    
    if (touched.category) {
      validateField('category', category);
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
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Обязательное поле';
        } else {
          delete newErrors.title;
        }
        break;
      case 'category':
        if (!value) {
          newErrors.category = 'Выберите категорию';
        } else {
          delete newErrors.category;
        }
        break;
      case 'date':
        if (!value) {
          newErrors.date = 'Укажите дату';
        } else {
          delete newErrors.date;
        }
        break;
      case 'amount':
        if (!validateAmount(value)) {
          newErrors.amount = 'Введите корректную сумму (от 1 до 1 000 000 ₽)';
        } else {
          delete newErrors.amount;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const isFormValid = formData.title && formData.category && formData.date && 
                     formData.amount && Object.keys(errors).length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      const expense = {
        ...formData,
        amount: Number(formData.amount),
        createdAt: new Date().toISOString()
      };
      
      dispatch({ type: 'ADD_EXPENSE', payload: expense });
      addNotification('Расход успешно добавлен', 'success');
      
      setFormData({
        title: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        amount: ''
      });
      setErrors({});
      setTouched({});
    } else {
      const allTouched = {
        title: true,
        category: true,
        date: true,
        amount: true
      };
      setTouched(allTouched);
      
      Object.keys(formData).forEach(key => {
        if (key !== 'description') { 
          validateField(key, formData[key]);
        }
      });
      
      addNotification('Пожалуйста, заполните все обязательные поля правильно', 'error');
    }
  };

  const getInputClassName = (fieldName) => {
    if (errors[fieldName]) return 'error';
    if (formData[fieldName] && !errors[fieldName]) return 'valid';
    return '';
  };

  return (
    <div className="add-expense-form">
      <h2 className="form-title">Новый расход</h2>
      <form onSubmit={handleSubmit}>
        <div className={`form-group ${getInputClassName('title')}`}>
          <label className="form-label">
            Новый расход *
            {errors.title && <span className="error-asterisk"> *</span>}
          </label>
          <input
            type="text"
            name="title"
            placeholder="Описание расхода"
            value={formData.title}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          {errors.title && <span className="error-icon">*</span>}
          {errors.title && <div className="error-text">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Описание</label>
          <input
            type="text"
            name="description"
            placeholder="Дополнительное описание"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <div className={`form-group ${errors.category ? 'error' : formData.category ? 'valid' : ''}`}>
          <label className="form-label">
            Категория *
            {errors.category && <span className="error-asterisk"> *</span>}
          </label>
          <CategorySelector 
            selectedCategory={formData.category}
            onCategoryChange={handleCategoryChange}
          />
          {errors.category && <div className="error-text">{errors.category}</div>}
        </div>

        <div className={`form-group ${getInputClassName('date')}`}>
          <label className="form-label">
            Дата *
            {errors.date && <span className="error-asterisk"> *</span>}
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          {errors.date && <span className="error-icon">*</span>}
          {errors.date && <div className="error-text">{errors.date}</div>}
        </div>

        <div className={`form-group ${getInputClassName('amount')}`}>
          <label className="form-label">
            Сумма *
            {errors.amount && <span className="error-asterisk"> *</span>}
          </label>
          <input
            type="number"
            name="amount"
            placeholder="0"
            value={formData.amount}
            onChange={handleInputChange}
            onBlur={handleBlur}
            min="1"
            max="1000000"
          />
          {errors.amount && <span className="error-icon">*</span>}
          {errors.amount && <div className="error-text">{errors.amount}</div>}
        </div>

        <button 
          type="submit" 
          className={`submit-button ${isFormValid ? 'active' : 'inactive'}`}
          disabled={!isFormValid}
        >
          Добавить новый расход
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;