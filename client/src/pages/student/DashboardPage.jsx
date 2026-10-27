import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CourseCard } from '../../components/course/CourseCard';
import { Button } from '../../components/common/Button';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Lock,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentCourses = async () => {
      try {
        setLoading(true);
        const res = await coursesApi.getStudentDashboard();
        if (res.success) {
          setCourses(res.courses);
        }
      } catch (err) {
        console.error('Error fetching student dashboard courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentCourses();
  }, []);

  // Compute aggregate stats across accessible courses
  const totalAccessible = courses.length;
  const completedCoursesCount = courses.filter((c) => c.percentage === 100).length;
  const totalCompletedLessons = courses.reduce(
    (acc, c) => acc + (c.completedLessons || 0),
    0
  );

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8 bg-slate-50">
      {/* Header Welcome Card */}
      <div className="relative rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-panel overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold w-fit">
              <GraduationCap className="w-4 h-4 text-brand-600" />
              <span>Student Learning Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Only courses specifically granted to your account appear below in accordance with our access control policies.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Active Courses
              </span>
              <span className="text-xl font-extrabold text-slate-900 tabular-nums mt-0.5">
                {totalAccessible}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Lessons Done
              </span>
              <span className="text-xl font-extrabold text-emerald-600 tabular-nums mt-0.5">
                {totalCompletedLessons}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Finished
              </span>
              <span className="text-xl font-extrabold text-brand-600 tabular-nums mt-0.5">
                {completedCoursesCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Accessible Courses</h2>
            <p className="text-xs text-slate-500">
              Curricula unlocked for your profile
            </p>
          </div>
          <Link to="/courses">
            <Button variant="ghost" size="sm" iconRight={ArrowRight}>
              Browse Full Catalog
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-white border border-slate-200 animate-pulse shadow-xs"
              />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                isEnrolled={true}
                progressPercentage={course.percentage || 0}
              />
            ))}
          </div>
        ) : (
          /* Honest Empty State for Students with Zero Granted Courses */
          <div className="py-16 px-6 text-center rounded-3xl bg-white border border-slate-200 shadow-panel flex flex-col items-center justify-center max-w-2xl mx-auto my-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 shadow-xs">
              <Lock className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              No Courses Currently Assigned
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md mb-6 leading-relaxed text-pretty">
              Your student account is active! However, our zero-trust access model requires an administrator to explicitly assign course permissions before protected video modules, notes, and resources unlock.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/courses">
                <Button variant="primary" size="md" iconRight={ArrowRight}>
                  Explore Course Catalog
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="secondary" size="md">
                    Open Admin Access Console
                  </Button>
                </Link>
              )}
            </div>

            <div className="mt-8 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 text-left max-w-md w-full shadow-xs">
              <span className="font-semibold text-slate-900">How to get access:</span>{' '}
              Reach out to your cohort lead or platform administrator. Once they grant enrollment in the Admin Console, your modules will instantly appear here.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
