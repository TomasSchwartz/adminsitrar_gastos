import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/DashboardHome';
import ReactDOM from 'react-dom/client';
import Layout from './components/Layout';
import Expenses from './pages/ExpensesPage';
import Analytics from './pages/AnalyticsPage';
import ExportPage from './pages/ExportPage';
import Budget from "./pages/BudgetPage";


function App() {
    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route element={<Layout/>}>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/expenses" element={<Expenses/>}/>
                <Route path="/analytics" element={<Analytics/>}/>
                <Route path="/export" element={<ExportPage/>}/>
                <Route path="/budget" element={<Budget/>}/>
            </Route>
        </Routes>
    );
}

export default App;
