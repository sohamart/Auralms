import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AppSidebar } from './AppSidebar';
import { AppTopBar } from './AppTopBar';
import { AppBottomNav } from './AppBottomNav';
import { Footer } from './Footer';

export const AppShell = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register';
  const isClassroom = location.pathname.startsWith('/learn');

  // If on login or registration, render standalone without app shell chrome
  if (isAuthPage) {
    return <div className="min-h-screen bg-slate-50 text-slate-900">{children}</div>;
  }

  // If inside immersive classroom player, render full-screen view
  if (isClassroom) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 selection:bg-brand-500/15 selection:text-brand-900">
      {/* 1. Desktop Persistent App Sidebar Rail */}
      <AppSidebar />

      {/* 2. Main Workspace & Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top App Bar */}
        <AppTopBar />

        {/* Content Area with Mobile Bottom Dock Clearance */}
        <main className="flex-1 flex flex-col pb-20 md:pb-0">{children}</main>

        {/* Desktop Minimal App Status Bar */}
        <Footer />
      </div>

      {/* 3. Mobile Fixed Bottom Navigation Dock */}
      <AppBottomNav />
    </div>
  );
};
