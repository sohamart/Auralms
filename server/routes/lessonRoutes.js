const express = require('express');
const router = express.Router();
const { adminUpdateLesson, adminDeleteLesson } = require('../controllers/lessonController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/requireAdmin');

router.put('/:id', protect, requireAdmin, adminUpdateLesson);
router.delete('/:id', protect, requireAdmin, adminDeleteLesson);

module.exports = router;
