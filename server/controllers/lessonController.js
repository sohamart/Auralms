const Lesson = require('../models/Lesson');
const Topic = require('../models/Topic');
const Course = require('../models/Course');
const LessonProgress = require('../models/LessonProgress');
const { validateAndFormatVideo } = require('../utils/videoValidator');
const { formatGoogleResourceUrl, validateResource } = require('../utils/resourceHelper');

// @desc    Get protected lesson content for learning classroom (Enrolled students or Admin)
// @route   GET /api/courses/:courseSlug/lessons/:lessonId
// @access  Private (Strict checkCourseAccess required)
const getStudentLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const course = req.course;

    const lesson = await Lesson.findOne({ _id: lessonId, course: course._id });
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found in this course.' });
    }

    // Format safe embed URL
    const videoData = validateAndFormatVideo(lesson.videoUrl, lesson.videoType);

    // Format resources with preview URLs
    const formattedResources = (lesson.resources || []).map((r) => {
      const obj = r.toObject ? r.toObject() : r;
      const formatted = formatGoogleResourceUrl(obj.url, obj.type);
      return {
        ...obj,
        previewUrl: formatted.previewUrl || obj.url,
      };
    });

    // Determine completion status
    const progress = await LessonProgress.findOne({
      user: req.user._id,
      lesson: lesson._id,
    });

    // Find Previous and Next lessons within this course
    const allCourseLessons = await Lesson.find({ course: course._id }).sort({ order: 1 });
    const currentIndex = allCourseLessons.findIndex(
      (l) => l._id.toString() === lesson._id.toString()
    );

    const prevLesson = currentIndex > 0 ? allCourseLessons[currentIndex - 1] : null;
    const nextLesson =
      currentIndex >= 0 && currentIndex < allCourseLessons.length - 1
        ? allCourseLessons[currentIndex + 1]
        : null;

    res.status(200).json({
      success: true,
      lesson: {
        _id: lesson._id,
        title: lesson.title,
        order: lesson.order,
        durationMinutes: lesson.durationMinutes,
        videoType: lesson.videoType,
        videoUrl: lesson.videoUrl, // original
        embedUrl: videoData.embedUrl || '',
        videoNotice: videoData.notice || null,
        notesMarkdown: lesson.notesMarkdown || '',
        resources: formattedResources,
        isFreePreview: lesson.isFreePreview,
        topic: lesson.topic,
        course: lesson.course,
      },
      progress: {
        completed: progress ? progress.completed : false,
        completedAt: progress ? progress.completedAt : null,
        lastPositionSeconds: progress ? progress.lastPositionSeconds : 0,
      },
      navigation: {
        prev: prevLesson ? { _id: prevLesson._id, title: prevLesson.title } : null,
        next: nextLesson ? { _id: nextLesson._id, title: nextLesson.title } : null,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get complete curriculum tree with student progress (Enrolled students or Admin)
// @route   GET /api/courses/:courseSlug/curriculum
// @access  Private (Strict checkCourseAccess required)
const getCourseCurriculumFull = async (req, res, next) => {
  try {
    const course = req.course;

    const topics = await Topic.find({ course: course._id }).sort({ order: 1 });
    const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 });

    // Fetch user progress for all lessons in this course
    const userProgress = await LessonProgress.find({
      user: req.user._id,
      course: course._id,
    });

    const progressMap = {};
    userProgress.forEach((p) => {
      progressMap[p.lesson.toString()] = p.completed;
    });

    const curriculum = topics.map((t) => {
      const topicLessons = lessons
        .filter((l) => l.topic.toString() === t._id.toString())
        .map((l) => ({
          _id: l._id,
          title: l.title,
          order: l.order,
          durationMinutes: l.durationMinutes,
          videoType: l.videoType,
          isFreePreview: l.isFreePreview,
          completed: !!progressMap[l._id.toString()],
        }));

      return {
        _id: t._id,
        title: t.title,
        description: t.description,
        order: t.order,
        lessons: topicLessons,
      };
    });

    const totalLessons = lessons.length;
    const completedCount = Object.values(progressMap).filter(Boolean).length;
    const progressPercentage =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    res.status(200).json({
      success: true,
      course: {
        _id: course._id,
        title: course.title,
        slug: course.slug,
        subtitle: course.subtitle,
        thumbnail: course.thumbnail,
      },
      curriculum,
      stats: {
        totalLessons,
        completedLessons: completedCount,
        percentage: progressPercentage,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Create lesson
// @route   POST /api/courses/:courseId/topics/:topicId/lessons
// @access  Private (Admin)
const adminCreateLesson = async (req, res, next) => {
  try {
    const { courseId, topicId } = req.params;
    const {
      title,
      durationMinutes,
      videoType,
      videoUrl,
      notesMarkdown,
      resources,
      isFreePreview,
      order,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Lesson title is required.' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found.' });
    }

    // Validate video
    const videoCheck = validateAndFormatVideo(videoUrl, videoType);
    if (!videoCheck.isValid) {
      return res.status(400).json({ success: false, message: videoCheck.error });
    }

    // Validate resources
    if (Array.isArray(resources)) {
      for (const r of resources) {
        const resCheck = validateResource(r);
        if (!resCheck.isValid) {
          return res.status(400).json({ success: false, message: resCheck.error });
        }
      }
    }

    const nextOrder =
      order !== undefined ? order : await Lesson.countDocuments({ course: courseId });

    const lesson = await Lesson.create({
      title: title.trim(),
      topic: topicId,
      course: courseId,
      order: nextOrder,
      durationMinutes: durationMinutes || 10,
      videoType: videoType || 'none',
      videoUrl: videoUrl ? videoUrl.trim() : '',
      notesMarkdown: notesMarkdown || '',
      resources: Array.isArray(resources) ? resources : [],
      isFreePreview: !!isFreePreview,
    });

    // Update course totalLessons
    const totalLessons = await Lesson.countDocuments({ course: courseId });
    await Course.findByIdAndUpdate(courseId, { totalLessons });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully.',
      lesson,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Update lesson
// @route   PUT /api/lessons/:id
// @access  Private (Admin)
const adminUpdateLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found.' });
    }

    const {
      title,
      topicId,
      durationMinutes,
      videoType,
      videoUrl,
      notesMarkdown,
      resources,
      isFreePreview,
      order,
    } = req.body;

    // Validate video if provided or type changed
    const vType = videoType !== undefined ? videoType : lesson.videoType;
    const vUrl = videoUrl !== undefined ? videoUrl : lesson.videoUrl;
    const videoCheck = validateAndFormatVideo(vUrl, vType);
    if (!videoCheck.isValid) {
      return res.status(400).json({ success: false, message: videoCheck.error });
    }

    // Validate resources
    if (Array.isArray(resources)) {
      for (const r of resources) {
        const resCheck = validateResource(r);
        if (!resCheck.isValid) {
          return res.status(400).json({ success: false, message: resCheck.error });
        }
      }
    }

    if (title) lesson.title = title.trim();
    if (topicId) lesson.topic = topicId;
    if (durationMinutes !== undefined) lesson.durationMinutes = Number(durationMinutes);
    if (videoType !== undefined) lesson.videoType = videoType;
    if (videoUrl !== undefined) lesson.videoUrl = videoUrl.trim();
    if (notesMarkdown !== undefined) lesson.notesMarkdown = notesMarkdown;
    if (resources !== undefined) lesson.resources = resources;
    if (isFreePreview !== undefined) lesson.isFreePreview = isFreePreview;
    if (order !== undefined) lesson.order = Number(order);

    await lesson.save();

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully.',
      lesson,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Admin)
const adminDeleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found.' });
    }

    const courseId = lesson.course;
    await LessonProgress.deleteMany({ lesson: lesson._id });
    await lesson.deleteOne();

    const totalLessons = await Lesson.countDocuments({ course: courseId });
    await Course.findByIdAndUpdate(courseId, { totalLessons });

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStudentLesson,
  getCourseCurriculumFull,
  adminCreateLesson,
  adminUpdateLesson,
  adminDeleteLesson,
};
