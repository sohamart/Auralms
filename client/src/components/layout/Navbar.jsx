import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePwa } from '../../context/PwaContext';
import { Button } from '../common/Button';
import {
  Layers,
  Search,
  Bell,
  Download,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  ChevronDown,
  Monitor,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { isInstallable, isInstalled, promptInstall, openInstallModal } = usePwa();
  const location = useLocation();
  const navigate = useNavigate();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-colors select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 gap-4">
          {/* Left: App Logo & Live Status */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-700 flex items-center justify-center shadow-sm group-hover:scale-105 active:scale-95 transition-transform duration-200">
                <Layers className="w-5 h-5 text-white" strokeWidth={2.2} />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors leading-tight">
                  Aura<span className="text-brand-600">LMS</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  App Platform
                </span>
              </div>
            </Link>

            {/* Desktop Quick Nav Tabs */}
            <nav className="hidden md:flex items-center gap-1 ml-2">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive('/') && location.pathname === '/'
                    ? 'bg-brand-50 text-brand-700 border border-brand-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                App Home
              </Link>
              <Link
                to="/courses"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive('/courses')
                    ? 'bg-brand-50 text-brand-700 border border-brand-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Explore Courses
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive('/dashboard')
                      ? 'bg-brand-50 text-brand-700 border border-brand-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-brand-600" />
                  <span>My Learning</span>
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive('/admin')
                      ? 'bg-brand-50 text-brand-700 border border-brand-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                  <span>Admin Console</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Center: Search Trigger (Desktop & Tablet) */}
          <div className="hidden lg:flex flex-1 max-w-xs mx-4">
            <Link
              to="/courses"
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs text-slate-500 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                <span>Search courses, topics...</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-400 font-bold shadow-xs">
                ⌘K
              </kbd>
            </Link>
          </div>

          {/* Right: Actions, Install App Button & Profile */}
          <div className="flex items-center gap-2.5">
            {/* Install PWA App Button */}
            {!isInstalled ? (
              <button
                onClick={openInstallModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-sm shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
                title="Install AuraLMS as a Native App on your device"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Install App</span>
                <span className="sm:hidden">Install</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping hidden sm:inline" />
              </button>
            ) : (
              <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200">
                <Monitor className="w-3.5 h-3.5 text-emerald-600" />
                <span>Native Standalone Mode</span>
              </div>
            )}

            {/* Notification Bell */}
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

              {/* Notifications Popover */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-panel p-3 flex flex-col gap-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">App Notifications</span>
                    <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                      2 Unread
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-0.5">
                      <span className="font-semibold text-slate-800 text-[11px]">
                        🎉 Welcome to AuraLMS App
                      </span>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        You're running the progressive native app shell. Install to home screen anytime.
                      </p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-0.5">
                      <span className="font-semibold text-slate-800 text-[11px]">
                        🚀 New Masterclasses Live
                      </span>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        Cloud Systems & AI Engineering curricula ready for enrolled learners.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition-all text-left cursor-pointer active:scale-95"
                >
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-900 leading-none">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-semibold text-brand-600 capitalize mt-0.5">
                      {user.role}
                    </span>
                  </div>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center font-bold text-xs">
                      {user.name[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 pr-0.5" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-panel p-2 flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-brand-600" />
                      <span>My Learning Dashboard</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-brand-600" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    {!isInstalled && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openInstallModal();
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-cyan-700 hover:bg-cyan-50 transition-colors text-left"
                      >
                        <Download className="w-4 h-4 text-cyan-600" />
                        <span>Install Desktop App</span>
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors w-full text-left mt-1 border-t border-slate-100 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
