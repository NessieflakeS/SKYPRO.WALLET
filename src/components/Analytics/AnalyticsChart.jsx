import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  filterExpensesByPeriod, 
  calculateCategoryTotals, 
  getCategoryDataForChart,
  formatDateRange 
} from '../../utils/analyticsUtils';
import './Analytics.css';

const AnalyticsChart = () => {
  const { expenses, analyticsPeriod } = useApp();
  
  const filteredExpenses = filterExpensesByPeriod(
    expenses, 
    analyticsPeriod.startDate, 
    analyticsPeriod.endDate
  );
  
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categoryTotals = calculateCategoryTotals(filteredExpenses);
  const chartData = getCategoryDataForChart(categoryTotals, totalAmount);

  const maxAmount = Math.max(...chartData.map(item => item.amount), 1);

  return (
    <div className="analytics-chart">
      <div className="chart-container">
        <div className="chart-summary">
          <div className="total-amount">
            <h3>Общая сумма</h3>
            <p className="amount">{totalAmount.toLocaleString('ru-RU')} ₽</p>
          </div>
          <div className="period-display">
            <h3>Период</h3>
            <p className="period-text">{formatDateRange(analyticsPeriod.startDate, analyticsPeriod.endDate)}</p>
          </div>
        </div>

        <div className="chart-content">
          {filteredExpenses.length > 0 ? (
            <div className="bar-chart-container">
              <div className="bar-chart">
                {chartData.map(item => (
                  <div key={item.category} className="bar-chart-item">
                    <div className="bar-wrapper">
                      <div 
                        className="bar"
                        style={{ 
                          height: `${(item.amount / maxAmount) * 80}%`,
                          backgroundColor: item.color
                        }}
                      >
                        <span className="bar-amount">{item.amount > 0 ? `${item.amount.toLocaleString('ru-RU')} ₽` : ''}</span>
                      </div>
                    </div>
                    <div className="bar-label">{item.category}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-data">
              <p>Нет данных за выбранный период</p>
              <p className="no-data-subtitle">Добавьте расходы в разделе "Мои расходы"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;