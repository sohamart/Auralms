import React, { useState } from 'react';
import {
  Play,
  FileText,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Info,
  Maximize2,
} from 'lucide-react';

export const SafeVideoPlayer = ({
  videoType = 'none',
  embedUrl,
  videoNotice,
  lessonTitle,
  onEnded,
}) => {
  const [hasError, setHasError] = useState(false);

  // If no video was configured for this lesson
  if (videoType === 'none' || !embedUrl) {
    return (
      <div className="w-full aspect-video bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 mb-4 shadow-sm">
          <FileText className="w-7 h-7" strokeWidth={1.75} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Practical Reading & Lab Module
        </h3>
        <p className="text-sm text-slate-600 max-w-md mb-4 text-pretty">
          This lesson focuses on architectural reading, implementation specifications, and code analysis provided in the Lesson Notes & Resources below.
        </p>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
          <Info className="w-3.5 h-3.5 text-brand-600" />
          <span>No video stream required for this module</span>
        </span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* 16:9 Aspect Ratio Sandboxed Player Container */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-slate-300 shadow-panel group">
        {!hasError ? (
          <iframe
            src={embedUrl}
            title={lessonTitle || 'Lesson Video Player'}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            // Sandbox prevents unauthorized top navigation while allowing media playback
            sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-white">
            <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />
            <h4 className="text-base font-semibold text-slate-900 mb-1">
              Unable to load embedded video stream
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mb-4">
              The external provider could not be loaded or third-party permissions are restricted.
            </p>
            {embedUrl && (
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              >
                <span>Open in External Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Third-Party Access Notice Callout */}
      <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-100/70 border border-slate-200 text-[11px] text-slate-600">
        <Info className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
        <div className="flex-1 leading-relaxed">
          <span className="font-semibold text-slate-800">Third-Party Permissions Notice:</span>{' '}
          {videoNotice ||
            'Original provider sharing permissions apply (e.g. YouTube unlisted privacy, Google Drive link view permissions, or Vimeo domain whitelist). Embedding this stream inside AuraLMS does not make a restricted external file public.'}
        </div>
      </div>
    </div>
  );
};
