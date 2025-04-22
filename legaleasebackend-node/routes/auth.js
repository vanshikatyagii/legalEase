const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

// SIGNUP
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword, role: 'user' });

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ email: newUser.email, token, role: newUser.role });
  } catch (err) {
    console.error('❌ Signup Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ email: user.email, token, role: user.role });
  } catch (err) {
    console.error('❌ Login Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GOOGLE AUTH HANDLER
router.post('/google-auth', async (req, res) => {
  const { email, name, uid } = req.body;

  if (!email || !uid) {
    return res.status(400).json({ error: 'Missing email or uid' });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        email,
        name,
        uid,
        role: 'user',
        joined: new Date()
      });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      email: user.email,
      name: user.name,
      token,
      role: user.role
    });

  } catch (err) {
    console.error('❌ Google Auth Error:', err.message);
    res.status(500).json({ error: 'Google Auth failed' });
  }
});

module.exports = router;
