const Task = require('../models/Task');
const User = require('../models/User')
exports.createTask = async (req, res) => {
  const { title, description, assignedTo, dueDate } = req.body;
  try {
    
    const task = new Task({ title, description, assignedTo, dueDate });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const userEmail = req.query.email;

    if (!userEmail) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const tasks = await Task.find({ assignedTo: userEmail });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// do
