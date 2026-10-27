const Topic = require('../models/Topic');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// @desc    Get all topics for a course
// @route   GET /api/courses/:courseId/topics
// @access  Private (Admin or Enrolled)
const getTopicsByCourse = async (req, res, next) => {
  try {
    const topics = await Topic.find({ course: req.params.courseId }).sort({ order: 1 });
    res.status(200).json({ success: true, count: topics.length, topics });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Create topic for a course
// @route   POST /api/courses/:courseId/topics
// @access  Private (Admin)
const createTopic = async (req, res, next) => {
  try {
    const { title, description, order } = req.body;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Topic title is required' });
    }

    // Determine default order if not provided
    const nextOrder = order !== undefined ? order : (await Topic.countDocuments({ course: courseId }));

    const topic = await Topic.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      course: courseId,
      order: nextOrder,
    });

    res.status(201).json({ success: true, message: 'Topic created successfully', topic });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Update topic
// @route   PUT /api/topics/:id
// @access  Private (Admin)
const updateTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    const { title, description, order } = req.body;
    if (title) topic.title = title.trim();
    if (description !== undefined) topic.description = description.trim();
    if (order !== undefined) topic.order = Number(order);

    await topic.save();

    res.status(200).json({ success: true, message: 'Topic updated successfully', topic });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Delete topic and its lessons
// @route   DELETE /api/topics/:id
// @access  Private (Admin)
const deleteTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    const courseId = topic.course;
    await Lesson.deleteMany({ topic: topic._id });
    await topic.deleteOne();

    // Update course totalLessons
    const totalLessons = await Lesson.countDocuments({ course: courseId });
    await Course.findByIdAndUpdate(courseId, { totalLessons });

    res.status(200).json({
      success: true,
      message: 'Topic and associated lessons deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTopicsByCourse,
  createTopic,
  updateTopic,
  deleteTopic,
};
