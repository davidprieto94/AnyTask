const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = Schema({
  title: String,
  description: String,  
  status: {
    type: Boolean,
    default: false
  },
  date: Date,
  prioridad: Number
});

module.exports = mongoose.model('tasks', TaskSchema);