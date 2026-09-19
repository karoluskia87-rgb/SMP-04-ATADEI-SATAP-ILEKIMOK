import React, { useEffect } from 'react';
import {
  Bell,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  X,
  Smartphone
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

interface NotificationToastProps {
  onOpenMobileSimulator: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ onOpenMobileSimulator }) => {
  const {
    latestDispatchedNotification,
    clearLatestNotification,
    setSelectedStudentId,
    setActiveRole
  } = useSchool();

  useEffect(() => {
    if (latestDispatchedNotification) {
      const timer = setTimeout(() => {
        clearLatestNotification();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [latestDispatchedNotification, clearLatestNotification]);

  if (!latestDispatchedNotification) return null;

  const handleOpenParent = () => {
    setSelectedStudentId(latestDispatchedNotification.studentId);
    setActiveRole('PARENT');
    clearLatestNotification();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700/80 animate-slide-up no-print">
      <div className="flex items-start justify-between gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mb-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Notifikasi WhatsApp Terkirim Otomatis</span>
          </div>

          <h4 className="font-bold text-xs text-white truncate">
            {latestDispatchedNotification.title}
          </h4>

          <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
            Penerima: <strong>{latestDispatchedNotification.parentName}</strong> ({latestDispatchedNotification.parentPhone})
          </p>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleOpenParent}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Cek di Portal Ortu</span>
            </button>

            <button
              onClick={() => {
                onOpenMobileSimulator();
                clearLatestNotification();
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Buka Layar HP</span>
            </button>
          </div>
        </div>

        <button
          onClick={clearLatestNotification}
          className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
