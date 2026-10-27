const express = require('express');
const router = express.Router();
const { updateTopic, deleteTopic } = require('../controllers/topicController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/requireAdmin');

router.put('/:id', protect, requireAdmin, updateTopic);
router.delete('/:id', protect, requireAdmin, deleteTopic);

module.exports = router;
