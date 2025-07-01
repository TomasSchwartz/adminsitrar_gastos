const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: String,
  amount: Number,
  date: String,
  category: String
});

module.exports = mongoose.model('Expense', expenseSchema);
