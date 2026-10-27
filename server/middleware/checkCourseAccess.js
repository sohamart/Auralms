const Course = require('../models/Course');
const CourseAccess = require('../models/CourseAccess');
const Lesson = require('../models/Lesson');

const checkCourseAccess = async (req, res, next) => {
  try {
    const courseIdentifier = req.params.courseSlug || req.params.slug || req.params.courseId || req.params.id;

    if (!courseIdentifier) {
      return res.status(400).json({
        success: false,
        message: 'Course identifier is missing from request.',
      });
    }

    // Find course by slug or ObjectId
    let course;
    if (courseIdentifier.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(courseIdentifier);
    } else {
      course = await Course.findOne({ slug: courseIdentifier.toLowerCase() });
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    req.course = course;

    // Admin users have full bypass access
    if (req.user && req.user.role === 'admin') {
      req.hasAccess = true;
      return next();
    }

    // Check active CourseAccess for authenticated user
    const access = await CourseAccess.findOne({
      user: req.user._id,
      course: course._id,
      status: 'active',
    });

    if (access) {
      // Check if access expired
      if (access.expiresAt && new Date(access.expiresAt) < new Date()) {
        return res.status(403).json({
          success: false,
          code: 'ACCESS_EXPIRED',
          message: 'Your enrollment access for this course has expired. Please contact the administrator.',
          course: { id: course._id, title: course.title, slug: course.slug },
        });
      }

      req.hasAccess = true;
      req.courseAccess = access;
      return next();
    }

    // Optional free preview check for specific lesson if requested
    if (req.params.lessonId) {
      const lesson = await Lesson.findById(req.params.lessonId);
      if (lesson && lesson.isFreePreview) {
        req.hasAccess = false;
        req.isFreePreview = true;
        req.lesson = lesson;
        return next();
      }
    }

    // Denied: Student is not enrolled
    return res.status(403).json({
      success: false,
      code: 'ACCESS_DENIED',
      message: 'Access Restricted: You are not currently granted access to this course curriculum. Please contact your instructor or administrator to request access.',
      course: { id: course._id, title: course.title, slug: course.slug },
    });
  } catch (err) {
    console.error('[checkCourseAccess] Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Error verifying course access permissions.',
    });
  }
};

module.exports = { checkCourseAccess };
