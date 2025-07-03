const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  monthlyBudget: { type: mongoose.Schema.Types.ObjectId, ref: 'MonthlyBudget', required: false } // puede ser null
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
