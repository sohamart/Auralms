import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ResourceViewerModal } from '../../components/player/ResourceViewerModal';
import {
  FolderOpen,
  FileText,
  FileSpreadsheet,
  Presentation,
  Download,
  ExternalLink,
  Eye,
  Search,
  BookOpen,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const ResourcesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [activePreviewResource, setActivePreviewResource] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const res = await coursesApi.getStudentDashboard();
        if (res.success) {
          setCourses(res.courses || []);
        }
      } catch (err) {
        console.error('Error fetching resources:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  // Aggregate all resources from accessible courses
  const allResources = courses.flatMap((course) => {
    const courseRes = [];
    if (course.topics) {
      course.topics.forEach((t) => {
        if (t.lessons) {
          t.lessons.forEach((l) => {
            if (l.resources && l.resources.length > 0) {
              l.resources.forEach((r) => {
                courseRes.push({
                  ...r,
                  courseTitle: course.title,
                  courseSlug: course.slug,
                  lessonTitle: l.title,
                  lessonId: l._id,
                });
              });
            }
          });
        }
      });
    }
    return courseRes;
  });

  const filteredResources = allResources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || r.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getResourceIcon = (type) => {
    switch (type) {
      case 'google_drive_pdf':
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-600" />;
      case 'google_sheet':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'google_slides':
        return <Presentation className="w-5 h-5 text-amber-600" />;
      default:
        return <FolderOpen className="w-5 h-5 text-brand-600" />;
    }
  };

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8 bg-slate-50 text-slate-900 select-none pb-24 md:pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shadow-xs">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Learning Resources & Blueprints
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Downloadable architecture diagrams, Google Drive PDFs, and implementation runbooks
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500 tabular-nums bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl w-fit">
          {filteredResources.length} Documents Available
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents or courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Documents' },
            { id: 'google_drive_pdf', label: 'PDFs & Blueprints' },
            { id: 'google_doc', label: 'Guides & Docs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedType === tab.id
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-44 rounded-3xl bg-white border border-slate-200 shadow-xs animate-pulse"
            />
          ))}
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((res, index) => (
            <div
              key={res.id || index}
              className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
                    {getResourceIcon(res.type)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {res.type.replace(/_/g, ' ')}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                    {res.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {res.description || 'Verified course architectural resource and learning reference.'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-brand-600 font-semibold truncate max-w-[150px]">
                  {res.courseTitle}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setActivePreviewResource(res)}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="In-App Sandboxed Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 transition-colors"
                    title="Open in Provider Tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center">
          <FolderOpen className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">
            No matching resources found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            Try adjusting your search query or explore all certified courses in your learning dashboard.
          </p>
          <Link to="/courses">
            <Button variant="primary" size="sm">
              Explore Course Catalog
            </Button>
          </Link>
        </div>
      )}

      {/* In-App Preview Modal */}
      {activePreviewResource && (
        <ResourceViewerModal
          resource={activePreviewResource}
          isOpen={!!activePreviewResource}
          onClose={() => setActivePreviewResource(null)}
        />
      )}
    </div>
  );
};
