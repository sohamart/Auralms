import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePwa } from '../../context/PwaContext';
import {
  Home,
  Compass,
  GraduationCap,
  FolderOpen,
  ShieldCheck,
  User,
  Download,
  LogIn,
} from 'lucide-react';

export const AppBottomNav = () => {
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { isInstallable, isInstalled, openInstallModal } = usePwa();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1.5 safe-area-pb"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* 1. Home Feed */}
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all duration-150 active:scale-95 ${
            isActive('/') && location.pathname === '/'
              ? 'text-brand-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5" strokeWidth={isActive('/') && location.pathname === '/' ? 2.4 : 1.8} />
            {isActive('/') && location.pathname === '/' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-600" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">Home</span>
        </Link>

        {/* 2. Explore / Courses */}
        <Link
          to="/courses"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all duration-150 active:scale-95 ${
            isActive('/courses')
              ? 'text-brand-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Compass className="w-5 h-5" strokeWidth={isActive('/courses') ? 2.4 : 1.8} />
            {isActive('/courses') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-600" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">Explore</span>
        </Link>

        {/* 3. My Learning */}
        <Link
          to="/dashboard"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all duration-150 active:scale-95 ${
            isActive('/dashboard') || location.pathname.startsWith('/learn')
              ? 'text-brand-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <GraduationCap
              className="w-5 h-5"
              strokeWidth={
                isActive('/dashboard') || location.pathname.startsWith('/learn')
                  ? 2.4
                  : 1.8
              }
            />
            {(isActive('/dashboard') || location.pathname.startsWith('/learn')) && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-600" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">Learning</span>
        </Link>

        {/* 4. Resources & Blueprints */}
        <Link
          to="/resources"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all duration-150 active:scale-95 ${
            isActive('/resources')
              ? 'text-brand-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <FolderOpen className="w-5 h-5" strokeWidth={isActive('/resources') ? 2.4 : 1.8} />
            {isActive('/resources') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-600" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">Resources</span>
        </Link>

        {/* 5. Profile Tab */}
        {user ? (
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all duration-150 active:scale-95 ${
              isActive('/profile')
                ? 'text-brand-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className={`w-5 h-5 rounded-full object-cover border ${
                    isActive('/profile') ? 'border-brand-600 ring-1 ring-brand-500' : 'border-slate-300'
                  }`}
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold border border-brand-200">
                  {user.name[0]?.toUpperCase() || 'U'}
                </div>
              )}
              {isActive('/profile') && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-600" />
              )}
            </div>
            <span className="text-[10px] tracking-tight">Profile</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all duration-150 active:scale-95 ${
              isActive('/login')
                ? 'text-brand-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-5 h-5" strokeWidth={isActive('/login') ? 2.4 : 1.8} />
            <span className="text-[10px] tracking-tight">Sign In</span>
          </Link>
        )}
      </div>
    </nav>
  );
};
