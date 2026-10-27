const Course = require('../models/Course');
const Topic = require('../models/Topic');
const Lesson = require('../models/Lesson');
const CourseAccess = require('../models/CourseAccess');
const LessonProgress = require('../models/LessonProgress');

// @desc    Get all published courses (Public catalog)
// @route   GET /api/courses
// @access  Public
const getPublicCourses = async (req, res, next) => {
  try {
    const { search, category, level } = req.query;
    const query = { published: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (level && level !== 'All Levels') {
      query.level = level;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(query)
      .select('-__v')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get public course details & public syllabus
// @route   GET /api/courses/:slug
// @access  Public (Enhanced if authenticated)
const getCourseBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug: slug.toLowerCase() });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    // Load topics
    const topics = await Topic.find({ course: course._id }).sort({ order: 1 });

    // Load lessons
    const lessons = await Lesson.find({ course: course._id })
      .select('title topic order durationMinutes isFreePreview') // Exclude videoUrl, notes, resources
      .sort({ order: 1 });

    // Group lessons by topic for curriculum view
    const curriculum = topics.map((t) => {
      const topicLessons = lessons.filter(
        (l) => l.topic.toString() === t._id.toString()
      );
      return {
        _id: t._id,
        title: t.title,
        description: t.description,
        order: t.order,
        lessons: topicLessons,
      };
    });

    // Check if current user has access
    let hasAccess = false;
    let enrollment = null;
    let progressStats = null;

    if (req.user) {
      if (req.user.role === 'admin') {
        hasAccess = true;
      } else {
        const accessRecord = await CourseAccess.findOne({
          user: req.user._id,
          course: course._id,
          status: 'active',
        });
        if (accessRecord && (!accessRecord.expiresAt || new Date(accessRecord.expiresAt) > new Date())) {
          hasAccess = true;
          enrollment = accessRecord;
        }
      }

      if (hasAccess) {
        const completedCount = await LessonProgress.countDocuments({
          user: req.user._id,
          course: course._id,
          completed: true,
        });
        const totalCount = lessons.length;
        progressStats = {
          completedLessons: completedCount,
          totalLessons: totalCount,
          percentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
        };
      }
    }

    res.status(200).json({
      success: true,
      course,
      curriculum,
      hasAccess,
      enrollment,
      progressStats,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get courses accessible by current student
// @route   GET /api/courses/student/dashboard
// @access  Private (Student & Admin)
const getStudentCourses = async (req, res, next) => {
  try {
    let courses = [];

    if (req.user.role === 'admin') {
      // Admins have access to all published and unpublished courses
      courses = await Course.find().sort({ updatedAt: -1 });
    } else {
      // Students: query CourseAccess where status === 'active'
      const activeAccessList = await CourseAccess.find({
        user: req.user._id,
        status: 'active',
      }).populate('course');

      // Filter out expired or deleted courses
      const validAccess = activeAccessList.filter((acc) => {
        if (!acc.course) return false;
        if (acc.expiresAt && new Date(acc.expiresAt) < new Date()) return false;
        return true;
      });

      courses = validAccess.map((acc) => acc.course);
    }

    // Attach student's progress for each accessible course
    const enrichedCourses = await Promise.all(
      courses.map(async (c) => {
        const totalLessons = await Lesson.countDocuments({ course: c._id });
        const completedLessons = await LessonProgress.countDocuments({
          user: req.user._id,
          course: c._id,
          completed: true,
        });

        // Find last accessed lesson
        const lastProgress = await LessonProgress.findOne({
          user: req.user._id,
          course: c._id,
        })
          .sort({ updatedAt: -1 })
          .populate('lesson', 'title order');

        const percentage =
          totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        return {
          ...c.toObject(),
          totalLessons,
          completedLessons,
          percentage,
          lastLesson: lastProgress ? lastProgress.lesson : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enrichedCourses.length,
      courses: enrichedCourses,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Get all courses with detailed metrics
// @route   GET /api/courses/admin/all
// @access  Private (Admin)
const adminGetCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    const enriched = await Promise.all(
      courses.map(async (c) => {
        const activeStudentsCount = await CourseAccess.countDocuments({
          course: c._id,
          status: 'active',
        });
        const topicsCount = await Topic.countDocuments({ course: c._id });
        const lessonsCount = await Lesson.countDocuments({ course: c._id });

        return {
          ...c.toObject(),
          activeStudentsCount,
          topicsCount,
          lessonsCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enriched.length,
      courses: enriched,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Create new course
// @route   POST /api/courses
// @access  Private (Admin)
const adminCreateCourse = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      subtitle,
      description,
      category,
      level,
      thumbnail,
      published,
      instructorName,
      instructorTitle,
      durationHours,
      tags,
      features,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required.',
      });
    }

    // Auto-slug if not provided
    const cleanSlug = (
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    ).toLowerCase();

    // Check slug collision
    const existing = await Course.findOne({ slug: cleanSlug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A course with slug "${cleanSlug}" already exists. Please pick a unique slug.`,
      });
    }

    const course = await Course.create({
      title: title.trim(),
      slug: cleanSlug,
      subtitle: subtitle ? subtitle.trim() : '',
      description: description.trim(),
      category: category || 'Software Engineering',
      level: level || 'All Levels',
      thumbnail: thumbnail || '',
      published: !!published,
      instructor: req.user._id,
      instructorName: instructorName || req.user.name,
      instructorTitle: instructorTitle || 'Lead Instructor',
      durationHours: durationHours || 0,
      tags: Array.isArray(tags) ? tags : [],
      features: Array.isArray(features) ? features : [],
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      course,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin)
const adminUpdateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    const {
      title,
      slug,
      subtitle,
      description,
      category,
      level,
      thumbnail,
      published,
      instructorName,
      instructorTitle,
      durationHours,
      tags,
      features,
    } = req.body;

    if (slug && slug.toLowerCase() !== course.slug) {
      const existing = await Course.findOne({
        slug: slug.toLowerCase(),
        _id: { $ne: course._id },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Slug "${slug}" is already in use by another course.`,
        });
      }
      course.slug = slug.toLowerCase();
    }

    if (title) course.title = title.trim();
    if (subtitle !== undefined) course.subtitle = subtitle.trim();
    if (description) course.description = description.trim();
    if (category) course.category = category;
    if (level) course.level = level;
    if (thumbnail !== undefined) course.thumbnail = thumbnail;
    if (published !== undefined) course.published = published;
    if (instructorName) course.instructorName = instructorName;
    if (instructorTitle) course.instructorTitle = instructorTitle;
    if (durationHours !== undefined) course.durationHours = Number(durationHours);
    if (tags !== undefined) course.tags = tags;
    if (features !== undefined) course.features = features;

    // Recalculate total lessons
    course.totalLessons = await Lesson.countDocuments({ course: course._id });

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course updated successfully.',
      course,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Toggle course publication status
// @route   PATCH /api/courses/:id/publish
// @access  Private (Admin)
const adminTogglePublish = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    course.published = !course.published;
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course ${course.published ? 'published' : 'unpublished'} successfully.`,
      published: course.published,
      course,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Delete course and all dependencies
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
const adminDeleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Cascade delete topics, lessons, access, progress
    await Topic.deleteMany({ course: course._id });
    await Lesson.deleteMany({ course: course._id });
    await CourseAccess.deleteMany({ course: course._id });
    await LessonProgress.deleteMany({ course: course._id });
    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course and all related topics, lessons, and access records deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicCourses,
  getCourseBySlug,
  getStudentCourses,
  adminGetCourses,
  adminCreateCourse,
  adminUpdateCourse,
  adminTogglePublish,
  adminDeleteCourse,
};
