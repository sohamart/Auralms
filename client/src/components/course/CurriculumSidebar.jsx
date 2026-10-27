import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProgressBar } from '../common/ProgressBar';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  PlayCircle,
  FileText,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';

export const CurriculumSidebar = ({
  course,
  curriculum = [],
  currentLessonId,
  progressStats,
  onSelectLesson,
}) => {
  const navigate = useNavigate();
  // Default all topic modules expanded
  const [expandedTopics, setExpandedTopics] = useState(() => {
    const map = {};
    curriculum.forEach((t) => {
      map[t._id] = true;
    });
    return map;
  });

  const toggleTopic = (topicId) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-slate-200 text-slate-900 select-none">
      {/* Header with Return to Dashboard link */}
      <div className="p-4 border-b border-slate-200 flex flex-col gap-3 bg-white">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        <div>
          <h2 className="text-sm font-bold text-slate-900 line-clamp-1">
            {course.title}
          </h2>
          <span className="text-[11px] text-slate-500">Course Syllabus</span>
        </div>

        {/* Course Progress */}
        {progressStats && (
          <div className="pt-1">
            <ProgressBar
              percentage={progressStats.percentage}
              label={`${progressStats.completedLessons} of ${progressStats.totalLessons} completed`}
              size="sm"
            />
          </div>
        )}
      </div>

      {/* Topics & Lessons Tree */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-slate-50/50">
        {curriculum.map((topic, tIndex) => {
          const isExpanded = expandedTopics[topic._id];
          const topicLessons = topic.lessons || [];
          const topicCompletedCount = topicLessons.filter((l) => l.completed).length;

          return (
            <div
              key={topic._id}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs"
            >
              {/* Topic Header Toggle */}
              <button
                onClick={() => toggleTopic(topic._id)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-600">
                      Module {tIndex + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 truncate">
                      {topic.title}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] tabular-nums text-slate-600 shrink-0 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {topicCompletedCount}/{topicLessons.length}
                </span>
              </button>

              {/* Lesson Items */}
              {isExpanded && (
                <div className="px-1.5 pb-2 pt-0.5 flex flex-col gap-1 border-t border-slate-100 bg-slate-50/40">
                  {topicLessons.map((lesson, lIndex) => {
                    const isActive = currentLessonId === lesson._id;

                    return (
                      <button
                        key={lesson._id}
                        onClick={() => {
                          if (onSelectLesson) {
                            onSelectLesson(lesson._id);
                          } else {
                            navigate(`/learn/${course.slug}/lesson/${lesson._id}`);
                          }
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-all text-xs cursor-pointer ${
                          isActive
                            ? 'bg-brand-50 text-brand-700 border border-brand-200/80 font-semibold shadow-xs'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                        }`}
                      >
                        {/* Status Icon */}
                        {lesson.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                        )}

                        {/* Title & Duration */}
                        <div className="flex-1 min-w-0">
                          <p className="truncate leading-tight">{lesson.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                            {lesson.videoType !== 'none' ? (
                              <span className="flex items-center gap-1">
                                <PlayCircle className="w-3 h-3 text-slate-400" />
                                <span className="tabular-nums font-medium">{lesson.durationMinutes}m</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3 text-slate-400" />
                                <span>Reading</span>
                              </span>
                            )}
                            {lesson.isFreePreview && (
                              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 font-bold">
                                Free
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
