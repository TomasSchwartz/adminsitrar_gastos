const express = require('express');
const Expense = require('../models/Expense');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware simple para extraer userId del token
function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.sendStatus(403);
    }
}

// Obtener gastos
router.get('/', auth, async (req, res) => {
    const expenses = await Expense.find({ user: req.userId });
    res.json(expenses);
});

// Crear gasto
router.post('/', auth, async (req, res) => {
    const newExpense = new Expense({ ...req.body, user: req.userId });
    await newExpense.save();
    res.status(201).json(newExpense);
});

// Editar gasto
router.put('/:id', auth, async (req, res) => {
    try {
        const updated = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: 'Gasto no encontrado' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar gasto' });
    }
});


// Eliminar gasto
router.delete('/:id', auth, async (req, res) => {
    await Expense.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

module.exports = router;
