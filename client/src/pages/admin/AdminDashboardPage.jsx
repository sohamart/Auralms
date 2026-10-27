import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesApi, adminApi } from '../../services/api';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  ShieldCheck,
  BookOpen,
  Users,
  GraduationCap,
  Plus,
  ArrowRight,
  Eye,
  Settings,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [coursesRes, studentsRes] = await Promise.all([
          coursesApi.adminGetAll(),
          adminApi.getStudents(),
        ]);

        if (coursesRes.success) setCourses(coursesRes.courses);
        if (studentsRes.success) setStudents(studentsRes.students);
      } catch (err) {
        console.error('Error fetching admin overview data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.published).length;
  const totalStudents = students.length;
  const totalEnrollments = courses.reduce(
    (acc, c) => acc + (c.activeStudentsCount || 0),
    0
  );

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8 bg-slate-50">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-panel">
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold w-fit">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Administrator Control Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Platform Overview & Operations
          </h1>
          <p className="text-xs text-slate-600">
            Manage course publishing, curriculum modules, verified videos, and individual student access grants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/courses">
            <Button variant="primary" size="md" icon={Plus}>
              Manage Courses
            </Button>
          </Link>
          <Link to="/admin/students">
            <Button variant="secondary" size="md" icon={Users}>
              Grant Access
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Courses
            </span>
            <BookOpen className="w-4 h-4 text-brand-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {totalCourses}
            </span>
            <span className="text-xs text-slate-500">
              ({publishedCourses} published)
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Registered Students
            </span>
            <Users className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {totalStudents}
            </span>
            <span className="text-xs text-slate-500">profiles</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Active Access Grants
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600 tabular-nums">
              {totalEnrollments}
            </span>
            <span className="text-xs text-slate-500">enrollments</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Access Gate Policy
            </span>
            <GraduationCap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Strict Manual Grant
            </span>
          </div>
          <span className="text-[10px] text-slate-500 leading-tight">
            Zero auto-grant on register
          </span>
        </div>
      </div>

      {/* Recent Courses Table Preview */}
      <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">Course Management Quicklist</h2>
            <p className="text-xs text-slate-500">Overview of curricula and active student enrollment counts</p>
          </div>
          <Link to="/admin/courses">
            <Button variant="secondary" size="sm" iconRight={ArrowRight}>
              View All Courses
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="h-40 rounded-xl bg-slate-100 animate-pulse" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] bg-slate-50">
                  <th className="py-3 px-4">Course Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Lessons</th>
                  <th className="py-3 px-4">Enrolled Students</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {courses.slice(0, 5).map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      {course.title}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{course.category}</td>
                    <td className="py-3 px-4">
                      <Badge variant="default">{course.level}</Badge>
                    </td>
                    <td className="py-3 px-4 tabular-nums font-medium">{course.lessonsCount || 0}</td>
                    <td className="py-3 px-4 tabular-nums text-emerald-600 font-semibold">
                      {course.activeStudentsCount || 0}
                    </td>
                    <td className="py-3 px-4">
                      {course.published ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                          <span>Draft</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link to={`/admin/courses/${course._id}/curriculum`}>
                        <button className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer font-medium">
                          Curriculum
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Access Quick Action Preview */}
      <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">Student Access Quick Action</h2>
            <p className="text-xs text-slate-500">
              Grant or revoke curriculum access individually
            </p>
          </div>
          <Link to="/admin/students">
            <Button variant="primary" size="sm" iconRight={ArrowRight}>
              Open Access Console
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {students.slice(0, 3).map((student) => (
            <div
              key={student.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center font-bold text-xs shrink-0">
                  {student.name[0]}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{student.name}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{student.email}</p>
                </div>
              </div>

              <span className="tabular-nums text-xs text-brand-700 font-semibold shrink-0 ml-2">
                {student.activeAccessCount || 0} active
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
