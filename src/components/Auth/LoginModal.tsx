import React, { useState } from 'react';
import {
  User,
  School,
  Lock,
  X,
  LogIn,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen && !asPage) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Find any user matching username, nip, or studentId
    const matched = users.find(
      (u) =>
        u.username.toLowerCase() === cleanUser ||
        (u.nip && u.nip.toLowerCase().includes(cleanUser)) ||
        (u.studentId && u.studentId.toLowerCase() === cleanUser)
    );

    if (matched) {
      if (matched.password && matched.password !== cleanPass) {
        setErrorMessage('Kata sandi (password) yang Anda masukkan salah. Silakan coba lagi.');
        setIsLoading(false);
        return;
      }

      login(matched);
      setIsLoading(false);
      if (onClose) onClose();
    } else {
      setErrorMessage('Akun dengan username / NIP / NIS tersebut tidak ditemukan.');
      setIsLoading(false);
    }
  };

  const containerClasses = asPage
    ? 'min-h-[80vh] flex items-center justify-center p-4'
    : 'fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto';

  return (
    <div className={containerClasses}>
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative overflow-hidden animate-fade-in my-auto">
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
              Sistem e-Rapor & SIAKAD
            </h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {schoolSettings.schoolName}
            </p>
          </div>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Silakan masukkan username dan kata sandi Anda untuk mengakses sistem.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Single Unified Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username / NIP / NIS
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Masukkan username atau NIP/NIS"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            id="btn-submit-unified-login"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Aplikasi'}</span>
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-100">
          <p className="text-[11px] text-slate-400">
            Sistem otomatis mendeteksi peran (Admin, Guru, Kepala Sekolah, atau Orang Tua) setelah login.
          </p>
        </div>
      </div>
    </div>
  );
};
