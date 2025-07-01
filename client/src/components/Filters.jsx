import React, { useState } from 'react';

export default function Filters({ onFilter }) {
    const [category, setCategory] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const handleFilter = () => {
        const filters = {};
        if (category) filters.category = category;
        if (from) filters.from = from;
        if (to) filters.to = to;
        onFilter(filters);
    };

    return (
        <div className="bg-white p-4 rounded shadow mb-4 flex flex-wrap gap-4">
            <select value={category} onChange={e => setCategory(e.target.value)} className="p-2 border rounded w-40">
                <option value="">Todas</option>
                <option>Comida</option>
                <option>Transporte</option>
                <option>Servicios</option>
                <option>Otros</option>
            </select>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                   className="p-2 border rounded w-40"/>
            <input type="date" value={to} onChange={e => setTo(e.target.value)} className="p-2 border rounded w-40"/>
            <button onClick={handleFilter} className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded">
                Filtrar
            </button>
        </div>

    );
}
