import React, { useState } from 'react';
import {
  Smartphone,
  Send,
  Bell,
  CheckCheck,
  Phone,
  Video,
  MoreVertical,
  ChevronLeft,
  Share2,
  Sparkles,
  ExternalLink,
  Volume2,
  X
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

interface MobileNotificationSimulatorProps {
  onClose: () => void;
}

export const MobileNotificationSimulator: React.FC<MobileNotificationSimulatorProps> = ({ onClose }) => {
  const {
    notifications,
    students,
    selectedStudentId,
    setSelectedStudentId,
    setActiveRole,
    triggerAudioChime,
    sendCustomNotification
  } = useSchool();

  const [activeScreen, setActiveScreen] = useState<'LOCKSCREEN' | 'WHATSAPP'>('WHATSAPP');
  const [selectedParentId, setSelectedParentId] = useState<string>(selectedStudentId);

  const currentStudent = students.find((s) => s.id === selectedParentId) || students[0];
  const studentNotifs = notifications.filter((n) => n.studentId === currentStudent.id);

  const handleOpenReportFromPhone = () => {
    setSelectedStudentId(currentStudent.id);
    setActiveRole('PARENT');
    onClose();
  };

  const handleTriggerTestNotif = () => {
    sendCustomNotification(
      currentStudent.id,
      `🔔 Nilai Baru: Matematika (Ulangan Harian 2)`,
      `Yth. Bpk/Ibu ${currentStudent.parentName},\n\nNilai Ulangan Harian Matematika ananda ${currentStudent.name} telah diunggah dengan nilai *94/100* (A - Sangat Baik).\n\nSilakan cek e-Rapor real-time di sistem cloud sekolah.`
    );
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 shadow-2xl transition-all">
      {/* Smartphone Frame */}
      <div className="w-full max-w-[340px] h-[640px] bg-black rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col relative overflow-hidden">
        {/* Notch / Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-end px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
        </div>

        {/* Screen Bezel / Content */}
        <div className="w-full h-full bg-slate-900 rounded-[34px] overflow-hidden flex flex-col text-white relative">
          {/* Status Bar */}
          <div className="h-10 px-6 pt-2 flex items-center justify-between text-[11px] font-semibold text-slate-300 z-20 shrink-0 select-none">
            <span>09:41</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">5G</span>
              <div className="w-5 h-2.5 border border-slate-300 rounded-xs p-0.5 flex items-center">
                <div className="h-full w-3/4 bg-slate-300 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Mode Switcher inside Phone Top */}
          <div className="px-3 pb-2 flex items-center justify-between gap-1 text-[10px] bg-slate-900/90 border-b border-slate-800 z-20 shrink-0">
            <div className="flex gap-1 bg-slate-800 p-0.5 rounded-lg">
              <button
                onClick={() => setActiveScreen('WHATSAPP')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  activeScreen === 'WHATSAPP'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                WhatsApp Web
              </button>
              <button
                onClick={() => setActiveScreen('LOCKSCREEN')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  activeScreen === 'LOCKSCREEN'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Lockscreen Push
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-md bg-slate-800 cursor-pointer"
              title="Tutup Simulator"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Screen Content */}
          {activeScreen === 'WHATSAPP' ? (
            <div className="flex-1 flex flex-col bg-[#0b141a] overflow-hidden">
              {/* WhatsApp Header */}
              <div className="bg-[#202c33] px-3 py-2 flex items-center justify-between shrink-0 shadow-md">
                <div className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                  <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs text-white">
                    SIA
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white flex items-center gap-1">
                      SIAKAD SMAN 1
                      <span className="w-3 h-3 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[8px] font-black">
                        ✓
                      </span>
                    </h4>
                    <span className="text-[9px] text-emerald-400 block">Akun Resmi Sekolah</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <Phone className="w-3.5 h-3.5" />
                  <Video className="w-3.5 h-3.5" />
                  <MoreVertical className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Chat Conversation Scroll Area */}
              <div
                className="flex-1 p-3 overflow-y-auto space-y-3 text-xs"
                style={{
                  backgroundImage:
                    'radial-gradient(#1e293b 1px, transparent 1px)',
                  backgroundSize: '16px 16px'
                }}
              >
                <div className="text-center my-1">
                  <span className="bg-[#182229] text-slate-400 text-[10px] px-2.5 py-1 rounded-md shadow-xs">
                    Hari ini
                  </span>
                </div>

                {studentNotifs.length === 0 ? (
                  <div className="bg-[#1f2c34] p-3 rounded-xl text-slate-300 text-[11px] text-center">
                    Belum ada pesan notifikasi. Klik tombol "Tes Kirim Notifikasi" di bawah untuk menguji.
                  </div>
                ) : (
                  studentNotifs.map((notif) => (
                    <div
                      key={notif.id}
                      className="bg-[#005c4b] text-white p-3 rounded-2xl rounded-tl-xs shadow-md space-y-2 text-[11px] max-w-[92%]"
                    >
                      <p className="whitespace-pre-line leading-relaxed font-sans">
                        {notif.body}
                      </p>

                      <div className="pt-2 border-t border-emerald-600/60 flex items-center justify-between gap-2">
                        <button
                          onClick={handleOpenReportFromPhone}
                          className="px-2.5 py-1 bg-white text-emerald-950 font-bold rounded-md text-[10px] flex items-center gap-1 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Buka e-Rapor</span>
                        </button>
                        <div className="flex items-center gap-1 text-[9px] text-emerald-200">
                          <span>{notif.timestamp.substring(11, 16) || 'Baru saja'}</span>
                          <CheckCheck className="w-3 h-3 text-sky-400" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* WhatsApp Fake Input bar */}
              <div className="bg-[#202c33] p-2 flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Ketik pesan konfirmasi..."
                  disabled
                  className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 text-[11px] text-slate-300 placeholder-slate-500 outline-hidden"
                />
                <button
                  onClick={handleTriggerTestNotif}
                  className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 cursor-pointer hover:bg-emerald-500"
                  title="Kirim Notifikasi Uji Coba"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Lockscreen View */
            <div className="flex-1 p-4 flex flex-col justify-between bg-gradient-to-b from-indigo-950 via-slate-900 to-black overflow-y-auto">
              {/* Lockscreen clock */}
              <div className="text-center pt-6 space-y-1">
                <p className="text-4xl font-extralight tracking-tight font-mono">09:41</p>
                <p className="text-xs text-slate-400">Sabtu, 20 Desember</p>
              </div>

              {/* Stack of Push Notifications */}
              <div className="space-y-2 my-auto">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block px-1">
                  Pemberitahuan Sekolah ({studentNotifs.length})
                </span>

                {studentNotifs.slice(0, 3).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={handleOpenReportFromPhone}
                    className="bg-white/10 hover:bg-white/15 backdrop-blur-lg p-3 rounded-2xl border border-white/10 text-xs cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center text-[9px] font-black text-black">
                          W
                        </div>
                        <span className="font-bold text-white text-[11px]">SIAKAD CLOUD</span>
                      </div>
                      <span className="text-[9px] text-slate-400">Sekarang</span>
                    </div>
                    <p className="font-semibold text-slate-200 text-[11px] truncate">
                      {notif.title}
                    </p>
                    <p className="text-slate-300 text-[10px] line-clamp-2">
                      {notif.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom hint */}
              <div className="text-center pb-2">
                <span className="text-[10px] text-slate-500">Geser ke atas untuk membuka</span>
              </div>
            </div>
          )}

          {/* Phone Bottom Home Bar */}
          <div className="h-5 flex items-center justify-center bg-black shrink-0">
            <div className="w-24 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>

      {/* Simulator Side Controls */}
      <div className="hidden sm:flex flex-col gap-2 ml-4 self-center text-xs">
        <button
          onClick={handleTriggerTestNotif}
          className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          <span>Tes Bunyi Notifikasi</span>
        </button>

        <button
          onClick={onClose}
          className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-medium flex items-center gap-2 cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Tutup Phone Simulator</span>
        </button>
      </div>
    </div>
  );
};
