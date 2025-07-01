const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;  // agregar username
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ message: 'Email o username ya registrado' });

        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashed });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token });
    } catch (err) {
        console.error('Error en registro:', err);
        res.status(500).json({ message: 'Error del servidor' });
    }
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Credenciales inválidas' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor' });
    }
});

module.exports = router;
