import React, { useEffect, useState, useContext } from 'react';
import { getExpenses, createExpense, deleteExpense } from '../api';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import Filters from '../components/Filters';
import Charts from '../components/Charts';
import ExportButtons from '../components/ExportButtons';
import KpiPanel from '../components/KpiPanel';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import SavingHistory from '../components/SavingHistory';

export default function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [filters, setFilters] = useState({});
    const [editing, setEditing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigate = useNavigate();
    const { dark, toggle } = useContext(ThemeContext);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await getExpenses(filters);
            console.log("✅ Datos recibidos desde el backend:", res.data);
            setExpenses(res.data);
        } catch (err) {
            console.error("❌ Error al obtener gastos:", err);
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters]);

    const handleAdd = async (data) => {
        if (editing) {
            await updateExpense(editing._id, data);
            setEditing(null);
        } else {
            await createExpense(data);
        }
        fetchData();
    };

    const handleDelete = async (id) => {
        await deleteExpense(id);
        fetchData();
    };

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Loading State
    if (isLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${
                dark ? 'bg-slate-950' : 'bg-gray-50'
            }`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className={`text-lg font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Loading your dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-all duration-300 ${
            dark
                ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
                : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
        }`}>
            {/* Enhanced Professional Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
                dark
                    ? 'bg-slate-900/80 border-slate-700/50 shadow-2xl shadow-slate-900/20'
                    : 'bg-white/80 border-gray-200/50 shadow-xl shadow-gray-900/5'
            }`}>
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Enhanced Logo */}
                            <div className={`relative flex items-center justify-center w-12 h-12 rounded-xl shadow-lg ${
                                dark
                                    ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700'
                                    : 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600'
                            }`}>
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-30 animate-pulse"></div>
                            </div>

                            <div>
                                <h1 className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
                                    FinanceFlow
                                </h1>
                                <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Smart Expense Management
                                </p>
                            </div>
                        </div>

                        {/* Enhanced Action Buttons */}
                        <div className="flex items-center space-x-3">
                            {/* Quick Stats Indicator */}
                            <div className={`hidden md:flex items-center px-4 py-2 rounded-lg border ${
                                dark
                                    ? 'bg-slate-800/50 border-slate-700 text-gray-300'
                                    : 'bg-gray-50 border-gray-200 text-gray-600'
                            }`}>
                                <div className="flex items-center space-x-3 text-sm">
                                    <span className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                        {expenses.length} records
                                    </span>
                                </div>
                            </div>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggle}
                                className={`group relative inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                                    dark
                                        ? 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700 hover:border-slate-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="relative">
                                    {dark ? (
                                        <svg className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 mr-2 transition-transform group-hover:-rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                        </svg>
                                    )}
                                </div>
                                {dark ? 'Light' : 'Dark'}
                            </button>

                            {/* Logout Button */}
                            <button
                                onClick={logout}
                                className="group inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <svg className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Enhanced Main Content */}
            <main className="pt-28 px-6 pb-8">
                <div className="max-w-7xl mx-auto">

                    {/* Welcome Section with Quick Stats */}
                    <section className="mb-8">
                        <div className="text-center mb-8">
                            <h2 className={`text-3xl font-bold mb-2 ${
                                dark
                                    ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent'
                                    : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'
                            }`}>
                                Welcome to your Financial Dashboard
                            </h2>
                            <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Track, analyze, and optimize your expenses with powerful insights
                            </p>
                        </div>
                    </section>

                    {/* Enhanced KPI Section */}
                    <section className="mb-8">
                        <div className={`group rounded-2xl border transition-all duration-300 hover:shadow-2xl ${
                            dark
                                ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 hover:border-slate-600/50 backdrop-blur-xl'
                                : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-gray-200/50 hover:border-gray-300/50 backdrop-blur-xl'
                        }`}>
                            <div className="p-8">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className={`p-3 rounded-xl shadow-lg ${
                                        dark
                                            ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30'
                                            : 'bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200'
                                    }`}>
                                        <svg className={`w-6 h-6 ${dark ? 'text-emerald-400' : 'text-emerald-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                            Performance Overview
                                        </h3>
                                        <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Real-time financial metrics and insights
                                        </p>
                                    </div>
                                </div>
                                <KpiPanel />
                            </div>
                        </div>
                    </section>

                    {/* Two Column Layout for Form and Quick Actions */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">

                        {/* Enhanced Action Form */}
                        <div className="xl:col-span-2">
                            <div className={`group rounded-2xl border transition-all duration-300 hover:shadow-2xl ${
                                dark
                                    ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 hover:border-slate-600/50 backdrop-blur-xl'
                                    : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-gray-200/50 hover:border-gray-300/50 backdrop-blur-xl'
                            }`}>
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-3 rounded-xl shadow-lg ${
                                                dark
                                                    ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30'
                                                    : 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200'
                                            }`}>
                                                <svg className={`w-6 h-6 ${dark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                                    {editing ? 'Edit Expense' : 'Add New Expense'}
                                                </h3>
                                                <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {editing ? 'Update your expense details' : 'Track your spending efficiently'}
                                                </p>
                                            </div>
                                        </div>
                                        {editing && (
                                            <button
                                                onClick={() => setEditing(null)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                                                    dark
                                                        ? 'text-gray-400 hover:text-white hover:bg-slate-800 border border-slate-700'
                                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-200'
                                                }`}
                                            >
                                                Cancel Edit
                                            </button>
                                        )}
                                    </div>
                                    <ExpenseForm onAdd={handleAdd} editing={editing} onCancel={() => setEditing(null)} />
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Panel */}
                        <div className="space-y-6">
                            {/* Export Section */}
                            <div className={`rounded-2xl border p-6 ${
                                dark
                                    ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl'
                                    : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-gray-200/50 backdrop-blur-xl'
                            }`}>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className={`p-2 rounded-lg ${
                                        dark ? 'bg-orange-500/10' : 'bg-orange-50'
                                    }`}>
                                        <svg className={`w-5 h-5 ${dark ? 'text-orange-400' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h4 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                        Export Data
                                    </h4>
                                </div>
                                <ExportButtons data={expenses} />
                            </div>

                            {/* Quick Stats */}
                            <div className={`rounded-2xl border p-6 ${
                                dark
                                    ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl'
                                    : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-gray-200/50 backdrop-blur-xl'
                            }`}>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className={`p-2 rounded-lg ${
                                        dark ? 'bg-green-500/10' : 'bg-green-50'
                                    }`}>
                                        <svg className={`w-5 h-5 ${dark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <h4 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                        Quick Stats
                                    </h4>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Total Records
                                        </span>
                                        <span className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                            {expenses.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                        {/* Charts Section */}
                        <div className={`rounded-2xl border transition-all duration-300 hover:shadow-2xl ${
                            dark
                                ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 hover:border-slate-600/50 backdrop-blur-xl'
                                : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-gray-200/50 hover:border-gray-300/50 backdrop-blur-xl'
                        }`}>
                            <div className="p-8">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className={`p-3 rounded-xl shadow-lg ${
                                        dark
                                            ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30'
                                            : 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200'
                                    }`}>
                                        <svg className={`w-6 h-6 ${dark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                            Analytics Overview
                                        </h3>
                                        <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Visual insights into your spending patterns
                                        </p>
                                    </div>
                                </div>
                                <Charts expenses={expenses} />
                            </div>
                        </div>

                        {/* Savings History */}
                        <div className={`rounded-2xl border transition-all duration-300 hover:shadow-2xl ${
                            dark
                                ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 hover:border-slate-600/50 backdrop-blur-xl'
                                : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-gray-200/50 hover:border-gray-300/50 backdrop-blur-xl'
                        }`}>
                            <div className="p-8">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className={`p-3 rounded-xl shadow-lg ${
                                        dark
                                            ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30'
                                            : 'bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200'
                                    }`}>
                                        <svg className={`w-6 h-6 ${dark ? 'text-amber-400' : 'text-amber-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                            Savings Tracker
                                        </h3>
                                        <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Monitor your financial growth over time
                                        </p>
                                    </div>
                                </div>
                                <SavingHistory />
                            </div>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <section className="mb-8">
                        <div className={`rounded-2xl border transition-all duration-300 hover:shadow-2xl ${
                            dark
                                ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 hover:border-slate-600/50 backdrop-blur-xl'
                                : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-gray-200/50 hover:border-gray-300/50 backdrop-blur-xl'
                        }`}>
                            <div className="p-8">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className={`p-3 rounded-xl shadow-lg ${
                                        dark
                                            ? 'bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 border border-indigo-500/30'
                                            : 'bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200'
                                    }`}>
                                        <svg className={`w-6 h-6 ${dark ? 'text-indigo-400' : 'text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                            Smart Filters
                                        </h3>
                                        <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Refine your data with advanced filtering options
                                        </p>
                                    </div>
                                </div>
                                <Filters onFilter={setFilters} />
                            </div>
                        </div>
                    </section>

                    {/* Enhanced Expense List */}
                    <section>
                        <div className={`rounded-2xl border transition-all duration-300 hover:shadow-2xl ${
                            dark
                                ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 hover:border-slate-600/50 backdrop-blur-xl'
                                : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-gray-200/50 hover:border-gray-300/50 backdrop-blur-xl'
                        }`}>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-3 rounded-xl shadow-lg ${
                                            dark
                                                ? 'bg-gradient-to-br from-gray-500/20 to-gray-600/20 border border-gray-500/30'
                                                : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'
                                        }`}>
                                            <svg className={`w-6 h-6 ${dark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a22 0 00-2-2H9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                                Expense Records
                                            </h3>
                                            <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Complete list of your tracked expenses
                                            </p>
                                        </div>
                                    </div>

                                    {/* Record Count Badge */}
                                    <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                        dark
                                            ? 'bg-slate-800 text-gray-300 border border-slate-700'
                                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                                    }`}>
                                        {expenses.length} {expenses.length === 1 ? 'record' : 'records'}
                                    </div>
                                </div>

                                <ExpenseList
                                    expenses={expenses}
                                    onEdit={setEditing}
                                    onDelete={handleDelete}
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}