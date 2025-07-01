import React, { useEffect, useState, useMemo } from 'react';
import { getBudget, setBudget } from '../api';

export default function BudgetPanel({ expenses }) {
    const [budget, setBudgetState] = useState(0);
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);

    const currentMonth = new Date().toISOString().slice(0, 7);

    useEffect(() => {
        const fetchBudget = async () => {
            try {
                const res = await getBudget(currentMonth);
                setBudgetState(res.data.amount);
                setInputValue(res.data.amount);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBudget();
    }, [currentMonth]);

    const totalThisMonth = useMemo(() => {
        return expenses
            .filter(e => e.date.slice(0, 7) === currentMonth)
            .reduce((acc, e) => acc + e.amount, 0);
    }, [expenses]);

    const percent = budget ? (totalThisMonth / budget) * 100 : 0;
    const alertLevel = percent > 100 ? '🔥 Te pasaste del presupuesto' :
        percent > 80 ? '⚠️ Estás cerca del límite' :
            percent > 50 ? '✅ Vas bien' :
                '🟢 Tranquilo';

    const handleSave = async () => {
        try {
            await setBudget(currentMonth, parseFloat(inputValue));
            setBudgetState(parseFloat(inputValue));
            setEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p className="mb-4">Cargando presupuesto...</p>;

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
            <h3 className="text-lg font-semibold mb-2">Presupuesto mensual</h3>

            {editing ? (
                <div className="flex gap-2 items-center mb-2">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        className="p-2 border rounded w-32"
                    />
                    <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                        Guardar
                    </button>
                    <button onClick={() => setEditing(false)} className="text-red-500 font-semibold">Cancelar</button>
                </div>
            ) : (
                <div className="flex justify-between items-center mb-2">
                    <p className="text-xl">${budget || 0}</p>
                    <button onClick={() => setEditing(true)} className="text-blue-600 hover:underline">
                        Cambiar presupuesto
                    </button>
                </div>
            )}

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded h-4 mb-1">
                <div
                    className={`h-4 rounded transition-all ${percent > 100 ? 'bg-red-600' : percent > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                ></div>
            </div>

            <div className="text-sm text-gray-700 dark:text-gray-300">
                Gastado este mes: <strong>${totalThisMonth.toFixed(2)}</strong> — {alertLevel}
            </div>
        </div>
    );
}
