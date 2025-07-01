const Expense = require('../models/Expense');

// Obtener todos los gastos (con filtros opcionales)
const getExpenses = async (req, res) => {
    try {
        const { category, from, to } = req.query;
        let filter = {};

        if (category) filter.category = category;
        if (from || to) {
            filter.date = {};
            if (from) filter.date.$gte = new Date(from);
            if (to) filter.date.$lte = new Date(to);
        }

        const expenses = await Expense.find({ userId: req.user.id, ...filter }).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Crear nuevo gasto
const createExpense = async (req, res) => {
    try {
        const newExpense = new Expense({ ...req.body, userId: req.user.id });
        const saved = await newExpense.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Eliminar gasto
const deleteExpense = async (req, res) => {
    try {
        const deleted = await Expense.findByIdAndDelete(req.params.id);
        res.json(deleted);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { getExpenses, createExpense, deleteExpense };
