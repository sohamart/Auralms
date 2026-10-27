const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'google_drive_pdf',
        'google_doc',
        'google_sheet',
        'google_slides',
        'pdf',
        'external_link',
        'note',
      ],
      default: 'external_link',
    },
    url: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    isDownloadable: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    durationMinutes: {
      type: Number,
      default: 15,
      min: 0,
    },
    videoType: {
      type: String,
      enum: ['youtube', 'vimeo', 'wistia', 'drive', 'external', 'none'],
      default: 'none',
    },
    videoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    notesMarkdown: {
      type: String,
      default: '',
    },
    resources: {
      type: [resourceSchema],
      default: [],
    },
    isFreePreview: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

lessonSchema.index({ course: 1, topic: 1, order: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
