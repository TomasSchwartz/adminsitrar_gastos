const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const SavedAhorro = require('../models/SavedAhorro');

router.get('/:month', auth, async (req, res) => {
    const { month } = req.params; // "2025-07"
    try {
        const start = new Date(`${month}-01`);
        const end = new Date(`${month}-31`);

        const incomes = await Income.find({
            user: req.userId,
            date: { $gte: start, $lte: end }
        });

        const expenses = await Expense.find({
            user: req.userId,
            date: { $gte: start, $lte: end }
        });

        const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        const netBalance = totalIncome - totalExpenses;

        // Guardar ahorro automático si no existe
        const existing = await SavedAhorro.findOne({ user: req.userId, month });
        if (!existing) {
            const ahorro = new SavedAhorro({
                user: req.userId,
                month,
                amount: netBalance
            });
            await ahorro.save();
        }

        res.json({ totalIncome, totalExpenses, netBalance });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al calcular KPIs" });
    }
});

module.exports = router;
