// src/pages/Layout.jsx
import React, {useContext} from 'react';
import {Outlet} from 'react-router-dom';
import {ThemeContext} from '../context/ThemeContext';
import Navbar from '../components/Navbar';

export default function Layout() {
    const {dark} = useContext(ThemeContext);

    return (
        <div
            className={`min-h-screen transition-all duration-300 ${
                dark
                    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
                    : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
            }`}
            style={{scrollBehavior: 'smooth'}}>
            <Navbar/>

            {/* Enhanced Main Content Container */}
            <main className="pt-44 px-6 pb-8">
                <div className="max-w-7xl mx-auto">
                    {/* Content Wrapper with Beautiful Background */}
                    <div className={`rounded-2xl border transition-all duration-300 ${
                        dark
                            ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl shadow-2xl'
                            : 'bg-gradient-to-br from-white/70 to-gray-50/50 border-gray-200/50 backdrop-blur-xl shadow-xl'
                    }`}>
                        <div className="p-8">
                            <Outlet/>
                        </div>
                    </div>
                </div>
            </main>

            {/* Optional: Decorative Elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-full ${
                    dark
                        ? 'bg-gradient-to-br from-blue-900/5 via-transparent to-indigo-900/5'
                        : 'bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30'
                }`}></div>

                {/* Floating Decorative Circles */}
                <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20 ${
                    dark ? 'bg-blue-500' : 'bg-blue-200'
                } animate-pulse`}></div>
                <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 ${
                    dark ? 'bg-indigo-500' : 'bg-indigo-200'
                } animate-pulse`} style={{animationDelay: '1s'}}></div>
            </div>
        </div>
    );
}