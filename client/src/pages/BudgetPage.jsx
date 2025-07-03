import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { getBudgets, createBudget, updateBudget, deleteBudget, getExpenses } from '../api';

export default function BudgetManagement() {
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [formData, setFormData] = useState({ name: '', maxAmount: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const { dark } = useContext(ThemeContext);

    // Obtener el mes actual en formato YYYY-MM
    const getCurrentMonth = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    };

    const getCurrentMonthName = () => {
        const now = new Date();
        return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Cargar budgets
            const budgetsRes = await getBudgets();
            setBudgets(budgetsRes.data);

            // Cargar expenses para calcular el uso del presupuesto
            const expensesRes = await getExpenses();
            setExpenses(expensesRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateBudgetUsage = (budget) => {
        const currentMonth = getCurrentMonth();
        const currentMonthExpenses = expenses.filter(expense =>
            expense.date && expense.date.startsWith(currentMonth)
        );

        const totalSpent = currentMonthExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
        const usedPercentage = budget.maxAmount > 0 ? (totalSpent / budget.maxAmount) * 100 : 0;
        const remaining = budget.maxAmount - totalSpent;

        return { totalSpent, usedPercentage, remaining };
    };

    const handleOpenModal = (budget = null) => {
        setEditingBudget(budget);
        setFormData(budget ? { name: budget.name, maxAmount: budget.maxAmount } : { name: '', maxAmount: '' });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingBudget(null);
        setFormData({ name: '', maxAmount: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.maxAmount || formData.maxAmount <= 0) {
            return;
        }

        setIsSubmitting(true);
        try {
            const budgetData = {
                name: formData.name.trim(),
                maxAmount: parseFloat(formData.maxAmount),
                month: getCurrentMonth()
            };

            if (editingBudget) {
                const updatedBudget = await updateBudget(editingBudget._id, budgetData);
                setBudgets(budgets.map(b => b._id === editingBudget._id ? updatedBudget.data : b));
            } else {
                const newBudget = await createBudget(budgetData);
                setBudgets(prev => [...prev, newBudget.data]);
            }

            handleCloseModal();
        } catch (error) {
            console.error('Error saving budget:', error);
            // Aquí podrías mostrar un mensaje de error al usuario
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteBudget(id);
            setBudgets(budgets.filter(b => b._id !== id));
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
    };

    const currentMonthBudgets = budgets.filter(budget => budget.month === getCurrentMonth());

    if (isLoading) {
        return (
            <div className="min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className={`text-lg font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Loading your budgets...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-8 pb-8 px-1 sm:px-1 lg:px-1">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <section className="text-center">
                    <div className="mb-8">
                        <h1 className={`text-4xl font-bold mb-4 transition-all duration-500 ${
                            dark
                                ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent'
                                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'
                        }`}>
                            Budget Management
                        </h1>
                        <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Manage your budgets for {getCurrentMonthName()}
                        </p>
                    </div>
                </section>

                {/* Create Budget Button */}
                <section className="flex justify-center">
                    <button
                        onClick={() => handleOpenModal()}
                        className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                            dark
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                                : 'bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800'
                        } shadow-lg`}
                    >
                        <span className="flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                            <span>Create New Budget</span>
                        </span>
                    </button>
                </section>

                {/* Budgets Grid or Empty State */}
                {currentMonthBudgets.length === 0 ? (
                    <section className="text-center py-20">
                        <div className={`rounded-2xl border p-12 transition-all duration-300 ${
                            dark
                                ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50'
                                : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-gray-200/50'
                        } shadow-lg backdrop-blur-xl`}>
                            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                                dark ? 'bg-slate-700/50' : 'bg-gray-100'
                            }`}>
                                <svg className={`w-12 h-12 ${dark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <h3 className={`text-2xl font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
                                No budgets found
                            </h3>
                            <p className={`text-lg mb-8 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                You haven't created any budgets for {getCurrentMonthName()} yet.
                            </p>
                            <button
                                onClick={() => handleOpenModal()}
                                className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                                    dark
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
                                        : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800'
                                } shadow-lg hover:shadow-xl`}
                            >
                                Create Your First Budget
                            </button>
                        </div>
                    </section>
                ) : (
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentMonthBudgets.map((budget) => {
                            const { totalSpent, usedPercentage, remaining } = calculateBudgetUsage(budget);
                            return (
                                <div
                                    key={budget._id}
                                    className={`rounded-xl border p-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                                        dark
                                            ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50'
                                            : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-gray-200/50'
                                    } shadow-lg backdrop-blur-xl`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                            {budget.name}
                                        </h3>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleOpenModal(budget)}
                                                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                                                    dark ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                                                }`}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(budget._id)}
                                                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                                                    dark ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' : 'bg-red-100 hover:bg-red-200 text-red-600'
                                                }`}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Budget Limit
                                            </span>
                                            <span className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                                ${budget.maxAmount.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Spent
                                            </span>
                                            <span className={`text-lg font-bold ${dark ? 'text-red-400' : 'text-red-600'}`}>
                                                ${totalSpent.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Remaining
                                            </span>
                                            <span className={`text-lg font-bold ${
                                                remaining >= 0
                                                    ? dark ? 'text-green-400' : 'text-green-600'
                                                    : dark ? 'text-red-400' : 'text-red-600'
                                            }`}>
                                                ${remaining.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="mt-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Usage
                                                </span>
                                                <span className={`text-sm font-bold ${
                                                    usedPercentage <= 75
                                                        ? dark ? 'text-green-400' : 'text-green-600'
                                                        : usedPercentage <= 90
                                                            ? dark ? 'text-yellow-400' : 'text-yellow-600'
                                                            : dark ? 'text-red-400' : 'text-red-600'
                                                }`}>
                                                    {usedPercentage.toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className={`w-full bg-gray-200 rounded-full h-3 ${dark ? 'bg-gray-700' : ''}`}>
                                                <div
                                                    className={`h-3 rounded-full transition-all duration-1000 ${
                                                        usedPercentage <= 75
                                                            ? 'bg-gradient-to-r from-green-500 to-green-600'
                                                            : usedPercentage <= 90
                                                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                                                                : 'bg-gradient-to-r from-red-500 to-red-600'
                                                    }`}
                                                    style={{width: `${Math.min(usedPercentage, 100)}%`}}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                )}

                {/* Modal for Create/Edit Budget */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                        <div className={`w-full max-w-md mx-4 rounded-2xl border p-8 ${
                            dark
                                ? 'bg-slate-900 border-slate-700'
                                : 'bg-white border-gray-200'
                        } shadow-2xl transform transition-all duration-300 scale-100`}>
                            <h2 className={`text-2xl font-bold mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>
                                {editingBudget ? 'Edit Budget' : 'Create New Budget'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Budget Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="e.g., Groceries, Entertainment, Travel"
                                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            dark
                                                ? 'bg-slate-800 border-slate-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Maximum Amount
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.maxAmount}
                                        onChange={(e) => setFormData({...formData, maxAmount: e.target.value})}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            dark
                                                ? 'bg-slate-800 border-slate-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                        required
                                    />
                                </div>

                                <div className={`p-4 rounded-xl ${dark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        This budget will be created for <span className="font-semibold">{getCurrentMonthName()}</span>
                                    </p>
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                            dark
                                                ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                                            isSubmitting
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800'
                                        }`}
                                    >
                                        {isSubmitting ? 'Saving...' : editingBudget ? 'Update Budget' : 'Create Budget'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                        <div className={`w-full max-w-md mx-4 rounded-2xl border p-8 ${
                            dark
                                ? 'bg-slate-900 border-slate-700'
                                : 'bg-white border-gray-200'
                        } shadow-2xl`}>
                            <h2 className={`text-2xl font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
                                Delete Budget
                            </h2>
                            <p className={`mb-6 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Are you sure you want to delete this budget? This action cannot be undone.
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                        dark
                                            ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}