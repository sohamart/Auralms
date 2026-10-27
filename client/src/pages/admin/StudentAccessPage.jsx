import React, { useState, useEffect } from 'react';
import { adminApi, coursesApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ProgressBar } from '../../components/common/ProgressBar';
import {
  Users,
  Search,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  BookOpen,
  Calendar,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';

export const StudentAccessPage = () => {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Student Access Management Modal
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentAccessRecords, setStudentAccessRecords] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [updatingCourseId, setUpdatingCourseId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, coursesRes] = await Promise.all([
        adminApi.getStudents(),
        coursesApi.adminGetAll(),
      ]);

      if (studentsRes.success) setStudents(studentsRes.students);
      if (coursesRes.success) setCourses(coursesRes.courses);
    } catch (err) {
      toast.error(err.message || 'Error loading student data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAccessManager = async (student) => {
    setSelectedStudent(student);
    setAccessModalOpen(true);
    setLoadingDetail(true);

    try {
      const res = await adminApi.getStudentDetail(student.id);
      if (res.success) {
        setStudentAccessRecords(res.accessRecords || []);
      }
    } catch (err) {
      toast.error(err.message || 'Error fetching student details');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleGrantAccess = async (courseId, courseTitle) => {
    if (!selectedStudent) return;
    try {
      setUpdatingCourseId(courseId);
      const res = await adminApi.grantAccess({
        studentId: selectedStudent.id,
        courseId,
        notes: 'Granted via Admin Access Console',
      });
      if (res.success) {
        toast.success(`Access granted for "${courseTitle}"`);
        // Refresh details
        const detailRes = await adminApi.getStudentDetail(selectedStudent.id);
        if (detailRes.success) {
          setStudentAccessRecords(detailRes.accessRecords || []);
        }
        // Refresh students list counts
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to grant course access');
    } finally {
      setUpdatingCourseId(null);
    }
  };

  const handleRevokeAccess = async (courseId, courseTitle) => {
    if (!selectedStudent) return;
    try {
      setUpdatingCourseId(courseId);
      const res = await adminApi.revokeAccess({
        studentId: selectedStudent.id,
        courseId,
      });
      if (res.success) {
        toast.info(`Access revoked for "${courseTitle}"`);
        // Refresh details
        const detailRes = await adminApi.getStudentDetail(selectedStudent.id);
        if (detailRes.success) {
          setStudentAccessRecords(detailRes.accessRecords || []);
        }
        // Refresh students list counts
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to revoke course access');
    } finally {
      setUpdatingCourseId(null);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Student Access & Enrollment Governance
          </h1>
          <p className="text-xs text-slate-500">
            Grant or revoke access per student to maintain zero-trust authorization
          </p>
        </div>

        {/* Access Rule Reminder */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
          <Lock className="w-4 h-4 text-amber-600" />
          <span>Manual Enrollment Active: Registration ≠ Course Access</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>

        <span className="text-xs text-slate-500 tabular-nums font-medium">
          {filteredStudents.length} Students Listed
        </span>
      </div>

      {/* Students Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs animate-pulse">
            Loading student records...
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Registered On</th>
                  <th className="py-3 px-4">Active Courses</th>
                  <th className="py-3 px-4">Completed Lessons</th>
                  <th className="py-3 px-4 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {s.avatar ? (
                          <img
                            src={s.avatar}
                            alt={s.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center font-bold text-xs">
                            {s.name[0]}
                          </div>
                        )}
                        <span className="font-bold text-slate-900 text-xs">{s.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {s.email}
                    </td>

                    <td className="py-3 px-4 text-slate-500">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4">
                      {s.activeAccessCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold tabular-nums">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{s.activeAccessCount} Granted</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-[11px]">
                          <Lock className="w-3.5 h-3.5" />
                          <span>0 Courses (Pending)</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 tabular-nums font-medium text-slate-800">
                      {s.completedLessonsCount || 0}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => openAccessManager(s)}
                      >
                        Manage Access
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs">
            No students found matching "{searchTerm}".
          </div>
        )}
      </div>

      {/* Course Access Drawer / Modal */}
      <Modal
        isOpen={accessModalOpen}
        onClose={() => setAccessModalOpen(false)}
        title={`Course Access: ${selectedStudent?.name}`}
        subtitle={`Student Email: ${selectedStudent?.email}`}
        maxWidth="max-w-2xl"
      >
        <div className="flex flex-col gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Toggle course enrollment for this student. Granting access immediately unlocks all protected lesson streams, resources, and progress tracking.
            </span>
          </div>

          {loadingDetail ? (
            <div className="py-8 text-center text-slate-500 text-xs animate-pulse">
              Loading courses and student records...
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {courses.map((course) => {
                const accessRecord = studentAccessRecords.find(
                  (r) => r.course?._id === course._id || r.course === course._id
                );
                const hasActiveAccess = accessRecord && accessRecord.status === 'active';
                const progressPercentage = accessRecord?.percentage || 0;
                const isUpdating = updatingCourseId === course._id;

                return (
                  <div
                    key={course._id}
                    className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors ${
                      hasActiveAccess
                        ? 'bg-white border-slate-200 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 opacity-90'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {course.category}
                          </span>
                          {hasActiveAccess ? (
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Active Access</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              <span>Access Not Granted</span>
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {course.title}
                        </h4>
                      </div>

                      {/* Action Button */}
                      <div className="shrink-0">
                        {hasActiveAccess ? (
                          <Button
                            variant="danger"
                            size="sm"
                            loading={isUpdating}
                            onClick={() => handleRevokeAccess(course._id, course.title)}
                          >
                            Revoke Access
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            loading={isUpdating}
                            onClick={() => handleGrantAccess(course._id, course.title)}
                          >
                            Grant Access
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar for Enrolled Course */}
                    {hasActiveAccess && (
                      <div className="pt-2 border-t border-slate-100">
                        <ProgressBar
                          percentage={progressPercentage}
                          label={`Student Progress (${accessRecord?.completedLessons || 0} of ${
                            accessRecord?.totalLessons || course.lessonsCount || 0
                          } lessons completed)`}
                          size="sm"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Sticky footer */}
          <div className="sticky bottom-0 -mx-6 -mb-5 px-6 py-4 bg-white/95 backdrop-blur-md border-t border-slate-200 flex justify-end z-10 mt-4">
            <Button variant="secondary" size="sm" onClick={() => setAccessModalOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
