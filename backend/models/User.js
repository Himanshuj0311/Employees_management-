const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String, enum: ['employee', 'manager'], default: 'employee' },
});

module.exports = mongoose.model('User', UserSchema);
