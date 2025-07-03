const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  maxAmount: { type: Number, required: true },
  month: { type: String, required: true },
}, {
  timestamps: true
});

budgetSchema.index({ user: 1, name: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
