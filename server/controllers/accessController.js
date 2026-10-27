const User = require('../models/User');
const Course = require('../models/Course');
const CourseAccess = require('../models/CourseAccess');
const Lesson = require('../models/Lesson');
const LessonProgress = require('../models/LessonProgress');

// @desc    Admin: List all students with access summaries
// @route   GET /api/admin/students
// @access  Private (Admin)
const adminGetAllStudents = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = { role: 'student' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await User.find(query).sort({ createdAt: -1 });

    const enrichedStudents = await Promise.all(
      students.map(async (s) => {
        const activeAccessCount = await CourseAccess.countDocuments({
          user: s._id,
          status: 'active',
        });
        const completedLessonsCount = await LessonProgress.countDocuments({
          user: s._id,
          completed: true,
        });

        return {
          ...s.toJSON(),
          activeAccessCount,
          completedLessonsCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enrichedStudents.length,
      students: enrichedStudents,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Get student details and all course access records
// @route   GET /api/admin/students/:id
// @access  Private (Admin)
const adminGetStudentDetail = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const accessRecords = await CourseAccess.find({ user: student._id })
      .populate('course', 'title slug thumbnail category totalLessons')
      .populate('grantedBy', 'name email')
      .sort({ createdAt: -1 });

    // Calculate progress for each granted course
    const accessWithProgress = await Promise.all(
      accessRecords.map(async (acc) => {
        if (!acc.course) return acc;
        const totalLessons = await Lesson.countDocuments({ course: acc.course._id });
        const completed = await LessonProgress.countDocuments({
          user: student._id,
          course: acc.course._id,
          completed: true,
        });
        const percentage = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

        return {
          ...acc.toObject(),
          totalLessons,
          completedLessons: completed,
          percentage,
        };
      })
    );

    res.status(200).json({
      success: true,
      student: student.toJSON(),
      accessRecords: accessWithProgress,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Grant course access to a student
// @route   POST /api/admin/access/grant
// @access  Private (Admin)
const adminGrantCourseAccess = async (req, res, next) => {
  try {
    const { studentId, courseId, expiresAt, notes } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Both studentId and courseId are required.',
      });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Upsert access record
    const access = await CourseAccess.findOneAndUpdate(
      { user: studentId, course: courseId },
      {
        user: studentId,
        course: courseId,
        grantedBy: req.user._id,
        status: 'active',
        grantedAt: new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        notes: notes || '',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: `Course access to "${course.title}" granted successfully to ${student.name}.`,
      access,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Revoke course access from a student
// @route   POST /api/admin/access/revoke
// @access  Private (Admin)
const adminRevokeCourseAccess = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Both studentId and courseId are required.',
      });
    }

    const access = await CourseAccess.findOne({ user: studentId, course: courseId });
    if (!access) {
      return res.status(404).json({
        success: false,
        message: 'No enrollment access record found for this student and course.',
      });
    }

    access.status = 'revoked';
    await access.save();

    res.status(200).json({
      success: true,
      message: 'Course access has been revoked successfully.',
      access,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Get all students enrolled in a specific course
// @route   GET /api/admin/courses/:courseId/students
// @access  Private (Admin)
const adminGetCourseStudents = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const accessList = await CourseAccess.find({ course: courseId })
      .populate('user', 'name email avatar createdAt')
      .sort({ grantedAt: -1 });

    const totalLessons = await Lesson.countDocuments({ course: courseId });

    const enriched = await Promise.all(
      accessList.map(async (acc) => {
        if (!acc.user) return null;
        const completedCount = await LessonProgress.countDocuments({
          user: acc.user._id,
          course: courseId,
          completed: true,
        });

        const percentage =
          totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

        return {
          accessId: acc._id,
          status: acc.status,
          grantedAt: acc.grantedAt,
          expiresAt: acc.expiresAt,
          notes: acc.notes,
          student: acc.user,
          completedLessons: completedCount,
          totalLessons,
          percentage,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enriched.filter(Boolean).length,
      enrollments: enriched.filter(Boolean),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  adminGetAllStudents,
  adminGetStudentDetail,
  adminGrantCourseAccess,
  adminRevokeCourseAccess,
  adminGetCourseStudents,
};
