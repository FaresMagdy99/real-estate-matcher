// controllers/userController.js

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  try {
    const { name, phone, role, password } = req.body;

    // Check for existing user with phone number
    const existingUser = await User.findOne({ phone });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ name, phone, role, password});
    await user.save();

    // Generate JWT token (implement secret key in .env)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3600s' }); // 1 hour

    res.status(201).json({ message: 'User created successfully', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Find user by phone number
    const user = await User.findOne({ phone });
    if (!user) return res.status(401).json({ message: 'Invalid User' });

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid Password' });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3600s' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
