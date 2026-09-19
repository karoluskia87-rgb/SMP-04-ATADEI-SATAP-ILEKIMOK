import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Printer,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  CloudCheck,
  RotateCcw,
  Sparkles,
  LogIn,
  LogOut,
  ChevronDown,
  UserCheck,
  KeyRound,
  Camera,
  Edit2
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { UserProfileModal } from './Auth/UserProfileModal';

interface HeaderProps {
  onOpenMobileSimulator: () => void;
  isMobileSimulatorOpen: boolean;
  onOpenAiHelper: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSimulator,
  isMobileSimulatorOpen,
  onOpenAiHelper
}) => {
  const {
    schoolSettings,
    activeRole,
    setActiveRole,
    currentUser,
    users,
    logout,
    login,
    setIsLoginModalOpen,
    unreadNotifCount,
    resetToDefaultData
  } = useSchool();

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand & School info */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight truncate">
                  {schoolSettings.schoolName}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CloudCheck className="w-3 h-3" />
                  e-Rapor Sah
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">
                Sistem Nilai Real-Time • {schoolSettings.currentClass} • Semester {schoolSettings.currentSemester} ({schoolSettings.currentAcademicYear})
              </p>
            </div>
          </div>

          {/* Role Navigation & User Bar */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {currentUser && (
              <>
                {/* Current Role Badge & Title */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs shadow-2xs ${
                  currentUser.role === 'ADMIN'
                    ? 'bg-purple-50 text-purple-800 border-purple-200'
                    : currentUser.role === 'PRINCIPAL'
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : currentUser.role === 'TEACHER'
                    ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  {currentUser.role === 'ADMIN' && (
                    <>
                      <ShieldAlert className="w-4 h-4 text-purple-600" />
                      <span>Panel Administrator</span>
                    </>
                  )}
                  {currentUser.role === 'PRINCIPAL' && (
                    <>
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>Portal Kepala Sekolah</span>
                    </>
                  )}
                  {currentUser.role === 'TEACHER' && (
                    <>
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                      <span>Dashboard Guru & Wali Kelas</span>
                    </>
                  )}
                  {currentUser.role === 'PARENT' && (
                    <>
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>Portal Orang Tua / Siswa</span>
                    </>
                  )}
                </div>

                {/* AI Assistant Button (For Teachers & Principal) */}
                {(currentUser.role === 'TEACHER' || currentUser.role === 'PRINCIPAL' || currentUser.role === 'ADMIN') && (
                  <button
                    id="btn-ai-assistant"
                    onClick={onOpenAiHelper}
                    title="Asisten AI Deskripsi Capaian Rapor"
                    className="hidden xl:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>AI Rapor</span>
                  </button>
                )}

                {/* Mobile Notification Simulator Toggle */}
                <button
                  id="btn-mobile-simulator"
                  onClick={onOpenMobileSimulator}
                  title="Simulasi Notifikasi HP Orang Tua (WhatsApp)"
                  className={`relative flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    isMobileSimulatorOpen
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="hidden md:inline">HP Notif</span>
                  {unreadNotifCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 absolute -top-0.5 -right-0.5 animate-pulse" />
                  )}
                </button>
              </>
            )}

            {/* User Account / Login Button */}
            <div className="relative">
              {currentUser ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer text-left group"
                  >
                    <div className="relative">
                      {currentUser.avatar ? (
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-7 h-7 rounded-lg object-cover border border-slate-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white ${
                            currentUser.role === 'ADMIN'
                              ? 'bg-purple-600'
                              : currentUser.role === 'PRINCIPAL'
                              ? 'bg-amber-600'
                              : currentUser.role === 'TEACHER'
                              ? 'bg-indigo-600'
                              : 'bg-emerald-600'
                          }`}
                        >
                          {currentUser.name.charAt(0)}
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 p-0.5 bg-indigo-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-2 h-2" />
                      </span>
                    </div>

                    <div className="hidden sm:block min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                        {currentUser.name.split(',')[0]}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {currentUser.role === 'ADMIN'
                          ? 'Admin Sistem'
                          : currentUser.role === 'PRINCIPAL'
                          ? 'Kepala Sekolah'
                          : currentUser.role === 'TEACHER'
                          ? 'Guru / Wali Kelas'
                          : 'Orang Tua'}
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {isAccountMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in space-y-1">
                      <div className="p-2 border-b border-slate-100 flex items-center gap-3">
                        {currentUser.avatar ? (
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                            {currentUser.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{currentUser.title}</p>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-slate-400 font-mono">
                            <span>User: {currentUser.username}</span>
                          </div>
                        </div>
                      </div>

                      {/* Prominent Edit Profile & Photo Button */}
                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          setIsProfileModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/70 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Camera className="w-4 h-4 text-indigo-600 shrink-0" />
                        <div className="flex-1">
                          <span className="block leading-tight">Ubah Foto Profil & Data Diri</span>
                          <span className="text-[10px] font-normal text-indigo-500">Unggah foto baru atau pilih avatar</span>
                        </div>
                      </button>

                      <div className="pt-1 max-h-52 overflow-y-auto">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                          Pilih Akun Terdaftar:
                        </span>
                        {users.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => {
                              login(u);
                              setIsAccountMenuOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer ${
                              currentUser.id === u.id
                                ? 'bg-indigo-50 text-indigo-700 font-bold'
                                : 'text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {u.avatar ? (
                                <img
                                  src={u.avatar}
                                  alt={u.name}
                                  className="w-5 h-5 rounded-full object-cover shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <span className="w-5 h-5 rounded-full bg-slate-200 text-[10px] flex items-center justify-center font-bold text-slate-700 shrink-0">
                                  {u.name.charAt(0)}
                                </span>
                              )}
                              <span className="truncate">{u.name.split(',')[0]}</span>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-normal bg-slate-100 text-slate-600 shrink-0 ml-1">
                              {u.role === 'ADMIN' ? 'Admin' : u.role === 'PRINCIPAL' ? 'Kepsek' : u.role === 'TEACHER' ? 'Guru' : 'Ortu'}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            setIsLoginModalOpen(true);
                          }}
                          className="px-2 py-1 text-xs text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                        >
                          Halaman Login
                        </button>
                        <button
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            logout();
                          }}
                          className="px-2 py-1 text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Keluar</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  id="btn-open-login"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </button>
              )}
            </div>

            {/* Reset data */}
            <button
              id="btn-reset-data"
              onClick={() => {
                if (window.confirm('Reset data nilai dan siswa ke contoh awal?')) {
                  resetToDefaultData();
                }
              }}
              title="Reset ke Data Standar"
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* User Profile & Photo Edit Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </header>
  );
};
