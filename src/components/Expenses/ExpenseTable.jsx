import React from 'react';
import { useApp } from '../../context/AppContext';
import './ExpenseTable.css';
import DeleteIcon from './icons/Удаление.svg';

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
                    <img src={DeleteIcon} alt="Удалить" className="delete-icon" />
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