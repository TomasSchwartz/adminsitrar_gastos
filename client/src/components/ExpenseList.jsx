import React, { useState } from 'react';

export default function ExpenseList({ expenses, onDelete, onEdit }) {
    return (
        <ul className="bg-white p-4 rounded shadow">
            {expenses.length === 0 && <p className="text-gray-500">No hay gastos.</p>}
            {expenses.map(exp => (
                <li key={exp._id} className="flex justify-between items-center border-b py-2">
          <span>
            <span className="font-semibold">{exp.date.slice(0, 10)}</span> — {exp.category} — {exp.description} — ${exp.amount}
          </span>
                    <div className="flex gap-2">
                        <button onClick={() => onEdit(exp)} className="text-blue-600 hover:text-blue-800">✏️</button>
                        <button onClick={() => onDelete(exp._id)} className="text-red-600 hover:text-red-800">❌</button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
