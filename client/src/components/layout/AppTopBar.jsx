import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePwa } from '../../context/PwaContext';
import {
  Layers,
  Search,
  Bell,
  Download,
  ShieldCheck,
  ChevronRight,
  Monitor,
} from 'lucide-react';

export const AppTopBar = () => {
  const { user, isAdmin } = useAuth();
  const { isInstallable, isInstalled, openInstallModal } = usePwa();
  const location = useLocation();

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Derive human-readable screen title
  const getScreenTitle = () => {
    const p = location.pathname;
    if (p === '/') return 'Home Feed';
    if (p === '/dashboard') return 'My Learning';
    if (p === '/courses') return 'Course Explorer';
    if (p === '/resources') return 'Resources & Notes';
    if (p === '/profile') return 'Profile & Settings';
    if (p.startsWith('/courses/')) return 'Course Details';
    if (p.startsWith('/admin/courses')) return 'Admin • Courses';
    if (p.startsWith('/admin/students')) return 'Admin • Student Access';
    if (p.startsWith('/admin')) return 'Admin Overview';
    return 'AuraLMS';
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 select-none">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile: App Logo; Desktop: Screen Title / Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="md:hidden flex items-center gap-2">
            <img
              src="/pwa-192x192.png"
              alt="AuraLMS"
              className="w-8 h-8 rounded-xl shadow-xs object-cover"
            />
            <span className="text-base font-black text-slate-900 tracking-tight">
              Aura<span className="text-brand-600">LMS</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              App
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <h2 className="text-xs font-bold text-slate-900">
              {getScreenTitle()}
            </h2>
          </div>
        </div>

        {/* Center: Search trigger (Desktop & Tablet) */}
        <div className="hidden sm:flex flex-1 max-w-sm mx-4">
          <Link
            to="/courses"
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs text-slate-500 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              <span>Search masterclasses, topics...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-400 font-bold shadow-xs">
              ⌘K
            </kbd>
          </Link>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2.5">
          {/* PWA Install Button (Compact header trigger) */}
          {!isInstalled && (
            <button
              onClick={openInstallModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-700 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
              title="Install AuraLMS as Native App"
            >
              <Download className="w-3.5 h-3.5 text-brand-600" />
              <span className="hidden sm:inline">Install App</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          )}

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
              title="Notifications"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-panel p-3 flex flex-col gap-2 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">App Alerts</span>
                  <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                    2 New
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-0.5">
                    <span className="font-semibold text-slate-800 text-[11px]">
                      🚀 Native App Shell v2.4 Active
                    </span>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Enjoy edge-to-edge touch navigation and standalone desktop mode.
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-0.5">
                    <span className="font-semibold text-slate-800 text-[11px]">
                      🔒 Zero-Trust Enrollment Verified
                    </span>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      All curriculum streams and notes are protected by backend IDOR guards.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Mini-Avatar (Mobile visible) */}
          {user && (
            <Link
              to="/profile"
              className="flex items-center gap-2 p-1 rounded-full bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
              title="Manage Profile & Avatar"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center text-xs font-bold">
                  {user.name[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
