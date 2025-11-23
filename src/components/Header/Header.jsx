import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Header.css';

const Header = () => {
  const { isAuthenticated, dispatch } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate('/expenses');
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const handleNavigation = (page) => {
    navigate(`/${page}`);
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="header-container">
      <header className="header">
        <div className="header-logo" onClick={handleLogoClick}>
          <img src="/favicon.png" alt="SkyproWallet" />
        </div>

        {!isAuthPage && isAuthenticated && (
          <nav className="header-nav">
            <button 
              className={`nav-btn ${location.pathname === '/expenses' ? 'active' : ''}`}
              onClick={() => handleNavigation('expenses')}
            >
              Мои расходы
            </button>
            <button 
              className={`nav-btn ${location.pathname === '/analytics' ? 'active' : ''}`}
              onClick={() => handleNavigation('analytics')}
            >
              Анализ расходов
            </button>
          </nav>
        )}

        {!isAuthPage && isAuthenticated && (
          <button className="logout-btn" onClick={handleLogout}>
            Выйти
          </button>
        )}
      </header>
    </div>
  );
};

export default Header;