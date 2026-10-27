import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppShell } from './components/layout/AppShell';
import { SplashScreen } from './components/common/SplashScreen';
import { InstallAppModal } from './components/common/InstallAppModal';

// Public & Auth Pages
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { HomePage } from './pages/public/HomePage';
import { CatalogPage } from './pages/public/CatalogPage';
import { CourseDetailsPage } from './pages/public/CourseDetailsPage';

// Student Pages
import { DashboardPage } from './pages/student/DashboardPage';
import { ClassroomPage } from './pages/student/ClassroomPage';
import { ResourcesPage } from './pages/student/ResourcesPage';
import { ProfilePage } from './pages/student/ProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { CurriculumBuilderPage } from './pages/admin/CurriculumBuilderPage';
import { StudentAccessPage } from './pages/admin/StudentAccessPage';

// Protected Route Guard: Authentication-First (Redirect to /login)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Admin Protected Route Guard
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 rounded-full border-2 border-accent-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Only Route Guard: If already logged in, redirect to App Home (/)
const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const App = () => {
  const { loading: authLoading } = useAuth();

  // Branded Startup Splash Screen on application boot
  const [showSplash, setShowSplash] = useState(() => {
    return sessionStorage.getItem('auralms_splash_seen') !== 'true';
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('auralms_splash_seen', 'true');
    setShowSplash(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-500/15 selection:text-brand-900">
      {/* 1. Startup Splash Screen: Holds until auth verification finishes */}
      {showSplash && (
        <SplashScreen
          isLoading={authLoading}
          onComplete={handleSplashComplete}
        />
      )}

      {/* 2. Global Installable PWA Modal */}
      <InstallAppModal />

      {/* 3. Universal App Shell Layout (Sidebar, Top Bar, Bottom Nav, Standalone Auth) */}
      <AppShell>
        <Routes>
          {/* Public Authentication Screens (Standalone, redirect if already logged in) */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />

          {/* Authenticated App Home Dashboard (Mandatory Auth) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* Explore / Course Catalog */}
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <CatalogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:slug"
            element={
              <ProtectedRoute>
                <CourseDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Dedicated Resources & Blueprints Screen */}
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <ResourcesPage />
              </ProtectedRoute>
            }
          />

          {/* Dedicated Profile & Avatar Settings */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Student Learning Workspace */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/:courseSlug"
            element={
              <ProtectedRoute>
                <ClassroomPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/:courseSlug/lesson/:lessonId"
            element={
              <ProtectedRoute>
                <ClassroomPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Governance Screens */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <AdminRoute>
                <AdminCoursesPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/courses/:courseId/curriculum"
            element={
              <AdminRoute>
                <CurriculumBuilderPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <AdminRoute>
                <StudentAccessPage />
              </AdminRoute>
            }
          />

          {/* Wildcard Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </div>
  );
};
