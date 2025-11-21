import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import { NotificationProvider } from '../context/NotificationContext';
import LoginForm from '../components/Auth/LoginForm';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithProviders = (component) => {
  return render(
    <Router>
      <NotificationProvider>
        <AppProvider>
          {component}
        </AppProvider>
      </NotificationProvider>
    </Router>
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders login form', () => {
    renderWithProviders(<LoginForm onSwitchToRegister={() => {}} />);
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
  });

  test('validates email format', async () => {
    renderWithProviders(<LoginForm onSwitchToRegister={() => {}} />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByRole('button', { name: 'Войти' });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  test('enables button with valid credentials', async () => {
    renderWithProviders(<LoginForm onSwitchToRegister={() => {}} />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Пароль');
    const submitButton = screen.getByRole('button', { name: 'Войти' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});