import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './AnalyticsChart.css';

const Calendar = () => {
  const { analyticsPeriod, dispatch } = useApp();
  const [currentYear] = useState(new Date().getFullYear());

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  const months = [
    { name: 'Январь', days: 31 },
    { name: 'Февраль', days: currentYear % 4 === 0 ? 29 : 28 },
    { name: 'Март', days: 31 },
    { name: 'Апрель', days: 30 },
    { name: 'Май', days: 31 },
    { name: 'Июнь', days: 30 },
    { name: 'Июль', days: 31 },
    { name: 'Август', days: 31 },
    { name: 'Сентябрь', days: 30 },
    { name: 'Октябрь', days: 31 },
    { name: 'Ноябрь', days: 30 },
    { name: 'Декабрь', days: 31 }
  ];

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

  const renderMonth = (monthIndex, monthName, daysInMonth) => {
    const firstDay = getFirstDayOfMonth(monthIndex, currentYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${monthIndex}-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, monthIndex, day);
      const selected = isSelected(date);
      
      days.push(
        <div
          key={`${monthIndex}-${day}`}
          className={`calendar-day ${selected ? 'selected' : ''}`}
          onClick={() => handleDateSelect(date)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar">
      <h3 className="calendar-title">Период</h3>
      <div className="calendar-months-scroll">
        {months.map((month, index) => (
          <div key={index} className="calendar-month">
            <div className="month-header">
              {month.name} {currentYear}
            </div>
            <div className="calendar-grid">
              {daysOfWeek.map(day => (
                <div key={`${index}-${day}`} className="calendar-weekday">
                  {day}
                </div>
              ))}
              {renderMonth(index, month.name, month.days)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;