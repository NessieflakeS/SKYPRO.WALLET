import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';
import './Expenses.css';

const ExpenseTable = () => {
  const { expenses, dispatch } = useApp();
  const { addNotification } = useNotification();

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот расход?')) {
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
      addNotification('Расход удален', 'info');
    }
  };

  const getCategoryName = (category) => {
    const names = {
      'food': 'Еда',
      'transport': 'Транспорт', 
      'housing': 'Жилье',
      'entertainment': 'Развлечения',
      'education': 'Образование',
      'other': 'Другое'
    };
    return names[category] || 'Другое';
  };

  return (
    <div className="expense-table">
      <div className="table-container">
        {expenses.length > 0 ? (
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Описание</th>
                <th>Категория</th>
                <th>Дата</th>
                <th>Сумма</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td className="expense-title">
                    <div>
                      <strong>{expense.title}</strong>
                      {expense.description && (
                        <div className="expense-description">{expense.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="expense-category">
                    {getCategoryName(expense.category)}
                  </td>
                  <td className="expense-date">
                    {new Date(expense.date).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="expense-amount">{expense.amount.toLocaleString('ru-RU')} ₽</td>
                  <td className="expense-actions">
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(expense.id)}
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>Пока нет расходов. Добавьте первый!</p>
          </div>
        )}
        
        {expenses.length > 0 && (
          <div className="expenses-summary">
            <p><strong>Всего расходов:</strong> {expenses.length}</p>
            <p><strong>Общая сумма:</strong> {expenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString('ru-RU')} ₽</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTable;