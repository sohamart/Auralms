const LessonProgress = require('../models/LessonProgress');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// @desc    Toggle or set lesson completion status
// @route   POST /api/courses/:courseSlug/lessons/:lessonId/progress
// @access  Private (Strict checkCourseAccess required)
const toggleLessonProgress = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { completed } = req.body; // boolean or toggle if undefined
    const course = req.course;

    const lesson = await Lesson.findOne({ _id: lessonId, course: course._id });
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found in this course.' });
    }

    let progress = await LessonProgress.findOne({
      user: req.user._id,
      lesson: lesson._id,
    });

    const targetCompleted = completed !== undefined ? !!completed : (progress ? !progress.completed : true);

    if (!progress) {
      progress = new LessonProgress({
        user: req.user._id,
        course: course._id,
        lesson: lesson._id,
        completed: targetCompleted,
        completedAt: targetCompleted ? new Date() : null,
      });
    } else {
      progress.completed = targetCompleted;
      progress.completedAt = targetCompleted ? new Date() : null;
    }

    await progress.save();

    // Calculate updated course statistics
    const totalLessons = await Lesson.countDocuments({ course: course._id });
    const completedLessons = await LessonProgress.countDocuments({
      user: req.user._id,
      course: course._id,
      completed: true,
    });
    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    res.status(200).json({
      success: true,
      message: targetCompleted ? 'Lesson marked as completed!' : 'Lesson marked as incomplete.',
      progress: {
        lessonId: lesson._id,
        completed: progress.completed,
        completedAt: progress.completedAt,
      },
      stats: {
        totalLessons,
        completedLessons,
        percentage,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Save playback position
// @route   PATCH /api/courses/:courseSlug/lessons/:lessonId/position
// @access  Private (Strict checkCourseAccess required)
const updatePlaybackPosition = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { seconds } = req.body;
    const course = req.course;

    if (seconds === undefined || typeof seconds !== 'number') {
      return res.status(400).json({ success: false, message: 'Playback seconds must be a number.' });
    }

    await LessonProgress.findOneAndUpdate(
      { user: req.user._id, lesson: lessonId },
      {
        user: req.user._id,
        course: course._id,
        lesson: lessonId,
        lastPositionSeconds: Math.floor(seconds),
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// @desc    Get progress details for a course
// @route   GET /api/courses/:courseSlug/progress
// @access  Private (Strict checkCourseAccess required)
const getCourseProgress = async (req, res, next) => {
  try {
    const course = req.course;

    const progressRecords = await LessonProgress.find({
      user: req.user._id,
      course: course._id,
      completed: true,
    });

    const totalLessons = await Lesson.countDocuments({ course: course._id });
    const completedLessonIds = progressRecords.map((p) => p.lesson.toString());
    const completedCount = completedLessonIds.length;
    const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    res.status(200).json({
      success: true,
      completedLessonIds,
      stats: {
        totalLessons,
        completedLessons: completedCount,
        percentage,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  toggleLessonProgress,
  updatePlaybackPosition,
  getCourseProgress,
};
