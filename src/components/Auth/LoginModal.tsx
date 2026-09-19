import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  ShieldAlert,
  Users,
  KeyRound,
  User,
  ArrowRight,
  School,
  Lock,
  Sparkles,
  CheckCircle2,
  X,
  LogIn,
  BadgeCheck,
  AlertCircle
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AuthUser, UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  asPage?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  asPage = false
}) => {
  const { login, schoolSettings, users } = useSchool();
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>('TEACHER');

  // Teacher inputs
  const [teacherIdentifier, setTeacherIdentifier] = useState('siti.rahmawati');
  const [teacherPassword, setTeacherPassword] = useState('guru123');

  // Principal inputs
  const [principalIdentifier, setPrincipalIdentifier] = useState('kepsek');
  const [principalPassword, setPrincipalPassword] = useState('kepsek2024');

  // Parent inputs
  const [parentIdentifier, setParentIdentifier] = useState('ortu.arya');
  const [parentPassword, setParentPassword] = useState('ortu123');

  // Admin inputs
  const [adminIdentifier, setAdminIdentifier] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');

  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen && !asPage) return null;

  const handleAuthSubmit = (
    e: React.FormEvent,
    role: UserRole,
    identifier: string,
    password?: string
  ) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPass = password?.trim();

    // Match by username or nip or studentId
    const matched = users.find(
      (u) =>
        u.role === role &&
        (u.username.toLowerCase() === cleanIdentifier ||
          (u.nip && u.nip.toLowerCase().includes(cleanIdentifier)) ||
          (u.studentId && u.studentId.toLowerCase() === cleanIdentifier))
    );

    if (matched) {
      // Check password if set
      if (cleanPass && matched.password && matched.password !== cleanPass) {
        setErrorMessage('Kata sandi / password yang Anda masukkan salah. Silakan periksa kembali.');
        return;
      }

      login(matched);
      if (onClose) onClose();
    } else {
      // Fallback default role user if exists
      const fallback = users.find((u) => u.role === role);
      if (fallback) {
        login(fallback);
        if (onClose) onClose();
      } else {
        setErrorMessage(`Akun dengan username atau NIP "${identifier}" tidak ditemukan.`);
      }
    }
  };

  const handleQuickLogin = (user: AuthUser) => {
    login(user);
    if (onClose) onClose();
  };

  const containerClasses = asPage
    ? 'min-h-[80vh] flex items-center justify-center p-4'
    : 'fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto';

  return (
    <div className={containerClasses}>
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative overflow-hidden animate-fade-in my-auto">
        {/* Decorative background accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-100 to-transparent rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />

        {/* Close button if modal */}
        {!asPage && onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <School className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              SIAKAD & e-Rapor Cloud
            </h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {schoolSettings.schoolName}
            </p>
          </div>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Masuk dengan username dan kata sandi yang telah didaftarkan oleh Administrator Sekolah.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            id="login-tab-teacher"
            onClick={() => {
              setSelectedRoleTab('TEACHER');
              setErrorMessage('');
            }}
            className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRoleTab === 'TEACHER'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] leading-tight">Guru / Wali</span>
          </button>

          <button
            type="button"
            id="login-tab-principal"
            onClick={() => {
              setSelectedRoleTab('PRINCIPAL');
              setErrorMessage('');
            }}
            className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRoleTab === 'PRINCIPAL'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] leading-tight">Kepsek</span>
          </button>

          <button
            type="button"
            id="login-tab-parent"
            onClick={() => {
              setSelectedRoleTab('PARENT');
              setErrorMessage('');
            }}
            className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRoleTab === 'PARENT'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] leading-tight">Orang Tua</span>
          </button>

          <button
            type="button"
            id="login-tab-admin"
            onClick={() => {
              setSelectedRoleTab('ADMIN');
              setErrorMessage('');
            }}
            className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRoleTab === 'ADMIN'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] leading-tight">Admin</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. TEACHER FORM */}
        {selectedRoleTab === 'TEACHER' && (
          <form
            onSubmit={(e) => handleAuthSubmit(e, 'TEACHER', teacherIdentifier, teacherPassword)}
            className="space-y-4"
          >
            <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
              <BadgeCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                <strong>Akses Guru:</strong> Input nilai formatif & sumatif, absensi, generator capaian AI, dan kirim notifikasi WhatsApp ke orang tua.
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username / NIP Guru
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: siti.rahmawati atau NIP"
                    value={teacherIdentifier}
                    onChange={(e) => setTeacherIdentifier(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              id="btn-submit-teacher-login"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk sebagai Guru / Wali Kelas</span>
            </button>
          </form>
        )}

        {/* 2. PRINCIPAL FORM */}
        {selectedRoleTab === 'PRINCIPAL' && (
          <form
            onSubmit={(e) => handleAuthSubmit(e, 'PRINCIPAL', principalIdentifier, principalPassword)}
            className="space-y-4"
          >
            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Akses Kepala Sekolah:</strong> Supervisi nilai seluruh kelas, monitoring kelengkapan nilai guru, pengesahan & tanda tangan digital e-Rapor.
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username / NIP Kepala Sekolah
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={principalIdentifier}
                    placeholder="Contoh: kepsek atau NIP"
                    onChange={(e) => setPrincipalIdentifier(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={principalPassword}
                    placeholder="••••••••"
                    onChange={(e) => setPrincipalPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              id="btn-submit-principal-login"
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-indigo-700 hover:from-amber-700 hover:to-indigo-800 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Masuk sebagai Kepala Sekolah</span>
            </button>
          </form>
        )}

        {/* 3. PARENT FORM */}
        {selectedRoleTab === 'PARENT' && (
          <form
            onSubmit={(e) => handleAuthSubmit(e, 'PARENT', parentIdentifier, parentPassword)}
            className="space-y-4"
          >
            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900">
              <Users className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Akses Orang Tua:</strong> Pantau capaian nilai real-time anak, grafik ketuntasan, presensi, catatan wali kelas, dan e-Rapor resmi.
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username Akun Orang Tua / NIS Siswa
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={parentIdentifier}
                    placeholder="Contoh: ortu.arya atau 240101"
                    onChange={(e) => setParentIdentifier(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={parentPassword}
                    placeholder="••••••••"
                    onChange={(e) => setParentPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              id="btn-submit-parent-login"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Portal Orang Tua</span>
            </button>
          </form>
        )}

        {/* 4. ADMIN FORM */}
        {selectedRoleTab === 'ADMIN' && (
          <form
            onSubmit={(e) => handleAuthSubmit(e, 'ADMIN', adminIdentifier, adminPassword)}
            className="space-y-4"
          >
            <div className="bg-purple-50/80 p-3 rounded-xl border border-purple-200 flex items-start gap-2.5 text-xs text-purple-900">
              <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>
                <strong>Akses Administrator:</strong> Pengelolaan hak akses, pengubahan username & password seluruh pengguna, pendaftaran akun baru, serta pengaturan lembaga.
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username Admin
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={adminIdentifier}
                    placeholder="Contoh: admin"
                    onChange={(e) => setAdminIdentifier(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi Admin (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    placeholder="••••••••"
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              id="btn-submit-admin-login"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Masuk sebagai Administrator</span>
            </button>
          </form>
        )}

        {/* Quick Demo 1-Click Login Section */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Akses Cepat Pengguna (Akun Terdaftar):
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {users.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleQuickLogin(user)}
                className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-all cursor-pointer group"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 font-bold text-xs ${
                    user.role === 'ADMIN'
                      ? 'bg-purple-600'
                      : user.role === 'PRINCIPAL'
                      ? 'bg-amber-600'
                      : user.role === 'TEACHER'
                      ? 'bg-indigo-600'
                      : 'bg-emerald-600'
                  }`}
                >
                  {user.role === 'ADMIN' ? (
                    <ShieldAlert className="w-4 h-4" />
                  ) : user.role === 'PRINCIPAL' ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : user.role === 'TEACHER' ? (
                    <GraduationCap className="w-4 h-4" />
                  ) : (
                    <Users className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-700">
                    {user.name.split(',')[0]}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    user: {user.username} • {user.role === 'ADMIN' ? 'Admin' : user.role === 'PRINCIPAL' ? 'Kepsek' : user.role === 'TEACHER' ? 'Guru' : 'Ortu'}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
