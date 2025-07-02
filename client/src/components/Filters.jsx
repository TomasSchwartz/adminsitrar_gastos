import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function Filters({ expenses, onFilter }) {
    const [category, setCategory] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { dark } = useContext(ThemeContext);

    const categories = [
        { value: 'Food', icon: '🍽️', label: 'Food' },
        { value: 'Transportation', icon: '🚗', label: 'Transport' },
        { value: 'Entertainment', icon: '🎬', label: 'Fun' },
        { value: 'Shopping', icon: '🛒', label: 'Shopping' },
        { value: 'Health', icon: '🏥', label: 'Health' },
        { value: 'Education', icon: '📚', label: 'Education' },
        { value: 'Utilities', icon: '💡', label: 'Utilities' },
        { value: 'Other', icon: '📝', label: 'Other' }
    ];

    const applyFilters = () => {
        let filtered = [...expenses];

        // Category filter
        if (category) {
            filtered = filtered.filter(expense => expense.category === category);
        }

        // Date range filter
        if (from) {
            filtered = filtered.filter(expense => new Date(expense.date) >= new Date(from));
        }
        if (to) {
            filtered = filtered.filter(expense => new Date(expense.date) <= new Date(to));
        }

        // Amount range filter
        if (minAmount) {
            filtered = filtered.filter(expense => expense.amount >= parseFloat(minAmount));
        }
        if (maxAmount) {
            filtered = filtered.filter(expense => expense.amount <= parseFloat(maxAmount));
        }

        // Search term filter
        if (searchTerm) {
            filtered = filtered.filter(expense =>
                expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (expense.notes && expense.notes.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        onFilter(filtered);
    };

    const clearFilters = () => {
        setCategory('');
        setFrom('');
        setTo('');
        setMinAmount('');
        setMaxAmount('');
        setSearchTerm('');
        onFilter(expenses);
    };

    const hasActiveFilters = category || from || to || minAmount || maxAmount || searchTerm;

    // Apply filters whenever any filter value changes
    useEffect(() => {
        applyFilters();
    }, [category, from, to, minAmount, maxAmount, searchTerm, expenses]);

    return (
        <div className={`rounded-lg border shadow-sm ${
            dark
                ? 'bg-slate-800 border-slate-600'
                : 'bg-white border-gray-200'
        }`}>
            {/* Compact Header */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-semibold flex items-center ${dark ? 'text-white' : 'text-gray-900'}`}>
                        <svg className={`w-5 h-5 mr-2 ${dark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                        </svg>
                        Filters
                    </h3>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                                dark
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                        >
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            <div className="p-3 space-y-4">
                {/* Search */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className={`w-4 h-4 ${dark ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Nombre del Gasto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2 text-sm rounded border focus:ring-2 focus:outline-none ${
                            dark
                                ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500'
                        }`}
                    />
                </div>

                {/* Category Filter - Compact Grid */}
                <div>
                    <label className={`block text-xs font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Category
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                        <button
                            onClick={() => setCategory('')}
                            className={`p-2 rounded text-xs font-medium flex flex-col items-center ${
                                !category
                                    ? dark
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-purple-100 text-purple-700'
                                    : dark
                                        ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <span className="text-sm mb-1">📋</span>
                            <span>All</span>
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setCategory(category === cat.value ? '' : cat.value)}
                                className={`p-2 rounded text-xs font-medium flex flex-col items-center ${
                                    category === cat.value
                                        ? dark
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-purple-100 text-purple-700'
                                        : dark
                                            ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <span className="text-sm mb-1">{cat.icon}</span>
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date Range - Compact */}
                <div>
                    <label className={`block text-xs font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="date"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className={`w-full px-3 py-2 text-sm rounded border focus:ring-2 focus:outline-none ${
                                dark
                                    ? 'bg-slate-700 border-slate-600 text-white focus:ring-purple-500 focus:border-purple-500'
                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500'
                            }`}
                        />
                        <input
                            type="date"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className={`w-full px-3 py-2 text-sm rounded border focus:ring-2 focus:outline-none ${
                                dark
                                    ? 'bg-slate-700 border-slate-600 text-white focus:ring-purple-500 focus:border-purple-500'
                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500'
                            }`}
                        />
                    </div>
                </div>

                {/* Amount Range - Compact */}
                <div>
                    <label className={`block text-xs font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Amount Range ($)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            step="0.01"
                            min="0"
                            value={minAmount}
                            onChange={(e) => setMinAmount(e.target.value)}
                            className={`w-full px-3 py-2 text-sm rounded border focus:ring-2 focus:outline-none ${
                                dark
                                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500'
                            }`}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            step="0.01"
                            min="0"
                            value={maxAmount}
                            onChange={(e) => setMaxAmount(e.target.value)}
                            className={`w-full px-3 py-2 text-sm rounded border focus:ring-2 focus:outline-none ${
                                dark
                                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500'
                            }`}
                        />
                    </div>
                </div>

                {/* Active Filters Tags - Compact */}
                {hasActiveFilters && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex flex-wrap gap-1">
                            {category && (
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                    dark ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'
                                }`}>
                                    {categories.find(c => c.value === category)?.icon} {category}
                                    <button
                                        onClick={() => setCategory('')}
                                        className="ml-1 hover:text-red-400"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {(from || to) && (
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                    dark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    📅 {from || '...'} → {to || '...'}
                                </span>
                            )}
                            {(minAmount || maxAmount) && (
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                    dark ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'
                                }`}>
                                    💰 ${minAmount || '0'} - ${maxAmount || '∞'}
                                </span>
                            )}
                            {searchTerm && (
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                    dark ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700'
                                }`}>
                                    🔍 "{searchTerm.length > 10 ? searchTerm.substring(0, 10) + '...' : searchTerm}"
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="ml-1 hover:text-red-400"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}