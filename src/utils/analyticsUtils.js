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
    food: { name: 'Еда', color: '#9370DB' }, 
    transport: { name: 'Транспорт', color: '#FFA500' }, 
    housing: { name: 'Жилье', color: '#87CEEB' }, 
    entertainment: { name: 'Развлечения', color: '#6A5ACD' }, 
    education: { name: 'Образование', color: '#98FB98' }, 
    other: { name: 'Другое', color: '#FFB6C1' } 
  };
  
  return Object.entries(categories).map(([categoryKey, categoryInfo]) => {
    const amount = categoryTotals[categoryKey] || 0;
    const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
    
    return {
      category: categoryInfo.name,
      amount,
      percentage: Math.round(percentage * 10) / 10,
      color: categoryInfo.color
    };
  }).sort((a, b) => b.amount - a.amount);
};

export const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString('ru-RU');
  }
  
  return `${start.toLocaleDateString('ru-RU')} - ${end.toLocaleDateString('ru-RU')}`;
};