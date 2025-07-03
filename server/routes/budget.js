const express = require('express');
const Budget = require('../models/MonthlyBudget');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware de autenticación
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

// Obtener todos los budgets del usuario
router.get('/', auth, async (req, res) => {
    const budgets = await Budget.find({ user: req.userId }).sort({ month: -1, name: 1 });
    res.json(budgets);
});

// Crear un nuevo budget
router.post('/', auth, async (req, res) => {
    try {
        const { name, maxAmount, month } = req.body;

        const existing = await Budget.findOne({ user: req.userId, name, month });
        if (existing) return res.status(400).json({ error: 'Ya existe un budget con ese nombre para ese mes' });

        const newBudget = new Budget({ user: req.userId, name, maxAmount, month });
        await newBudget.save();

        res.status(201).json(newBudget);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el budget' });
    }
});

// Editar un budget
router.put('/:id', auth, async (req, res) => {
    try {
        const updated = await Budget.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: 'Budget no encontrado' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el budget' });
    }
});

// Eliminar un budget
router.delete('/:id', auth, async (req, res) => {
    try {
        const deleted = await Budget.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!deleted) return res.status(404).json({ error: 'Budget no encontrado' });
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el budget' });
    }
});

module.exports = router;
