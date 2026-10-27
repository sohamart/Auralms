const express = require('express');
const router = express.Router();
const {
  adminGetAllStudents,
  adminGetStudentDetail,
  adminGrantCourseAccess,
  adminRevokeCourseAccess,
} = require('../controllers/accessController');
const { validateAndFormatVideo } = require('../utils/videoValidator');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/requireAdmin');

router.use(protect);
router.use(requireAdmin);

// Student access management
router.get('/students', adminGetAllStudents);
router.get('/students/:id', adminGetStudentDetail);
router.post('/access/grant', adminGrantCourseAccess);
router.post('/access/revoke', adminRevokeCourseAccess);

// Live video validation helper
router.post('/validate-video', (req, res) => {
  const { url, type } = req.body;
  const result = validateAndFormatVideo(url, type);
  res.status(200).json({ success: result.isValid, data: result });
});

module.exports = router;
