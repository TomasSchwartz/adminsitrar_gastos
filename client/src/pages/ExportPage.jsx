import React, {useEffect, useState, useContext} from 'react';
import {getExpenses} from '../api';
import {ThemeContext} from '../context/ThemeContext';

export default function ExportPage() {
    const {dark} = useContext(ThemeContext);
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState({csv: false, pdf: false});

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

    const exportToCSV = async () => {
        setIsExporting(prev => ({...prev, csv: true}));
        try {
            // Crear el contenido CSV
            const headers = ['Fecha', 'Descripción', 'Categoría', 'Monto'];
            const csvContent = [
                headers.join(','),
                ...expenses.map(expense => [
                    expense.date,
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
            // Crear contenido HTML para el PDF
            const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
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
                    
                    <div class="summary">
                        <div class="summary-title">Resumen</div>
                        <div class="summary-stats">
                            <div class="stat">
                                <div class="stat-value">${expenses.length}</div>
                                <div class="stat-label">Total de Registros</div>
                            </div>
                            <div class="stat">
                                <div class="stat-value">${totalAmount.toLocaleString()}</div>
                                <div class="stat-label">Monto Total</div>
                            </div>
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
                            ${expenses.map(expense => `
                                <tr>
                                    <td>${expense.date}</td>
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
        <div className="min-h-[70vh] flex flex-col items-center justify-center pt-8 pb-4 px-1 sm:px-1 lg:px-1">
            {/* Header */}
            <div className="text-center mb-16">
                               <h1 className={`text-5xl font-bold mb-6 ${
                    dark
                        ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent'
                        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent'
                }`}>
                    Exportar Datos
                </h1>

                <p className={`text-xl ${
                    dark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    Elegí el formato para descargar tus gastos
                </p>
            </div>

            {/* Export Buttons */}
            <div className="flex flex-col sm:flex-row gap-8 w-full max-w-2xl px-4">
                {/* CSV Export Button */}
                <button
                    onClick={exportToCSV}
                    disabled={isExporting.csv}
                    className={`group flex-1 relative overflow-hidden rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        dark
                            ? 'bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/30 hover:border-green-400/50 hover:shadow-2xl hover:shadow-green-500/20'
                            : 'bg-gradient-to-br from-green-50 to-green-100/80 border-green-200 hover:border-green-300 hover:shadow-2xl hover:shadow-green-500/20'
                    } backdrop-blur-sm`}
                >
                    <div className="p-10 text-center">
                        {/* CSV Icon */}
                        <div className={`mx-auto mb-6 w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            dark
                                ? 'bg-green-500/20 group-hover:bg-green-500/30'
                                : 'bg-green-500/10 group-hover:bg-green-500/20'
                        }`}>
                            <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                <path d="M8,12V14H16V12H8M8,16V18H13V16H8Z"/>
                            </svg>
                        </div>

                        <h3 className={`text-2xl font-bold mb-3 ${
                            dark ? 'text-white' : 'text-gray-900'
                        }`}>
                            Formato CSV
                        </h3>

                        <p className={`text-sm mb-6 ${
                            dark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            Perfecto para Excel y análisis de datos
                        </p>

                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                            dark ? 'bg-green-500/10 text-green-400' : 'bg-green-500/10 text-green-600'
                        }`}>
                            {isExporting.csv ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-green-500 border-r-transparent rounded-full animate-spin"></div>
                                    Exportando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Descargar CSV
                                </>
                            )}
                        </div>
                    </div>

                    {/* Hover Effect */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        dark
                            ? 'bg-gradient-to-br from-green-500/5 to-green-400/5'
                            : 'bg-gradient-to-br from-green-500/5 to-green-400/5'
                    }`}></div>
                </button>

                {/* PDF Export Button */}
                <button
                    onClick={exportToPDF}
                    disabled={isExporting.pdf}
                    className={`group flex-1 relative overflow-hidden rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        dark
                            ? 'bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-500/30 hover:border-red-400/50 hover:shadow-2xl hover:shadow-red-500/20'
                            : 'bg-gradient-to-br from-red-50 to-red-100/80 border-red-200 hover:border-red-300 hover:shadow-2xl hover:shadow-red-500/20'
                    } backdrop-blur-sm`}
                >
                    <div className="p-10 text-center">
                        {/* PDF Icon */}
                        <div className={`mx-auto mb-6 w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            dark
                                ? 'bg-red-500/20 group-hover:bg-red-500/30'
                                : 'bg-red-500/10 group-hover:bg-red-500/20'
                        }`}>
                            <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                <path d="M10.05,11.22L10.9,11.22L10.9,12.22L10.05,12.22L10.05,11.22M9.25,10.5L9.25,13L11.75,13L11.75,10.5L9.25,10.5M8.5,9.75L12.5,9.75L12.5,13.75L8.5,13.75L8.5,9.75Z"/>
                            </svg>
                        </div>

                        <h3 className={`text-2xl font-bold mb-3 ${
                            dark ? 'text-white' : 'text-gray-900'
                        }`}>
                            Formato PDF
                        </h3>

                        <p className={`text-sm mb-6 ${
                            dark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            Ideal para reportes y presentaciones
                        </p>

                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                            dark ? 'bg-red-500/10 text-red-400' : 'bg-red-500/10 text-red-600'
                        }`}>
                            {isExporting.pdf ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-red-500 border-r-transparent rounded-full animate-spin"></div>
                                    Exportando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Descargar PDF
                                </>
                            )}
                        </div>
                    </div>

                    {/* Hover Effect */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        dark
                            ? 'bg-gradient-to-br from-red-500/5 to-red-400/5'
                            : 'bg-gradient-to-br from-red-500/5 to-red-400/5'
                    }`}></div>
                </button>
            </div>
        </div>
    );
}