const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const auth = require('../middlewares/auth');

// Crear ingreso
router.post('/', auth, async (req, res) => {
    const { amount, source, date, description } = req.body;
    try {
        const newIncome = new Income({ user: req.userId, amount, source, date, description });
        await newIncome.save();
        res.status(201).json(newIncome);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear ingreso' });
    }
});

// Obtener todos los ingresos del usuario
router.get('/', auth, async (req, res) => {
    try {
        const incomes = await Income.find({ user: req.userId }).sort({ date: -1 });
        res.json(incomes);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener ingresos' });
    }
});

// Editar ingreso
router.put('/:id', auth, async (req, res) => {
    try {
        const updated = await Income.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Ingreso no encontrado" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Error al editar ingreso' });
    }
});

// Eliminar ingreso
router.delete('/:id', auth, async (req, res) => {
    try {
        const deleted = await Income.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!deleted) return res.status(404).json({ message: "Ingreso no encontrado" });
        res.json({ message: "Ingreso eliminado" });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar ingreso' });
    }
});

module.exports = router;
