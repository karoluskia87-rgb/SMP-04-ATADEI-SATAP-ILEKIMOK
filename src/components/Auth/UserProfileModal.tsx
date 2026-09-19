import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  User,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Trash2,
  ShieldCheck,
  KeyRound,
  Image as ImageIcon
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AuthUser } from '../../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser?: AuthUser; // If provided (e.g. by Admin editing another user), otherwise currentUser
}

const PRESET_AVATARS = [
  {
    id: 'avatar-1',
    label: 'Guru Wanita (Hijab Formal)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'avatar-2',
    label: 'Guru Pria (Formal Kacamata)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'avatar-3',
    label: 'Kepala Sekolah (Batik/Formal)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'avatar-4',
    label: 'Admin / IT Sekolah',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'avatar-5',
    label: 'Ibu Wali Murid',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'avatar-6',
    label: 'Bapak Wali Murid',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'avatar-7',
    label: 'Guru Muda Kreatif',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'avatar-8',
    label: 'Staf Administrasi',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80'
  }
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  targetUser
}) => {
  const { currentUser, updateUserProfile, triggerAudioChime } = useSchool();
  const activeUser = targetUser || currentUser;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewAvatar, setPreviewAvatar] = useState<string>('');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [title, setTitle] = useState<string>('');

  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (activeUser && isOpen) {
      setPreviewAvatar(activeUser.avatar || '');
      setCustomUrlInput(activeUser.avatar?.startsWith('data:') ? '' : activeUser.avatar || '');
      setName(activeUser.name || '');
      setEmail(activeUser.email || '');
      setPhone(activeUser.phone || '');
      setTitle(activeUser.title || '');
      setFeedback(null);
    }
  }, [activeUser, isOpen]);

  if (!isOpen || !activeUser) return null;

  // Process file upload from computer/phone with canvas compression to ~250px
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', text: 'Format berkas harus berupa gambar (JPG, PNG, WEBP).' });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize down to max 256x256 for optimal localStorage storage
        const canvas = document.createElement('canvas');
        const maxSize = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPreviewAvatar(compressedDataUrl);
          setCustomUrlInput('');
          setFeedback({
            type: 'success',
            text: 'Foto profil baru berhasil dimuat! Klik "Simpan Foto & Data Diri" di bawah untuk menerapkan.'
          });
        }
        setIsUploading(false);
      };
      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      setIsUploading(false);
      setFeedback({ type: 'error', text: 'Gagal membaca berkas gambar dari perangkat.' });
    };

    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) {
      setFeedback({ type: 'error', text: 'Silakan masukkan URL tautan gambar yang valid.' });
      return;
    }
    setPreviewAvatar(customUrlInput.trim());
    setFeedback({
      type: 'success',
      text: 'Tautan foto profil berhasil dipilih! Klik simpan di bawah.'
    });
  };

  const handleSelectPreset = (url: string) => {
    setPreviewAvatar(url);
    setCustomUrlInput(url);
    setFeedback({
      type: 'success',
      text: 'Pilihan avatar dipilih! Jangan lupa klik "Simpan Foto & Data Diri".'
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const result = updateUserProfile(activeUser.id, {
      avatar: previewAvatar,
      name,
      email,
      phone,
      title
    });

    if (result.success) {
      setFeedback({ type: 'success', text: result.message });
      triggerAudioChime();
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setFeedback({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-fade-in my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-700 via-indigo-800 to-blue-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Camera className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Pengaturan Foto Profil & Data Diri</h3>
              <p className="text-xs text-indigo-200">
                Ubah foto profil avatar dan informasi akun {activeUser.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mx-6 mt-4 p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 animate-fade-in ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="font-medium">{feedback.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Main Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-200">
            {/* Live Avatar Preview */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-indigo-100 flex items-center justify-center">
                {previewAvatar ? (
                  <img
                    src={previewAvatar}
                    alt={name || activeUser.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => {
                      setFeedback({
                        type: 'error',
                        text: 'Tautan gambar tidak dapat dimuat. Pastikan URL benar atau gunakan unggah foto.'
                      });
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-600 text-white font-bold text-3xl">
                    {name ? name.charAt(0) : activeUser.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Upload trigger overlay button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-md transition-all cursor-pointer group-hover:scale-110 flex items-center justify-center"
                title="Unggah Foto dari Komputer/HP"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Avatar controls & options */}
            <div className="space-y-3 flex-1 text-center sm:text-left w-full">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 text-base">{name || activeUser.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                    {activeUser.role === 'ADMIN'
                      ? 'Administrator'
                      : activeUser.role === 'PRINCIPAL'
                      ? 'Kepala Sekolah'
                      : activeUser.role === 'TEACHER'
                      ? 'Guru / Wali Kelas'
                      : 'Orang Tua Siswa'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{title || activeUser.title}</p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Memproses...' : 'Unggah Foto dari HP / Komputer'}</span>
                </button>

                {previewAvatar && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewAvatar('');
                      setCustomUrlInput('');
                    }}
                    className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Gunakan Huruf Awal (Inisial)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Foto</span>
                  </button>
                )}
              </div>

              <p className="text-[11px] text-slate-400">
                Mendukung format JPG, PNG, WEBP. Foto otomatis disesuaikan secara simetris dan aman disimpan di peramban.
              </p>
            </div>
          </div>

          {/* Quick Preset Avatars Gallery */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Pilih Cepat dari Galeri Avatar Edukasi:</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {PRESET_AVATARS.map((preset) => {
                const isSelected = previewAvatar === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer aspect-square ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-300 scale-105 shadow-md'
                        : 'border-slate-200 hover:border-indigo-300 hover:scale-102 opacity-85 hover:opacity-100'
                    }`}
                    title={preset.label}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-indigo-900/30 flex items-center justify-center rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-white drop-shadow-md" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Or Paste Direct Image URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Atau Tempel URL / Tautan Gambar Langsung:</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="https://example.com/foto-profil-saya.jpg"
                className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-700 bg-white"
              />
              <button
                type="button"
                onClick={handleApplyCustomUrl}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Terapkan URL
              </button>
            </div>
          </div>

          {/* Form Personal Info */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Informasi Pengguna
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Nama Lengkap & Gelar:
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    placeholder="Nama Lengkap"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Jabatan / Deskripsi Peran:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  placeholder="Contoh: Guru Matematika / Orang Tua"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  No. Telepon / WhatsApp:
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    placeholder="Contoh: 0812-3456-7890"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Alamat Email:
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    placeholder="nama@sekolah.sch.id"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-xl shadow-md shadow-indigo-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Foto & Data Diri</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
