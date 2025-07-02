import React, {useEffect, useState, useContext} from 'react';
import {getExpenses, createExpense, updateExpense, deleteExpense} from '../api';
import {ThemeContext} from '../context/ThemeContext';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import Filters from '../components/Filters';

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [editing, setEditing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    const {dark} = useContext(ThemeContext);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await getExpenses();
            setExpenses(res.data);
            setFilteredExpenses(res.data);
        } catch (err) {
            console.error("❌ Error al obtener gastos:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = async (data) => {
        try {
            if (editing) {
                await updateExpense(editing._id, data);
                setEditing(null);
            } else {
                await createExpense(data);
            }
            await fetchData();
            setModalVisible(false);
        } catch (err) {
            console.error("❌ Error al guardar gasto:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteExpense(id);
            await fetchData();
        } catch (err) {
            console.error("❌ Error al eliminar gasto:", err);
        }
    };

    const handleEdit = (expense) => {
        setEditing(expense);
        setModalVisible(true);
    };

    const handleCancel = () => {
        setEditing(null);
        setModalVisible(false);
    };

    const handleNewExpense = () => {
        setEditing(null);
        setModalVisible(true);
    };

    const handleFilter = (filtered) => {
        setFilteredExpenses(filtered);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'Food': '🍽️',
            'Transportation': '🚗',
            'Entertainment': '🎬',
            'Shopping': '🛒',
            'Health': '🏥',
            'Education': '📚',
            'Utilities': '💡',
            'Other': '📝'
        };
        return icons[category] || '📝';
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Food': 'bg-orange-100 text-orange-800 border-orange-200',
            'Transportation': 'bg-blue-100 text-blue-800 border-blue-200',
            'Entertainment': 'bg-purple-100 text-purple-800 border-purple-200',
            'Shopping': 'bg-pink-100 text-pink-800 border-pink-200',
            'Health': 'bg-red-100 text-red-800 border-red-200',
            'Education': 'bg-indigo-100 text-indigo-800 border-indigo-200',
            'Utilities': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Other': 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getCategoryColorDark = (category) => {
        const colors = {
            'Food': 'bg-orange-900/30 text-orange-300 border-orange-700/50',
            'Transportation': 'bg-blue-900/30 text-blue-300 border-blue-700/50',
            'Entertainment': 'bg-purple-900/30 text-purple-300 border-purple-700/50',
            'Shopping': 'bg-pink-900/30 text-pink-300 border-pink-700/50',
            'Health': 'bg-red-900/30 text-red-300 border-red-700/50',
            'Education': 'bg-indigo-900/30 text-indigo-300 border-indigo-700/50',
            'Utilities': 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50',
            'Other': 'bg-gray-900/30 text-gray-300 border-gray-700/50'
        };
        return colors[category] || 'bg-gray-900/30 text-gray-300 border-gray-700/50';
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className={`text-lg font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Loading your expenses...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen pt-8 pb-4 px-1 sm:px-1 lg:px-1">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header Section */}
                    <section className="text-center">
                        <div className="mb-8">
                            <h1 className={`text-4xl font-bold mb-4 transition-all duration-500 ${
                                dark
                                    ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent'
                                    : 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent'
                            }`}>
                                Expense Management
                            </h1>
                        </div>
                    </section>

                    {/* Expenses List Section with Integrated Filters */}
                    <section className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                        <div className={`rounded-2xl border transition-all duration-500 shadow-lg ${
                            dark
                                ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl'
                                : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-gray-200/50 backdrop-blur-xl'
                        }`}>
                            <div className="p-8">
                                {/* List Header */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                                    {/* Icon and Title */}
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-4 rounded-xl shadow-lg ${
                                            dark
                                                ? 'bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 border border-indigo-500/30'
                                                : 'bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200'
                                        }`}>
                                            <svg className={`w-8 h-8 ${dark ? 'text-indigo-400' : 'text-indigo-600'}`}
                                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className={`text-3xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                                Your Expenses
                                            </h2>
                                            <p className={`text-lg font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Filter and manage your recorded expenses
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div
                                        className={`inline-flex items-center px-6 py-3 rounded-xl border transition-all duration-300 ${
                                            dark
                                                ? 'bg-slate-800/50 border-slate-700 text-gray-300'
                                                : 'bg-white/70 border-gray-200 text-gray-600'
                                        } backdrop-blur-sm shadow-lg`}>
                                        <div className="flex items-center space-x-4 text-sm font-medium">
                <span className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    {filteredExpenses.length} of {expenses.length} Expenses
                </span>
                                            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                                            <span className="flex items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                    Total: {formatCurrency(filteredExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0))}
                </span>
                                        </div>
                                    </div>

                                    {/* New Expense Button */}
                                    <div>
                                        <button
                                            onClick={handleNewExpense}
                                            className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                                                dark
                                                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white'
                                                    : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white'
                                            } shadow-lg`}
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                            </svg>
                                            New Expense
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">

                                {/* Main Content with Sidebar Layout */}
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Filters Sidebar */}
                                    <div className="lg:w-80 flex-shrink-0">
                                        <div
                                            className={`sticky top-24 rounded-xl border p-6 transition-all duration-300 ${
                                                dark
                                                    ? 'bg-slate-800/50 border-slate-700/50 backdrop-blur-sm'
                                                    : 'bg-white/70 border-gray-200/50 backdrop-blur-sm'
                                            } shadow-lg`}>
                                            <Filters
                                                expenses={expenses}
                                                onFilter={handleFilter}
                                            />
                                        </div>
                                    </div>

                                    {/* Expenses Table */}
                                    <div className="flex-1 min-w-0">
                                        <div className="relative">
                                            {filteredExpenses.length === 0 ? (
                                                <div className="text-center py-12">
                                                    <div
                                                        className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                                                            dark ? 'bg-slate-800/50' : 'bg-gray-100'
                                                        }`}>
                                                        <svg
                                                            className={`w-12 h-12 ${dark ? 'text-gray-600' : 'text-gray-400'}`}
                                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                                        </svg>
                                                    </div>
                                                    <h3 className={`text-xl font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                        {expenses.length === 0 ? 'No expenses yet' : 'No expenses match your filters'}
                                                    </h3>
                                                    <p className={`${dark ? 'text-gray-500' : 'text-gray-400'} mb-6`}>
                                                        {expenses.length === 0
                                                            ? 'Start by adding your first expense'
                                                            : 'Try adjusting your filter criteria'
                                                        }
                                                    </p>
                                                    {expenses.length === 0 && (
                                                        <button
                                                            onClick={handleNewExpense}
                                                            className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                                                                dark
                                                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                                            } shadow-lg hover:shadow-xl`}
                                                        >
                                                            <svg className="w-5 h-5 mr-2" fill="none"
                                                                 stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                      strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                                            </svg>
                                                            Add First Expense
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div
                                                    className={`rounded-xl border overflow-hidden transition-all duration-300 ${
                                                        dark
                                                            ? 'bg-slate-800/30 border-slate-700/50'
                                                            : 'bg-white/50 border-gray-200/50'
                                                    } backdrop-blur-sm shadow-lg`}>
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full">
                                                            <thead>
                                                            <tr className={`border-b-2 ${dark ? 'border-slate-700' : 'border-gray-200'} ${
                                                                dark ? 'bg-slate-800/50' : 'bg-gray-50/70'
                                                            }`}>
                                                                <th className={`text-left py-4 px-6 font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                    Date
                                                                </th>
                                                                <th className={`text-left py-4 px-6 font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                    Category
                                                                </th>
                                                                <th className={`text-left py-4 px-6 font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                    Description
                                                                </th>
                                                                <th className={`text-right py-4 px-6 font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                    Amount
                                                                </th>
                                                                <th className={`text-center py-4 px-6 font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                    Actions
                                                                </th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {filteredExpenses.map((expense, index) => (
                                                                <tr
                                                                    key={expense._id}
                                                                    className={`border-b transition-all duration-200 hover:scale-[1.01] ${
                                                                        dark
                                                                            ? 'border-slate-700/50 hover:bg-slate-800/30'
                                                                            : 'border-gray-100 hover:bg-gray-50/50'
                                                                    }`}
                                                                >
                                                                    <td className="py-4 px-6">
                                                                        <div className="flex items-center space-x-3">
                                                                            <div className={`p-2 rounded-lg ${
                                                                                dark ? 'bg-slate-800/50' : 'bg-gray-100'
                                                                            }`}>
                                                                                <svg
                                                                                    className={`w-4 h-4 ${dark ? 'text-gray-400' : 'text-gray-600'}`}
                                                                                    fill="none" stroke="currentColor"
                                                                                    viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round"
                                                                                          strokeLinejoin="round"
                                                                                          strokeWidth={2}
                                                                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                                                </svg>
                                                                            </div>
                                                                            <div>
                                                                                <p className={`font-medium ${dark ? 'text-gray-200' : 'text-gray-900'}`}>
                                                                                    {formatDate(expense.date)}
                                                                                </p>
                                                                                <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                                                    {new Date(expense.date).toLocaleDateString('en-US', {weekday: 'short'})}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                        <span
                                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                                                                dark ? getCategoryColorDark(expense.category) : getCategoryColor(expense.category)
                                                            }`}>
                                                            <span
                                                                className="mr-2">{getCategoryIcon(expense.category)}</span>
                                                            {expense.category}
                                                        </span>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <div>
                                                                            <p className={`font-medium ${dark ? 'text-gray-200' : 'text-gray-900'}`}>
                                                                                {expense.description}
                                                                            </p>
                                                                            {expense.notes && (
                                                                                <p className={`text-sm mt-1 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                                                    {expense.notes}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-4 px-6 text-right">
                                                        <span
                                                            className={`text-lg font-semibold ${dark ? 'text-gray-200' : 'text-gray-900'}`}>
                                                            {formatCurrency(expense.amount)}
                                                        </span>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <div
                                                                            className="flex items-center justify-center space-x-2">
                                                                            <button
                                                                                onClick={() => handleEdit(expense)}
                                                                                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                                                                                    dark
                                                                                        ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                                                                                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                                                                }`}
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none"
                                                                                     stroke="currentColor"
                                                                                     viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round"
                                                                                          strokeLinejoin="round"
                                                                                          strokeWidth={2}
                                                                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                                                                </svg>
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDelete(expense._id)}
                                                                                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                                                                                    dark
                                                                                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                                                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                                                                                }`}
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none"
                                                                                     stroke="currentColor"
                                                                                     viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round"
                                                                                          strokeLinejoin="round"
                                                                                          strokeWidth={2}
                                                                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Decorative Background Elements */}
                                            <div
                                                className="absolute -top-2 -right-2 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-xl animate-pulse pointer-events-none"></div>
                                            <div
                                                className="absolute -bottom-2 -left-2 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-xl animate-pulse pointer-events-none"
                                                style={{animationDelay: '1s'}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Modal for Add/Edit Expense */}
            {modalVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleCancel}
                    ></div>

                    {/* Modal Content */}
                    <div
                        className={`relative w-full max-w-2xl mx-auto rounded-2xl border shadow-2xl transform transition-all duration-300 ${
                            dark
                                ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'
                                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                        }`}>
                        <div className="p-8">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-4 rounded-xl shadow-lg ${
                                        dark
                                            ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30'
                                            : 'bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200'
                                    }`}>
                                        <svg className={`w-8 h-8 ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}
                                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d={editing ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"}/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className={`text-3xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                            {editing ? 'Edit Expense' : 'New Expense'}
                                        </h2>
                                        <p className={`text-lg font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {editing ? 'Update your expense details' : 'Add a new expense to your records'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCancel}
                                    className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                                        dark
                                            ? 'bg-slate-800/50 border border-slate-700/50 text-gray-400 hover:text-gray-300 hover:bg-slate-800/70'
                                            : 'bg-white/70 border border-gray-200/50 text-gray-500 hover:text-gray-700 hover:bg-white/90'
                                    } backdrop-blur-sm shadow-md hover:shadow-lg`}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>

                            {/* Form */}
                            <ExpenseForm
                                onAdd={handleAdd}
                                editing={editing}
                                onCancel={handleCancel}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}