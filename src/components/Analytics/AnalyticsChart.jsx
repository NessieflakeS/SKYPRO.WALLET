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
  
  const minHeightPercent = 5;
  
  const categoryColors = {
    'Еда': '#D9B6FF',
    'Транспорт': '#FFB53D',
    'Жилье': '#6EE4FE',
    'Развлечения': '#B0AEFF',
    'Образование': '#BCEC30',
    'Другое': '#FFB9B8'
  };

  const calculateBarHeight = (amount) => {
    if (amount === 0) return 0;
    
    const calculatedHeight = (amount / maxAmount) * 100;
    return Math.max(calculatedHeight, minHeightPercent);
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
        {chartData.map((item) => {
          const barHeight = calculateBarHeight(item.amount);
          
          return (
            <div key={item.category} className="chart-column">
              <div className="chart-bar-container">
                {barHeight > 0 && (
                  <div 
                    className="chart-bar"
                    style={{
                      height: `${barHeight}%`,
                      backgroundColor: categoryColors[item.category] || '#CCCCCC'
                    }}
                  >
                    <div className="chart-amount-on-bar">
                      {item.amount.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                )}
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