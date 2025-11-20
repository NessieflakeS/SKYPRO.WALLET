import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';
import { validateAmount } from '../../utils/validation';
import './Expenses.css';

import FoodIcon from './icons/Еда.svg';
import TransportIcon from './icons/Транспорт.svg';
import HousingIcon from './icons/Жилье.svg';
import EntertainmentIcon from './icons/Развлечения.svg';
import EducationIcon from './icons/Образование.svg';
import OtherIcon from './icons/Другое.svg';

const AddExpenseForm = () => {
  const [formData, setFormData] = useState({
    description: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    amount: ''
  });
  const [errors, setErrors] = useState({});

  const { dispatch } = useApp();
  const { addNotification } = useNotification();

  const categories = [
    { key: 'food', name: 'Еда', icon: FoodIcon },
    { key: 'transport', name: 'Транспорт', icon: TransportIcon },
    { key: 'housing', name: 'Жилье', icon: HousingIcon },
    { key: 'entertainment', name: 'Развлечения', icon: EntertainmentIcon },
    { key: 'education', name: 'Образование', icon: EducationIcon },
    { key: 'other', name: 'Другое', icon: OtherIcon }
  ];

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

  const handleCategorySelect = (categoryKey) => {
    setFormData(prev => ({
      ...prev,
      category: categoryKey
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    }

    if (!validateAmount(formData.amount)) {
      newErrors.amount = 'Сумма должна быть положительным числом до 1,000,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      addNotification('Пожалуйста, проверьте введенные данные', 'error');
      return;
    }

    const expense = {
      description: formData.description.trim(),
      category: formData.category,
      date: formData.date,
      amount: Number(formData.amount)
    };

    dispatch({ type: 'ADD_EXPENSE', payload: expense });
    addNotification('Расход успешно добавлен!', 'success');

    setFormData({
      description: '',
      category: 'food',
      date: new Date().toISOString().split('T')[0],
      amount: ''
    });
  };

  return (
    <div className="add-expense-form">
      <h3 className="expenses-subtitle">Новый расход</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Описание</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`form-input ${errors.description ? 'error' : ''}`}
            placeholder="Введите описание расхода"
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Категория</label>
          <div className="categories-grid">
            {categories.map(category => (
              <button
                key={category.key}
                type="button"
                className={`category-btn ${formData.category === category.key ? 'selected' : ''}`}
                onClick={() => handleCategorySelect(category.key)}
              >
                <img src={category.icon} alt={category.name} className="category-icon" />
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Дата</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Сумма</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={`form-input ${errors.amount ? 'error' : ''}`}
            placeholder="0"
            min="1"
            max="1000000"
          />
          {errors.amount && <span className="error-text">{errors.amount}</span>}
        </div>

        <button type="submit" className="submit-btn">
          Добавить расход
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;