import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Expenses
export const getExpenses = (params) => API.get('/expenses', {params});
export const createExpense = (data) => API.post('/expenses', data);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);
export const updateExpense = (id, data) => API.put(`/expenses/${id}`, data);

// Budget
export const getBudget = (params) => API.get('/budgets', { params });
export const setBudget = (month, amount) => API.put(`/budget/${month}`, {amount});

// Budgets
// Budget (usar singular si así está en tu backend)
export const getMonthlyBudget = (month) => API.get(`/budget`, { params: { month } });
export const createBudget = (data) => API.post('/budget', data);
export const updateBudget = (id, data) => API.put(`/budget/${id}`, data);
export const deleteBudget = (id) => API.delete(`/budget/${id}`);


// Incomes - CORREGIDAS para usar la instancia API configurada
export const getIncomes = () => API.get('/income');
export const addIncome = (incomeData) => API.post('/income', incomeData);