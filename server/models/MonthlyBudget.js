const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true }, // ej: "2025-07"
  amount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('MonthlyBudget', budgetSchema);
