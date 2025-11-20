import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useApp();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const getCurrentPage = () => {
    if (location.pathname === '/expenses') return 'expenses';
    if (location.pathname === '/analytics') return 'analytics';
    return 'expenses';
  };

  const currentPage = getCurrentPage();

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__logo">SkyproWallet</div>
        <nav className="header__nav">
          <button 
            className={`header__nav-btn ${currentPage === 'expenses' ? 'active' : ''}`}
            onClick={() => handleNavigation('/expenses')}
          >
            Мои расходы
          </button>
          <button 
            className={`header__nav-btn ${currentPage === 'analytics' ? 'active' : ''}`}
            onClick={() => handleNavigation('/analytics')}
          >
            Анализ расходов
          </button>
          <button 
            className="header__nav-btn header__logout"
            onClick={handleLogout}
          >
            Выйти
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;