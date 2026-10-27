import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { coursesApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Clock,
  BookOpen,
  User,
  ArrowRight,
  ShieldCheck,
  Lock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  FileText,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';

export const CourseDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [progressStats, setProgressStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Accordion open modules
  const [openTopics, setOpenTopics] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await coursesApi.getBySlug(slug);
        if (res.success) {
          setCourse(res.course);
          setCurriculum(res.curriculum || []);
          setHasAccess(res.hasAccess || false);
          setProgressStats(res.progressStats || null);

          // Open all topics by default
          const map = {};
          (res.curriculum || []).forEach((t) => {
            map[t._id] = true;
          });
          setOpenTopics(map);
        }
      } catch (err) {
        setError(err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  const toggleTopic = (topicId) => {
    setOpenTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col gap-6">
        <div className="h-48 rounded-2xl bg-white border border-slate-200 shadow-xs animate-pulse" />
        <div className="h-96 rounded-2xl bg-white border border-slate-200 shadow-xs animate-pulse" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center flex flex-col items-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Course Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">{error || 'The requested course does not exist.'}</p>
        <Link to="/courses">
          <Button variant="secondary" size="md">
            Return to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-10">
      {/* Course Hero Banner */}
      <div className="relative rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-panel overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Details */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="brand">{course.category}</Badge>
              <Badge variant="accent">{course.level}</Badge>
              {hasAccess && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Enrolled & Verified</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-pretty">
              {course.subtitle || course.description}
            </p>

            {/* Metrics Row */}
            <div className="flex flex-wrap items-center gap-5 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-brand-600" />
                <span className="tabular-nums font-semibold text-slate-800">
                  {course.totalLessons || 0} Lessons
                </span>
              </div>
              {course.durationHours > 0 && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-600" />
                  <span className="tabular-nums font-semibold text-slate-800">
                    {course.durationHours} Hours Total
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-slate-800 font-medium">
                  {course.instructorName || 'Lead Instructor'}
                </span>
              </div>
            </div>

            {/* Main Action Trigger */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              {hasAccess ? (
                <Link to={`/learn/${course.slug}`}>
                  <Button variant="primary" size="lg" iconRight={ArrowRight}>
                    {progressStats && progressStats.percentage > 0
                      ? 'Continue Learning'
                      : 'Start Course Classroom'}
                  </Button>
                </Link>
              ) : user ? (
                <div className="flex flex-col gap-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                    <Lock className="w-4 h-4 text-amber-600" />
                    <span>Course Access Restricted — Requires Administrator Approval</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Your account is registered. An administrator must grant access to this course before private lesson videos, notes, and resources unlock.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login">
                    <Button variant="primary" size="md">
                      Sign In to Access
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="secondary" size="md">
                      Create Student Account
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="lg:col-span-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video shadow-xs">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-slate-400" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Syllabus & Course Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Syllabus Curriculum Breakdown */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Curriculum Syllabus</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Structured breakdown of topics, modules, and lessons
              </p>
            </div>
            <span className="text-xs tabular-nums text-slate-500 font-semibold">
              {curriculum.length} Modules
            </span>
          </div>

          {curriculum.length > 0 ? (
            <div className="flex flex-col gap-3">
              {curriculum.map((topic, index) => {
                const isOpen = openTopics[topic._id];
                const lessons = topic.lessons || [];

                return (
                  <div
                    key={topic._id}
                    className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs"
                  >
                    <button
                      onClick={() => toggleTopic(topic._id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {isOpen ? (
                          <ChevronDown className="w-4 h-4 text-brand-600 shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                            Module {index + 1}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900">
                            {topic.title}
                          </h3>
                        </div>
                      </div>

                      <span className="text-xs text-slate-500 tabular-nums font-medium">
                        {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50">
                        {lessons.map((lesson) => (
                          <div
                            key={lesson._id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <PlayCircle className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="text-slate-800 truncate font-medium">
                                {lesson.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {lesson.isFreePreview && (
                                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 font-bold">
                                  Free Preview
                                </span>
                              )}
                              <span className="tabular-nums text-slate-500 font-medium">
                                {lesson.durationMinutes} min
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs shadow-xs">
              Curriculum structure is currently being updated for this course.
            </div>
          )}
        </div>

        {/* Right: Course Specs & Features */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Key Features */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Included in this Curriculum
            </h3>

            <div className="flex flex-col gap-2.5 text-xs text-slate-700">
              {(course.features && course.features.length > 0
                ? course.features
                : [
                    'Multi-provider verified video embeds',
                    'Downloadable architecture blueprints & PDFs',
                    'Interactive Markdown notes with code blocks',
                    'Real-time lesson completion tracking',
                  ]
              ).map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructor Bio Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Instructor Profile
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center font-bold text-brand-700">
                {course.instructorName ? course.instructorName[0] : 'I'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {course.instructorName || 'Lead Instructor'}
                </h4>
                <p className="text-xs text-slate-500">
                  {course.instructorTitle || 'Staff Engineer & Educator'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
              Architecting secure systems and teaching real-world engineering patterns for modern development teams.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
