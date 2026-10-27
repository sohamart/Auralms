const express = require('express');
const router = express.Router();
const {
  getPublicCourses,
  getCourseBySlug,
  getStudentCourses,
  adminGetCourses,
  adminCreateCourse,
  adminUpdateCourse,
  adminTogglePublish,
  adminDeleteCourse,
} = require('../controllers/courseController');
const {
  getTopicsByCourse,
  createTopic,
} = require('../controllers/topicController');
const {
  getStudentLesson,
  getCourseCurriculumFull,
  adminCreateLesson,
} = require('../controllers/lessonController');
const {
  toggleLessonProgress,
  updatePlaybackPosition,
  getCourseProgress,
} = require('../controllers/progressController');
const {
  adminGetCourseStudents,
} = require('../controllers/accessController');

const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/requireAdmin');
const { optionalAuth } = require('../middleware/optionalAuth');
const { checkCourseAccess } = require('../middleware/checkCourseAccess');

// Public catalog
router.get('/', getPublicCourses);

// Student enrolled dashboard
router.get('/student/dashboard', protect, getStudentCourses);

// Admin course management
router.get('/admin/all', protect, requireAdmin, adminGetCourses);
router.post('/', protect, requireAdmin, adminCreateCourse);
router.put('/:id', protect, requireAdmin, adminUpdateCourse);
router.patch('/:id/publish', protect, requireAdmin, adminTogglePublish);
router.delete('/:id', protect, requireAdmin, adminDeleteCourse);
router.get('/admin/:courseId/students', protect, requireAdmin, adminGetCourseStudents);

// Topic management under course
router.get('/:courseId/topics', protect, getTopicsByCourse);
router.post('/:courseId/topics', protect, requireAdmin, createTopic);

// Lesson creation under course and topic
router.post('/:courseId/topics/:topicId/lessons', protect, requireAdmin, adminCreateLesson);

// Protected learning classroom endpoints (strictly verifies user has active CourseAccess or admin role)
router.get('/:courseSlug/curriculum', protect, checkCourseAccess, getCourseCurriculumFull);
router.get('/:courseSlug/lessons/:lessonId', protect, checkCourseAccess, getStudentLesson);
router.post('/:courseSlug/lessons/:lessonId/progress', protect, checkCourseAccess, toggleLessonProgress);
router.patch('/:courseSlug/lessons/:lessonId/position', protect, checkCourseAccess, updatePlaybackPosition);
router.get('/:courseSlug/progress', protect, checkCourseAccess, getCourseProgress);

// Public course details with syllabus outline
router.get('/:slug', optionalAuth, getCourseBySlug);

module.exports = router;
