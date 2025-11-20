import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateRange } from '../../utils/analyticsUtils';
import './Analytics.css';

const Calendar = () => {
  const { analyticsPeriod, dispatch } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDates, setSelectedDates] = useState([]);

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    for (let i = 0; i < (firstDay.getDay() || 7) - 1; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateString = date.toISOString().split('T')[0];
      const isSelected = selectedDates.includes(dateString);
      const isInPeriod = dateString >= analyticsPeriod.startDate && dateString <= analyticsPeriod.endDate;
      
      days.push({ 
        day, 
        isCurrentMonth: true,
        date,
        dateString,
        isSelected,
        isInPeriod
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  useEffect(() => {
    const datesInRange = [];
    const start = new Date(analyticsPeriod.startDate);
    const end = new Date(analyticsPeriod.endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      datesInRange.push(date.toISOString().split('T')[0]);
    }
    
    setSelectedDates(datesInRange);
  }, [analyticsPeriod]);

  const handleDateClick = (dateString) => {
    if (!dateString) return;
    
    let newSelectedDates;
    
    if (selectedPeriod === 'day') {
      newSelectedDates = [dateString];
    } else {
      newSelectedDates = [...selectedDates];
      const dateIndex = newSelectedDates.indexOf(dateString);
      
      if (dateIndex > -1) {
        newSelectedDates.splice(dateIndex, 1);
      } else {
        newSelectedDates.push(dateString);
      }
      
      newSelectedDates.sort();
    }
    
    setSelectedDates(newSelectedDates);
    
    if (newSelectedDates.length > 0) {
      const startDate = newSelectedDates[0];
      const endDate = newSelectedDates[newSelectedDates.length - 1];
      
      dispatch({
        type: 'SET_ANALYTICS_PERIOD',
        payload: { startDate, endDate }
      });
    }
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
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Понедельник
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

  const getDayClassName = (dayInfo) => {
    let className = 'calendar-day';
    
    if (!dayInfo.isCurrentMonth) {
      className += ' other-month';
    }
    
    if (dayInfo.isSelected) {
      className += ' selected';
    } else if (dayInfo.isInPeriod) {
      className += ' in-period';
    }
    
    return className;
  };

  return (
    <div className="calendar">
      <h2 className="calendar-title">Выбор периода</h2>
      
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
          <div className="calendar-month">
            {new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
          </div>
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