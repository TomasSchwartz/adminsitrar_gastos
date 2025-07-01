import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', form);
            navigate('/login');
        } catch (err) {
            alert(err.response.data.error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Registro</h2>
                <input
                    name="username"
                    placeholder="Nombre"
                    onChange={handleChange}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                    onChange={handleChange}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition duration-200">
                    Registrarse
                </button>
            </form>
        </div>

    );
}
