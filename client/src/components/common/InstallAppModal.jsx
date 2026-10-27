import React from 'react';
import { usePwa } from '../../context/PwaContext';
import { Modal } from './Modal';
import { Button } from './Button';
import {
  Download,
  Smartphone,
  Monitor,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Share,
  PlusSquare,
} from 'lucide-react';

export const InstallAppModal = () => {
  const { showInstallModal, closeInstallModal, promptInstall, isInstallable, isInstalled } =
    usePwa();

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  return (
    <Modal
      isOpen={showInstallModal}
      onClose={closeInstallModal}
      title="Install AuraLMS App"
      subtitle="Install directly to your device home screen or desktop application drawer"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-5">
        {/* App Emblem Header Box */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <img
            src="/pwa-192x192.png"
            alt="AuraLMS"
            className="w-12 h-12 rounded-2xl shadow-sm object-cover shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-sm font-black text-slate-900 leading-tight">
              AuraLMS
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Native Engineering Learning App
            </p>
          </div>
        </div>

        {/* Benefits list */}
        <div className="flex flex-col gap-2.5 text-xs text-slate-700">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Instant launch from dock or home screen without browser chrome</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Fast, distraction-free native classroom & safe video streaming</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Monitor className="w-4 h-4 text-cyan-600 shrink-0" />
            <span>Works seamlessly across Windows, macOS, Android, and iOS</span>
          </div>
        </div>

        {/* iOS Specific Instructions if on iPhone/iPad Safari */}
        {isIOS && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 font-bold">
              <Smartphone className="w-4 h-4 text-amber-600" />
              <span>iOS Safari Installation:</span>
            </div>
            <ol className="list-decimal pl-4 flex flex-col gap-1 text-[11px] text-amber-800">
              <li>
                Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline mx-0.5 text-blue-600" /> at the bottom of Safari.
              </li>
              <li>
                Scroll down and select <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5" />.
              </li>
              <li>Tap <strong>Add</strong> in the top-right corner.</li>
            </ol>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex flex-col gap-2">
          {!isIOS && (
            <Button
              variant="primary"
              size="lg"
              icon={Download}
              onClick={promptInstall}
              className="w-full justify-center"
            >
              {isInstalled ? 'App Already Installed' : 'Install AuraLMS App Now'}
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={closeInstallModal}
            className="w-full justify-center text-slate-500"
          >
            Continue in Browser Window
          </Button>
        </div>
      </div>
    </Modal>
  );
};
