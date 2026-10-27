import React from 'react';
import { Link } from 'react-router-dom';
import { usePwa } from '../../context/PwaContext';
import { Layers, ShieldCheck, Download, Smartphone, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  const { isInstalled, openInstallModal } = usePwa();

  return (
    <footer className="w-full bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 hidden md:block select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: App Identity & Operational Health */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <div className="w-5 h-5 rounded-md bg-brand-600 text-white flex items-center justify-center text-[10px]">
              <Layers className="w-3 h-3" />
            </div>
            <span>AuraLMS App</span>
          </div>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] font-mono text-slate-400">v2.4.0 Native Shell</span>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All Systems Operational</span>
          </div>
        </div>

        {/* Center: Quick Native App Install CTA */}
        <div className="flex items-center gap-3 text-[11px]">
          {!isInstalled ? (
            <button
              onClick={openInstallModal}
              className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg border border-brand-200/80 transition-colors cursor-pointer"
            >
              <Download className="w-3 h-3 text-brand-600" />
              <span>Install to Desktop / Mobile</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Running in Native Mode</span>
            </div>
          )}
        </div>

        {/* Right: Security & Policy */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-1 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>Zero-Trust Architecture</span>
          </div>
          <span className="text-slate-300">•</span>
          <span>© {new Date().getFullYear()} AuraLMS</span>
        </div>
      </div>
    </footer>
  );
};
