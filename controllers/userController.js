const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  role: Joi.string().valid('ADMIN', 'CLIENT', 'AGENT').required(),
  password: Joi.string().required()
});

const loginSchema = Joi.object({
  phone: Joi.string().required(),
  password: Joi.string().required()
});

exports.register = async (req, res) => {
  try {
    const body = await registerSchema.validateAsync(req.body);

    const { name, phone, role, password } = body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, phone, role, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3600s' }); // 1 hour

    res.status(201).json({ message: 'User created successfully', token });
  } catch (err) {
    if (err.isJoi) {
      return res.status(400).json({ message: err.details[0].message });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.login = async (req, res) => {
  try {
    const body = await loginSchema.validateAsync(req.body);

    const { phone, password } = body;

    const user = await User.findOne({ phone });
    if (!user) return res.status(401).json({ message: 'Invalid User' });

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid Password' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3600s' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    if (err.isJoi) {
      return res.status(400).json({ message: err.details[0].message });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
