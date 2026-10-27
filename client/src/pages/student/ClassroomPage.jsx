import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { coursesApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { CurriculumSidebar } from '../../components/course/CurriculumSidebar';
import { SafeVideoPlayer } from '../../components/player/SafeVideoPlayer';
import { ResourceList } from '../../components/player/ResourceList';
import { MarkdownNotes } from '../../components/player/MarkdownNotes';
import { Button } from '../../components/common/Button';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  FileText,
  FolderOpen,
  Info,
  Lock,
  ArrowLeft,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';

export const ClassroomPage = () => {
  const { courseSlug, lessonId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [courseData, setCourseData] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [stats, setStats] = useState(null);

  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonProgress, setLessonProgress] = useState(null);
  const [navigation, setNavigation] = useState({ prev: null, next: null });

  const [loadingCurriculum, setLoadingCurriculum] = useState(true);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Active Tab below video
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'resources' | 'overview'

  // Mobile sidebar drawer
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // 1. Fetch Curriculum
  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        setLoadingCurriculum(true);
        setAccessDenied(false);
        const res = await coursesApi.getCurriculumFull(courseSlug);
        if (res.success) {
          setCourseData(res.course);
          setCurriculum(res.curriculum);
          setStats(res.stats);

          // Find initial lesson if not in URL
          if (!lessonId) {
            let targetLesson = null;
            for (const topic of res.curriculum) {
              const uncompleted = (topic.lessons || []).find((l) => !l.completed);
              if (uncompleted) {
                targetLesson = uncompleted;
                break;
              }
            }
            if (!targetLesson && res.curriculum[0]?.lessons?.[0]) {
              targetLesson = res.curriculum[0].lessons[0];
            }

            if (targetLesson) {
              navigate(`/learn/${courseSlug}/lesson/${targetLesson._id}`, { replace: true });
            }
          }
        }
      } catch (err) {
        if (err.status === 403 || err.code === 'ACCESS_DENIED') {
          setAccessDenied(true);
          setErrorMessage(err.message || 'You do not have active access to this course.');
        } else {
          setErrorMessage(err.message || 'Failed to load course curriculum.');
        }
      } finally {
        setLoadingCurriculum(false);
      }
    };

    fetchCurriculum();
  }, [courseSlug]);

  // 2. Fetch Active Lesson
  useEffect(() => {
    if (!lessonId || accessDenied) return;

    const fetchLesson = async () => {
      try {
        setLoadingLesson(true);
        const res = await coursesApi.getStudentLesson(courseSlug, lessonId);
        if (res.success) {
          setActiveLesson(res.lesson);
          setLessonProgress(res.progress);
          setNavigation(res.navigation);
          setMobileSidebarOpen(false); // Close mobile drawer on selection
        }
      } catch (err) {
        if (err.status === 403) {
          setAccessDenied(true);
          setErrorMessage(err.message);
        } else {
          toast.error(err.message || 'Error loading lesson content');
        }
      } finally {
        setLoadingLesson(false);
      }
    };

    fetchLesson();
  }, [courseSlug, lessonId, accessDenied]);

  // Toggle Completion
  const handleToggleComplete = async () => {
    if (!activeLesson) return;
    try {
      const targetState = !lessonProgress?.completed;
      const res = await coursesApi.toggleProgress(
        courseSlug,
        activeLesson._id,
        targetState
      );
      if (res.success) {
        setLessonProgress(res.progress);
        setStats(res.stats);

        // Update curriculum checkmark locally
        setCurriculum((prev) =>
          prev.map((topic) => ({
            ...topic,
            lessons: (topic.lessons || []).map((l) =>
              l._id === activeLesson._id ? { ...l, completed: targetState } : l
            ),
          }))
        );

        if (targetState) {
          toast.success('Lesson marked as completed!');
          // Auto advance if next lesson exists
          if (navigation.next) {
            setTimeout(() => {
              navigate(`/learn/${courseSlug}/lesson/${navigation.next._id}`);
            }, 600);
          }
        } else {
          toast.info('Lesson marked as incomplete');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Could not update lesson progress');
    }
  };

  // Switch Lesson
  const handleSelectLesson = (id) => {
    navigate(`/learn/${courseSlug}/lesson/${id}`);
  };

  // Access Denied Screen (Strict Authorization Enforcement)
  if (accessDenied) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-rose-200 text-center flex flex-col items-center gap-4 shadow-panel">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-slate-900">Enrollment Access Required</h2>

          <p className="text-xs text-slate-600 leading-relaxed text-pretty">
            {errorMessage ||
              'Access to protected lessons, videos, and resources is restricted to students with an active enrollment grant.'}
          </p>

          <div className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 text-left">
            <span className="font-semibold text-slate-900">Administrator Approval:</span>{' '}
            Registration does not automatically unlock courses. Reach out to the course administrator to activate your access.
          </div>

          <div className="flex items-center gap-3 w-full pt-2">
            <Link to="/dashboard" className="flex-1">
              <Button variant="secondary" size="md" className="w-full">
                My Dashboard
              </Button>
            </Link>
            <Link to="/courses" className="flex-1">
              <Button variant="primary" size="md" className="w-full">
                Course Catalog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loadingCurriculum) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full bg-slate-50">
        <div className="w-80 border-r border-slate-200 bg-white animate-pulse hidden md:block" />
        <div className="flex-1 p-8 flex flex-col gap-6 animate-pulse">
          <div className="h-10 w-1/3 bg-white rounded-xl border border-slate-200" />
          <div className="aspect-video w-full bg-white rounded-2xl border border-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-50">
      {/* Desktop Curriculum Sidebar (Fixed left) */}
      <div className="hidden lg:block w-80 shrink-0 h-full">
        {courseData && (
          <CurriculumSidebar
            course={courseData}
            curriculum={curriculum}
            currentLessonId={activeLesson?._id}
            progressStats={stats}
            onSelectLesson={handleSelectLesson}
          />
        )}
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] h-full bg-white z-10 shadow-panel">
            {courseData && (
              <CurriculumSidebar
                course={courseData}
                curriculum={curriculum}
                currentLessonId={activeLesson?._id}
                progressStats={stats}
                onSelectLesson={(id) => {
                  handleSelectLesson(id);
                  setMobileSidebarOpen(false);
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Main Classroom Learning Stage */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col">
        {/* Mobile Curriculum Toggle Bar */}
        <div className="lg:hidden p-3 border-b border-slate-200 bg-white flex items-center justify-between">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 text-xs font-semibold text-brand-600 hover:text-brand-700 cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <span>View Syllabus ({stats?.completedLessons}/{stats?.totalLessons})</span>
          </button>
          <span className="text-xs font-semibold text-slate-800 truncate max-w-[180px]">
            {courseData?.title}
          </span>
        </div>

        {/* Content Wrapper */}
        <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
          {loadingLesson ? (
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="h-8 w-1/2 bg-white rounded-xl border border-slate-200" />
              <div className="aspect-video w-full bg-white rounded-2xl border border-slate-200" />
            </div>
          ) : activeLesson ? (
            <>
              {/* Lesson Top Bar & Completion Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                      Lesson {activeLesson.order + 1}
                    </span>
                    {activeLesson.durationMinutes > 0 && (
                      <span className="text-[11px] text-slate-500 tabular-nums font-medium">
                        • {activeLesson.durationMinutes} min
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {activeLesson.title}
                  </h1>
                </div>

                {/* Completion Toggle Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleToggleComplete}
                    className={`pressable flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border shadow-xs ${
                      lessonProgress?.completed
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {lessonProgress?.completed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-slate-400" />
                        <span>Mark as Completed</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Video Player Stage */}
              <SafeVideoPlayer
                videoType={activeLesson.videoType}
                embedUrl={activeLesson.embedUrl}
                videoNotice={activeLesson.videoNotice}
                lessonTitle={activeLesson.title}
              />

              {/* Previous / Next Lesson Navigation */}
              <div className="flex items-center justify-between pt-1 pb-4 border-b border-slate-200 text-xs">
                {navigation.prev ? (
                  <button
                    onClick={() => handleSelectLesson(navigation.prev._id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-xs transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="truncate max-w-[150px] sm:max-w-[220px]">
                      Prev: {navigation.prev.title}
                    </span>
                  </button>
                ) : (
                  <div />
                )}

                {navigation.next ? (
                  <button
                    onClick={() => handleSelectLesson(navigation.next._id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 shadow-xs transition-colors cursor-pointer ml-auto font-medium"
                  >
                    <span className="truncate max-w-[150px] sm:max-w-[220px]">
                      Next: {navigation.next.title}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div />
                )}
              </div>

              {/* Lesson Tabs: Notes vs Resources vs Overview */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'notes'
                        ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Lesson Notes</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('resources')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'resources'
                        ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span>Attached Resources ({activeLesson.resources?.length || 0})</span>
                  </button>
                </div>

                {/* Tab 1: Notes Content */}
                {activeTab === 'notes' && (
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-panel">
                    <MarkdownNotes content={activeLesson.notesMarkdown} />
                  </div>
                )}

                {/* Tab 2: Attached Resources */}
                {activeTab === 'resources' && (
                  <div className="flex flex-col gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                      Access verified architecture documentation, Google Drive PDFs, spreadsheets, and external links attached to this lesson module.
                    </div>
                    <ResourceList resources={activeLesson.resources} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 text-sm">
              Please select a lesson from the syllabus on the left to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
