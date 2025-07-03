// src/pages/BudgetsPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { getMonthlyBudget as getBudgets, createBudget, updateBudget, deleteBudget } from '../api';
import { ThemeContext } from '../context/ThemeContext';

export default function BudgetsPage() {
    const { dark } = useContext(ThemeContext);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', maxAmount: '', month: '' });
    const [editId, setEditId] = useState(null);

    const fetchBudgets = async () => {
        setLoading(true);
        try {
            const res = await getBudgets();
            setBudgets(res.data);
        } catch (err) {
            console.error("Error loading budgets:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await updateBudget(editId, formData);
            } else {
                await createBudget(formData);
            }
            setFormData({ name: '', maxAmount: '', month: '' });
            setEditId(null);
            fetchBudgets();
        } catch (err) {
            alert("Failed to save budget. " + err.response?.data?.message || '');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this budget?")) {
            await deleteBudget(id);
            fetchBudgets();
        }
    };

    const handleEdit = (budget) => {
        setFormData({
            name: budget.name,
            maxAmount: budget.maxAmount,
            month: budget.month
        });
        setEditId(budget._id);
    };

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 max-w-5xl mx-auto">
            <h1 className={`text-3xl font-bold mb-8 text-center ${dark ? 'text-white' : 'text-gray-900'}`}>
                Manage Monthly Budgets
            </h1>

            {/* Budget Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-10 bg-white/70 dark:bg-slate-800/50 p-6 rounded-xl shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        required
                        placeholder="Budget Name"
                        className="rounded-lg px-4 py-2 border dark:bg-slate-700"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                    <input
                        type="number"
                        required
                        placeholder="Max Amount"
                        className="rounded-lg px-4 py-2 border dark:bg-slate-700"
                        value={formData.maxAmount}
                        onChange={e => setFormData({...formData, maxAmount: e.target.value})}
                    />
                    <input
                        type="month"
                        required
                        className="rounded-lg px-4 py-2 border dark:bg-slate-700"
                        value={formData.month}
                        onChange={e => setFormData({...formData, month: e.target.value})}
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                >
                    {editId ? 'Update Budget' : 'Create Budget'}
                </button>
            </form>

            {/* Budget List */}
            {loading ? (
                <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
            ) : (
                <div className="space-y-4">
                    {budgets.length === 0 && (
                        <p className="text-center text-gray-500 dark:text-gray-400">No budgets found.</p>
                    )}
                    {budgets.map(budget => (
                        <div key={budget._id} className="p-4 rounded-xl border flex justify-between items-center transition-all duration-300 hover:shadow-md dark:bg-slate-800/30 dark:border-slate-700">
                            <div>
                                <p className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    {budget.name} ({budget.month})
                                </p>
                                <p className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Max: ${budget.maxAmount.toLocaleString()}
                                </p>
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleEdit(budget)}
                                    className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(budget._id)}
                                    className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}