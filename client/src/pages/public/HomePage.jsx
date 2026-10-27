import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { coursesApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { usePwa } from '../../context/PwaContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import {
  Play,
  PlayCircle,
  Clock,
  BookOpen,
  ArrowRight,
  Flame,
  Award,
  Download,
  Sparkles,
  Compass,
  CheckCircle2,
  Lock,
  ChevronRight,
  Zap,
  ShieldCheck,
  FolderOpen,
  Smartphone,
  Layers,
  Search,
  User,
  GraduationCap,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const HomePage = () => {
  const { user, isAdmin } = useAuth();
  const { isInstallable, isInstalled, openInstallModal } = usePwa();
  const navigate = useNavigate();

  const [studentCourses, setStudentCourses] = useState([]);
  const [catalogCourses, setCatalogCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch student's accessible enrolled courses
        const studentRes = await coursesApi.getStudentDashboard();
        if (studentRes.success) {
          setStudentCourses(studentRes.courses || []);
        }

        // 2. Fetch public course catalog for exploration
        const catalogRes = await coursesApi.getPublic();
        if (catalogRes.success) {
          setCatalogCourses(catalogRes.courses || []);
        }
      } catch (err) {
        console.error('Error loading dashboard feed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // First active course with progress or most recently accessed
  const activeCourse =
    studentCourses.find((c) => c.percentage < 100) ||
    studentCourses[0] ||
    catalogCourses[0];

  const totalLessonsDone = studentCourses.reduce(
    (acc, c) => acc + (c.completedLessons || 0),
    0
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50 text-slate-900 select-none pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-8 pt-6 sm:pt-8">
        
        {/* ============================================================ */}
        {/* 1. App Header Greeting & Progress Summary                    */}
        {/* ============================================================ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <Link
            to="/profile"
            className="flex items-center gap-3.5 group cursor-pointer"
            title="Manage Profile & Avatar"
          >
            <div className="relative shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shadow-xs group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  {user?.name ? user.name[0]?.toUpperCase() : 'A'}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-200" />
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                {getGreeting()}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug group-hover:text-brand-600 transition-colors">
                {user?.name || 'Engineer'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAdmin
                  ? 'Administrator Console & Curriculum Governor'
                  : studentCourses.length > 0
                  ? `Active Learner • ${studentCourses.length} Enrolled Courses`
                  : 'Student Account Active • Access Pending'}
              </p>
            </div>
          </Link>

          {/* Quick Learning & Telemetry Badges */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Official AuraLMS Brand Emblem */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200/80 shadow-2xs">
              <img
                src="/pwa-192x192.png"
                alt="AuraLMS Logo"
                className="w-5 h-5 rounded-md object-cover shadow-xs"
              />
              <span className="text-xs font-black tracking-tight text-slate-800">
                Aura<span className="text-brand-600">LMS</span>
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-brand-50 border border-brand-200/80 text-brand-800 text-xs font-bold shadow-xs">
              <Award className="w-4 h-4 text-brand-600" />
              <span>{totalLessonsDone} Lessons Completed</span>
            </div>

            {!isInstalled && (
              <button
                onClick={openInstallModal}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-800 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                title="Install AuraLMS as Native App"
              >
                <Download className="w-4 h-4 text-cyan-600" />
                <span>Install App</span>
              </button>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. "Continue Learning" / Active Lesson Hero Card             */}
        {/* ============================================================ */}
        {loading ? (
          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse">
            <div className="flex flex-col gap-3.5 w-full max-w-lg">
              <div className="flex items-center gap-2">
                <div className="w-28 h-6 rounded-full bg-slate-200" />
                <div className="w-20 h-6 rounded-full bg-slate-100" />
              </div>
              <div className="w-3/4 h-8 rounded-xl bg-slate-200" />
              <div className="w-full h-4 rounded-lg bg-slate-100" />
              <div className="w-2/3 h-4 rounded-lg bg-slate-100" />
              <div className="w-40 h-10 rounded-xl bg-slate-200 mt-2" />
            </div>
            <div className="w-full md:w-72 aspect-video rounded-2xl bg-slate-200 shrink-0" />
          </div>
        ) : studentCourses.length > 0 && activeCourse ? (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50/70 via-white to-indigo-50/40 text-slate-900 p-6 sm:p-8 shadow-xs border border-brand-200/90">
            {/* Ambient Backlight Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-brand-200/40 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 flex flex-col gap-3.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                    <span>Continue Learning</span>
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {activeCourse.category} • {activeCourse.level}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
                  {activeCourse.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {activeCourse.subtitle || activeCourse.description}
                </p>

                {/* Progress bar */}
                <div className="flex flex-col gap-1.5 pt-2 max-w-md">
                  <div className="flex justify-between text-xs text-slate-500 tabular-nums font-semibold">
                    <span>Curriculum Completion</span>
                    <span className="text-brand-600 font-bold">{activeCourse.percentage || 0}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-600 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(activeCourse.percentage || 0, 8)}%` }}
                    />
                  </div>
                </div>

                {/* Quick Action Button */}
                <div className="pt-2 flex items-center gap-3">
                  <Link to={`/learn/${activeCourse.slug}`}>
                    <Button variant="primary" size="lg" icon={Play}>
                      Resume Masterclass
                    </Button>
                  </Link>

                  <Link to={`/courses/${activeCourse.slug}`}>
                    <Button variant="secondary" size="lg" iconRight={ChevronRight}>
                      View Syllabus
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Course Thumbnail */}
              <div className="lg:col-span-4 hidden sm:block">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-video group">
                  <img
                    src={activeCourse.thumbnail || '/pwa-512x512.png'}
                    alt={activeCourse.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white text-brand-600 flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-transform">
                      <Play className="w-6 h-6 ml-1 fill-current" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Branded Academy Hero Card */
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50/90 via-white to-indigo-50/50 border border-brand-200 p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-brand-200/40 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-4 text-left max-w-xl">
              <div className="flex items-center gap-3.5">
                <img
                  src="/pwa-192x192.png"
                  alt="AuraLMS Official Logo"
                  className="w-14 h-14 rounded-2xl shadow-lg shadow-brand-500/20 border-2 border-white object-cover shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-brand-600 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Native LMS Academy</span>
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Aura<span className="text-brand-600">LMS</span> Workspace
                  </h2>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isAdmin
                  ? 'Your academy workspace is active. Build high-retention video curricula, organize modules, and grant student enrollments from the Admin Console.'
                  : 'Welcome to your learning portal. Access to certified courses is granted directly by academy governors upon enrollment.'}
              </p>

              <div className="flex items-center gap-3 pt-1 flex-wrap">
                {isAdmin ? (
                  <Link to="/admin/courses">
                    <Button variant="primary" size="md" iconRight={ArrowRight}>
                      Build Course Curriculum
                    </Button>
                  </Link>
                ) : (
                  <Link to="/courses">
                    <Button variant="primary" size="md" iconRight={ArrowRight}>
                      Explore Certified Tracks
                    </Button>
                  </Link>
                )}
                <Link to="/resources">
                  <Button variant="secondary" size="md" icon={FolderOpen}>
                    Resource Center
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Visual Brand Badge */}
            <div className="relative z-10 hidden sm:flex flex-col items-center justify-center p-6 rounded-3xl bg-white/80 backdrop-blur-xs border border-brand-100 shadow-sm shrink-0 min-w-[200px]">
              <div className="relative mb-3">
                <img
                  src="/pwa-192x192.png"
                  alt="AuraLMS Academy Badge"
                  className="w-18 h-18 rounded-3xl shadow-xl shadow-brand-500/25 border-4 border-white object-cover"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                  ✓
                </span>
              </div>
              <span className="text-xs font-black text-slate-900 tracking-tight">
                Zero-Trust Protected
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Installable Native App
              </span>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. My Accessible Courses (Native App Section)               */}
        {/* ============================================================ */}
        {studentCourses.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-brand-600" />
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  My Enrolled Courses ({studentCourses.length})
                </h3>
              </div>
              <Link
                to="/dashboard"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>Full Learning Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentCourses.map((c) => (
                <div
                  key={c._id}
                  className="rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="brand">{c.category}</Badge>
                    </div>
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-[11px] font-mono">
                      {c.completedLessons || 0} / {c.totalLessons || 4} Done
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-3">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                      {c.title}
                    </h4>

                    <div className="pt-1">
                      <ProgressBar
                        percentage={c.percentage || 0}
                        size="sm"
                        showPercentage
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">
                        {c.durationHours}h Track
                      </span>
                      <Link to={`/learn/${c.slug}`}>
                        <Button variant="primary" size="sm" iconRight={ArrowRight}>
                          Launch Classroom
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. Explore More Certified Curricula                         */}
        {/* ============================================================ */}
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-brand-600" />
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Explore Available Curricula
              </h3>
            </div>
            <Link
              to="/courses"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>Explore all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {catalogCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {catalogCourses.slice(0, 3).map((course) => (
                <div
                  key={course._id}
                  className="rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <Badge variant="brand">{course.category}</Badge>
                      <Badge variant="accent">{course.level}</Badge>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between gap-3 flex-1">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                        {course.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {course.subtitle || course.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-500 font-medium tabular-nums">
                        {course.totalLessons || 0} Lessons
                      </span>
                      <Link to={`/courses/${course.slug}`}>
                        <Button variant="secondary" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col items-center text-center">
              <Compass className="w-10 h-10 text-slate-300 mb-2" />
              <h4 className="text-sm font-bold text-slate-900">No Courses Published Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">
                {isAdmin
                  ? 'As an administrator, build curricula and publish lessons to welcome learners to your academy.'
                  : 'New engineering tracks and curricula will appear here as soon as they are published.'}
              </p>
              {isAdmin && (
                <Link to="/admin/courses">
                  <Button variant="primary" size="sm">
                    Create Course
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* 5. Native App Shortcuts (Blueprints, PWA, Security)          */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {/* Shortcut 1: Blueprints */}
          <Link
            to="/resources"
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-brand-300 hover:shadow-md transition-all flex items-start gap-4 group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 group-hover:scale-105 transition-transform">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                Architecture Blueprints
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Downloadable schemas, PDFs, and implementation runbooks.
              </p>
            </div>
          </Link>

          {/* Shortcut 2: PWA Install */}
          <div
            onClick={openInstallModal}
            className="p-5 rounded-3xl bg-gradient-to-br from-cyan-50 to-brand-50 border border-cyan-200/80 shadow-xs hover:shadow-md transition-all flex items-start gap-4 group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-cyan-600 text-white shadow-xs group-hover:scale-105 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-slate-900">
                  Native App Installation
                </h4>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {isInstalled
                  ? 'Running in standalone desktop/mobile mode.'
                  : 'Install to home screen or desktop application drawer.'}
              </p>
            </div>
          </div>

          {/* Shortcut 3: Zero-Trust Security */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Zero-Trust Protection
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Hardened JWT with HTTP-only cookies and role-gated IDOR defenses.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
