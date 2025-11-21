import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  filterExpensesByPeriod, 
  calculateCategoryTotals,
  getCategoryDataForChart,
  formatDateRange 
} from '../../utils/analyticsUtils';
import './AnalyticsChart.css';

const AnalyticsChart = () => {
  const { expenses, analyticsPeriod } = useApp();
  
  const filteredExpenses = filterExpensesByPeriod(
    expenses, 
    analyticsPeriod.startDate, 
    analyticsPeriod.endDate
  );
  
  const categoryTotals = calculateCategoryTotals(filteredExpenses);
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const chartData = getCategoryDataForChart(categoryTotals, totalAmount);
  
  const maxAmount = Math.max(...chartData.map(item => item.amount), 1);
  const minVisibleAmount = Math.max(maxAmount * 0.05, 500); 
  
  const categoryColors = {
    'Еда': '#D9B6FF',
    'Транспорт': '#FFB53D',
    'Жилье': '#6EE4FE',
    'Развлечения': '#B0AEFF',
    'Образование': '#BCEC30',
    'Другое': '#FFB9B8'
  };

  return (
    <div className="analytics-chart">
      <div className="chart-header">
        <div className="total-amount">
          {totalAmount.toLocaleString('ru-RU')} ₽
        </div>
        <div className="period-text">
          Расходы за {formatDateRange(analyticsPeriod.startDate, analyticsPeriod.endDate)}
        </div>
      </div>
      
      <div className="chart-bars">
        {chartData.map((item, index) => {
          const baseHeight = (item.amount / maxAmount) * 100;
          const adjustedHeight = Math.max(baseHeight, (minVisibleAmount / maxAmount) * 100);
          
          return (
            <div key={item.category} className="chart-column">
              <div className="chart-bar-container">
                <div 
                  className="chart-bar"
                  style={{
                    height: `${adjustedHeight}%`,
                    backgroundColor: categoryColors[item.category] || '#CCCCCC'
                  }}
                >
                  <div className="chart-amount-on-bar">
                    {item.amount > 0 ? `${item.amount.toLocaleString('ru-RU')} ₽` : ''}
                  </div>
                </div>
              </div>
              <div className="chart-label">{item.category}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalyticsChart;