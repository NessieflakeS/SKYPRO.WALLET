import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateRange } from '../../utils/analyticsUtils';
import './Analytics.css';

const Calendar = () => {
  const { analyticsPeriod, dispatch } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const generateCalendarDays = () => {
    const days = [];
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    for (let i = 0; i < (firstDay.getDay() || 7) - 1; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateString = date.toISOString().split('T')[0];
      const isInPeriod = dateString >= analyticsPeriod.startDate && dateString <= analyticsPeriod.endDate;
      
      days.push({ 
        day, 
        isCurrentMonth: true,
        date,
        dateString,
        isInPeriod
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const handleDateClick = (dateString) => {
    if (!dateString) return;
    
    let startDate, endDate;
    
    if (selectedPeriod === 'day') {
      startDate = dateString;
      endDate = dateString;
    } else {
      // Для выбора периода - используем логику выбора диапазона
      const clickedDate = new Date(dateString);
      const currentStart = new Date(analyticsPeriod.startDate);
      const currentEnd = new Date(analyticsPeriod.endDate);
      
      if (clickedDate < currentStart || clickedDate > currentEnd) {
        startDate = dateString;
        endDate = dateString;
      } else {
        startDate = analyticsPeriod.startDate;
        endDate = analyticsPeriod.endDate;
      }
    }
    
    dispatch({
      type: 'SET_ANALYTICS_PERIOD',
      payload: { startDate, endDate }
    });
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    
    const today = new Date();
    let startDate, endDate;
    
    switch (period) {
      case 'day':
        startDate = today.toISOString().split('T')[0];
        endDate = startDate;
        break;
      case 'week':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1);
        startDate = startOfWeek.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      default:
        return;
    }
    
    dispatch({
      type: 'SET_ANALYTICS_PERIOD',
      payload: { startDate, endDate }
    });
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const getDayClassName = (dayInfo) => {
    let className = 'calendar-day';
    
    if (!dayInfo.isCurrentMonth) {
      className += ' other-month';
    }
    
    if (dayInfo.isInPeriod) {
      className += ' in-period';
    }
    
    if (dayInfo.dateString === analyticsPeriod.startDate || dayInfo.dateString === analyticsPeriod.endDate) {
      className += ' selected';
    }
    
    return className;
  };

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  return (
    <div className="calendar">
      <h2 className="calendar-title">Период</h2>
      
      <div className="period-selector">
        <button 
          className={`period-btn ${selectedPeriod === 'day' ? 'active' : ''}`}
          onClick={() => handlePeriodChange('day')}
        >
          День
        </button>
        <button 
          className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
          onClick={() => handlePeriodChange('week')}
        >
          Неделя
        </button>
        <button 
          className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
          onClick={() => handlePeriodChange('month')}
        >
          Месяц
        </button>
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <button className="nav-button" onClick={() => navigateMonth('prev')}>‹</button>
          <div className="calendar-month">
            {monthNames[currentMonth]} {currentYear}
          </div>
          <button className="nav-button" onClick={() => navigateMonth('next')}>›</button>
        </div>
        
        <div className="calendar-weekdays">
          {daysOfWeek.map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>
        
        <div className="calendar-grid">
          {calendarDays.map((dayInfo, index) => (
            <div
              key={index}
              className={getDayClassName(dayInfo)}
              onClick={() => handleDateClick(dayInfo.dateString)}
            >
              {dayInfo.day}
            </div>
          ))}
        </div>
      </div>

      <div className="selected-period">
        <h3>Выбранный период:</h3>
        <p>{formatDateRange(analyticsPeriod.startDate, analyticsPeriod.endDate)}</p>
      </div>
    </div>
  );
};

export default Calendar;