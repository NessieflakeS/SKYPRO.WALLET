import React from 'react';
import Header from '../components/Header/Header';
import AnalyticsChart from '../components/Analytics/AnalyticsChart';
import Calendar from '../components/Analytics/Calendar';
import './Pages.css';

const Analytics = () => {
  return (
    <div className="page analytics-page">
      <Header currentPage="analytics" />
      <div className="page-content">
        <h1 className="analytics-main-title">Анализ расходов</h1>
        <div className="analytics-layout">
          <div className="calendar-section">
            <Calendar />
          </div>
          <div className="chart-section">
            <AnalyticsChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;