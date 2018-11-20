const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
  title: String,
  name: String,
  phone: Number,  
  email: String
});

module.exports = mongoose.model('users', UserSchema);