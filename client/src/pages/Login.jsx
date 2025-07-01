import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', form);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response.data.error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar sesión</h2>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                    onChange={handleChange}
                    className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-200">
                    Entrar
                </button>
            </form>
        </div>


    );
}

