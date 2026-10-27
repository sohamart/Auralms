import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesApi, adminApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Plus,
  ArrowLeft,
  Layers,
  PlayCircle,
  FileText,
  Trash2,
  Edit,
  FolderOpen,
  CheckCircle2,
  Video,
  ExternalLink,
  Info,
  AlertTriangle,
  Eye,
  FileSpreadsheet,
  Presentation,
} from 'lucide-react';

export const CurriculumBuilderPage = () => {
  const { courseId } = useParams();
  const toast = useToast();

  const [course, setCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Topic Modal
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [topicTitle, setTopicTitle] = useState('');
  const [topicDescription, setTopicDescription] = useState('');

  // Lesson Modal
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);

  const [lessonForm, setLessonForm] = useState({
    title: '',
    durationMinutes: 15,
    videoType: 'youtube',
    videoUrl: '',
    notesMarkdown: '',
    isFreePreview: false,
    resources: [],
  });

  // Live video preview state
  const [videoValidation, setVideoValidation] = useState(null);
  const [validatingVideo, setValidatingVideo] = useState(false);

  // Fetch Course & Curriculum
  const fetchCurriculum = async () => {
    try {
      setLoading(true);
      // Fetch course by ID
      const allCoursesRes = await coursesApi.adminGetAll();
      if (allCoursesRes.success) {
        const found = allCoursesRes.courses.find((c) => c._id === courseId);
        if (found) {
          setCourse(found);
          // Fetch course curriculum tree
          const curRes = await coursesApi.getCurriculumFull(found.slug);
          if (curRes.success) {
            setTopics(curRes.curriculum || []);
          }
        }
      }
    } catch (err) {
      toast.error(err.message || 'Error loading course curriculum');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculum();
  }, [courseId]);

  // Topic Handlers
  const openCreateTopic = () => {
    setEditingTopic(null);
    setTopicTitle('');
    setTopicDescription('');
    setTopicModalOpen(true);
  };

  const openEditTopic = (t) => {
    setEditingTopic(t);
    setTopicTitle(t.title);
    setTopicDescription(t.description || '');
    setTopicModalOpen(true);
  };

  const handleSaveTopic = async (e) => {
    e.preventDefault();
    if (!topicTitle.trim()) {
      toast.error('Topic title is required');
      return;
    }

    try {
      if (editingTopic) {
        const res = await coursesApi.updateTopic(editingTopic._id, {
          title: topicTitle,
          description: topicDescription,
        });
        if (res.success) toast.success('Topic updated');
      } else {
        const res = await coursesApi.createTopic(courseId, {
          title: topicTitle,
          description: topicDescription,
        });
        if (res.success) toast.success('New topic added');
      }
      setTopicModalOpen(false);
      fetchCurriculum();
    } catch (err) {
      toast.error(err.message || 'Error saving topic');
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm('Delete this topic and all lessons inside it?')) return;
    try {
      const res = await coursesApi.deleteTopic(topicId);
      if (res.success) {
        toast.success('Topic deleted');
        fetchCurriculum();
      }
    } catch (err) {
      toast.error(err.message || 'Error deleting topic');
    }
  };

  // Lesson Handlers
  const openCreateLesson = (topicId) => {
    setActiveTopicId(topicId);
    setEditingLesson(null);
    setVideoValidation(null);
    setLessonForm({
      title: '',
      durationMinutes: 15,
      videoType: 'youtube',
      videoUrl: 'https://www.youtube.com/watch?v=2Z2dffWj0bA',
      notesMarkdown: '### Lesson Overview\n\nAdd your detailed architectural notes here.',
      isFreePreview: false,
      resources: [],
    });
    setLessonModalOpen(true);
  };

  const openEditLesson = async (topicId, lesson) => {
    setActiveTopicId(topicId);
    setEditingLesson(lesson);
    setVideoValidation(null);

    // Fetch full lesson details (including notes & resources)
    try {
      const res = await coursesApi.getStudentLesson(course.slug, lesson._id);
      if (res.success) {
        setLessonForm({
          title: res.lesson.title,
          durationMinutes: res.lesson.durationMinutes,
          videoType: res.lesson.videoType,
          videoUrl: res.lesson.videoUrl || '',
          notesMarkdown: res.lesson.notesMarkdown || '',
          isFreePreview: !!res.lesson.isFreePreview,
          resources: res.lesson.resources || [],
        });
      }
    } catch (e) {
      setLessonForm({
        title: lesson.title,
        durationMinutes: lesson.durationMinutes,
        videoType: lesson.videoType,
        videoUrl: '',
        notesMarkdown: '',
        isFreePreview: !!lesson.isFreePreview,
        resources: [],
      });
    }

    setLessonModalOpen(true);
  };

  // Test video embed live
  const handleValidateVideo = async () => {
    if (!lessonForm.videoUrl && lessonForm.videoType !== 'none') {
      toast.error('Enter a video URL to validate');
      return;
    }

    try {
      setValidatingVideo(true);
      const res = await adminApi.validateVideo({
        url: lessonForm.videoUrl,
        type: lessonForm.videoType,
      });
      setVideoValidation(res.data);
      if (res.data.isValid) {
        toast.success('Video URL is valid and verified!');
      } else {
        toast.error(res.data.error || 'Video validation failed');
      }
    } catch (err) {
      toast.error(err.message || 'Validation request failed');
    } finally {
      setValidatingVideo(false);
    }
  };

  // Add / remove resource repeater item
  const addResourceItem = () => {
    setLessonForm((prev) => ({
      ...prev,
      resources: [
        ...prev.resources,
        {
          id: Math.random().toString(36).substring(2, 9),
          title: '',
          type: 'google_drive_pdf',
          url: '',
          description: '',
          isDownloadable: false,
        },
      ],
    }));
  };

  const updateResourceItem = (index, field, val) => {
    setLessonForm((prev) => {
      const updated = [...prev.resources];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, resources: updated };
    });
  };

  const removeResourceItem = (index) => {
    setLessonForm((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index),
    }));
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) {
      toast.error('Lesson title is required');
      return;
    }

    try {
      if (editingLesson) {
        const res = await coursesApi.updateLesson(editingLesson._id, {
          ...lessonForm,
          topicId: activeTopicId,
        });
        if (res.success) toast.success('Lesson updated successfully!');
      } else {
        const res = await coursesApi.createLesson(
          courseId,
          activeTopicId,
          lessonForm
        );
        if (res.success) toast.success('New lesson added to module!');
      }
      setLessonModalOpen(false);
      fetchCurriculum();
    } catch (err) {
      toast.error(err.message || 'Error saving lesson');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      const res = await coursesApi.deleteLesson(lessonId);
      if (res.success) {
        toast.success('Lesson deleted');
        fetchCurriculum();
      }
    } catch (err) {
      toast.error(err.message || 'Error deleting lesson');
    }
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Back and Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            to="/admin/courses"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Courses</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Curriculum Builder: {course?.title}
          </h1>
          <p className="text-xs text-slate-500">
            Structure syllabus modules, attach verified videos, and configure student resources
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={openCreateTopic}>
          Add Module / Topic
        </Button>
      </div>

      {/* Topics & Lessons Tree */}
      {loading ? (
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="h-32 bg-white rounded-2xl border border-slate-200 shadow-xs" />
          <div className="h-32 bg-white rounded-2xl border border-slate-200 shadow-xs" />
        </div>
      ) : topics.length > 0 ? (
        <div className="flex flex-col gap-6">
          {topics.map((topic, index) => (
            <div
              key={topic._id}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs"
            >
              {/* Topic Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{topic.title}</h3>
                    {topic.description && (
                      <p className="text-xs text-slate-500">{topic.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Plus}
                    onClick={() => openCreateLesson(topic._id)}
                  >
                    Add Lesson
                  </Button>
                  <button
                    onClick={() => openEditTopic(topic)}
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
                    title="Edit Topic Title"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTopic(topic._id)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                    title="Delete Module"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Lessons List Inside Module */}
              <div className="p-3 flex flex-col gap-2">
                {topic.lessons && topic.lessons.length > 0 ? (
                  topic.lessons.map((lesson, lIdx) => (
                    <div
                      key={lesson._id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs transition-colors shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-3">
                        <span className="tabular-nums text-slate-400 font-bold w-5">
                          {lIdx + 1}.
                        </span>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-slate-900 truncate text-xs">
                            {lesson.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-0.5 text-[11px] text-slate-500">
                            <span className="capitalize text-slate-700">
                              {lesson.videoType === 'none'
                                ? 'Practical Reading'
                                : `${lesson.videoType} Video`}
                            </span>
                            <span>•</span>
                            <span className="tabular-nums font-medium">{lesson.durationMinutes} min</span>
                            {lesson.isFreePreview && (
                              <>
                                <span>•</span>
                                <span className="text-[10px] uppercase font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                                  Free Preview
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => openEditLesson(topic._id, lesson)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Configure
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson._id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Lesson"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-slate-500">
                    No lessons in this module yet. Click "Add Lesson" above to add your first lecture.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-3xl bg-white border border-slate-200 p-8 flex flex-col items-center justify-center shadow-xs">
          <Layers className="w-12 h-12 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">
            No Modules Created Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            Curricula are organized into Modules/Topics containing individual Lessons and Resources.
          </p>
          <Button variant="primary" size="md" icon={Plus} onClick={openCreateTopic}>
            Create First Module
          </Button>
        </div>
      )}

      {/* Topic Create / Edit Modal */}
      <Modal
        isOpen={topicModalOpen}
        onClose={() => setTopicModalOpen(false)}
        title={editingTopic ? 'Edit Module' : 'Add New Module / Topic'}
        subtitle="Group lessons under a cohesive learning topic"
      >
        <form onSubmit={handleSaveTopic} className="flex flex-col gap-4">
          <Input
            label="Module Title"
            placeholder="e.g. Module 1: Foundations of Distributed Storage"
            value={topicTitle}
            onChange={(e) => setTopicTitle(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Module Summary
            </label>
            <textarea
              rows={3}
              className="w-full bg-white border border-slate-300 hover:border-slate-400 text-slate-900 text-xs rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="What core competencies are covered in this module..."
              value={topicDescription}
              onChange={(e) => setTopicDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <Button variant="ghost" size="sm" onClick={() => setTopicModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingTopic ? 'Save Changes' : 'Create Module'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Comprehensive Lesson Configuration Modal */}
      <Modal
        isOpen={lessonModalOpen}
        onClose={() => setLessonModalOpen(false)}
        title={editingLesson ? 'Edit Lesson & Resources' : 'Add Lesson to Module'}
        subtitle="Configure video source, notes markdown, and attach external documents"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSaveLesson} className="flex flex-col gap-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Lesson Title"
                placeholder="e.g. 1.1 Zero-Trust Architecture with HTTP-Only Cookies"
                value={lessonForm.title}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, title: e.target.value })
                }
                required
              />
            </div>
            <Input
              label="Duration (Minutes)"
              type="number"
              value={lessonForm.durationMinutes}
              onChange={(e) =>
                setLessonForm({
                  ...lessonForm,
                  durationMinutes: Number(e.target.value),
                })
              }
            />
          </div>

          {/* Video Configuration Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-brand-600" />
                <span>Video Source Configuration</span>
              </span>
              <span className="text-[11px] text-slate-500">
                Safe embeds only (Raw iframes blocked)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Provider Type
                </label>
                <select
                  value={lessonForm.videoType}
                  onChange={(e) =>
                    setLessonForm({
                      ...lessonForm,
                      videoType: e.target.value,
                      videoUrl: e.target.value === 'none' ? '' : lessonForm.videoUrl,
                    })
                  }
                  className="bg-white border border-slate-300 hover:border-slate-400 text-slate-900 text-xs rounded-xl py-2.5 px-3 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="wistia">Wistia</option>
                  <option value="drive">Google Drive Video</option>
                  <option value="external">External Approved HTTPS</option>
                  <option value="none">No Video (Practical / Reading)</option>
                </select>
              </div>

              {lessonForm.videoType !== 'none' && (
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Video Canonical URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder={
                        lessonForm.videoType === 'youtube'
                          ? 'https://www.youtube.com/watch?v=...'
                          : lessonForm.videoType === 'vimeo'
                          ? 'https://vimeo.com/12345678'
                          : 'https://...'
                      }
                      value={lessonForm.videoUrl}
                      onChange={(e) => {
                        setLessonForm({ ...lessonForm, videoUrl: e.target.value });
                        setVideoValidation(null);
                      }}
                      className="flex-1 bg-white border border-slate-300 hover:border-slate-400 text-slate-900 text-xs rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      loading={validatingVideo}
                      onClick={handleValidateVideo}
                    >
                      Verify
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Validation Feedback Banner */}
            {videoValidation && (
              <div
                className={`p-3 rounded-xl border text-xs flex flex-col gap-2 ${
                  videoValidation.isValid
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {videoValidation.isValid ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>URL Verified for {videoValidation.provider}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Validation Failed: {videoValidation.error}</span>
                    </>
                  )}
                </div>

                {videoValidation.isValid && videoValidation.embedUrl && (
                  <div className="text-[11px] text-slate-600 font-mono break-all">
                    Safe Embed URL: {videoValidation.embedUrl}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lesson Notes (Markdown) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-600" />
                <span>Lesson Notes (Markdown Supported)</span>
              </label>
              <span className="text-[10px] text-slate-500">
                Supports headings (#), code blocks (```), bullet lists
              </span>
            </div>
            <textarea
              rows={5}
              className="w-full bg-white border border-slate-300 hover:border-slate-400 text-slate-900 font-mono text-xs rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 leading-relaxed"
              placeholder="Write comprehensive lesson takeaways or code snippets here..."
              value={lessonForm.notesMarkdown}
              onChange={(e) =>
                setLessonForm({ ...lessonForm, notesMarkdown: e.target.value })
              }
            />
          </div>

          {/* Resources Repeater Section */}
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4 text-brand-600" />
                <span>Attached Lesson Resources ({lessonForm.resources.length})</span>
              </span>
              <Button type="button" variant="secondary" size="sm" icon={Plus} onClick={addResourceItem}>
                Add Resource
              </Button>
            </div>

            {lessonForm.resources.length === 0 ? (
              <p className="text-xs text-slate-500 py-2 text-center">
                No external resources attached yet. Click "Add Resource" to attach Google Drive PDFs, Google Docs/Sheets, or downloadable files.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {lessonForm.resources.map((res, rIdx) => (
                  <div
                    key={res.id || rIdx}
                    className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">
                        Resource #{rIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeResourceItem(rIdx)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        title="Remove Resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Resource Title (e.g. Architecture Blueprint)"
                        value={res.title}
                        onChange={(e) =>
                          updateResourceItem(rIdx, 'title', e.target.value)
                        }
                        className="sm:col-span-2 bg-white border border-slate-300 text-slate-900 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-brand-500"
                        required
                      />

                      <select
                        value={res.type}
                        onChange={(e) =>
                          updateResourceItem(rIdx, 'type', e.target.value)
                        }
                        className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2 py-1.5 outline-none focus:border-brand-500"
                      >
                        <option value="google_drive_pdf">Google Drive PDF</option>
                        <option value="google_doc">Google Doc</option>
                        <option value="google_sheet">Google Sheet</option>
                        <option value="google_slides">Google Slides</option>
                        <option value="pdf">PDF File</option>
                        <option value="external_link">Web Link</option>
                        <option value="note">Text Note</option>
                      </select>
                    </div>

                    <input
                      type="url"
                      placeholder="Resource URL (e.g. https://drive.google.com/file/d/...)"
                      value={res.url}
                      onChange={(e) =>
                        updateResourceItem(rIdx, 'url', e.target.value)
                      }
                      className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-brand-500"
                      required
                    />

                    <div className="flex items-center justify-between gap-4">
                      <input
                        type="text"
                        placeholder="Optional description / instructions for student..."
                        value={res.description}
                        onChange={(e) =>
                          updateResourceItem(rIdx, 'description', e.target.value)
                        }
                        className="flex-1 bg-white border border-slate-300 text-slate-700 text-xs rounded-lg px-2.5 py-1 outline-none focus:border-brand-500"
                      />

                      <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={res.isDownloadable}
                          onChange={(e) =>
                            updateResourceItem(rIdx, 'isDownloadable', e.target.checked)
                          }
                          className="rounded text-brand-600 focus:ring-brand-500"
                        />
                        <span>Downloadable</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Free Preview Toggle */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <input
              type="checkbox"
              id="free-preview-toggle"
              checked={lessonForm.isFreePreview}
              onChange={(e) =>
                setLessonForm({ ...lessonForm, isFreePreview: e.target.checked })
              }
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <label htmlFor="free-preview-toggle" className="text-xs text-slate-600 cursor-pointer">
              <span className="font-semibold text-slate-900">Public Free Preview:</span>{' '}
              Allows unregistered or un-enrolled visitors to sample this lesson video and notes.
            </label>
          </div>

          {/* Actions - Sticky Footer */}
          <div className="sticky bottom-0 -mx-6 -mb-5 px-6 py-4 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-end gap-3 z-10 mt-2">
            <Button variant="ghost" size="sm" onClick={() => setLessonModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingLesson ? 'Save Lesson Changes' : 'Create Lesson'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
