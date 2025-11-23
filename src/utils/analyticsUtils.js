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
    food: { name: 'Еда', color: '#D9B6FF' },
    transport: { name: 'Транспорт', color: '#FFB53D' },
    housing: { name: 'Жилье', color: '#6EE4FE' },
    entertainment: { name: 'Развлечения', color: '#B0AEFF' },
    education: { name: 'Образование', color: '#BCEC30' },
    other: { name: 'Другое', color: '#FFB9B8' }
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
  
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} - ${end.getDate()} ${start.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}`;
  }
  
  if (start.getFullYear() === end.getFullYear()) {
    return `${start.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} - ${end.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  }
  
  return `${start.toLocaleDateString('ru-RU')} - ${end.toLocaleDateString('ru-RU')}`;
};