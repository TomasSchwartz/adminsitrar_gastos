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

// Obtener gastos (con información del monthlyBudget si está asociado)
router.get('/', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.userId })
            .populate('monthlyBudget', 'name maxAmount month') // Incluir datos del monthlyBudget
            .sort({ date: -1 }); // Ordenar por fecha descendente
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener gastos' });
    }
});

// Crear gasto
router.post('/', auth, async (req, res) => {
    try {
        // Si se envía un monthlyBudget vacío, convertirlo a null
        const expenseData = {
            ...req.body,
            user: req.userId,
            monthlyBudget: req.body.monthlyBudget || null
        };

        const newExpense = new Expense(expenseData);
        await newExpense.save();

        // Populate el monthlyBudget antes de enviar la respuesta
        await newExpense.populate('monthlyBudget', 'name maxAmount month');

        res.status(201).json(newExpense);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear gasto' });
    }
});

// Editar gasto
router.put('/:id', auth, async (req, res) => {
    try {
        // Si se envía un monthlyBudget vacío, convertirlo a null
        const updateData = {
            ...req.body,
            monthlyBudget: req.body.monthlyBudget || null
        };

        const updated = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            updateData,
            { new: true }
        ).populate('monthlyBudget', 'name maxAmount month');

        if (!updated) return res.status(404).json({ error: 'Gasto no encontrado' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar gasto' });
    }
});

// Eliminar gasto
router.delete('/:id', auth, async (req, res) => {
    try {
        const deleted = await Expense.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });
        if (!deleted) return res.status(404).json({ error: 'Gasto no encontrado' });
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar gasto' });
    }
});

module.exports = router;