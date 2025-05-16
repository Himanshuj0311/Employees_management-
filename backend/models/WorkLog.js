const mongoose = require('mongoose');

const WorkLogSchema = new mongoose.Schema({
  employeeId: { type: String, ref: 'User' },
  startTime: Date,
  endTime: Date,
  tasksWorkedOn: [String],
});

module.exports = mongoose.model('WorkLog', WorkLogSchema);
