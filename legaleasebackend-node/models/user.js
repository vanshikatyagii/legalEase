const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },              // Optional: only for manual signup
  uid: { type: String },                   // ✅ For Google users (Firebase UID)
  name: { type: String },                  // ✅ Optional: display name from Google
  role: { type: String, default: 'user' }, // ✅ Role: user | admin
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
