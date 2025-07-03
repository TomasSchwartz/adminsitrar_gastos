import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { getBudgets } from '../api'; // Asegúrate de importar esta función

export default function ExpenseForm({ onAdd, editing, onCancel }) {
    const [form, setForm] = useState({
        description: '',
        amount: '',
        date: '',
        category: 'Other',
        notes: '',
        budget: '' // Nuevo campo para budget
    });

    const [budgets, setBudgets] = useState([]); // Estado para almacenar los budgets
    const [loadingBudgets, setLoadingBudgets] = useState(true);

    const { dark } = useContext(ThemeContext);

    const categories = [
        { value: 'Food', label: 'Food', icon: '🍽️' },
        { value: 'Transportation', label: 'Transportation', icon: '🚗' },
        { value: 'Entertainment', label: 'Entertainment', icon: '🎬' },
        { value: 'Shopping', label: 'Shopping', icon: '🛒' },
        { value: 'Health', label: 'Health', icon: '🏥' },
        { value: 'Education', label: 'Education', icon: '📚' },
        { value: 'Utilities', label: 'Utilities', icon: '💡' },
        { value: 'Other', label: 'Other', icon: '📝' }
    ];

    // Cargar budgets al montar el componente
    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const response = await getBudgets();
                setBudgets(response.data);
            } catch (error) {
                console.error('Error loading budgets:', error);
                setBudgets([]);
            } finally {
                setLoadingBudgets(false);
            }
        };

        fetchBudgets();
    }, []);

    useEffect(() => {
        if (editing) {
            setForm({
                description: editing.description || '',
                amount: editing.amount || '',
                date: editing.date ? editing.date.split('T')[0] : '',
                category: editing.category || 'Other',
                notes: editing.notes || '',
                budget: editing.budget || '' // Incluir budget en la edición
            });
        }
    }, [editing]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        await onAdd(form);
        setForm({
            description: '',
            amount: '',
            date: '',
            category: 'Other',
            notes: '',
            budget: ''
        });
    };

    // Filtrar budgets por el mes actual si no hay fecha seleccionada
    const getFilteredBudgets = () => {
        if (!form.date) return budgets;

        const expenseDate = new Date(form.date);
        const expenseMonth = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;

        return budgets.filter(budget => budget.month === expenseMonth);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description */}
            <div>
                <label className={`block text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description *
                </label>
                <input
                    name="description"
                    placeholder="What did you spend on?"
                    value={form.description}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        dark
                            ? 'bg-slate-800/50 border-slate-600 text-gray-200 placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                />
            </div>

            {/* Amount and Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={`block text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Amount *
                    </label>
                    <div className="relative">
                        <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-lg font-medium ${
                            dark ? 'text-gray-400' : 'text-gray-600'
                        }`}>$</span>
                        <input
                            name="amount"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={form.amount}
                            onChange={handleChange}
                            required
                            className={`w-full pl-8 pr-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                dark
                                    ? 'bg-slate-800/50 border-slate-600 text-gray-200 placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            }`}
                        />
                    </div>
                </div>

                <div>
                    <label className={`block text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Date *
                    </label>
                    <input
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                            dark
                                ? 'bg-slate-800/50 border-slate-600 text-gray-200'
                                : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    />
                </div>
            </div>

            {/* Category and Budget Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={`block text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Category *
                    </label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                            dark
                                ? 'bg-slate-800/50 border-slate-600 text-gray-200'
                                : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.icon} {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className={`block text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Budget <span className={`text-sm font-normal ${dark ? 'text-gray-500' : 'text-gray-400'}`}>(optional)</span>
                    </label>
                    <select
                        name="budget"
                        value={form.budget}
                        onChange={handleChange}
                        disabled={loadingBudgets}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                            dark
                                ? 'bg-slate-800/50 border-slate-600 text-gray-200'
                                : 'bg-white border-gray-300 text-gray-900'
                        } ${loadingBudgets ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <option value="">
                            {loadingBudgets ? 'Loading budgets...' : 'No budget'}
                        </option>
                        {getFilteredBudgets().map(budget => (
                            <option key={budget._id} value={budget._id}>
                                💰 {budget.name} ({budget.month}) - ${budget.maxAmount}
                            </option>
                        ))}
                    </select>
                    {form.date && getFilteredBudgets().length === 0 && !loadingBudgets && (
                        <p className={`text-xs mt-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                            No budgets available for {new Date(form.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    )}
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className={`block text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Notes <span className={`text-sm font-normal ${dark ? 'text-gray-500' : 'text-gray-400'}`}>(optional)</span>
                </label>
                <textarea
                    name="notes"
                    placeholder="Additional details..."
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${
                        dark
                            ? 'bg-slate-800/50 border-slate-600 text-gray-200 placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                    type="submit"
                    className={`flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-offset-2 ${
                        dark
                            ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white focus:ring-emerald-500'
                            : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white focus:ring-emerald-500'
                    } shadow-lg hover:shadow-xl`}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editing ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                    </svg>
                    {editing ? 'Update Expense' : 'Add Expense'}
                </button>

                {editing && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 ${
                            dark
                                ? 'border-slate-600 text-gray-300 hover:bg-slate-800/50 hover:border-slate-500'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}