import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [dark, setDark] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const toggle = () => setDark(!dark);

    const calculatePasswordStrength = (password) => {
        let score = 0;
        let feedback = [];

        if (password.length >= 8) score += 1;
        else feedback.push('at least 8 characters');

        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('uppercase letter');

        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('lowercase letter');

        if (/[0-9]/.test(password)) score += 1;
        else feedback.push('number');

        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        else feedback.push('special character');

        const strengthLevels = {
            0: { text: 'Very Weak', color: 'bg-red-500' },
            1: { text: 'Weak', color: 'bg-red-400' },
            2: { text: 'Fair', color: 'bg-yellow-500' },
            3: { text: 'Good', color: 'bg-blue-500' },
            4: { text: 'Strong', color: 'bg-green-500' },
            5: { text: 'Very Strong', color: 'bg-green-600' }
        };

        return {
            score,
            text: password ? strengthLevels[score].text : '',
            color: password ? strengthLevels[score].color : '',
            feedback: feedback.length > 0 ? `Missing: ${feedback.join(', ')}` : 'Great password!'
        };
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (error) setError('');

        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validations
        if (!form.username.trim()) {
            setError('Full name is required');
            setIsLoading(false);
            return;
        }

        if (!form.email.trim()) {
            setError('Email address is required');
            setIsLoading(false);
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (passwordStrength.score < 3) {
            setError('Please choose a stronger password');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                username: form.username.trim(),
                email: form.email.trim(),
                password: form.password
            });

            // Registration successful
            console.log('Registration successful:', response.data);

            // Redirect to login page
            navigate('/login', {
                state: {
                    message: 'Registration successful! Please log in with your credentials.'
                }
            });

        } catch (err) {
            console.error('Registration error:', err);

            // Handle different types of errors
            if (err.response) {
                // Server responded with error status
                const errorMessage = err.response.data?.error ||
                    err.response.data?.message ||
                    'Registration failed. Please try again.';
                setError(errorMessage);
            } else if (err.request) {
                // Request was made but no response received
                setError('Unable to connect to server. Please check your internet connection.');
            } else {
                // Something else happened
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
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
                    <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
                    <div className="absolute top-2/3 right-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-15"></div>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                Light Mode
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                                Dark Mode
                            </>
                        )}
                    </button>
                </div>

                {/* Register Card */}
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
                                    ? 'bg-gradient-to-br from-emerald-600 to-blue-700'
                                    : 'bg-gradient-to-br from-emerald-600 to-blue-600'
                            }`}>
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                Create Account
                            </h1>
                            <p className={`mt-2 text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Join our financial management platform
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Registration Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username Field */}
                            <div>
                                <label htmlFor="username" className={`block text-sm font-medium mb-2 ${
                                    dark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className={`w-5 h-5 ${dark ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        value={form.username}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                                            dark
                                                ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                                    dark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className={`w-5 h-5 ${dark ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                                            dark
                                                ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                                    dark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className={`w-5 h-5 ${dark ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={form.password}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                                            dark
                                                ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                        placeholder="Create a strong password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <svg className={`w-5 h-5 ${dark ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {showPassword ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            )}
                                        </svg>
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {form.password && (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-xs font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Password Strength: {passwordStrength.text}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className={`text-xs mt-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {passwordStrength.feedback}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${
                                    dark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className={`w-5 h-5 ${dark ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                                            dark
                                                ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        } ${form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-500' : ''}`}
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <svg className={`w-5 h-5 ${dark ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {showConfirmPassword ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            )}
                                        </svg>
                                    </button>
                                </div>
                                {form.confirmPassword && form.password !== form.confirmPassword && (
                                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || passwordStrength.score < 3 || form.password !== form.confirmPassword || !form.username.trim() || !form.email.trim()}
                                className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                        Create Account
                                    </div>
                                )}
                            </button>
                        </form>

                        {/* Login Redirect Section */}
                        <div className={`mt-6 pt-6 border-t transition-colors duration-300 ${
                            dark ? 'border-slate-700' : 'border-gray-200'
                        }`}>
                            <div className="text-center">
                                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Already have an account?{' '}
                                    <button
                                        onClick={handleLoginRedirect}
                                        className={`font-semibold transition-colors duration-200 hover:underline ${
                                            dark
                                                ? 'text-emerald-400 hover:text-emerald-300'
                                                : 'text-emerald-600 hover:text-emerald-500'
                                        }`}
                                    >
                                        Sign in here
                                    </button>
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={`mt-6 pt-4 border-t transition-colors duration-300 ${
                            dark ? 'border-slate-800' : 'border-gray-100'
                        }`}>
                            <div className="flex items-center justify-center space-x-1">
                                <svg className={`w-4 h-4 ${dark ? 'text-emerald-400' : 'text-emerald-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Your data is protected with enterprise-grade security
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}