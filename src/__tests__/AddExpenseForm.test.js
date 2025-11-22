import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider } from '../context/AppContext';
import { NotificationProvider } from '../context/NotificationContext';
import AddExpenseForm from '../components/Expenses/AddExpenseForm';

const renderWithProviders = (component) => {
  return render(
    <NotificationProvider>
      <AppProvider>
        {component}
      </AppProvider>
    </NotificationProvider>
  );
};

describe('AddExpenseForm', () => {
  test('renders form fields', () => {
    renderWithProviders(<AddExpenseForm />);
    
    expect(screen.getByLabelText(/описание/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/категория/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/дата/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/сумма/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /добавить расход/i })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    renderWithProviders(<AddExpenseForm />);
    
    const submitButton = screen.getByRole('button', { name: /добавить расход/i });
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/описание обязательно/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    renderWithProviders(<AddExpenseForm />);
    
    const descriptionInput = screen.getByLabelText(/описание/i);
    const amountInput = screen.getByLabelText(/сумма/i);
    const submitButton = screen.getByRole('button', { name: /добавить расход/i });

    fireEvent.change(descriptionInput, { target: { value: 'Test expense' } });
    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(descriptionInput.value).toBe('');
      expect(amountInput.value).toBe('');
    });
  });
});