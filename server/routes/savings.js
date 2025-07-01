const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const SavedAhorro = require('../models/SavedAhorro');

// GET /api/savings → historial de ahorro del usuario
router.get('/', auth, async (req, res) => {
    try {
        const savings = await SavedAhorro.find({ user: req.userId }).sort({ month: 1 });
        res.json(savings);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener historial de ahorro' });
    }
});

module.exports = router;
