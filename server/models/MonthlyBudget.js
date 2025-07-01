const mongoose = require('mongoose');

const monthlyBudgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true },
  amount: { type: Number, required: true }
});

monthlyBudgetSchema.index({ user: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('MonthlyBudget', monthlyBudgetSchema);
