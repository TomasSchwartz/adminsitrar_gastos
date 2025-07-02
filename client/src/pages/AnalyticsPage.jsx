import React, {useEffect, useState, useContext} from 'react';
import {getExpenses} from '../api';
import {ThemeContext} from '../context/ThemeContext';
import Charts from '../components/Charts';
import SavingHistory from '../components/SavingHistory';

export default function AnalyticsPage() {
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {dark} = useContext(ThemeContext);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await getExpenses();
            setExpenses(res.data);
        } catch (err) {
            console.error("❌ Error al obtener gastos:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Calculate analytics metrics
    const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const expensesByCategory = expenses.reduce((acc, exp) => {
        const category = exp.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + (exp.amount || 0);
        return acc;
    }, {});
    const topCategory = Object.entries(expensesByCategory).sort(([, a], [, b]) => b - a)[0];

    // Budget calculations
    const monthlyBudget = 2000; // This could come from user settings
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const currentMonthExpenses = expenses
        .filter(exp => exp.date && exp.date.startsWith(currentMonth))
        .reduce((sum, exp) => sum + (exp.amount || 0), 0);

    const budgetUsed = (currentMonthExpenses / monthlyBudget) * 100;
    const remainingBudget = monthlyBudget - currentMonthExpenses;
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const currentDay = new Date().getDate();
    const dailyBudgetRemaining = remainingBudget / (daysInMonth - currentDay + 1);

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className={`text-lg font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Loading analytics data...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-8 pb-8 px-1 sm:px-1 lg:px-1"
             style={{scrollBehavior: 'smooth'}}>


            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <section className="text-center">
                    <div className="mb-8">
                        <h1 className={`text-4xl font-bold mb-4 transition-all duration-500 ${
                            dark
                                ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent'
                                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent'
                        }`}>
                            Financial Analytics
                        </h1>
                        <p className={`text-xl transition-colors duration-300 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Deep insights into your spending patterns and financial trends
                        </p>

                        {/* Analytics Stats Bar */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                            <div
                                className={`inline-flex items-center px-6 py-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
                                    dark
                                        ? 'bg-slate-800/50 border-slate-700 text-gray-300 hover:bg-slate-800/70'
                                        : 'bg-white/70 border-gray-200 text-gray-600 hover:bg-white/90'
                                } backdrop-blur-sm shadow-lg hover:shadow-xl`}>
                                <div className="flex items-center space-x-4 text-sm font-medium">
                                    <span className="flex items-center">
                                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                                        {expenses.length} Records
                                    </span>
                                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                                    <span className="flex items-center">
                                        <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
                                        ${totalExpenses.toFixed(2)} Total
                                    </span>
                                </div>
                            </div>

                            {topCategory && (
                                <div
                                    className={`inline-flex items-center px-6 py-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
                                        dark
                                            ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 text-purple-300'
                                            : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-700'
                                    } backdrop-blur-sm shadow-lg hover:shadow-xl`}>
                                    <div className="flex items-center space-x-2 text-sm font-medium">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                        </svg>
                                        <span>Top: {topCategory[0]} (${topCategory[1].toFixed(2)})</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Analytics Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Charts Section */}
                    <section className="xl:col-span-2 animate-fade-in-up">
                        <div
                            className={`group rounded-2xl border transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-1 ${
                                dark
                                    ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 hover:border-slate-600/50 backdrop-blur-xl'
                                    : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-gray-200/50 hover:border-gray-300/50 backdrop-blur-xl'
                            } shadow-lg`}>
                            <div className="p-8">
                                {/* Charts Header */}
                                <div className="flex items-center space-x-4 mb-8">
                                    <div
                                        className={`p-4 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 ${
                                            dark
                                                ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30'
                                                : 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200'
                                        }`}>
                                        <svg
                                            className={`w-8 h-8 transition-colors duration-300 ${dark ? 'text-purple-400' : 'text-purple-600'}`}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className={`text-3xl font-bold transition-colors duration-300 ${dark ? 'text-white' : 'text-gray-900'}`}>
                                            Charts & Visualizations
                                        </h2>
                                        <p className={`text-lg font-medium transition-colors duration-300 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Interactive data visualization and trends
                                        </p>
                                    </div>
                                </div>

                                {/* Charts Content */}
                                <div className="relative">
                                    {expenses.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div
                                                className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                                                    dark ? 'bg-slate-800/50' : 'bg-gray-100'
                                                }`}>
                                                <svg className={`w-12 h-12 ${dark ? 'text-gray-600' : 'text-gray-400'}`}
                                                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                                </svg>
                                            </div>
                                            <h3 className={`text-xl font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                No data to visualize
                                            </h3>
                                            <p className={`${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                Add some expenses to see beautiful charts
                                            </p>
                                        </div>
                                    ) : (
                                        <Charts expenses={expenses}/>
                                    )}

                                    {/* Decorative Background Elements */}
                                    <div
                                        className="absolute -top-2 -right-2 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-pulse pointer-events-none"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Right Column - Budget and Savings */}
                    <div className="space-y-8">
                        {/* Monthly Budget Section */}
                        <section className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                            <div
                                className={`group rounded-2xl border transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-1 ${
                                    dark
                                        ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 hover:border-slate-600/50 backdrop-blur-xl'
                                        : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-gray-200/50 hover:border-gray-300/50 backdrop-blur-xl'
                                } shadow-lg`}>
                                <div className="p-6">
                                    {/* Budget Header */}
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div
                                            className={`p-3 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 ${
                                                dark
                                                    ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30'
                                                    : 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200'
                                            }`}>
                                            <svg
                                                className={`w-6 h-6 transition-colors duration-300 ${dark ? 'text-green-400' : 'text-green-600'}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className={`text-xl font-bold transition-colors duration-300 ${dark ? 'text-white' : 'text-gray-900'}`}>
                                                Presupuesto Mensual
                                            </h2>
                                            <p className={`text-sm font-medium transition-colors duration-300 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Progreso vs presupuesto planificado
                                            </p>
                                        </div>
                                    </div>

                                    {/* Budget Progress */}
                                    <div className="space-y-4">
                                        {/* Budget Bar */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span
                                                    className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    Gastado este mes
                                                </span>
                                                <span
                                                    className={`text-sm font-bold ${budgetUsed > 100 ? (dark ? 'text-red-400' : 'text-red-600') : (dark ? 'text-green-400' : 'text-green-600')}`}>
                                                    {budgetUsed.toFixed(1)}%
                                                </span>
                                            </div>
                                            <div
                                                className={`w-full h-3 rounded-full overflow-hidden ${dark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                                                <div
                                                    className={`h-full transition-all duration-1000 ease-out ${
                                                        budgetUsed > 100
                                                            ? 'bg-gradient-to-r from-red-500 to-red-600'
                                                            : budgetUsed > 80
                                                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                                                : 'bg-gradient-to-r from-green-500 to-green-600'
                                                    }`}
                                                    style={{width: `${Math.min(budgetUsed, 100)}%`}}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Budget Stats */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div
                                                className={`p-4 rounded-lg ${dark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                                                <div
                                                    className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                                    ${currentMonthExpenses.toFixed(0)}
                                                </div>
                                                <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    Gastado
                                                </div>
                                            </div>
                                            <div
                                                className={`p-4 rounded-lg ${dark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                                                <div
                                                    className={`text-lg font-bold ${remainingBudget >= 0 ? (dark ? 'text-green-400' : 'text-green-600') : (dark ? 'text-red-400' : 'text-red-600')}`}>
                                                    ${Math.abs(remainingBudget).toFixed(0)}
                                                </div>
                                                <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {remainingBudget >= 0 ? 'Restante' : 'Excedido'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Daily Budget Recommendation */}
                                        {remainingBudget > 0 && (
                                            <div className={`p-4 rounded-lg border-l-4 ${
                                                dark
                                                    ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                                                    : 'bg-blue-50 border-blue-500 text-blue-700'
                                            }`}>
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                         viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                    </svg>
                                                    <span className="text-sm font-medium">
                                                        Presupuesto diario: ${dailyBudgetRemaining.toFixed(0)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Decorative Background */}
                                    <div
                                        className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-xl animate-pulse pointer-events-none"></div>
                                </div>
                            </div>
                        </section>

                        {/* Savings History Section */}
                        <section className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                            <div
                                className={`group rounded-2xl border transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-1 ${
                                    dark
                                        ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 hover:border-slate-600/50 backdrop-blur-xl'
                                        : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-gray-200/50 hover:border-gray-300/50 backdrop-blur-xl'
                                } shadow-lg`}>
                                <div className="p-6">
                                    {/* Savings History Header */}
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div
                                            className={`p-3 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 ${
                                                dark
                                                    ? 'bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-500/30'
                                                    : 'bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200'
                                            }`}>
                                            <svg
                                                className={`w-6 h-6 transition-colors duration-300 ${dark ? 'text-pink-400' : 'text-pink-600'}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className={`text-xl font-bold transition-colors duration-300 ${dark ? 'text-white' : 'text-gray-900'}`}>
                                                Savings History
                                            </h2>
                                            <p className={`text-sm font-medium transition-colors duration-300 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Track your savings progress over time
                                            </p>
                                        </div>
                                    </div>

                                    {/* Savings History Content */}
                                    <div className="relative">
                                        <SavingHistory/>

                                        {/* Decorative Background Elements */}
                                        <div
                                            className="absolute -top-2 -left-2 w-20 h-20 bg-gradient-to-br from-pink-500/10 to-indigo-500/10 rounded-full blur-xl animate-pulse pointer-events-none"
                                            style={{animationDelay: '1s'}}></div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Additional Analytics Cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up"
                         style={{animationDelay: '0.4s'}}>
                    {/* Quick Insights Card */}
                    <div
                        className={`group rounded-xl border p-6 transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-2 hover:scale-105 ${
                            dark
                                ? 'bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50 hover:bg-slate-800/70'
                                : 'bg-white/70 border-gray-200/50 hover:border-purple-500/50 hover:bg-white/90'
                        } backdrop-blur-sm shadow-md`}>
                        <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                                dark ? 'bg-purple-500/10 group-hover:bg-purple-500/20' : 'bg-purple-50 group-hover:bg-purple-100'
                            }`}>
                                <svg
                                    className={`w-6 h-6 transition-colors duration-300 ${dark ? 'text-purple-400' : 'text-purple-600'}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className={`font-semibold transition-colors duration-300 ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    Quick Insights
                                </h3>
                                <p className={`text-sm transition-colors duration-300 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    AI-powered analysis
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Export Analytics Card */}
                    <div
                        className={`group rounded-xl border p-6 transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-2 hover:scale-105 ${
                            dark
                                ? 'bg-slate-800/50 border-slate-700/50 hover:border-pink-500/50 hover:bg-slate-800/70'
                                : 'bg-white/70 border-gray-200/50 hover:border-pink-500/50 hover:bg-white/90'
                        } backdrop-blur-sm shadow-md`}>
                        <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                                dark ? 'bg-pink-500/10 group-hover:bg-pink-500/20' : 'bg-pink-50 group-hover:bg-pink-100'
                            }`}>
                                <svg
                                    className={`w-6 h-6 transition-colors duration-300 ${dark ? 'text-pink-400' : 'text-pink-600'}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className={`font-semibold transition-colors duration-300 ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    Export Report
                                </h3>
                                <p className={`text-sm transition-colors duration-300 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Download analytics
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Compare Periods Card */}
                    <div
                        className={`group rounded-xl border p-6 transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-2 hover:scale-105 ${
                            dark
                                ? 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800/70'
                                : 'bg-white/70 border-gray-200/50 hover:border-indigo-500/50 hover:bg-white/90'
                        } backdrop-blur-sm shadow-md`}>
                        <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                                dark ? 'bg-indigo-500/10 group-hover:bg-indigo-500/20' : 'bg-indigo-50 group-hover:bg-indigo-100'
                            }`}>
                                <svg
                                    className={`w-6 h-6 transition-colors duration-300 ${dark ? 'text-indigo-400' : 'text-indigo-600'}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className={`font-semibold transition-colors duration-300 ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    Compare Periods
                                </h3>
                                <p className={`text-sm transition-colors duration-300 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Month vs month
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}