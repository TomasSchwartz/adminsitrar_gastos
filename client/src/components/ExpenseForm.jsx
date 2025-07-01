import React, { useState } from 'react';

export default function ExpenseForm({ onAdd }) {
    const [form, setForm] = useState({
        description: '',
        amount: '',
        category: 'Comida',
        date: ''
    });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (!form.description || !form.amount || !form.date) return;
        onAdd({ ...form, amount: parseFloat(form.amount) });
        setForm({ description: '', amount: '', category: 'Comida', date: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4 flex flex-wrap gap-4">
            <input
                name="description"
                placeholder="Descripción"
                value={form.description}
                onChange={handleChange}
                className="flex-1 p-2 border border-gray-300 rounded"
            />
            <input
                name="amount"
                type="number"
                placeholder="Monto"
                value={form.amount}
                onChange={handleChange}
                className="w-32 p-2 border border-gray-300 rounded"
            />
            <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-40 p-2 border border-gray-300 rounded"
            />
            <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-40 p-2 border border-gray-300 rounded"
            >
                <option>Comida</option>
                <option>Transporte</option>
                <option>Servicios</option>
                <option>Otros</option>
            </select>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Agregar
            </button>
        </form>

    );
}
