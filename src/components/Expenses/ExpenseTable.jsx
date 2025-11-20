import React from 'react';
import { useApp } from '../../context/AppContext';
import './Expenses.css';

const ExpenseTable = () => {
  const { expenses, dispatch } = useApp();

  const handleDeleteExpense = (id) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  const categoryNames = {
    food: 'Еда',
    transport: 'Транспорт',
    housing: 'Жилье',
    entertainment: 'Развлечения',
    education: 'Образование',
    other: 'Другое'
  };

  return (
    <div className="expense-table-container">
      <h3 className="expenses-subtitle">Таблица расходов</h3>
      <div className="table-scroll-container">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Категория</th>
              <th>Описание</th>
              <th>Дата</th>
              <th>Сумма</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>
                  <div className="category-cell">
                    <span>{categoryNames[expense.category]}</span>
                  </div>
                </td>
                <td>{expense.description}</td>
                <td>{new Date(expense.date).toLocaleDateString('ru-RU')}</td>
                <td>{expense.amount.toLocaleString('ru-RU')} ₽</td>
                <td>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 1.5L10.5 10.5M1.5 10.5L10.5 1.5" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;