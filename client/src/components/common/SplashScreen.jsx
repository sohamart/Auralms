import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, WifiOff } from 'lucide-react';
import { usePwa } from '../../context/PwaContext';

export const SplashScreen = ({ isLoading = false, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(25);
  const { isOnline } = usePwa();

  useEffect(() => {
    // Stage 1: Initial boot
    const timer1 = setTimeout(() => setProgress(65), 200);

    // Stage 2: When loading finishes or timeout reached
    const timer2 = setTimeout(() => setProgress(95), 550);

    const finishTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 250);
    }, 950);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(finishTimer);
    };
  }, [isLoading, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-slate-50 text-slate-900 py-12 px-6 select-none"
        >
          {/* Subtle top indicator */}
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase">
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-400">Verifying Security Session</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-600 font-bold">Offline Shell Active</span>
              </>
            )}
          </div>

          {/* Center Brand App Emblem & Title */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="relative mb-6"
            >
              {/* Outer Glow Ring */}
              <div className="absolute -inset-4 rounded-3xl bg-brand-500/20 blur-xl animate-pulse" />

              {/* App Icon Squircle */}
              <img
                src="/pwa-192x192.png"
                alt="AuraLMS"
                className="relative w-24 h-24 rounded-3xl shadow-xl border border-white/20 object-cover"
              />
            </motion.div>

            <motion.h1
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.35 }}
              className="text-2xl font-black text-slate-900 tracking-tight"
            >
              AuraLMS
            </motion.h1>

            <motion.p
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.35 }}
              className="text-xs text-slate-500 font-medium tracking-wide mt-1"
            >
              Enterprise Engineering Academy
            </motion.p>
          </div>

          {/* Bottom Progress Bar & Version */}
          <div className="w-full max-w-xs flex flex-col items-center gap-3">
            <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
            </div>

            <div className="flex items-center justify-between w-full text-[11px] text-slate-400 font-medium tabular-nums">
              <span>Initializing Native Workspace...</span>
              <span>{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
