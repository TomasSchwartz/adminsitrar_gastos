import React, { useState, useEffect } from 'react';

export default function ExpenseForm({ onAdd, editing, onCancel }) {
    const [form, setForm] = useState({
        description: '',
        amount: '',
        date: '',
        category: 'Otros'
    });

    useEffect(() => {
        if (editing) setForm(editing);
    }, [editing]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        await onAdd(form);
        setForm({ description: '', amount: '', date: '', category: 'Otros' });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4 flex flex-wrap gap-4">
            <input name="description" placeholder="Descripción" value={form.description} onChange={handleChange} className="flex-1 p-2 border rounded" />
            <input name="amount" type="number" placeholder="Monto" value={form.amount} onChange={handleChange} className="w-32 p-2 border rounded" />
            <input name="date" type="date" value={form.date} onChange={handleChange} className="w-40 p-2 border rounded" />
            <select name="category" value={form.category} onChange={handleChange} className="w-40 p-2 border rounded">
                <option>Comida</option>
                <option>Transporte</option>
                <option>Servicios</option>
                <option>Otros</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                {editing ? 'Actualizar' : 'Agregar'}
            </button>
            {editing && (
                <button onClick={onCancel} className="text-red-500 font-semibold">Cancelar</button>
            )}
        </form>
    );
}
