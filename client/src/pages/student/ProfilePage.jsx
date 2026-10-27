import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  User,
  Mail,
  ShieldCheck,
  Sparkles,
  Check,
  LogOut,
  Calendar,
  Award,
  Flame,
  ArrowRight,
  Lock,
  Layers,
  Settings,
  Shield,
  Smartphone,
} from 'lucide-react';

// 12 Curated Preset Avatars (High-Craft Vector Personas)
const PRESET_AVATARS = [
  {
    id: 'alex',
    name: 'Frontend Architect',
    url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alex',
  },
  {
    id: 'elena',
    name: 'AI Engineer',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Elena',
  },
  {
    id: 'marcus',
    name: 'Systems Lead',
    url: 'https://api.dicebear.com/7.x/personas/svg?seed=Marcus',
  },
  {
    id: 'sarah',
    name: 'DevOps Specialist',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: 'cyber',
    name: 'Bottts Core',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberCore',
  },
  {
    id: 'felix',
    name: 'Full-Stack Developer',
    url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix',
  },
  {
    id: 'aria',
    name: 'Security Analyst',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Aria',
  },
  {
    id: 'leo',
    name: 'Cloud Engineer',
    url: 'https://api.dicebear.com/7.x/personas/svg?seed=Leo',
  },
  {
    id: 'maya',
    name: 'Design Systems Lead',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
  },
  {
    id: 'titan',
    name: 'Neural Bot',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=TitanLab',
  },
  {
    id: 'zoe',
    name: 'Product Developer',
    url: 'https://api.dicebear.com/7.x/micah/svg?seed=Zoe',
  },
  {
    id: 'jordan',
    name: 'Kernel Engineer',
    url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Jordan',
  },
];

export const ProfilePage = () => {
  const { user, isAdmin, updateProfile, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || PRESET_AVATARS[0].url);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatusMessage({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }

    try {
      setSaving(true);
      setStatusMessage(null);
      await updateProfile({
        name: name.trim(),
        avatar: selectedAvatar,
      });
      toast.success('Profile updated successfully!');
      setStatusMessage({ type: 'success', text: 'Changes saved successfully.' });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to update profile.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col gap-8 bg-slate-50 text-slate-900 select-none pb-24 md:pb-12">
      {/* 1. Header Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Active Live Avatar Preview */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-brand-50 border-2 border-brand-200 shadow-md overflow-hidden flex items-center justify-center p-1">
              <img
                src={selectedAvatar}
                alt="Selected Avatar"
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-200" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                {user?.role === 'admin' ? 'System Administrator' : 'Verified Student'}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                ID: {user?._id?.slice(-6) || 'active'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {name || user?.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* Quick Actions / Role Telemetry */}
        <div className="flex items-center gap-2.5 self-start md:self-center">
          {isAdmin && (
            <Link to="/admin">
              <Button variant="secondary" size="sm" icon={ShieldCheck}>
                Admin Console
              </Button>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200/80 transition-all cursor-pointer active:scale-95"
            title="Sign out of AuraLMS"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* 2. Main Edit Form & Avatar Selector */}
      <form onSubmit={handleSave} className="flex flex-col gap-8">
        {/* Name Editing Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Profile Details
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your student identity displayed across courses, leaderboards, and forums.
              </p>
            </div>
            <span className="p-2 rounded-2xl bg-slate-100 text-slate-500">
              <User className="w-4 h-4" />
            </span>
          </div>

          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              <Check className="w-4 h-4 shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white text-slate-900 placeholder-slate-400 text-sm rounded-2xl py-2.5 pl-10 pr-3.5 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                />
              </div>
            </div>

            {/* Email Address (Read-only for security) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 tracking-wide">
                  Email Address
                </label>
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Managed by Auth
                </span>
              </div>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-slate-100/70 border border-slate-200 text-slate-500 text-sm rounded-2xl py-2.5 pl-10 pr-3.5 cursor-not-allowed select-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preset Avatar Gallery (No file upload) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  Choose Your Avatar
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  Instant Presets
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your engineering persona from our verified vector gallery. No file uploads required.
              </p>
            </div>
            <span className="text-xs font-bold text-brand-600 tabular-nums">
              {PRESET_AVATARS.length} Personas Available
            </span>
          </div>

          {/* Grid of Avatars */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3.5 sm:gap-4">
            {PRESET_AVATARS.map((preset) => {
              const isSelected = selectedAvatar === preset.url;
              return (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => setSelectedAvatar(preset.url)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-150 cursor-pointer active:scale-95 group relative ${
                    isSelected
                      ? 'bg-brand-50/80 border-brand-600 shadow-sm shadow-brand-500/10'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  <span className="text-[10px] font-bold text-slate-700 truncate w-full text-center">
                    {preset.name}
                  </span>

                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={saving}
              icon={Check}
              className="px-6 py-2.5 rounded-2xl shadow-sm shadow-brand-500/20"
            >
              Save Profile Changes
            </Button>
          </div>
        </div>
      </form>

      {/* 3. Account Telemetry & Security Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 border border-brand-200">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Academy Status
            </span>
            <p className="text-xs font-bold text-slate-900">
              {isAdmin ? 'Full System Governor' : 'Verified Learner'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Zero-Trust Guard
            </span>
            <p className="text-xs font-bold text-slate-900">HTTP-Only Authenticated</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Native Experience
            </span>
            <p className="text-xs font-bold text-slate-900">PWA v2.4 Standalone</p>
          </div>
        </div>
      </div>
    </div>
  );
};
