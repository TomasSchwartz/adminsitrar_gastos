import React, {useState, useContext} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {ThemeContext} from '../context/ThemeContext';

export default function Login() {
    const [form, setForm] = useState({email: '', password: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {dark, toggle} = useContext(ThemeContext);

    const handleChange = e => {
        setForm({...form, [e.target.name]: e.target.value});
        if (error) setError(''); // Clear error when user starts typing
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', form);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = () => {
        navigate('/register');
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-300 ${
            dark
                ? 'bg-slate-950'
                : 'bg-gray-50'
        }`}>
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-full opacity-5 ${
                    dark ? 'bg-slate-800' : 'bg-gray-200'
                }`}>
                    <div
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
                    <div
                        className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
                </div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Theme Toggle */}
                <div className="flex justify-end mb-6">
                    <button
                        onClick={toggle}
                        className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            dark
                                ? 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                        }`}
                    >
                        {dark ? (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                                </svg>
                                Light Mode
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                                </svg>
                                Dark Mode
                            </>
                        )}
                    </button>
                </div>

                {/* Login Card */}
                <div className={`backdrop-blur-md rounded-2xl border shadow-xl transition-all duration-300 ${
                    dark
                        ? 'bg-slate-900/95 border-slate-800/50'
                        : 'bg-white/95 border-gray-200/50'
                }`}>
                    <div className="p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                                dark
                                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700'
                                    : 'bg-gradient-to-br from-blue-600 to-indigo-600'
                            }`}>
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                </svg>
                            </div>
                            <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                Financial Dashboard
                            </h1>
                            <p className={`mt-2 text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Sign in to access your expense management system
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                                    dark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className={`w-5 h-5 ${dark ? 'text-gray-400' : 'text-gray-400'}`}
                                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            dark
                                                ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                                    dark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    Password
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className={`w-5 h-5 ${dark ? 'text-gray-400' : 'text-gray-400'}`}
                                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={form.password}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            dark
                                                ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                        placeholder="Enter your password"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSubmit(e);
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Forgot Password Link */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className={`text-sm font-medium transition-colors duration-200 hover:underline ${
                                        dark
                                            ? 'text-blue-400 hover:text-blue-300'
                                            : 'text-blue-600 hover:text-blue-500'
                                    }`}
                                >
                                    Forgot your password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]">
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none"
                                             viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"/>
                                        </svg>
                                        Sign In
                                    </div>
                                )}
                            </button>
                        </form>

                        {/* Sign Up Section */}
                        <div className={`mt-6 pt-6 border-t transition-colors duration-300 ${
                            dark ? 'border-slate-700' : 'border-gray-200'
                        }`}>
                            <div className="text-center">
                                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Don't have an account?{' '}
                                    <button
                                        onClick={handleSignUp}
                                        className={`font-semibold transition-colors duration-200 hover:underline ${
                                            dark
                                                ? 'text-blue-400 hover:text-blue-300'
                                                : 'text-blue-600 hover:text-blue-500'
                                        }`}
                                    >
                                        Create one now
                                    </button>
                                </p>
                                <p className={`mt-3 text-xs ${dark ? 'text-gray-500' : 'text-gray-500'}`}>
                                    Join thousands of users managing their finances securely
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={`mt-6 pt-4 border-t transition-colors duration-300 ${
                            dark ? 'border-slate-800' : 'border-gray-100'
                        }`}>
                            <div className="flex items-center justify-center space-x-1">
                                <svg className={`w-4 h-4 ${dark ? 'text-green-400' : 'text-green-500'}`} fill="none"
                                     stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                </svg>
                                <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Secure access to your financial data
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}