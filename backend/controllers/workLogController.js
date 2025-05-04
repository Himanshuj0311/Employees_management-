const WorkLog = require('../models/WorkLog');

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
    const logs = await WorkLog.find({ employeeId: req.user.userId });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
