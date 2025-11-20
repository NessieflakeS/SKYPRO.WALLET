import React from 'react';
import Header from '../components/Header/Header';
import ExpenseTable from '../components/Expenses/ExpenseTable';
import AddExpenseForm from '../components/Expenses/AddExpenseForm';
import './Pages.css';

const Expenses = () => {
  return (
    <div className="page expenses-page">
      <Header currentPage="expenses" />
      <div className="page-content">
        <div className="expenses-layout">
          <div className="expenses-form-section">
            <AddExpenseForm />
          </div>
          <div className="expenses-table-section">
            <ExpenseTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;