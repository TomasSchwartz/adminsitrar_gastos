import React, { useEffect, useState } from 'react';
import { getExpenses, createExpense, deleteExpense } from '../api';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import Filters from '../components/Filters';
import Charts from '../components/Charts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [filters, setFilters] = useState({});
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const res = await getExpenses(filters);
            setExpenses(res.data);
        } catch (err) {
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters]);

    const handleAdd = async (data) => {
        await createExpense(data);
        fetchData();
    };

    const handleDelete = async (id) => {
        await deleteExpense(id);
        fetchData();
    };

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Gestor de Gastos</h1>
                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                    Cerrar sesión
                </button>
            </div>
            {/* ...formulario, filtros, lista, charts... */}
        </div>

    );
}
