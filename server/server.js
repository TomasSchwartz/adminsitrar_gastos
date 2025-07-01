const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const auth = require('./middleware/auth');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/budget', require('./routes/budget'));
app.use('/api/auth', authRoutes);
app.use('/api/expenses', auth, expenseRoutes);


mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
  app.listen(5000, () => console.log('Server running on port 5000'));
});
