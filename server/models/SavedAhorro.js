const mongoose = require('mongoose');

const ahorroSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: String, required: true }, // formato "2025-07"
    amount: { type: Number, required: true }
}, { timestamps: true });

ahorroSchema.index({ user: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('SavedAhorro', ahorroSchema);
