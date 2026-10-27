import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Plus,
  Search,
  BookOpen,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Layers,
  ArrowRight,
  Clock,
  User,
} from 'lucide-react';

export const AdminCoursesPage = () => {
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Course Modal (Create & Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    category: 'Software Engineering',
    level: 'All Levels',
    thumbnail: '',
    durationHours: 10,
    published: false,
  });
  const [saving, setSaving] = useState(false);

  // Delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await coursesApi.adminGetAll();
      if (res.success) {
        setCourses(res.courses);
      }
    } catch (err) {
      toast.error(err.message || 'Error loading courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      slug: '',
      subtitle: '',
      description: '',
      category: 'Software Engineering',
      level: 'All Levels',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
      durationHours: 12,
      published: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingCourse(c);
    setFormData({
      title: c.title,
      slug: c.slug,
      subtitle: c.subtitle || '',
      description: c.description,
      category: c.category,
      level: c.level,
      thumbnail: c.thumbnail || '',
      durationHours: c.durationHours || 0,
      published: c.published,
    });
    setModalOpen(true);
  };

  const handleTitleChange = (val) => {
    setFormData((prev) => {
      const autoSlug = !editingCourse
        ? val
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        : prev.slug;
      return { ...prev, title: val, slug: autoSlug };
    });
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required.');
      return;
    }

    try {
      setSaving(true);
      if (editingCourse) {
        const res = await coursesApi.adminUpdate(editingCourse._id, formData);
        if (res.success) {
          toast.success('Course updated successfully!');
          setModalOpen(false);
          fetchCourses();
        }
      } else {
        const res = await coursesApi.adminCreate(formData);
        if (res.success) {
          toast.success('New course created successfully!');
          setModalOpen(false);
          fetchCourses();
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (courseId) => {
    try {
      const res = await coursesApi.adminTogglePublish(courseId);
      if (res.success) {
        toast.success(res.message);
        setCourses((prev) =>
          prev.map((c) =>
            c._id === courseId ? { ...c, published: res.published } : c
          )
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to toggle publication');
    }
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    try {
      const res = await coursesApi.adminDelete(courseToDelete._id);
      if (res.success) {
        toast.success('Course deleted successfully.');
        setDeleteModalOpen(false);
        setCourseToDelete(null);
        fetchCourses();
      }
    } catch (err) {
      toast.error(err.message || 'Error deleting course');
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Course Administration
          </h1>
          <p className="text-xs text-slate-500">
            Create, configure, publish, and structure course modules and topics
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={openCreateModal}>
          Create New Course
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Filter courses by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>

        <span className="text-xs text-slate-500 tabular-nums font-medium">
          Showing {filteredCourses.length} of {courses.length} courses
        </span>
      </div>

      {/* Courses Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs animate-pulse">
            Loading courses...
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Lessons</th>
                  <th className="py-3 px-4">Students</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredCourses.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Course Title & Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.thumbnail || 'https://via.placeholder.com/80'}
                          alt={c.title}
                          className="w-12 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-slate-900 truncate text-xs">{c.title}</p>
                          <p className="text-[11px] text-slate-500 font-mono">/{c.slug}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600">{c.category}</td>

                    <td className="py-3 px-4">
                      <Badge variant="brand">{c.level}</Badge>
                    </td>

                    <td className="py-3 px-4 tabular-nums font-medium text-slate-800">
                      {c.lessonsCount || 0}
                    </td>

                    <td className="py-3 px-4 tabular-nums font-semibold text-emerald-600">
                      {c.activeStudentsCount || 0}
                    </td>

                    {/* 1-Click Publish Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleTogglePublish(c._id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                          c.published
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
                        }`}
                      >
                        {c.published ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-slate-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link to={`/admin/courses/${c._id}/curriculum`}>
                          <button
                            className="px-2.5 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 transition-colors font-medium text-xs flex items-center gap-1 cursor-pointer"
                            title="Open Curriculum Builder"
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Curriculum</span>
                          </button>
                        </Link>

                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setCourseToDelete(c);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs">
            No courses found matching "{searchTerm}".
          </div>
        )}
      </div>

      {/* Create / Edit Course Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCourse ? 'Edit Course Details' : 'Create New Course'}
        subtitle="Configure course metadata, category, and access settings"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveCourse} className="flex flex-col gap-5">
          <Input
            label="Course Title"
            placeholder="e.g. Distributed Cloud Systems Masterclass"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="URL Slug"
              placeholder="distributed-cloud-systems"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value.toLowerCase().trim() })
              }
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white border border-slate-300 hover:border-slate-400 text-slate-900 text-sm rounded-xl py-2.5 px-3.5 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors cursor-pointer"
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full bg-white border border-slate-300 hover:border-slate-400 text-slate-900 text-sm rounded-xl py-2.5 px-3.5 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors cursor-pointer"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>

            <Input
              label="Estimated Duration (Hours)"
              type="number"
              value={formData.durationHours}
              onChange={(e) =>
                setFormData({ ...formData, durationHours: Number(e.target.value) })
              }
            />
          </div>

          <Input
            label="Thumbnail Image URL"
            placeholder="https://images.unsplash.com/..."
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          />

          <Input
            label="Subtitle"
            placeholder="Brief high-impact one-liner summary"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Detailed Description
            </label>
            <textarea
              rows={4}
              className="w-full bg-white border border-slate-300 hover:border-slate-400 text-slate-900 placeholder-slate-400 text-sm rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors leading-relaxed"
              placeholder="What will engineers learn in this course..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Published Toggle */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <input
              type="checkbox"
              id="published-toggle"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 mt-0.5 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <label htmlFor="published-toggle" className="text-xs text-slate-600 cursor-pointer select-none">
              <span className="font-semibold text-slate-900 block mb-0.5">Publish to Public Catalog</span>
              <span>When checked, this course immediately appears in the public course directory and student learning dashboards.</span>
            </label>
          </div>

          {/* Pinned Action Buttons Footer */}
          <div className="sticky bottom-0 -mx-6 -mb-5 px-6 py-4 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-end gap-3 z-10 mt-2">
            <Button variant="ghost" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={saving}>
              {editingCourse ? 'Save Changes' : 'Create Course'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Course & Dependencies"
        subtitle="This action permanently deletes all topics, lessons, resources, and progress records"
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to permanently delete{' '}
            <strong className="text-slate-900">"{courseToDelete?.title}"</strong>?
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDelete}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
