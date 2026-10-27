const User = require('./models/User');
const Course = require('./models/Course');
const Topic = require('./models/Topic');
const Lesson = require('./models/Lesson');
const CourseAccess = require('./models/CourseAccess');
const LessonProgress = require('./models/LessonProgress');

const runSeed = async () => {
  try {
    console.log('[SeedHelper] Initializing core records...');
    
    // Create admin user
    const adminUser = await User.create({
      name: 'Dr. Evelyn Vance',
      email: process.env.ADMIN_EMAIL || 'admin@auralms.com',
      password: process.env.ADMIN_PASSWORD || 'AdminPass123!',
      role: 'admin',
      status: 'active',
      bio: 'Principal Architect & Senior Technical Director with 15+ years delivering scalable cloud platforms.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    });


    // Course 1
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
      totalLessons: 4,
      tags: ['Node.js', 'React', 'MongoDB', 'Security', 'System Design', 'Performance'],
      features: [
        'Production MERN Architecture with Zero-Trust JWT',
        'State-of-the-Art Resource & Video Embedding System',
        'Real-world IDOR & Mass-Assignment Prevention Labs',
        'Downloadable Engineering Blueprints & Architecture Schemas',
      ],
    });

    // Course 2
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
      totalLessons: 2,
      tags: ['AI Agents', 'Embeddings', 'Vector DB', 'Prompt Engineering', 'Python', 'LLMOps'],
      features: [
        'Vector DB integration and semantic chunking strategies',
        'Agentic tool-calling and memory architectures',
        'Automated evaluation harnesses and latency benchmarking',
      ],
    });

    // Course 3
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
      totalLessons: 2,
      tags: ['Tailwind CSS', 'Framer Motion', 'Design Systems', 'WCAG AA', 'Typography'],
      features: [
        'Mathematical token scales for optical harmony',
        'Fluid clamp typography & baseline alignment',
        'WCAG AA accessible interactions with focus rings',
      ],
    });

    // Course 1 Topics & Lessons
    const t1 = await Topic.create({
      course: course1._id,
      title: 'Module 1: Foundations of Secure Web Architecture',
      description: 'Security fundamentals, zero-trust token cookies, and API gateway protection.',
      order: 1,
    });

    const t2 = await Topic.create({
      course: course1._id,
      title: 'Module 2: High-Volume Data Modeling & Resilient Queries',
      description: 'Designing high-performance schema relationships, compound indexes, and cache layers.',
      order: 2,
    });

    const l1 = await Lesson.create({
      course: course1._id,
      topic: t1._id,
      title: '1.1 Zero-Trust Authentication with HTTP-Only Cookies',
      order: 1,
      durationMinutes: 22,
      videoType: 'youtube',
      videoUrl: 'https://www.youtube.com/watch?v=2Z2dffWj0bA',
      isFreePreview: true,
      notesMarkdown: `### Architectural Overview\n\nIn high-consequence enterprise applications, storing authentication tokens in \`localStorage\` exposes your users to credential exfiltration via Cross-Site Scripting (XSS).\n\n#### Key Principles:\n1. **HTTP-Only Cookies**: Always deliver the JWT via an \`httpOnly: true\`, \`secure: true\` (HTTPS), and \`sameSite: 'lax'\` cookie.\n2. **Scoped Lifespans**: Limit session longevity and handle re-authentication gracefully.\n3. **Defense in Depth**: Pair cookies with strict CORS origins, Helmet CSP headers, and rate limiting.`,
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
      notesMarkdown: `### Defense Against Insecure Direct Object References (IDOR)\n\nNever assume that because an ID belongs to a valid database record, the requesting user has the right to view or modify it.\n\n#### Verification Strategy:\n- Always enforce ownership or explicit enrollment checks in route middleware.\n- Reject user payloads that attempt to overwrite privileged keys like \`role\`, \`status\`, or \`permissions\`.`,
      resources: [
        {
          title: 'OWASP Top 10: Broken Object Level Authorization',
          type: 'external_link',
          url: 'https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/',
          description: 'Comprehensive OWASP vulnerability analysis and mitigation guide.',
        },
      ],
    });

    const l3 = await Lesson.create({
      course: course1._id,
      topic: t2._id,
      title: '2.1 Mongoose Indexing Strategies for Sub-Millisecond Queries',
      order: 3,
      durationMinutes: 25,
      videoType: 'youtube',
      videoUrl: 'https://www.youtube.com/watch?v=AYcPS7W4hS4',
      isFreePreview: false,
      notesMarkdown: `### Compound Indexes in Production\n\nWhen querying by multiple fields (e.g. \`user\` + \`course\` + \`completed\`), single-field indexes require MongoDB to perform index intersection. A compound index provides immediate, single-B-Tree answers.`,
      resources: [
        {
          title: 'MongoDB Query Plan Analysis Guide',
          type: 'pdf',
          url: 'https://www.mongodb.com/docs/manual/core/index-compound/',
          description: 'Index optimization guide.',
        },
      ],
    });

    const l4 = await Lesson.create({
      course: course1._id,
      topic: t2._id,
      title: '2.2 Real-time Progress Tracking and Debounced Sync',
      order: 4,
      durationMinutes: 20,
      videoType: 'none', // Demonstrating No-Video practical reading module
      videoUrl: '',
      isFreePreview: false,
      notesMarkdown: `### Reading & Practical Exercise: Asynchronous Progress Buffering\n\nIn high-concurrency learning platforms, recording video playback heartbeats on every second will saturate your database connection pool.\n\n#### Optimization Architecture:\n1. **Debounce Position Sync**: Dispatch playback position timestamps every 10–15 seconds or on pause/exit.\n2. **Atomic Toggles**: Use upsert operations with \`findOneAndUpdate\` to guarantee idempotency.\n3. **Optimistic UI Updates**: Instantly update the checkmark in the client state before waiting on network confirmation.`,
      resources: [],
    });

    // Course 2 Topics & Lessons
    const c2t1 = await Topic.create({
      course: course2._id,
      title: 'Module 1: Vector Embeddings and Semantic Search',
      description: 'Understanding dense vectors, cosine distance, and chunking.',
      order: 1,
    });

    await Lesson.create({
      course: course2._id,
      topic: c2t1._id,
      title: '1.1 Designing Semantic Chunking Pipelines',
      order: 1,
      durationMinutes: 30,
      videoType: 'youtube',
      videoUrl: 'https://www.youtube.com/watch?v=QdDoFfkVkcw',
      isFreePreview: true,
      notesMarkdown: `### Semantic Chunking\n\nFixed-size chunking frequently slices sentences in half, causing context degradation during retrieval. Semantic chunking splits based on embedding similarity drops between consecutive sentences.`,
      resources: [
        {
          title: 'OpenAI Embeddings Whitepaper',
          type: 'external_link',
          url: 'https://arxiv.org/abs/2201.10005',
          description: 'Research paper on text and code embeddings.',
        },
      ],
    });

    await Lesson.create({
      course: course2._id,
      topic: c2t1._id,
      title: '1.2 Hybrid Retrieval with BM25 and Vector Search',
      order: 2,
      durationMinutes: 24,
      videoType: 'youtube',
      videoUrl: 'https://www.youtube.com/watch?v=2Z2dffWj0bA',
      isFreePreview: false,
      notesMarkdown: `### Reciprocal Rank Fusion\n\nCombine sparse lexical search (BM25 for exact keyword/part-number matching) with dense vector search for high recall and high precision.`,
      resources: [],
    });

    console.log('[SeedHelper] Initial auto-seed completed successfully (Clean Admin & Published Curricula ready)!');
  } catch (err) {
    console.error('[SeedHelper] Error during auto-seed:', err);
  }
};

module.exports = { runSeed };
