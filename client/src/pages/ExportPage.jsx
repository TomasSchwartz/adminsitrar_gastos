import React, {useEffect, useState, useContext} from 'react';
import {getExpenses} from '../api';
import {ThemeContext} from '../context/ThemeContext';

export default function ExportPage() {
    const {dark} = useContext(ThemeContext);
    const [allExpenses, setAllExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState({csv: false, pdf: false});

    // Filter states
    const [category, setCategory] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

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

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await getExpenses();
            setAllExpenses(res.data);
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

    // Apply filters whenever any filter value changes
    const applyFilters = () => {
        let filtered = [...allExpenses];

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

        setFilteredExpenses(filtered);
    };

    const clearFilters = () => {
        setCategory('');
        setFrom('');
        setTo('');
        setMinAmount('');
        setMaxAmount('');
        setSearchTerm('');
        setFilteredExpenses(allExpenses);
    };

    const hasActiveFilters = category || from || to || minAmount || maxAmount || searchTerm;

    useEffect(() => {
        applyFilters();
    }, [category, from, to, minAmount, maxAmount, searchTerm, allExpenses]);

const exportToCSV = async () => {
    setIsExporting(prev => ({...prev, csv: true}));
    try {
        // Crear el contenido CSV con datos filtrados
        const headers = ['Fecha', 'Descripción', 'Categoría', 'Monto'];
        const csvContent = [
            headers.join(','),
            ...filteredExpenses.map(expense => [
                new Date(expense.date).toLocaleDateString('en-CA'), // Formatear la fecha como YYYY-MM-DD
                `"${expense.description}"`, // Comillas para manejar comas en la descripción
                expense.category,
                expense.amount
            ].join(','))
        ].join('\n');

            // Crear y descargar el archivo
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `gastos_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } finally {
            setIsExporting(prev => ({...prev, csv: false}));
        }
    };

    const exportToPDF = async () => {
        setIsExporting(prev => ({...prev, pdf: true}));
        try {
            // Crear contenido HTML para el PDF con datos filtrados
            const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            const currentDate = new Date().toLocaleDateString('es-AR');

            const htmlContent = `
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Reporte de Gastos</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3B82F6; padding-bottom: 20px; }
                        .title { color: #1E40AF; font-size: 24px; font-weight: bold; }
                        .date { color: #6B7280; margin-top: 10px; }
                        .summary { background-color: #EFF6FF; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                        .summary-title { color: #1E40AF; font-weight: bold; margin-bottom: 10px; }
                        .summary-stats { display: flex; justify-content: space-around; }
                        .stat { text-align: center; }
                        .stat-value { font-size: 18px; font-weight: bold; color: #1E40AF; }
                        .stat-label { color: #6B7280; font-size: 12px; }
                        .filters { background-color: #F8FAFC; padding: 10px; border-radius: 8px; margin-bottom: 20px; font-size: 12px; }
                        .filters-title { font-weight: bold; color: #374151; margin-bottom: 5px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th { background-color: #3B82F6; color: white; padding: 12px; text-align: left; }
                        td { padding: 10px; border-bottom: 1px solid #E5E7EB; }
                        tr:nth-child(even) { background-color: #F9FAFB; }
                        .amount { text-align: right; font-weight: bold; }
                        .total-row { background-color: #EFF6FF; font-weight: bold; }
                        .footer { margin-top: 30px; text-align: center; color: #6B7280; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="title">📊 Reporte de Gastos</div>
                        <div class="date">Generado el ${currentDate}</div>
                    </div>
                    
                    ${hasActiveFilters ? `
                    <div class="filters">
                        <div class="filters-title">Filtros Aplicados:</div>
                        ${category ? `• Categoría: ${category}<br>` : ''}
                        ${from || to ? `• Fecha: ${from || 'Desde el inicio'} hasta ${to || 'la fecha actual'}<br>` : ''}
                        ${minAmount || maxAmount ? `• Monto: $${minAmount || '0'} - $${maxAmount || '∞'}<br>` : ''}
                        ${searchTerm ? `• Búsqueda: "${searchTerm}"<br>` : ''}
                    </div>
                    ` : ''}
                    
                    <div class="summary">
                        <div class="summary-title">Resumen</div>
                        <div class="summary-stats">
                            <div class="stat">
                                <div class="stat-value">${filteredExpenses.length}</div>
                                <div class="stat-label">Total de Registros</div>
                            </div>
                            <div class="stat">
                                <div class="stat-value">${totalAmount.toLocaleString()}</div>
                                <div class="stat-label">Monto Total</div>
                            </div>
                            ${hasActiveFilters ? `
                            <div class="stat">
                                <div class="stat-value">${allExpenses.length}</div>
                                <div class="stat-label">Total Original</div>
                            </div>
                            ` : ''}
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Descripción</th>
                                <th>Categoría</th>
                                <th>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredExpenses.map(expense => `
                                <tr>
                                    <td>${new Date(expense.date).toLocaleDateString('en-CA')}</td>
                                    <td>${expense.description}</td>
                                    <td>${expense.category}</td>
                                    <td class="amount">${expense.amount.toLocaleString()}</td>
                                </tr>
                            `).join('')}
                            <tr class="total-row">
                                <td colspan="3"><strong>TOTAL</strong></td>
                                <td class="amount"><strong>${totalAmount.toLocaleString()}</strong></td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="footer">
                        Reporte generado automáticamente desde tu aplicación de gastos
                    </div>
                </body>
                </html>
            `;

            // Crear y descargar el PDF
            const printWindow = window.open('', '_blank');
            printWindow.document.write(htmlContent);
            printWindow.document.close();

            // Esperar a que se cargue el contenido
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);

        } finally {
            setIsExporting(prev => ({...prev, pdf: false}));
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className={`inline-block w-12 h-12 border-4 border-solid rounded-full animate-spin mb-6 ${
                        dark
                            ? 'border-blue-400 border-r-transparent'
                            : 'border-blue-600 border-r-transparent'
                    }`}></div>
                    <p className={`text-xl font-medium ${
                        dark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        Preparando tus datos...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] p-4 max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">

                <h1 className={`text-4xl font-bold mb-4 ${
                    dark
                        ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent'
                        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent'
                }`}>
                    Exportar Datos
                </h1>

                <p className={`text-lg ${
                    dark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    Filtra y exporta tus gastos en el formato que prefieras
                </p>
            </div>

            {/* Export Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 flex-grow mb-6">
                {/* CSV Export Button */}
                <button
                    onClick={exportToCSV}
                    disabled={isExporting.csv || filteredExpenses.length === 0}
                    className={`group flex-1 relative overflow-hidden rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        filteredExpenses.length === 0
                            ? dark
                                ? 'bg-gray-800 border-gray-600 opacity-50 cursor-not-allowed'
                                : 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                            : dark
                                ? 'bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/30 hover:border-green-400/50 hover:shadow-2xl hover:shadow-green-500/20'
                                : 'bg-gradient-to-br from-green-50 to-green-100/80 border-green-200 hover:border-green-300 hover:shadow-2xl hover:shadow-green-500/20'
                    } backdrop-blur-sm`}
                >
                    <div className="p-8 text-center">
                        {/* CSV Icon */}
                        <div className={`mx-auto mb-6 w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            filteredExpenses.length === 0
                                ? dark ? 'bg-gray-700' : 'bg-gray-200'
                                : dark
                                    ? 'bg-green-500/20 group-hover:bg-green-500/30'
                                    : 'bg-green-500/10 group-hover:bg-green-500/20'
                        }`}>
                            <svg className={`w-8 h-8 ${filteredExpenses.length === 0 ? 'text-gray-500' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                <path d="M8,12V14H16V12H8M8,16V18H13V16H8Z"/>
                            </svg>
                        </div>

                        <h3 className={`text-xl font-bold mb-3 ${
                            filteredExpenses.length === 0
                                ? dark ? 'text-gray-500' : 'text-gray-400'
                                : dark ? 'text-white' : 'text-gray-900'
                        }`}>
                            Formato CSV
                        </h3>

                        <p className={`text-sm mb-6 ${
                            filteredExpenses.length === 0
                                ? dark ? 'text-gray-600' : 'text-gray-500'
                                : dark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            Perfecto para Excel y análisis de datos</p>

                        {isExporting.csv ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent mr-2"></div>
                                <span className={`text-sm font-medium ${dark ? 'text-green-400' : 'text-green-600'}`}>
                            Generando CSV...
                        </span>
                            </div>
                        ) : (
                            <div className={`flex items-center justify-center text-sm font-medium ${
                                filteredExpenses.length === 0
                                    ? dark ? 'text-gray-600' : 'text-gray-500'
                                    : dark ? 'text-green-400' : 'text-green-600'
                            }`}>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {filteredExpenses.length === 0 ? 'Sin datos para exportar' : 'Descargar CSV'}
                            </div>
                        )}
                    </div>
                </button>

                {/* PDF Export Button */}
                <button
                    onClick={exportToPDF}
                    disabled={isExporting.pdf || filteredExpenses.length === 0}
                    className={`group flex-1 relative overflow-hidden rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        filteredExpenses.length === 0
                            ? dark
                                ? 'bg-gray-800 border-gray-600 opacity-50 cursor-not-allowed'
                                : 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                            : dark
                                ? 'bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-500/30 hover:border-red-400/50 hover:shadow-2xl hover:shadow-red-500/20'
                                : 'bg-gradient-to-br from-red-50 to-red-100/80 border-red-200 hover:border-red-300 hover:shadow-2xl hover:shadow-red-500/20'
                    } backdrop-blur-sm`}
                >
                    <div className="p-8 text-center pb-4">
                        {/* PDF Icon */}
                        <div className={`mx-auto mb-6 w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            filteredExpenses.length === 0
                                ? dark ? 'bg-gray-700' : 'bg-gray-200'
                                : dark
                                    ? 'bg-red-500/20 group-hover:bg-red-500/30'
                                    : 'bg-red-500/10 group-hover:bg-red-500/20'
                        }`}>
                            <svg className={`w-8 h-8 ${filteredExpenses.length === 0 ? 'text-gray-500' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                <path d="M9.5,12L8,10.5L9.5,9L11,10.5L9.5,12M14.5,16L13,14.5L14.5,13L16,14.5L14.5,16M8.5,16L7,14.5L8.5,13L10,14.5L8.5,16Z"/>
                            </svg>
                        </div>

                        <h3 className={`text-xl font-bold mb-3 ${
                            filteredExpenses.length === 0
                                ? dark ? 'text-gray-500' : 'text-gray-400'
                                : dark ? 'text-white' : 'text-gray-900'
                        }`}>
                            Formato PDF
                        </h3>

                        <p className={`text-sm mb-6 ${
                            filteredExpenses.length === 0
                                ? dark ? 'text-gray-600' : 'text-gray-500'
                                : dark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            Reporte profesional listo para imprimir
                        </p>

                        {isExporting.pdf ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-red-500 border-t-transparent mr-2"></div>
                                <span className={`text-sm font-medium ${dark ? 'text-red-400' : 'text-red-600'}`}>
                            Generando PDF...
                        </span>
                            </div>
                        ) : (
                            <div className={`flex items-center justify-center text-sm font-medium ${
                                filteredExpenses.length === 0
                                    ? dark ? 'text-gray-600' : 'text-gray-500'
                                    : dark ? 'text-red-400' : 'text-red-600'
                            }`}>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {filteredExpenses.length === 0 ? 'Sin datos para exportar' : 'Generar PDF'}
                            </div>
                        )}
                    </div>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Filters Panel */}
                <div className="lg:col-span-1">
                    <div className={`rounded-lg border shadow-sm ${
                        dark
                            ? 'bg-slate-800 border-slate-600'
                            : 'bg-white border-gray-200'
                    }`}>
                        {/* Filters Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-between">
                                <h3 className={`text-lg font-semibold flex items-center ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    <svg className={`w-5 h-5 mr-2 ${dark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                                    </svg>
                                    Filtros
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
                                        Limpiar Todo
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Search */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className={`w-4 h-4 ${dark ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar en descripción..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full pl-9 pr-3 py-2 text-sm rounded border focus:ring-2 focus:outline-none ${
                                        dark
                                            ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500'
                                    }`}
                                />
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className={`block text-xs font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Categoría
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
                                        <span>Todas</span>
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

                            {/* Date Range */}
                            <div>
                                <label className={`block text-xs font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Rango de Fechas
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

                            {/* Amount Range */}
                            <div>
                                <label className={`block text-xs font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Rango de Montos ($)
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        placeholder="Mín"
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
                                        placeholder="Máx"
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

                            {/* Active Filters Tags */}
                            {hasActiveFilters && (
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
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
                </div>

                {/* Export Section */}
                <div className="lg:col-span-2 flex flex-col">
                    {/* Preview Table */}
                    {filteredExpenses.length > 0 && (
                        <div className={`mt-6 rounded-lg border overflow-hidden ${
                            dark ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'
                        }`}>
                            <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                                <h3 className={`text-lg font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    Vista Previa de Datos
                                </h3>
                                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Primeros {Math.min(5, filteredExpenses.length)} registros de {filteredExpenses.length} total
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                    <thead className={dark ? 'bg-slate-700' : 'bg-gray-50'}>
                                    <tr>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                            dark ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                            Fecha
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                            dark ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                            Descripción
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                            dark ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                            Categoría
                                        </th>
                                        <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                                            dark ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                            Monto
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className={`divide-y ${dark ? 'divide-gray-600' : 'divide-gray-200'}`}>
                                    {filteredExpenses.slice(0, 5).map((expense, index) => (
                                        <tr key={expense.id || index} className={dark ? 'bg-slate-800' : 'bg-white'}>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                                                dark ? 'text-gray-300' : 'text-gray-900'
                                            }`}>
                                                {new Date(expense.date).toLocaleDateString('en-CA')}
                                            </td>
                                            <td className={`px-6 py-4 text-sm ${
                                                dark ? 'text-gray-300' : 'text-gray-900'
                                            }`}>
                                                <div className="max-w-xs truncate">{expense.description}</div>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                                                dark ? 'text-gray-300' : 'text-gray-900'
                                            }`}>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        dark ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800'
                                    }`}>
                                        {categories.find(c => c.value === expense.category)?.icon} {expense.category}
                                    </span>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                                                dark ? 'text-gray-300' : 'text-gray-900'
                                            }`}>
                                                ${expense.amount.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredExpenses.length > 5 && (
                                        <tr className={dark ? 'bg-slate-700' : 'bg-gray-50'}>
                                            <td colSpan={4} className={`px-6 py-4 text-center text-sm font-medium ${
                                                dark ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                ... y {filteredExpenses.length - 5} registros más
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {/* Results Summary */}
                    <div className={`rounded-lg border p-4 mb-6 ${
                        dark ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center justify-between mt-6">
                            <div>
                            <h3 className={`text-lg font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    Resumen de Exportación
                                </h3>
                                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {filteredExpenses.length} de {allExpenses.length} registros serán exportados
                                </p>
                            </div>
                            <div className={`text-right ${dark ? 'text-white' : 'text-gray-900'}`}>
                                <div className="text-2xl font-bold">
                                    ${filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
                                </div>
                                <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Total a exportar
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            {/* Empty State */}
            {filteredExpenses.length === 0 && allExpenses.length > 0 && (
                <div className="text-center py-12">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                        dark
                            ? 'bg-gray-700 text-gray-400'
                            : 'bg-gray-100 text-gray-500'
                    }`}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.94-6.071 2.473" />
                        </svg>
                    </div>
                    <h3 className={`text-lg font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-900'}`}>
                        No hay datos que coincidan con los filtros
                    </h3>
                    <p className={`text-sm mb-6 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Ajusta los filtros para ver más resultados
                    </p>
                    <button
                        onClick={clearFilters}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            dark
                                ? 'bg-purple-600 text-white hover:bg-purple-700'
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                    >
                        Limpiar Filtros
                    </button>
                </div>
            )}

            {/* No Data State */}
            {allExpenses.length === 0 && (
                <div className="text-center py-12">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                        dark
                            ? 'bg-gray-700 text-gray-400'
                            : 'bg-gray-100 text-gray-500'
                    }`}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.94-6.071 2.473" />
                        </svg>
                    </div>
                    <h3 className={`text-lg font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-900'}`}>
                        No tienes gastos registrados
                    </h3>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Agrega algunos gastos primero para poder exportar tus datos
                    </p>
                </div>
            )}
        </div>
    );
}