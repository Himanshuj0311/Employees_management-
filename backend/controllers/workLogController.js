const WorkLog = require('../models/WorkLog');
const Task = require('../models/Task');
const User = require('../models/User')

exports.createLog = async (req, res) => {
  const { startTime, endTime, tasksWorkedOn } = req.body;
  try {
    const log = new WorkLog({
      employeeId: req.user.userId,
      startTime,
      endTime,
      tasksWorkedOn
    });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const userEmail = req.query.email;
    const data = await User.find({email : userEmail})


    const logs = await WorkLog.find({employeeId : data[0]._id });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
