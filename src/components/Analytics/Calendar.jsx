import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import './AnalyticsChart.css';

const Calendar = () => {
  const { analyticsPeriod, dispatch } = useApp();
  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: null
  });

  useEffect(() => {
    if (analyticsPeriod.startDate && analyticsPeriod.endDate) {
      setSelectedRange({
        start: new Date(analyticsPeriod.startDate),
        end: new Date(analyticsPeriod.endDate)
      });
    }
  }, [analyticsPeriod]);

  const currentYear = new Date().getFullYear();
  
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
    let newRange = { ...selectedRange };

    if (!newRange.start || (newRange.start && newRange.end)) {
      newRange = { start: date, end: null };
    } else if (newRange.start && !newRange.end) {
      if (date < newRange.start) {
        newRange = { start: date, end: newRange.start };
      } else {
        newRange.end = date;
      }
      
      dispatch({
        type: 'SET_ANALYTICS_PERIOD',
        payload: {
          startDate: newRange.start.toISOString().split('T')[0],
          endDate: newRange.end.toISOString().split('T')[0]
        }
      });
    }

    setSelectedRange(newRange);
  };

  const isInRange = (date) => {
    if (!selectedRange.start || !selectedRange.end) return false;
    return date >= selectedRange.start && date <= selectedRange.end;
  };

  const isSelected = (date) => {
    return (
      (selectedRange.start && selectedRange.start.toDateString() === date.toDateString()) ||
      (selectedRange.end && selectedRange.end.toDateString() === date.toDateString())
    );
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
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
      const inRange = isInRange(date);
      const today = isToday(date);
      
      days.push(
        <div
          key={`${monthIndex}-${day}`}
          className={`calendar-day ${selected ? 'selected' : ''} ${inRange ? 'in-range' : ''} ${today ? 'today' : ''}`}
          onClick={() => handleDateSelect(date)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const clearSelection = () => {
    setSelectedRange({ start: null, end: null });
    dispatch({
      type: 'SET_ANALYTICS_PERIOD',
      payload: {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      }
    });
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h3 className="calendar-title">Период</h3>
        <button className="clear-selection-btn" onClick={clearSelection}>
          Сбросить
        </button>
      </div>
      <div className="selected-range">
        {selectedRange.start && selectedRange.end ? (
          <span>
            {selectedRange.start.toLocaleDateString('ru-RU')} - {selectedRange.end.toLocaleDateString('ru-RU')}
          </span>
        ) : selectedRange.start ? (
          <span>Выберите конечную дату</span>
        ) : (
          <span>Выберите начальную дату</span>
        )}
      </div>
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