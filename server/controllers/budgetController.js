const Budget = require('../models/Budget');

exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.userId });
        res.json(budgets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createBudget = async (req, res) => {
    try {
        const { name, maxAmount, month } = req.body;
        const budget = new Budget({
            user: req.userId,
            name,
            maxAmount,
            month
        });
        await budget.save();
        res.status(201).json(budget);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateBudget = async (req, res) => {
    try {
        const updated = await Budget.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
        req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Budget not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!budget) return res.status(404).json({ error: 'Budget not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
