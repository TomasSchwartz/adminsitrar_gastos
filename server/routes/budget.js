const express = require('express');
const Budget = require('../models/MonthlyBudget');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware
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

// Guardar o actualizar presupuesto mensual
router.post('/', auth, async (req, res) => {
    const { month, amount } = req.body;
    const filter = { user: req.userId, month };
    const update = { amount };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const result = await Budget.findOneAndUpdate(filter, update, options);
    res.json(result);
});

// Obtener presupuesto de un mes
router.get('/:month', auth, async (req, res) => {
    const budget = await Budget.findOne({ user: req.userId, month: req.params.month });
    res.json(budget || {});
});

module.exports = router;
