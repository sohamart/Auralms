import React from 'react';
import { Modal } from '../common/Modal';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export const ResourceViewerModal = ({
  isOpen,
  onClose,
  resource,
}) => {
  if (!resource) return null;

  const previewUrl = resource.previewUrl || resource.url;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={resource.title}
      subtitle={resource.description || 'Secure in-app document preview'}
      maxWidth="max-w-4xl"
    >
      <div className="flex flex-col gap-3">
        {/* Safe Iframe Preview */}
        <div className="relative w-full h-[65vh] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
          <iframe
            src={previewUrl}
            title={resource.title}
            className="w-full h-full border-0"
            allow="fullscreen"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Sandboxed Preview Active</span>
          </div>

          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors font-medium shadow-xs"
          >
            <span>Open in Dedicated Window</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </Modal>
  );
};
