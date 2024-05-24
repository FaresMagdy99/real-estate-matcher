const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // for password hashing

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'CLIENT', 'AGENT'],
    required: true,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'DELETED'],
    default: 'ACTIVE',
  },
  password: {
    type: String,
    required: true,
  },
});

// Hashing password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Don't rehash if not modified
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
