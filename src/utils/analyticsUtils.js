export const filterExpensesByPeriod = (expenses, startDate, endDate) => {
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    return expenseDate >= start && expenseDate <= end;
  });
};

export const calculateCategoryTotals = (expenses) => {
  const categoryMap = {};
  
  expenses.forEach(expense => {
    if (!categoryMap[expense.category]) {
      categoryMap[expense.category] = 0;
    }
    categoryMap[expense.category] += expense.amount;
  });
  
  return categoryMap;
};

export const getCategoryDataForChart = (categoryTotals, totalAmount) => {
  const categories = {
    food: { name: 'Еда', color: '#8A2BE2' },
    transport: { name: 'Транспорт', color: '#4B0082' },
    housing: { name: 'Жилье', color: '#9370DB' },
    entertainment: { name: 'Развлечения', color: '#D8BFD8' },
    education: { name: 'Образование', color: '#E6E6FA' },
    other: { name: 'Другое', color: '#F5F0FF' }
  };
  
  return Object.entries(categoryTotals)
    .map(([category, amount]) => {
      const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
      return {
        category: categories[category]?.name || 'Другое',
        amount,
        percentage: Math.round(percentage * 10) / 10, 
        color: categories[category]?.color || '#F5F0FF'
      };
    })
    .sort((a, b) => b.amount - a.amount); 
};

export const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString('ru-RU');
  }
  
  return `${start.toLocaleDateString('ru-RU')} - ${end.toLocaleDateString('ru-RU')}`;
};