const mongoose = require('mongoose');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Course = require('./models/Course');
const Topic = require('./models/Topic');
const Lesson = require('./models/Lesson');
const CourseAccess = require('./models/CourseAccess');
const LessonProgress = require('./models/LessonProgress');

const resetDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('[ResetDB Error] MONGODB_URI not found in environment.');
      process.exit(1);
    }

    console.log('[ResetDB] Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('[ResetDB] Connected to MongoDB.');

    console.log('[ResetDB] Wiping all collections clean for fresh new app...');
    const [uRes, cRes, tRes, lRes, aRes, pRes] = await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Topic.deleteMany({}),
      Lesson.deleteMany({}),
      CourseAccess.deleteMany({}),
      LessonProgress.deleteMany({}),
    ]);

    console.log(`[ResetDB] Cleaned records:
- Users deleted: ${uRes.deletedCount}
- Courses deleted: ${cRes.deletedCount}
- Topics deleted: ${tRes.deletedCount}
- Lessons deleted: ${lRes.deletedCount}
- Access grants deleted: ${aRes.deletedCount}
- Progress tracks deleted: ${pRes.deletedCount}`);

    console.log('[ResetDB] Database is now 100% clean and fresh! The first user to register will automatically become Admin.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[ResetDB Error]:', err.message);
    process.exit(1);
  }
};

resetDatabase();
