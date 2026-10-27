import React, { useState } from 'react';
import { ResourceViewerModal } from './ResourceViewerModal';
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  FileCode2,
  ExternalLink,
  Download,
  Eye,
  StickyNote,
  FolderOpen,
} from 'lucide-react';

const getResourceIcon = (type) => {
  switch (type) {
    case 'google_drive_pdf':
    case 'pdf':
      return <FileText className="w-5 h-5 text-rose-400" />;
    case 'google_doc':
      return <FileCode2 className="w-5 h-5 text-brand-400" />;
    case 'google_sheet':
      return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    case 'google_slides':
      return <Presentation className="w-5 h-5 text-amber-400" />;
    case 'note':
      return <StickyNote className="w-5 h-5 text-cyan-400" />;
    case 'external_link':
    default:
      return <ExternalLink className="w-5 h-5 text-brand-400" />;
  }
};

const getTypeLabel = (type) => {
  switch (type) {
    case 'google_drive_pdf':
      return 'Google Drive PDF';
    case 'google_doc':
      return 'Google Doc';
    case 'google_sheet':
      return 'Google Sheet';
    case 'google_slides':
      return 'Google Slides';
    case 'pdf':
      return 'PDF Document';
    case 'note':
      return 'Study Note';
    case 'external_link':
    default:
      return 'Web Reference';
  }
};

export const ResourceList = ({ resources = [] }) => {
  const [selectedResource, setSelectedResource] = useState(null);

  if (!resources || resources.length === 0) {
    return (
      <div className="py-8 px-4 text-center rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center">
        <FolderOpen className="w-8 h-8 text-slate-400 mb-2" />
        <p className="text-xs text-slate-500 font-medium">No external resources attached to this lesson.</p>
      </div>
    );
  }

  const canPreview = (res) => {
    return (
      res.type === 'google_drive_pdf' ||
      res.type === 'google_doc' ||
      res.type === 'google_sheet' ||
      res.type === 'google_slides' ||
      res.previewUrl
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {resources.map((res, index) => {
          const isPreviewable = canPreview(res);

          return (
            <div
              key={res.id || index}
              className="group flex flex-col justify-between p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-all shadow-xs"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  {getResourceIcon(res.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {getTypeLabel(res.type)}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors truncate">
                    {res.title}
                  </h4>
                  {res.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {res.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                {isPreviewable && (
                  <button
                    onClick={() => setSelectedResource(res)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>In-App Preview</span>
                  </button>
                )}

                {res.url && (
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 transition-colors cursor-pointer"
                  >
                    {res.isDownloadable ? (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Link</span>
                      </>
                    )}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded Modal Preview */}
      <ResourceViewerModal
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        resource={selectedResource}
      />
    </div>
  );
};
