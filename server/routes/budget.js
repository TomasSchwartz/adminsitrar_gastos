const express = require('express');
const router = express.Router();
const MonthlyBudget = require('../models/MonthlyBudget');
const authMiddleware = require('../middlewares/auth');

// GET presupuesto para el mes actual
router.get('/:month', authMiddleware, async (req, res) => {
    try {
        const budget = await MonthlyBudget.findOne({ user: req.userId, month: req.params.month });
        res.json(budget || { amount: 0 });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener presupuesto' });
    }
});

// POST o PUT presupuesto
router.put('/:month', authMiddleware, async (req, res) => {
    try {
        const updated = await MonthlyBudget.findOneAndUpdate(
            { user: req.userId, month: req.params.month },
            { amount: req.body.amount },
            { new: true, upsert: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Error al guardar presupuesto' });
    }
});

module.exports = router;
