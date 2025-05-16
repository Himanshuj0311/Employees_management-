const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: { type: String, ref: 'User' },
  status: { type: String, enum: ['assigned', 'in progress', 'completed'], default: 'assigned' },
  dueDate: Date,
});

module.exports = mongoose.model('Task', TaskSchema);
