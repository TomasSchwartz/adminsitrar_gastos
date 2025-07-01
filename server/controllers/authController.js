const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ error: 'Email ya registrado' });

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashed });
        await user.save();

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Credenciales inválidas' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { register, login };
