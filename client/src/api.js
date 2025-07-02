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
export const getBudget = (month) => API.get(`/budget/${month}`);
export const setBudget = (month, amount) => API.put(`/budget/${month}`, {amount});
export const getMonthlyBudget = (month) => API.get(`/budget/${month}`); 

// Incomes - CORREGIDAS para usar la instancia API configurada
export const getIncomes = () => API.get('/income');
export const addIncome = (incomeData) => API.post('/income', incomeData);