import React from 'react';
import './Expenses.css';

const CategorySelector = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { id: 'food', name: 'Еда', icon: '🍕' },
    { id: 'transport', name: 'Транспорт', icon: '🚗' },
    { id: 'housing', name: 'Жилье', icon: '🏠' },
    { id: 'entertainment', name: 'Развлечения', icon: '🎬' },
    { id: 'education', name: 'Образование', icon: '📚' },
    { id: 'other', name: 'Другое', icon: '📦' }
  ];

  return (
    <div className="category-selector">
      <label className="category-label">Категория *</label>
      <div className="category-grid">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-item ${selectedCategory === category.id ? 'selected' : ''}`}
            onClick={() => onCategoryChange(category.id)}
            type="button"
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;