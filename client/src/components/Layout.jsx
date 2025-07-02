// src/components/Layout.jsx
import React, {useContext} from 'react';
import {Outlet} from 'react-router-dom';
import Navbar from './Navbar';
import {ThemeContext} from '../context/ThemeContext';

export default function Layout() {
    const {dark} = useContext(ThemeContext);

    return (
        <div
            className={`min-h-screen ${
                dark ? 'bg-slate-950 text-gray-100' : 'bg-gray-50 text-gray-900'
            }`}
            style={{scrollBehavior: 'smooth'}}
        >
            <Navbar/>
            <main className="pt-16 px-6 max-w-7xl mx-auto">
                <Outlet/>
            </main>
        </div>
    );
}
