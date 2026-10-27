import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Clock, BookOpen, User, ArrowRight, Lock, CheckCircle } from 'lucide-react';

const levelBadgeVariant = {
  Beginner: 'accent',
  Intermediate: 'brand',
  Advanced: 'warning',
  'All Levels': 'default',
};

export const CourseCard = ({ course, isEnrolled = false, progressPercentage = null }) => {
  const isCompleted = progressPercentage === 100;

  return (
    <div className="group relative flex flex-col justify-between bg-white border border-slate-200 hover:border-brand-300 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 shadow-xs hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <BookOpen className="w-10 h-10 text-slate-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

        {/* Level & Category Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <Badge variant={levelBadgeVariant[course.level] || 'default'}>
            {course.level}
          </Badge>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white bg-slate-900/70 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20">
            {course.category}
          </span>
        </div>

        {/* Enrollment / Completion Badge */}
        {isEnrolled && (
          <div className="absolute top-3 right-3">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-xs backdrop-blur-xs">
                <CheckCircle className="w-3 h-3 text-white" />
                <span>Completed</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-brand-600 text-white shadow-xs backdrop-blur-xs">
                <span>Enrolled</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
          {course.title}
        </h3>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {course.subtitle || course.description}
        </p>

        {/* Meta Stats */}
        <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span className="tabular-nums font-medium text-slate-700">
              {course.totalLessons || 0} Lessons
            </span>
          </div>
          {course.durationHours > 0 && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="tabular-nums font-medium text-slate-700">
                {course.durationHours} hrs
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 ml-auto truncate max-w-[130px]">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate text-slate-700 text-[11px] font-medium">
              {course.instructorName || 'Lead Instructor'}
            </span>
          </div>
        </div>

        {/* Progress Bar for Enrolled Students */}
        {isEnrolled && progressPercentage !== null && (
          <div className="pt-2">
            <ProgressBar
              percentage={progressPercentage}
              label="Learning Progress"
              size="sm"
            />
          </div>
        )}
      </div>

      {/* Footer Link / CTA */}
      <div className="p-4 pt-0">
        {isEnrolled ? (
          <Link
            to={`/learn/${course.slug}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors shadow-xs"
          >
            <span>{isCompleted ? 'Review Course' : 'Continue Learning'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <Link
            to={`/courses/${course.slug}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors shadow-xs"
          >
            <span>View Syllabus & Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};
