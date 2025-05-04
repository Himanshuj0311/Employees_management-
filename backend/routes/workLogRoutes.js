const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createLog, getLogs } = require('../controllers/workLogController');

router.post('/', auth, createLog);
router.get('/', auth, getLogs);

module.exports = router;
