import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './AnalyticsChart.css';

const Calendar = () => {
  const { analyticsPeriod, dispatch } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handleDateSelect = (date) => {
    const dateString = date.toISOString().split('T')[0];
    dispatch({
      type: 'SET_ANALYTICS_PERIOD',
      payload: {
        startDate: dateString,
        endDate: dateString
      }
    });
  };

  const isSelected = (date) => {
    return analyticsPeriod.startDate === date.toISOString().split('T')[0];
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const selected = isSelected(date);
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${selected ? 'selected' : ''}`}
          onClick={() => handleDateSelect(date)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h3 className="calendar-title">Период</h3>
        <div className="calendar-nav">
          <button onClick={handlePrevMonth} className="calendar-nav-btn">←</button>
          <span className="calendar-month">{months[currentMonth]} {currentYear}</span>
          <button onClick={handleNextMonth} className="calendar-nav-btn">→</button>
        </div>
      </div>

      <div className="calendar-grid">
        {daysOfWeek.map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>
    </div>
  );
};

export default Calendar;