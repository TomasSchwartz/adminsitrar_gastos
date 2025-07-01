import React, { useEffect, useState, useContext } from 'react';
import { getExpenses, createExpense, deleteExpense } from '../api';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import Filters from '../components/Filters';
import Charts from '../components/Charts';
import ExportButtons from '../components/ExportButtons';
import KpiPanel from '../components/KpiPanel';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [filters, setFilters] = useState({});
    const navigate = useNavigate();
    const { dark, toggle } = useContext(ThemeContext);

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

    const [editing, setEditing] = useState(null);
    const handleAdd = async (data) => {
        if (editing) {
            await updateExpense(editing._id, data);
            setEditing(null);
        } else {
            await createExpense(data);
        }
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
        <div className={`min-h-screen p-4 ${dark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-2">
                <h1 className="text-3xl font-bold">Gestor de Gastos</h1>
                <div className="flex gap-2">
                    <button
                        onClick={toggle}
                        className="bg-gray-200 dark:bg-gray-700 dark:text-white text-sm px-3 py-1 rounded"
                    >
                        {dark ? '☀️ Claro' : '🌙 Oscuro'}
                    </button>
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <KpiPanel />

            {/* Formulario de gastos */}
            <ExpenseForm onAdd={handleAdd} editing={editing} onCancel={() => setEditing(null)} />
            <ExpenseList expenses={expenses} onDelete={handleDelete} onEdit={setEditing} />


            {/* Filtros */}
            <Filters onFilter={setFilters} />

            {/* Gráfico de gastos */}
            <Charts expenses={expenses} />

            {/* Lista de gastos */}
            <ExpenseList expenses={expenses} onDelete={handleDelete} />

            {/* Exportar a CSV / PDF */}
            <ExportButtons data={expenses} />

            {/* Lugar para agregar ingresos o ahorros más adelante */}
            {/* <IncomePanel /> */}
            {/* <SavingsHistory /> */}
        </div>
    );
}
