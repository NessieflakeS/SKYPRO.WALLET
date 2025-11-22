import {
  filterExpensesByPeriod,
  calculateCategoryTotals,
  getCategoryDataForChart,
  formatDateRange
} from '../utils/analyticsUtils';

describe('Analytics Utilities', () => {
  const mockExpenses = [
    { id: '1', description: 'Lunch', category: 'food', amount: 500, date: '2024-01-15' },
    { id: '2', description: 'Bus', category: 'transport', amount: 50, date: '2024-01-16' },
    { id: '3', description: 'Movie', category: 'entertainment', amount: 300, date: '2024-02-01' },
    { id: '4', description: 'Dinner', category: 'food', amount: 800, date: '2024-01-20' }
  ];

  describe('filterExpensesByPeriod', () => {
    test('filters expenses within date range', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const result = filterExpensesByPeriod(mockExpenses, startDate, endDate);
      
      expect(result).toHaveLength(3);
      expect(result.map(exp => exp.id)).toEqual(['1', '2', '4']);
    });

    test('returns empty array when no expenses in range', () => {
      const startDate = '2024-03-01';
      const endDate = '2024-03-31';
      const result = filterExpensesByPeriod(mockExpenses, startDate, endDate);
      
      expect(result).toHaveLength(0);
    });
  });

  describe('calculateCategoryTotals', () => {
    test('calculates totals by category', () => {
      const result = calculateCategoryTotals(mockExpenses);
      
      expect(result.food).toBe(1300);
      expect(result.transport).toBe(50);
      expect(result.entertainment).toBe(300);
    });
  });

  describe('getCategoryDataForChart', () => {
    test('transforms category totals for chart', () => {
      const categoryTotals = { food: 1300, transport: 50, entertainment: 300 };
      const totalAmount = 1650;
      const result = getCategoryDataForChart(categoryTotals, totalAmount);
      
      expect(result).toHaveLength(6); 
      const foodData = result.find(item => item.category === 'Еда');
      expect(foodData.amount).toBe(1300);
      expect(foodData.percentage).toBeCloseTo(78.8, 1);
    });
  });

  describe('formatDateRange', () => {
    test('formats same date correctly', () => {
      const result = formatDateRange('2024-01-15', '2024-01-15');
      expect(result).toBe('15.01.2024');
    });

    test('formats different dates correctly', () => {
      const result = formatDateRange('2024-01-01', '2024-01-31');
      expect(result).toBe('01.01.2024 - 31.01.2024');
    });
  });
});