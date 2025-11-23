export const validateExpenseData = (expense) => {
  if (!expense || typeof expense !== 'object') return false;
  
  const requiredFields = ['id', 'description', 'category', 'date', 'amount'];
  const hasAllFields = requiredFields.every(field => field in expense);
  
  if (!hasAllFields) return false;
  
  return typeof expense.id === 'string' &&
         typeof expense.description === 'string' &&
         typeof expense.category === 'string' &&
         typeof expense.date === 'string' &&
         typeof expense.amount === 'number' &&
         expense.amount > 0;
};

export const validateExpensesArray = (expenses) => {
  if (!Array.isArray(expenses)) return [];
  
  return expenses.filter(expense => validateExpenseData(expense));
};

export const validateUser = (user) => {
  if (!user || typeof user !== 'object') return null;
  
  return user.id && user.email ? user : null;
};