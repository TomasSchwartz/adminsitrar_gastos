import React, { useMemo } from 'react';

export default function KpiPanel({ expenses }) {
    const kpis = useMemo(() => {
        if (!expenses.length) return null;

        const total = expenses.reduce((acc, e) => acc + e.amount, 0);
        const promedio = total / expenses.length;

        // Agrupar por mes
        const gastosPorMes = {};
        expenses.forEach(e => {
            const mes = e.date.slice(0, 7); // yyyy-mm
            gastosPorMes[mes] = (gastosPorMes[mes] || 0) + e.amount;
        });
        const promedioMensual = Object.values(gastosPorMes).reduce((a, b) => a + b, 0) / Object.keys(gastosPorMes).length;

        // Agrupar por categoría
        const porCategoria = {};
        expenses.forEach(e => {
            porCategoria[e.category] = (porCategoria[e.category] || 0) + e.amount;
        });
        const categoriaTop = Object.entries(porCategoria).sort((a, b) => b[1] - a[1])[0];

        return {
            total,
            promedio,
            promedioMensual,
            categoriaTop
        };
    }, [expenses]);

    if (!kpis) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                <h3 className="text-sm text-gray-500 dark:text-gray-300">Total Gastado</h3>
                <p className="text-2xl font-bold">${kpis.total.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                <h3 className="text-sm text-gray-500 dark:text-gray-300">Promedio por Gasto</h3>
                <p className="text-2xl font-bold">${kpis.promedio.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                <h3 className="text-sm text-gray-500 dark:text-gray-300">Promedio Mensual</h3>
                <p className="text-2xl font-bold">${kpis.promedioMensual.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                <h3 className="text-sm text-gray-500 dark:text-gray-300">Mayor Categoría</h3>
                <p className="text-xl font-semibold">{kpis.categoriaTop[0]}</p>
                <p className="text-sm text-gray-400">(${kpis.categoriaTop[1].toFixed(2)})</p>
            </div>
        </div>
    );
}
