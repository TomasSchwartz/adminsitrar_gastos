import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SavingsHistory() {
    const [savings, setSavings] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchSavings = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/savings', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setSavings(res.data);

                const totalSaved = res.data.reduce((sum, s) => sum + s.amount, 0);
                setTotal(totalSaved);
            } catch (err) {
                console.error("Error al obtener ahorro:", err);
            }
        };

        fetchSavings();
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 mt-6 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Historial de Ahorro Mensual</h2>
            {savings.length === 0 ? (
                <p>No hay datos de ahorro aún.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm table-auto">
                        <thead>
                        <tr className="bg-gray-200 dark:bg-gray-700">
                            <th className="p-2 text-left">Mes</th>
                            <th className="p-2 text-left">Monto Ahorrado</th>
                        </tr>
                        </thead>
                        <tbody>
                        {savings.map((s) => (
                            <tr key={s._id} className="border-b border-gray-300 dark:border-gray-600">
                                <td className="p-2">{s.month}</td>
                                <td className="p-2">${s.amount}</td>
                            </tr>
                        ))}
                        <tr className="font-bold">
                            <td className="p-2">Total acumulado</td>
                            <td className="p-2">${total}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default SavingsHistory;
