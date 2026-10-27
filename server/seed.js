const dotenv = require('dotenv');
dotenv.config();

const { connectDB, disconnectDB } = require('./config/db');
const User = require('./models/User');
const Course = require('./models/Course');
const Topic = require('./models/Topic');
const Lesson = require('./models/Lesson');
const CourseAccess = require('./models/CourseAccess');
const LessonProgress = require('./models/LessonProgress');

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Topic.deleteMany({});
    await Lesson.deleteMany({});
    await CourseAccess.deleteMany({});
    await LessonProgress.deleteMany({});

    console.log('[Seed] Creating Administrator account...');
    const adminUser = await User.create({
      name: 'Dr. Evelyn Vance',
      email: process.env.ADMIN_EMAIL || 'admin@auralms.com',
      password: process.env.ADMIN_PASSWORD || 'AdminPass123!',
      role: 'admin',
      status: 'active',
      bio: 'Principal Architect & Senior Technical Director with 15+ years delivering scalable cloud platforms.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    });

    console.log('[Seed] Creating flagship courses...');

    // Course 1: Full-Stack Architecture
    const course1 = await Course.create({
      title: 'Full-Stack Architecture & High-Performance Web Apps',
      slug: 'full-stack-architecture-masterclass',
      subtitle: 'Build production-grade systems with modern Node.js, React, distributed caching, and zero-trust security.',
      description: 'A comprehensive curriculum engineered for engineers aiming to master end-to-end web architecture. Learn how senior engineers design resilient distributed backends, implement zero-leak authorization models, construct responsive high-craft frontends, and configure continuous monitoring.',
      category: 'Software Engineering',
      level: 'Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      published: true,
      instructor: adminUser._id,
      instructorName: adminUser.name,
      instructorTitle: 'Principal Architect & Director',
      durationHours: 18,
      tags: ['Node.js', 'React', 'MongoDB', 'Security', 'System Design', 'Performance'],
      features: [
        'Production MERN Architecture with Zero-Trust JWT',
        'State-of-the-Art Resource & Video Embedding System',
        'Real-world IDOR & Mass-Assignment Prevention Labs',
        'Downloadable Engineering Blueprints & Architecture Schemas',
      ],
    });

    // Course 2: Applied AI & LLM Systems
    const course2 = await Course.create({
      title: 'Applied AI Engineering & System Integration',
      slug: 'applied-ai-engineering-systems',
      subtitle: 'Design, evaluate, and scale production applications powered by Large Language Models and vector embeddings.',
      description: 'Move beyond basic API calls. Master semantic search with vector databases, build autonomous agent workflows, implement guardrails and structured JSON generation, and evaluate latency, cost, and accuracy across multi-step LLM pipelines.',
      category: 'AI & Machine Learning',
      level: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      published: true,
      instructor: adminUser._id,
      instructorName: adminUser.name,
      instructorTitle: 'AI Research Lead',
      durationHours: 14,
      tags: ['AI Agents', 'Embeddings', 'Vector DB', 'Prompt Engineering', 'Python', 'LLMOps'],
      features: [
        'Vector DB integration and semantic chunking strategies',
        'Agentic tool-calling and memory architectures',
        'Automated evaluation harnesses and latency benchmarking',
      ],
    });

    // Course 3: Impeccable Design Systems & UI Craft
    const course3 = await Course.create({
      title: 'Design Systems & High-Craft Frontend Engineering',
      slug: 'design-systems-frontend-craft',
      subtitle: 'Create award-grade interfaces with anti-slop typography, concentric radius math, and accessible interactions.',
      description: 'Bridge the gap between world-class product design and robust frontend code. Learn to construct token-driven design systems, implement fluid reading geometry, audit accessibility at 10% animation speed, and build interfaces that feel distinctly responsive and alive.',
      category: 'UI/UX Design',
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      published: true,
      instructor: adminUser._id,
      instructorName: adminUser.name,
      instructorTitle: 'Design Technologist',
      durationHours: 12,
      tags: ['Tailwind CSS', 'Framer Motion', 'Design Systems', 'WCAG AA', 'Typography'],
      features: [
        'Mathematical token scales for optical harmony',
        'Fluid clamp typography & baseline alignment',
        'WCAG AA accessible interactions with focus rings',
      ],
    });

    console.log('[Seed] Populating Topics and Lessons for Course 1...');

    // Topic 1
    const t1 = await Topic.create({
      course: course1._id,
      title: 'Module 1: Foundations of Secure Web Architecture',
      description: 'Security fundamentals, zero-trust token cookies, and API gateway protection.',
      order: 1,
    });

    // Topic 2
    const t2 = await Topic.create({
      course: course1._id,
      title: 'Module 2: High-Volume Data Modeling & Resilient Queries',
      description: 'Designing high-performance schema relationships, compound indexes, and cache layers.',
      order: 2,
    });

    // Topic 3
    const t3 = await Topic.create({
      course: course1._id,
      title: 'Module 3: Frontend Performance & Tactile Micro-Interactions',
      description: 'Optimizing render waterfalls, frame budgets, and fluid responsive UI states.',
      order: 3,
    });

    // Lessons for Topic 1
    const l1 = await Lesson.create({
      course: course1._id,
      topic: t1._id,
      title: '1.1 Zero-Trust Authentication with HTTP-Only Cookies',
      order: 1,
      durationMinutes: 22,
      videoType: 'youtube',
      videoUrl: 'https://www.youtube.com/watch?v=2Z2dffWj0bA',
      isFreePreview: true,
      notesMarkdown: `### Architectural Overview

In high-consequence enterprise applications, storing authentication tokens in \`localStorage\` or \`sessionStorage\` exposes your users to credential exfiltration via Cross-Site Scripting (XSS).

#### Key Principles:
1. **HTTP-Only Cookies**: Always deliver the JWT via an \`httpOnly: true\`, \`secure: true\` (HTTPS), and \`sameSite: 'lax'\` cookie header.
2. **Access Token Lifespan**: Keep tokens scoped with deliberate expiry intervals.
3. **Defense in Depth**: Pair cookies with rigorous input sanitization, \`helmet\` CSP directives, and rate limiting.

\`\`\`javascript
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
});
\`\`\`
`,
      resources: [
        {
          title: 'RFC 6750: Bearer Token Usage Specification',
          type: 'external_link',
          url: 'https://datatracker.ietf.org/doc/html/rfc6750',
          description: 'Official IETF specification for OAuth 2.0 and Bearer tokens.',
        },
        {
          title: 'Architecture Blueprint: Zero-Trust Auth Flow',
          type: 'google_drive_pdf',
          url: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view',
          description: 'High-resolution system architecture flowchart in PDF format.',
          isDownloadable: true,
        },
        {
          title: 'Security Hardening Checklist & Best Practices',
          type: 'google_doc',
          url: 'https://docs.google.com/document/d/19p7yJ3g4_checklist_sample/edit',
          description: 'Collaborative Google Doc checklist for staging deployments.',
        },
      ],
    });

    const l2 = await Lesson.create({
      course: course1._id,
      topic: t1._id,
      title: '1.2 Preventing IDOR and Mass Assignment Attacks',
      order: 2,
      durationMinutes: 18,
      videoType: 'vimeo',
      videoUrl: 'https://vimeo.com/76979871',
      isFreePreview: false,
      notesMarkdown: `### Defense Against Insecure Direct Object References (IDOR)

Never assume that because an ID belongs to a valid database record, the requesting user has the right to view or modify it.

#### Verification Strategy:
- Always enforce ownership or explicit enrollment checks in route middleware.
- Reject user payloads that attempt to overwrite privileged keys like \`role\`, \`status\`, or \`permissions\`.

\`\`\`javascript
// Check CourseAccess before serving lesson content
const access = await CourseAccess.findOne({
  user: req.user._id,
  course: course._id,
  status: 'active'
});

if (!access && req.user.role !== 'admin') {
  return res.status(403).json({ message: 'Access denied' });
}
\`\`\`
`,
      resources: [
        {
          title: 'OWASP Top 10: Broken Object Level Authorization',
          type: 'external_link',
          url: 'https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/',
          description: 'Comprehensive OWASP vulnerability analysis and mitigation guide.',
        },
        {
          title: 'Database Access Matrix Spreadsheet',
          type: 'google_sheet',
          url: 'https://docs.google.com/spreadsheets/d/1example_access_matrix/edit',
          description: 'Role-based access matrix model with sample test cases.',
        },
      ],
    });

    // Lessons for Topic 2
    const l3 = await Lesson.create({
      course: course1._id,
      topic: t2._id,
      title: '2.1 Mongoose Indexing Strategies for Sub-Millisecond Queries',
      order: 3,
      durationMinutes: 25,
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1vIkWqN_demo_drive_file/view',
      isFreePreview: false,
      notesMarkdown: `### Query Optimization with Compound Indexes

When querying by multiple fields (e.g. \`user\` + \`course\` + \`completed\`), single-field indexes require MongoDB to perform index intersection. A compound index provides immediate, zero-scan answers.

\`\`\`javascript
lessonProgressSchema.index({ user: 1, course: 1, completed: 1 });
\`\`\`
`,
      resources: [
        {
          title: 'MongoDB Compound Index Mechanics Paper',
          type: 'pdf',
          url: 'https://www.mongodb.com/docs/manual/core/index-compound/',
          description: 'Official documentation and query execution explain analysis.',
        },
      ],
    });

    const l4 = await Lesson.create({
      course: course1._id,
      topic: t2._id,
      title: '2.2 Real-time Progress Tracking and Read/Write Buffering',
      order: 4,
      durationMinutes: 20,
      videoType: 'none', // Demonstrating No-Video practical reading module
      videoUrl: '',
      isFreePreview: false,
      notesMarkdown: `### Reading & Practical Exercise: Asynchronous Progress Buffering

In high-concurrency learning platforms, recording video playback heartbeats on every second will saturate your database connection pool.

#### Optimization Architecture:
1. **Debounce Position Sync**: Dispatch playback position timestamps every 10–15 seconds or on pause/exit.
2. **Atomic Toggles**: Use upsert operations with \`findOneAndUpdate\` to guarantee idempotency.
3. **Optimistic UI Updates**: Instantly update the checkmark in the client state before waiting on network confirmation.
`,
      resources: [
        {
          title: 'Interactive Progress Flow Architecture Slides',
          type: 'google_slides',
          url: 'https://docs.google.com/presentation/d/1sample_progress_slides/edit',
          description: 'Presentation deck with system flowcharts and benchmark results.',
        },
      ],
    });

    // Update course totalLessons
    course1.totalLessons = 4;
    await course1.save();

    console.log('---------------------------------------------------------');
    console.log('[Seed] DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('---------------------------------------------------------');
    console.log('Verified Administrator Account:');
    console.log(`  Email:    ${adminUser.email}`);
    console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'AdminPass123!'}`);
    console.log('---------------------------------------------------------');

    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
    process.exit(1);
  }
};

seedData();
