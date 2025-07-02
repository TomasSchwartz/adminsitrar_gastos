import React, {useEffect, useState, useContext} from 'react';
import {getExpenses} from '../api';
import {ThemeContext} from '../context/ThemeContext';
import KpiPanel from '../components/KpiPanel';

export default function DashboardHome() {
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {dark} = useContext(ThemeContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await getExpenses();
                console.log("✅ Datos cargados para dashboard:", res.data);
                setExpenses(res.data);
            } catch (err) {
                console.error("❌ Error al cargar datos del dashboard:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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

                {/* Enhanced KPI Section */}
                <section className="animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                    <div
                        className={`group rounded-2xl border transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-1 ${
                            dark
                                ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 hover:border-slate-600/50 backdrop-blur-xl'
                                : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-gray-200/50 hover:border-gray-300/50 backdrop-blur-xl'
                        } shadow-lg`}>

                        <div className="p-8">
                            {/* Section Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-6">
                                {/* Icon + Title + Description */}
                                <div className="flex items-center space-x-4">
                                    <div
                                        className={`p-4 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 ${
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

                                {/* Stats block (moved outside, aligned right) */}
                                <div
                                    className={`inline-flex items-center px-6 py-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
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

                            {/* KPI Panel Component */}
                            <div className="relative">
                                <KpiPanel expenses={expenses}/>

                                {/* Decorative Background Elements */}
                                <div
                                    className="absolute -top-2 -right-2 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-xl animate-pulse pointer-events-none"></div>
                                <div
                                    className="absolute -bottom-2 -left-2 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-xl animate-pulse pointer-events-none"
                                    style={{animationDelay: '1s'}}></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Additional Quick Actions Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up"
                         style={{animationDelay: '0.4s'}}>
                    {/* Quick Add Expense Card */}
                    <div
                        className={`group rounded-xl border p-6 transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-2 hover:scale-105 ${
                            dark
                                ? 'bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/70'
                                : 'bg-white/70 border-gray-200/50 hover:border-blue-500/50 hover:bg-white/90'
                        } backdrop-blur-sm shadow-md`}>
                        <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                                dark ? 'bg-blue-500/10 group-hover:bg-blue-500/20' : 'bg-blue-50 group-hover:bg-blue-100'
                            }`}>
                                <svg
                                    className={`w-6 h-6 transition-colors duration-300 ${dark ? 'text-blue-400' : 'text-blue-600'}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
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

                    {/* View Analytics Card */}
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
                                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className={`font-semibold transition-colors duration-300 ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    Analytics
                                </h3>
                                <p className={`text-sm transition-colors duration-300 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    View detailed charts
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Export Data Card */}
                    <div
                        className={`group rounded-xl border p-6 transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-2 hover:scale-105 ${
                            dark
                                ? 'bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/50 hover:bg-slate-800/70'
                                : 'bg-white/70 border-gray-200/50 hover:border-emerald-500/50 hover:bg-white/90'
                        } backdrop-blur-sm shadow-md`}>
                        <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                                dark ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20' : 'bg-emerald-50 group-hover:bg-emerald-100'
                            }`}>
                                <svg
                                    className={`w-6 h-6 transition-colors duration-300 ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className={`font-semibold transition-colors duration-300 ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    Export
                                </h3>
                                <p className={`text-sm transition-colors duration-300 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Download reports
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}