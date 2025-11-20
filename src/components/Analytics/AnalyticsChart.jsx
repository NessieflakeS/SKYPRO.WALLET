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

  return (
    <div className="analytics-chart">
      <h2 className="chart-title">Анализ расходов</h2>
      
      <div className="chart-container">
        <div className="chart-summary">
          <div className="total-amount">
            <h3>Общая сумма</h3>
            <p className="amount">{totalAmount.toLocaleString('ru-RU')} ₽</p>
          </div>
          <div className="period-display">
            <h3>Период</h3>
            <p>{formatDateRange(analyticsPeriod.startDate, analyticsPeriod.endDate)}</p>
          </div>
        </div>

        <div className="chart-content">
          {filteredExpenses.length > 0 ? (
            <>
              <div className="chart-bars">
                {chartData.map(item => (
                  <div key={item.category} className="chart-bar-item">
                    <div className="bar-label">
                      <span className="category-name">{item.category}</span>
                      <span className="category-amount">
                        {item.amount.toLocaleString('ru-RU')} ₽ ({item.percentage}%)
                      </span>
                    </div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill"
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: item.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chart-legend">
                <h3>Распределение по категориям</h3>
                <div className="legend-items">
                  {chartData.map(item => (
                    <div key={item.category} className="legend-item">
                      <div 
                        className="legend-color" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="legend-label">{item.category}</span>
                      <span className="legend-percentage">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
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