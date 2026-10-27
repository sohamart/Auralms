import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePwa } from '../../context/PwaContext';
import {
  Home,
  GraduationCap,
  Compass,
  FolderOpen,
  User,
  ShieldCheck,
  BookOpen,
  Users,
  Layers,
  LogOut,
  Download,
  ExternalLink,
  ChevronRight,
  Bell,
  Sparkles,
} from 'lucide-react';

export const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { isInstallable, isInstalled, openInstallModal } = usePwa();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { label: 'Home Dashboard', path: '/', icon: Home },
    { label: 'My Learning', path: '/dashboard', icon: GraduationCap },
    { label: 'Course Explorer', path: '/courses', icon: Compass },
    { label: 'Resources & Notes', path: '/resources', icon: FolderOpen },
    { label: 'Profile & Avatar', path: '/profile', icon: User },
  ];

  const adminLinks = [
    { label: 'Admin Overview', path: '/admin', icon: ShieldCheck, exact: true },
    { label: 'Course Curricula', path: '/admin/courses', icon: BookOpen },
    { label: 'Student Access', path: '/admin/students', icon: Users },
  ];

  return (
    <aside
      aria-label="App Navigation Sidebar"
      className="hidden md:flex flex-col justify-between w-64 h-screen sticky top-0 bg-white border-r border-slate-200 p-4 select-none shrink-0 z-30"
    >
      {/* Top Section: App Branding & User Profile */}
      <div className="flex flex-col gap-5">
        {/* App Logo */}
        <Link to="/" className="flex items-center gap-3 px-2 py-1 group">
          <img
            src="/pwa-192x192.png"
            alt="AuraLMS"
            className="w-10 h-10 rounded-2xl shadow-md shadow-brand-500/20 group-hover:scale-105 active:scale-95 transition-transform duration-200 object-cover"
          />
          <div className="flex flex-col">
            <span className="text-base font-black text-slate-900 tracking-tight leading-none group-hover:text-brand-600 transition-colors">
              Aura<span className="text-brand-600">LMS</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
              Native Academy
            </span>
          </div>
        </Link>

        {/* User Compact Card */}
        {user && (
          <Link
            to="/profile"
            className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 flex items-center gap-3 transition-colors group cursor-pointer"
            title="Manage Profile & Avatar"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-xl object-cover border border-slate-200 group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center border border-brand-200 group-hover:scale-105 transition-transform">
                {user.name[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate leading-tight group-hover:text-brand-600 transition-colors">
                {user.name}
              </p>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200/60 mt-0.5">
                {user.role}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </Link>
        )}

        {/* Core App Navigation */}
        <div className="flex flex-col gap-1">
          <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Learning App
          </span>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 active:scale-97 cursor-pointer ${
                  active
                    ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    active ? 'text-brand-600' : 'text-slate-400'
                  }`}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                <span className="flex-1">{item.label}</span>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Admin Navigation (Role Gated) */}
        {isAdmin && (
          <div className="flex flex-col gap-1 pt-2 border-t border-slate-100">
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Governance
            </span>
            {adminLinks.map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 active:scale-97 cursor-pointer ${
                    active
                      ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      active ? 'text-brand-600' : 'text-slate-400'
                    }`}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                  <span className="flex-1">{item.label}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Section: PWA Install & Logout */}
      <div className="flex flex-col gap-2 pt-4 border-t border-slate-200">
        {!isInstalled && (
          <button
            onClick={openInstallModal}
            className="flex items-center gap-2.5 w-full p-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-sm shadow-brand-500/20 active:scale-97 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="flex-1 text-left">Install Desktop App</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </button>
        )}

        <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>App Shell v2.4</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold cursor-pointer p-1 rounded hover:bg-rose-50 transition-colors"
            title="Sign out of app"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
