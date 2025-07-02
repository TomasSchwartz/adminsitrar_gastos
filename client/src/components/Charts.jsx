import React from 'react';
import {Bar, Pie} from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend} from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Charts({expenses}) {
    // Agrupar por categoría
    const gastosPorCategoria = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {});

    const categorias = Object.keys(gastosPorCategoria);
    const montos = Object.values(gastosPorCategoria);

    // Agrupar por mes
    const gastosPorMes = expenses.reduce((acc, exp) => {
        const mes = exp.date.slice(0, 7); // yyyy-mm
        acc[mes] = (acc[mes] || 0) + exp.amount;
        return acc;
    }, {});

    const meses = Object.keys(gastosPorMes).sort();
    const montosMensuales = meses.map(m => gastosPorMes[m]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-white p-4 shadow rounded">
                <h3 className="text-lg font-semibold mb-2">Gastos por Categoría</h3>
                <Pie
                    data={{
                        labels: categorias,
                        datasets: [{data: montos, backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#fbbf24']}]
                    }}
                />
            </div>
            <div className="bg-white p-4 shadow rounded">
                <h3 className="text-lg font-semibold mb-2">Gastos por Mes</h3>
                <Bar
                    data={{
                        labels: meses,
                        datasets: [{label: 'Gasto ($)', data: montosMensuales, backgroundColor: '#3b82f6'}]
                    }}
                />
            </div>
        </div>
    );
}
