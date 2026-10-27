import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop with smooth blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Centering wrapper that allows safe vertical scrolling without clipping the top */}
          <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-6 text-left">
            {/* Modal Card with max-height and internal scrolling */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 14 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`relative w-full ${maxWidth} bg-white border border-slate-200 rounded-2xl shadow-panel z-10 flex flex-col max-h-[88vh] overflow-hidden my-auto`}
              role="dialog"
              aria-modal="true"
            >
              {/* Pinned Header */}
              <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-200 bg-white/95 backdrop-blur-md shrink-0 z-20">
                <div className="flex flex-col gap-1 pr-2">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                    {title}
                  </h3>
                  {subtitle && (
                    <p className="text-xs text-slate-500 font-normal leading-relaxed">
                      {subtitle}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0 cursor-pointer -mr-1"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form / Content Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 overscroll-contain">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
