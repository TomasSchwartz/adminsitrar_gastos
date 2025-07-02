import React, {useEffect, useState, useContext} from 'react';
import {getExpenses, getIncomes, getMonthlyBudget} from '../api';
import {ThemeContext} from '../context/ThemeContext';
import KpiPanel from '../components/KpiPanel';

export default function DashboardHome() {
    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [monthlyBudget, setMonthlyBudget] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const {dark} = useContext(ThemeContext);

    // Obtener el mes actual en formato YYYY-MM
    const getCurrentMonth = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            // 1. Cargar expenses (crítico) - si falla, se detiene todo
            try {
                const expensesRes = await getExpenses();
                console.log("✅ Expenses cargados:", expensesRes.data);
                setExpenses(expensesRes.data);
            } catch (err) {
                console.error("❌ Error crítico al cargar expenses:", err);
                setIsLoading(false);
                return; // Salir si expenses falla
            }

            // 2. Cargar incomes (opcional)
            try {
                const incomesRes = await getIncomes();
                console.log("✅ Incomes cargados:", incomesRes.data);
                setIncomes(incomesRes.data);
            } catch (err) {
                console.warn("⚠️ No se pudieron cargar los ingresos:", err.message);
                setIncomes([]);
            }

            // 3. Cargar budget mensual (opcional)
            try {
                const currentMonth = getCurrentMonth();
                console.log("📅 Cargando budget para:", currentMonth);
                const budgetRes = await getMonthlyBudget(currentMonth);
                console.log("✅ Budget cargado:", budgetRes.data);
                setMonthlyBudget(budgetRes.data);
            } catch (err) {
                console.warn("⚠️ No se pudo cargar el presupuesto:", err.message);
                setMonthlyBudget(null);
            }

            setIsLoading(false);
        };

        fetchData();
    }, []);

    // Calcular métricas financieras
    const calculateFinancialMetrics = () => {
        const currentMonth = getCurrentMonth();
        const currentDate = new Date();

        // Filtrar gastos e ingresos del mes actual
        const currentMonthExpenses = expenses.filter(expense =>
            expense.date && expense.date.startsWith(currentMonth)
        );
        const currentMonthIncomes = incomes.filter(income =>
            income.date && income.date.startsWith(currentMonth)
        );

        // Calcular totales
        const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
        const totalIncome = currentMonthIncomes.reduce((sum, income) => sum + (income.amount || 0), 0);
        const budgetAmount = monthlyBudget?.amount || 0;

        // Calcular porcentajes y métricas
        const budgetUsed = budgetAmount > 0 ? (totalExpenses / budgetAmount) * 100 : 0;
        const remainingBudget = budgetAmount - totalExpenses;
        const netBalance = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

        return {
            totalExpenses,
            totalIncome,
            budgetAmount,
            budgetUsed,
            remainingBudget,
            netBalance,
            savingsRate,
            currentMonthExpenses,
            currentMonthIncomes
        };
    };

    const metrics = calculateFinancialMetrics();
    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className={`text-lg font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Loading your financial data...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-8 pb-8 px-1 sm:px-1 lg:px-1">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Welcome Section with Enhanced Header */}
                <section className="text-center">
                    <div className="mb-8">
                        <h1 className={`text-4xl font-bold mb-4 transition-all duration-500 ${
                            dark
                                ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent'
                                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'
                        }`}>
                            Financial Overview
                        </h1>
                    </div>
                </section>

                {/* New Financial Summary Cards */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 animate-fade-in-up">
                    {/* Total Expenses Card */}
                    <div className={`rounded-xl border p-6 transition-all duration-300 hover:shadow-xl ${
                        dark
                            ? 'bg-gradient-to-br from-red-900/50 to-red-800/30 border-red-700/50'
                            : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
                    } shadow-lg`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${dark ? 'text-red-300' : 'text-red-600'}`}>
                                    Monthly Expenses
                                </p>
                                <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    ${metrics.totalExpenses.toLocaleString()}
                                </p>
                                <p className={`text-xs ${dark ? 'text-red-400' : 'text-red-500'}`}>
                                    {metrics.currentMonthExpenses.length} transactions
                                </p>
                            </div>
                            <div className={`p-3 rounded-full ${dark ? 'bg-red-500/20' : 'bg-red-500/10'}`}>
                                <svg className={`w-6 h-6 ${dark ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Income Card */}
                    <div className={`rounded-xl border p-6 transition-all duration-300 hover:shadow-xl ${
                        dark
                            ? 'bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 border-emerald-700/50'
                            : 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200'
                    } shadow-lg`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${dark ? 'text-emerald-300' : 'text-emerald-600'}`}>
                                    Monthly Income
                                </p>
                                <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    ${metrics.totalIncome.toLocaleString()}
                                </p>
                                <p className={`text-xs ${dark ? 'text-emerald-400' : 'text-emerald-500'}`}>
                                    {metrics.currentMonthIncomes.length} sources
                                </p>
                            </div>
                            <div className={`p-3 rounded-full ${dark ? 'bg-emerald-500/20' : 'bg-emerald-500/10'}`}>
                                <svg className={`w-6 h-6 ${dark ? 'text-emerald-400' : 'text-emerald-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Budget Card */}
                    <div className={`rounded-xl border p-6 transition-all duration-300 hover:shadow-xl ${
                        dark
                            ? 'bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50'
                            : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
                    } shadow-lg`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${dark ? 'text-blue-300' : 'text-blue-600'}`}>
                                    Monthly Budget
                                </p>
                                <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    ${metrics.budgetAmount.toLocaleString()}
                                </p>
                                <p className={`text-xs ${dark ? 'text-blue-400' : 'text-blue-500'}`}>
                                    {metrics.budgetUsed.toFixed(1)}% used
                                </p>
                            </div>
                            <div className={`p-3 rounded-full ${dark ? 'bg-blue-500/20' : 'bg-blue-500/10'}`}>
                                <svg className={`w-6 h-6 ${dark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Net Balance Card */}
                    <div className={`rounded-xl border p-6 transition-all duration-300 hover:shadow-xl ${
                        metrics.netBalance >= 0
                            ? dark
                                ? 'bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50'
                                : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
                            : dark
                                ? 'bg-gradient-to-br from-red-900/50 to-red-800/30 border-red-700/50'
                                : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
                    } shadow-lg`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${
                                    metrics.netBalance >= 0
                                        ? dark ? 'text-green-300' : 'text-green-600'
                                        : dark ? 'text-red-300' : 'text-red-600'
                                }`}>
                                    Net Balance
                                </p>
                                <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    ${metrics.netBalance.toLocaleString()}
                                </p>
                                <p className={`text-xs ${
                                    metrics.netBalance >= 0
                                        ? dark ? 'text-green-400' : 'text-green-500'
                                        : dark ? 'text-red-400' : 'text-red-500'
                                }`}>
                                    {metrics.netBalance >= 0 ? 'Surplus' : 'Deficit'}
                                </p>
                            </div>
                            <div className={`p-3 rounded-full ${
                                metrics.netBalance >= 0
                                    ? dark ? 'bg-green-500/20' : 'bg-green-500/10'
                                    : dark ? 'bg-red-500/20' : 'bg-red-500/10'
                            }`}>
                                <svg className={`w-6 h-6 ${
                                    metrics.netBalance >= 0
                                        ? dark ? 'text-green-400' : 'text-green-600'
                                        : dark ? 'text-red-400' : 'text-red-600'
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d={metrics.netBalance >= 0
                                              ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                              : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"}/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Savings Rate Card */}
                    <div className={`rounded-xl border p-6 transition-all duration-300 hover:shadow-xl ${
                        dark
                            ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50'
                            : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
                    } shadow-lg`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${dark ? 'text-purple-300' : 'text-purple-600'}`}>
                                    Savings Rate
                                </p>
                                <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    {metrics.savingsRate.toFixed(1)}%
                                </p>
                                <p className={`text-xs ${dark ? 'text-purple-400' : 'text-purple-500'}`}>
                                    {metrics.savingsRate >= 20 ? 'Excellent' : metrics.savingsRate >= 10 ? 'Good' : 'Needs work'}
                                </p>
                            </div>
                            <div className={`p-3 rounded-full ${dark ? 'bg-purple-500/20' : 'bg-purple-500/10'}`}>
                                <svg className={`w-6 h-6 ${dark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Budget Progress Bar */}
                <section className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                    <div className={`rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${
                        dark
                            ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50'
                            : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-gray-200/50'
                    } shadow-lg backdrop-blur-xl`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-xl font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                Budget Progress
                            </h3>
                            <span className={`text-sm px-3 py-1 rounded-full ${
                                metrics.budgetUsed <= 75
                                    ? dark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                                    : metrics.budgetUsed <= 90
                                        ? dark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
                                        : dark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
                            }`}>
                                {metrics.budgetUsed.toFixed(1)}% used
                            </span>
                        </div>

                        <div className={`w-full bg-gray-200 rounded-full h-4 mb-4 ${dark ? 'bg-gray-700' : ''}`}>
                            <div
                                className={`h-4 rounded-full transition-all duration-1000 ${
                                    metrics.budgetUsed <= 75
                                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                                        : metrics.budgetUsed <= 90
                                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                                            : 'bg-gradient-to-r from-red-500 to-red-600'
                                }`}
                                style={{width: `${Math.min(metrics.budgetUsed, 100)}%`}}
                            ></div>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className={dark ? 'text-gray-400' : 'text-gray-600'}>
                                Spent: ${metrics.totalExpenses.toLocaleString()}
                            </span>
                            <span className={dark ? 'text-gray-400' : 'text-gray-600'}>
                                Remaining: ${metrics.remainingBudget.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Enhanced KPI Section - RESTAURADO CON TODOS LOS GASTOS */}
                <section className="animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                    <div className={`group rounded-2xl border transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-1 ${
                        dark
                            ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 hover:border-slate-600/50 backdrop-blur-xl'
                            : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-gray-200/50 hover:border-gray-300/50 backdrop-blur-xl'
                    } shadow-lg`}>
                        <div className="p-8">
                            {/* Section Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-6">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-4 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 ${
                                        dark
                                            ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30'
                                            : 'bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200'
                                    }`}>
                                        <svg className={`w-8 h-8 ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}
                                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className={`text-3xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                            Key Performance Indicators
                                        </h2>
                                        <p className={`text-lg font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Real-time financial metrics and comprehensive insights
                                        </p>
                                    </div>
                                </div>

                                <div className={`inline-flex items-center px-6 py-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
                                    dark
                                        ? 'bg-slate-800/50 border-slate-700 text-gray-300 hover:bg-slate-800/70 hover:border-slate-600'
                                        : 'bg-white/70 border-gray-200 text-gray-600 hover:bg-white/90 hover:border-gray-300'
                                } backdrop-blur-sm shadow-lg hover:shadow-xl`}>
                                    <div className="flex items-center space-x-4 text-sm font-medium">
                                        <span className="flex items-center">
                                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                            {expenses.length} Records
                                        </span>
                                        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                                        <span className="flex items-center">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                            Live Data
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* KPI Panel Component - RESTAURADO CON SOLO EXPENSES */}
                            <div className="relative">
                                <KpiPanel expenses={expenses} />
                                <div className="absolute -top-2 -right-2 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-xl animate-pulse pointer-events-none"></div>
                                <div className="absolute -bottom-2 -left-2 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-xl animate-pulse pointer-events-none" style={{animationDelay: '1s'}}></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Additional Quick Actions Section */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                    {/* Quick Add Expense Card */}
                    <div className={`group rounded-xl border p-6 transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-2 hover:scale-105 ${
                        dark
                            ? 'bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/70'
                            : 'bg-white/70 border-gray-200/50 hover:border-blue-500/50 hover:bg-white/90'
                    } backdrop-blur-sm shadow-md`}>
                        <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                                dark ? 'bg-blue-500/10 group-hover:bg-blue-500/20' : 'bg-blue-50 group-hover:bg-blue-100'
                            }`}>
                                <svg className={`w-6 h-6 transition-colors duration-300 ${dark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className={`font-semibold transition-colors duration-300 ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    Quick Add
                                </h3>
                                <p className={`text-sm transition-colors duration-300 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Add new expense
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Add Income Card */}
                    <div className={`group rounded-xl border p-6 transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-2 hover:scale-105 ${
                        dark
                            ? 'bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/50 hover:bg-slate-800/70'
                            : 'bg-white/70 border-gray-200/50 hover:border-emerald-500/50 hover:bg-white/90'
                    } backdrop-blur-sm shadow-md`}>
                        <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                                dark ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20' : 'bg-emerald-50 group-hover:bg-emerald-100'
                            }`}>
                                <svg className={`w-6 h-6 transition-colors duration-300 ${dark ? 'text-emerald-400' : 'text-emerald-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className={`font-semibold transition-colors duration-300 ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    Add Income
                                </h3>
                                <p className={`text-sm transition-colors duration-300 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Record income
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Set Budget Card */}
                    <div className={`group rounded-xl border p-6 transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-2 hover:scale-105 ${
                        dark
                            ? 'bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50 hover:bg-slate-800/70'
                            : 'bg-white/70 border-gray-200/50 hover:border-purple-500/50 hover:bg-white/90'
                    } backdrop-blur-sm shadow-md`}>
                        <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                                dark ? 'bg-purple-500/10 group-hover:bg-purple-500/20' : 'bg-purple-50 group-hover:bg-purple-100'
                            }`}>
                                <svg className={`w-6 h-6 transition-colors duration-300 ${dark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className={`font-semibold transition-colors duration-300 ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    Set Budget
                                </h3>
                                <p className={`text-sm transition-colors duration-300 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Plan spending
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* View Reports Card */}
                    <div className={`group rounded-xl border p-6 transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-2 hover:scale-105 ${
                        dark
                            ? 'bg-slate-800/50 border-slate-700/50 hover:border-yellow-500/50 hover:bg-slate-800/70'
                            : 'bg-white/70 border-gray-200/50 hover:border-yellow-500/50 hover:bg-white/90'
                    } backdrop-blur-sm shadow-md`}>
                        <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                                dark ? 'bg-yellow-500/10 group-hover:bg-yellow-500/20' : 'bg-yellow-50 group-hover:bg-yellow-100'
                            }`}>
                                <svg className={`w-6 h-6 transition-colors duration-300 ${dark ? 'text-yellow-400' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className={`font-semibold transition-colors duration-300 ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    View Reports
                                </h3>
                                <p className={`text-sm transition-colors duration-300 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Detailed insights
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}