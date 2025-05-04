const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createTask, getTasks } = require('../controllers/taskController');

router.post('/', auth, createTask);
router.get('/', auth, getTasks);

module.exports = router;
