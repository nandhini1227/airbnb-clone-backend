const mongoose = require('mongoose');

const userRegisterSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, trim: true, unique: true, required: true },
  password: { type: String, trim: true, required: true }
  // roles: {
  //   type: [String],
  //   default: ['user']
  // }
});

const User = mongoose.model('User', userRegisterSchema,'users');

module.exports = User;