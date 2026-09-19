import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserPlus,
  KeyRound,
  Edit3,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Check,
  X,
  Search,
  School,
  Settings,
  Printer,
  Copy,
  Users,
  GraduationCap,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Sliders,
  CheckCircle2,
  FileSpreadsheet,
  Phone,
  Mail,
  Globe,
  MapPin,
  Building2,
  Calendar,
  Download,
  Upload,
  Database,
  HardDrive,
  Save,
  CheckCheck,
  FileText,
  Camera
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AuthUser, UserRole, SchoolSettings } from '../../types';
import { ReportCardPreview } from '../ReportCard/ReportCardPreview';
import { StudentManagement } from '../TeacherDashboard/StudentManagement';
import { UserProfileModal } from '../Auth/UserProfileModal';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    currentUser,
    students,
    grades,
    reportApproval,
    updateUserCredentials,
    addNewUser,
    deleteUser,
    schoolSettings,
    updateSchoolSettings,
    resetToDefaultData,
    exportAllDataAsJSON,
    importDataFromJSON,
    triggerAudioChime
  } = useSchool();

  // Active Admin Tab
  const [activeAdminTab, setActiveAdminTab] = useState<'USERS' | 'SETTINGS' | 'STUDENTS' | 'BACKUP' | 'REPORT_PREVIEW'>('USERS');

  // Modal for changing user profile photo & details
  const [userForPhotoModal, setUserForPhotoModal] = useState<AuthUser | null>(null);

  // File input ref for restore
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backupRestoreMsg, setBackupRestoreMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [manualSaveSuccess, setManualSaveSuccess] = useState(false);

  // Search & Filter for Users
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');

  // Password visibility map { [userId]: boolean }
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Edit User Credentials Modal State
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('TEACHER');
  const [editNip, setEditNip] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editClass, setEditClass] = useState('');
  const [editFeedbackMsg, setEditFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Add User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState<Omit<AuthUser, 'id'>>({
    username: '',
    password: 'password123',
    name: '',
    role: 'TEACHER',
    nip: '',
    title: 'Guru Mata Pelajaran',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    assignedClass: 'VII - Merdeka'
  });
  const [addFeedbackMsg, setAddFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Delete User Confirm State
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<AuthUser | null>(null);

  // Reset Confirmation State
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Copy notification alert
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // School Settings form state
  const [settingsForm, setSettingsForm] = useState(schoolSettings);
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);

  useEffect(() => {
    setSettingsForm(schoolSettings);
  }, [schoolSettings]);

  // Toggle Password Visibility
  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Copy to clipboard
  const handleCopyCredentials = (user: AuthUser) => {
    const text = `Akses Login SIAKAD (${schoolSettings.schoolName})\nNama: ${user.name}\nRole: ${user.role}\nUsername: ${user.username}\nPassword: ${user.password || 'password123'}`;
    navigator.clipboard.writeText(text);
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Open Edit Modal
  const handleOpenEdit = (user: AuthUser) => {
    setEditingUser(user);
    setEditUsername(user.username);
    setEditPassword(user.password || 'password123');
    setEditName(user.name);
    setEditRole(user.role);
    setEditNip(user.nip || '');
    setEditTitle(user.title || '');
    setEditClass(user.assignedClass || '');
    setEditFeedbackMsg(null);
  };

  // Save Edit Credentials
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editUsername.trim()) {
      setEditFeedbackMsg({ type: 'error', text: 'Username tidak boleh kosong!' });
      return;
    }

    if (!editPassword.trim()) {
      setEditFeedbackMsg({ type: 'error', text: 'Kata sandi / Password tidak boleh kosong!' });
      return;
    }

    const res = updateUserCredentials(editingUser.id, {
      username: editUsername,
      password: editPassword,
      name: editName,
      role: editRole,
      nip: editNip,
      title: editTitle,
      assignedClass: editClass
    });

    if (res.success) {
      setEditFeedbackMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        setEditingUser(null);
        setEditFeedbackMsg(null);
      }, 1200);
    } else {
      setEditFeedbackMsg({ type: 'error', text: res.message });
    }
  };

  // Save New User
  const handleSaveNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.username.trim() || !newUserForm.name.trim() || !newUserForm.password?.trim()) {
      setAddFeedbackMsg({ type: 'error', text: 'Semua kolom bertanda bintang (*) wajib diisi.' });
      return;
    }

    const res = addNewUser(newUserForm);
    if (res.success) {
      setAddFeedbackMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        setIsAddUserModalOpen(false);
        setAddFeedbackMsg(null);
        setNewUserForm({
          username: '',
          password: 'password123',
          name: '',
          role: 'TEACHER',
          nip: '',
          title: 'Guru Mata Pelajaran',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          assignedClass: 'VII - Merdeka'
        });
      }, 1200);
    } else {
      setAddFeedbackMsg({ type: 'error', text: res.message });
    }
  };

  // Delete User
  const handleDeleteUser = () => {
    if (!deleteConfirmUser) return;
    deleteUser(deleteConfirmUser.id);
    setDeleteConfirmUser(null);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolSettings(settingsForm);
    setSettingsSavedNotice(true);
    triggerAudioChime();
    setTimeout(() => setSettingsSavedNotice(false), 3000);
  };

  // Force Save Snapshot to Local Storage
  const handleForceSaveSnapshot = () => {
    updateSchoolSettings(settingsForm);
    setManualSaveSuccess(true);
    triggerAudioChime();
    setTimeout(() => setManualSaveSuccess(false), 3000);
  };

  // Restore Backup File Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importDataFromJSON(content);
        if (result.success) {
          setBackupRestoreMsg({ type: 'success', text: result.message });
        } else {
          setBackupRestoreMsg({ type: 'error', text: result.message });
        }
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.nip && u.nip.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.title && u.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-purple-600" />
            Admin Sistem
          </span>
        );
      case 'PRINCIPAL':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-700" />
            Kepala Sekolah
          </span>
        );
      case 'TEACHER':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-indigo-600" />
            Guru / Wali Kelas
          </span>
        );
      case 'PARENT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <Users className="w-3 h-3 text-emerald-600" />
            Orang Tua
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Admin Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                Panel Administrator Utama (Super Admin)
              </span>
              <span className="text-xs text-slate-400">
                {schoolSettings.schoolName}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Manajemen Hak Akses & Kredensial Pengguna
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Administrator memiliki wewenang penuh untuk <strong>mengubah username, mengganti password, menambah akun guru/wali kelas/kepsek/orang tua</strong>, dan mengatur seluruh konfigurasi sistem e-Rapor.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Tambah Akun Baru</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">Total Akun Terdaftar</span>
            <strong className="text-lg font-mono font-bold text-white mt-0.5 block">{users.length} Akun</strong>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">Dewan Guru & Wali</span>
            <strong className="text-lg font-mono font-bold text-indigo-300 mt-0.5 block">
              {users.filter((u) => u.role === 'TEACHER').length} Akun
            </strong>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">Orang Tua / Wali</span>
            <strong className="text-lg font-mono font-bold text-emerald-300 mt-0.5 block">
              {users.filter((u) => u.role === 'PARENT').length} Akun
            </strong>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">Kepsek & Admin</span>
            <strong className="text-lg font-mono font-bold text-amber-300 mt-0.5 block">
              {users.filter((u) => u.role === 'PRINCIPAL' || u.role === 'ADMIN').length} Akun
            </strong>
          </div>
        </div>

        {/* Institutional Contact Strip */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              <Phone className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400">Telp/Hotline:</span>
              <strong className="text-white font-mono">{schoolSettings.phone}</strong>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400">Email:</span>
              <span className="text-slate-200">{schoolSettings.email}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400">Alamat:</span>
              <span className="text-slate-200">{schoolSettings.address}, {schoolSettings.city}</span>
            </span>
          </div>

          <button
            onClick={() => setActiveAdminTab('SETTINGS')}
            className="text-[11px] font-bold text-indigo-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Ubah No. Telepon & Profil Sekolah &rarr;</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveAdminTab('USERS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'USERS'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Kelola Akun & Kredensial ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('SETTINGS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'SETTINGS'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Konfigurasi Sekolah & No. Telepon</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('STUDENTS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'STUDENTS'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Master Data Siswa ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('BACKUP')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'BACKUP'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Simpan Cadangan & Pulihkan Data</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('REPORT_PREVIEW')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'REPORT_PREVIEW'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Cetak & Pratinjau Rapor Resmi</span>
        </button>
      </div>

      {/* TAB 1: USERS CREDENTIALS MANAGEMENT */}
      {activeAdminTab === 'USERS' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Daftar Akun Pengguna & Kredensial Login
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ubah username, reset kata sandi, dan perbarui hak akses pengguna sistem e-Rapor secara instan.
              </p>
            </div>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Buat Akun Baru</span>
            </button>
          </div>

          {/* Search and Filter bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, username, NIP, atau gelar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              />
            </div>

            {/* Filter Role Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto w-full sm:w-auto">
              <button
                onClick={() => setRoleFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  roleFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({users.length})
              </button>
              <button
                onClick={() => setRoleFilter('ADMIN')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  roleFilter === 'ADMIN'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => setRoleFilter('PRINCIPAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  roleFilter === 'PRINCIPAL'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kepsek
              </button>
              <button
                onClick={() => setRoleFilter('TEACHER')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  roleFilter === 'TEACHER'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Guru
              </button>
              <button
                onClick={() => setRoleFilter('PARENT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  roleFilter === 'PARENT'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Orang Tua
              </button>
            </div>
          </div>

          {/* User Account Cards List */}
          <div className="grid grid-cols-1 gap-3.5">
            {filteredUsers.map((user) => {
              const isPasswordVisible = !!visiblePasswords[user.id];
              const isCurrent = currentUser?.id === user.id;

              return (
                <div
                  key={user.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'border-indigo-300 bg-indigo-50/30 ring-2 ring-indigo-100'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* User Identity */}
                    <div className="flex items-start gap-3.5">
                      <div className="relative group/avatar shrink-0">
                        <button
                          type="button"
                          onClick={() => setUserForPhotoModal(user)}
                          className="relative block rounded-2xl overflow-hidden border border-slate-200 shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          title="Klik untuk Mengubah Foto Profil Pengguna Ini"
                        >
                          <img
                            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                            alt={user.name}
                            className="w-12 h-12 rounded-2xl object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Camera className="w-4 h-4" />
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setUserForPhotoModal(user)}
                          className="absolute -bottom-1 -right-1 p-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xs cursor-pointer"
                          title="Ubah Foto Profil"
                        >
                          <Camera className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 text-sm">{user.name}</h3>
                          {getRoleBadge(user.role)}
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white">
                              Akun Anda Saat Ini
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-xs text-slate-500">
                          <span>{user.title}</span>
                          {user.nip && <span>• NIP: <strong className="font-mono text-slate-700">{user.nip}</strong></span>}
                          {user.assignedClass && (
                            <span className="text-indigo-700 font-medium bg-indigo-50 px-2 py-0.2 rounded border border-indigo-100">
                              {user.assignedClass}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Credentials Display & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                      {/* Username Pill */}
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                          Username
                        </span>
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{user.username}</span>
                        </div>
                      </div>

                      {/* Password Pill */}
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                          Password
                        </span>
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{isPasswordVisible ? user.password || 'password123' : '••••••••'}</span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(user.id)}
                            className="text-slate-400 hover:text-slate-700 p-0.5 ml-1 cursor-pointer"
                            title={isPasswordVisible ? 'Sembunyikan' : 'Lihat Password'}
                          >
                            {isPasswordVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 pt-1 sm:pt-0 sm:border-l sm:border-slate-200 sm:pl-3">
                        <button
                          onClick={() => setUserForPhotoModal(user)}
                          className="p-2 bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 hover:border-indigo-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Ubah Foto Profil & Data Diri Pengguna Ini"
                        >
                          <Camera className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="hidden sm:inline">Foto</span>
                        </button>

                        <button
                          onClick={() => handleCopyCredentials(user)}
                          className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Salin Data Login untuk Diberikan ke Pengguna"
                        >
                          {copiedId === user.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          <span className="hidden sm:inline">{copiedId === user.id ? 'Tersalin!' : 'Salin'}</span>
                        </button>

                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          title="Ubah Username & Kata Sandi"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Ubah Akses</span>
                        </button>

                        {!isCurrent && (
                          <button
                            onClick={() => setDeleteConfirmUser(user)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                            title="Hapus Akun Pengguna"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SCHOOL SETTINGS */}
      {activeAdminTab === 'SETTINGS' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <School className="w-5 h-5 text-indigo-600" />
                Pengaturan Lembaga, Nomor Telepon & e-Rapor
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ubah identitas sekolah, nomor telepon hotline resmi, kepala sekolah, wali kelas, serta titimangsa penerbitan rapor.
              </p>
            </div>
            {settingsSavedNotice && (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-fade-in shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Pengaturan Berhasil Disimpan!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
            {/* SECTION 1: IDENTITAS & KONTAK RESMI SEKOLAH */}
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>1. Identitas & Kontak Resmi Lembaga</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Resmi Sekolah</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.schoolName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, schoolName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">NPSN (Nomor Pokok Sekolah Nasional)</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.npsn}
                    onChange={(e) => setSettingsForm({ ...settingsForm, npsn: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                {/* NOMOR TELEPON RESMI SEKOLAH */}
                <div className="sm:col-span-2 bg-indigo-50/80 p-3.5 rounded-xl border border-indigo-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
                      <Phone className="w-4 h-4 text-indigo-600" />
                      Nomor Telepon / Hotline Resmi Sekolah
                    </label>
                    <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                      Tercetak di Kop Surat & Rapor
                    </span>
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      id="input-school-phone"
                      placeholder="Contoh: 0813-3921-8842 atau (0383) 21001"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full bg-white border border-indigo-300 rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
                    />
                  </div>
                  <p className="text-[11px] text-indigo-800 mt-1.5">
                    Nomor telepon ini otomatis dimuat pada Kop Surat Rapor Resmi, header dokumen, lembar cetak PDF, dan kontak sekolah untuk orang tua siswa.
                  </p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Resmi Sekolah</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Website Resmi Sekolah</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={settingsForm.website}
                      onChange={(e) => setSettingsForm({ ...settingsForm, website: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Alamat Jalan / Desa</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kecamatan</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.subdistrict}
                    onChange={(e) => setSettingsForm({ ...settingsForm, subdistrict: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kabupaten / Kota & Provinsi</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Kabupaten"
                      value={settingsForm.city}
                      onChange={(e) => setSettingsForm({ ...settingsForm, city: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Provinsi"
                      value={settingsForm.province}
                      onChange={(e) => setSettingsForm({ ...settingsForm, province: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: PEJABAT PENANDATANGAN */}
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>2. Pejabat Penandatangan Rapor</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Kepala Sekolah (Lengkap Gelar)</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.headmasterName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, headmasterName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIP Kepala Sekolah</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.headmasterNip}
                    onChange={(e) => setSettingsForm({ ...settingsForm, headmasterNip: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Wali Kelas Utama</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.homeroomTeacherName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, homeroomTeacherName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIP Wali Kelas</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.homeroomTeacherNip}
                    onChange={(e) => setSettingsForm({ ...settingsForm, homeroomTeacherNip: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: TAHUN AJARAN & TITIMANGSA */}
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>3. Tahun Ajaran & Titimangsa Penerbitan</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tahun Ajaran Aktif</label>
                  <input
                    type="text"
                    required
                    placeholder="2024/2025"
                    value={settingsForm.currentAcademicYear}
                    onChange={(e) => setSettingsForm({ ...settingsForm, currentAcademicYear: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Semester Aktif</label>
                  <select
                    value={settingsForm.currentSemester}
                    onChange={(e) => setSettingsForm({ ...settingsForm, currentSemester: e.target.value as '1' | '2' })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  >
                    <option value="1">Semester 1 (Ganjil)</option>
                    <option value="2">Semester 2 (Genap)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Titimangsa (Tempat & Tanggal)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ile Kimok, 20 Desember 2024"
                    value={settingsForm.reportPlaceDate}
                    onChange={(e) => setSettingsForm({ ...settingsForm, reportPlaceDate: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Data Pabrik (Default Demo)</span>
              </button>

              <button
                type="submit"
                id="btn-save-school-settings"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold rounded-xl flex items-center gap-2 shadow-md shadow-indigo-200 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Perubahan Pengaturan & Nomor Telepon</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: MASTER DATA SISWA */}
      {activeAdminTab === 'STUDENTS' && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-indigo-950 block font-bold text-sm">
                  Kelola Data Induk & Biodata Siswa (Master Siswa)
                </strong>
                <span className="text-indigo-700 text-xs">
                  Sebagai Administrator, Anda dapat menambah siswa baru, mengubah biodata lengkap, memperbarui nomor kontak orang tua, dan mengelola kehadiran.
                </span>
              </div>
            </div>
            <span className="px-3 py-1.5 bg-white text-indigo-800 border border-indigo-200 font-bold rounded-xl text-xs shrink-0 flex items-center gap-1.5 self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Total {students.length} Siswa Terdaftar
            </span>
          </div>

          <StudentManagement />
        </div>
      )}

      {/* TAB 4: CADANGKAN & PULIHKAN DATA (BACKUP / RESTORE) */}
      {activeAdminTab === 'BACKUP' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                Pusat Penyimpanan, Cadangan & Pemulihan Data Sekolah
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pastikan data nilai, siswa, kredensial pengguna, dan pengaturan sekolah selalu tersimpan dengan aman dan dapat dicadangkan secara berkala.
              </p>
            </div>

            {manualSaveSuccess && (
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-fade-in shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Seluruh Data Berhasil Disimpan!
              </span>
            )}
          </div>

          {backupRestoreMsg && (
            <div
              className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 animate-fade-in ${
                backupRestoreMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {backupRestoreMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{backupRestoreMsg.text}</span>
              </div>
              <button
                onClick={() => setBackupRestoreMsg(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Grid Cards for Backup, Restore & Sync */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Persistent Storage Status */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <HardDrive className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Penyimpanan Lokal Browser</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Semua perubahan data (nilai, akun pengguna, profil lembaga, dan nomor telepon) otomatis tersimpan di penyimpanan lokal peramban ini.
                </p>

                <div className="pt-2 space-y-1.5 text-[11px] text-slate-600 font-medium">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span>Status Penyimpanan:</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Aktif & Tersinkron
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span>Total Siswa:</span>
                    <strong className="text-slate-900">{students.length} Orang</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span>Total Akun Pengguna:</span>
                    <strong className="text-slate-900">{users.length} Akun</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Total Nilai Tercatat:</span>
                    <strong className="text-slate-900">{grades.length} Rekor</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleForceSaveSnapshot}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Snapshot Data Sekarang</span>
              </button>
            </div>

            {/* Card 2: Export JSON Backup */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Unduh File Cadangan (.JSON)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unduh seluruh database sekolah (profil sekolah, akun guru/orang tua, data siswa, dan lembar nilai) ke dalam berkas arsip JSON yang aman.
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600">
                  <p className="font-semibold text-slate-800 mb-1">Direkomendasikan untuk:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                    <li>Arsip semesteran / tahunan</li>
                    <li>Pindah perangkat komputer operator</li>
                    <li>Pencadangan rutin flashdisk sekolah</li>
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={exportAllDataAsJSON}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-indigo-200 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Cadangan Lengkap (.JSON)</span>
              </button>
            </div>

            {/* Card 3: Restore Backup */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Pulihkan Data dari Berkas</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unggah berkas cadangan JSON yang telah diunduh sebelumnya untuk mengembalikan seluruh kondisi sistem dan basis data e-Rapor.
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json,application/json"
                  className="hidden"
                />

                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-800">
                  <span className="font-bold block mb-0.5">⚠️ Perhatian:</span>
                  Pemulihan berkas akan memperbarui data yang ada saat ini dengan data yang termuat dalam file cadangan.
                </div>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Pilih Berkas & Pulihkan Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REPORT CARD PREVIEW */}
      {activeAdminTab === 'REPORT_PREVIEW' && (
        <div className="space-y-4">
          <ReportCardPreview />
        </div>
      )}

      {/* MODAL 1: EDIT CREDENTIALS (USERNAME & PASSWORD) */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Ubah Kredensial & Hak Akses
                  </h3>
                  <p className="text-xs text-slate-500">
                    Akun: {editingUser.name} ({editingUser.role})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editFeedbackMsg && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                  editFeedbackMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {editFeedbackMsg.type === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{editFeedbackMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Username Login *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    placeholder="Contoh: siti.rahmawati"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold text-indigo-950 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Digunakan untuk masuk ke dalam aplikasi. Hindari penggunaan spasi.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Kata Sandi / Password Baru *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Masukkan password baru..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role / Peran Sistem</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold focus:bg-white"
                  >
                    <option value="TEACHER">Guru / Wali Kelas</option>
                    <option value="PRINCIPAL">Kepala Sekolah</option>
                    <option value="PARENT">Orang Tua / Wali Murid</option>
                    <option value="ADMIN">Administrator Sistem</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIP (Opsional)</label>
                  <input
                    type="text"
                    value={editNip}
                    onChange={(e) => setEditNip(e.target.value)}
                    placeholder="Contoh: 19840214 200801 2 009"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-mono focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jabatan / Judul</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Contoh: Guru Matematika"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 shadow-md shadow-indigo-200 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan Kredensial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TAMBAH USER BARU */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Tambah Akun Pengguna Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Daftarkan akun untuk Guru, Kepala Sekolah, Orang Tua, atau Admin
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addFeedbackMsg && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                  addFeedbackMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {addFeedbackMsg.type === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{addFeedbackMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveNewUser} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bpk. Yohanes Paulus, S.Pd."
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role / Peran *</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => {
                      const role = e.target.value as UserRole;
                      setNewUserForm({
                        ...newUserForm,
                        role,
                        title:
                          role === 'TEACHER'
                            ? 'Guru Mata Pelajaran'
                            : role === 'PRINCIPAL'
                            ? 'Kepala Sekolah'
                            : role === 'PARENT'
                            ? 'Orang Tua / Wali Murid'
                            : 'Admin Sistem'
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold focus:bg-white"
                  >
                    <option value="TEACHER">Guru / Wali Kelas</option>
                    <option value="PRINCIPAL">Kepala Sekolah</option>
                    <option value="PARENT">Orang Tua / Wali Murid</option>
                    <option value="ADMIN">Administrator Sistem</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Username Login *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: yohanes.paulus"
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-mono font-bold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Password Awal *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: guru123"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-mono font-bold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIP (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 19910512 201801 1 002"
                    value={newUserForm.nip}
                    onChange={(e) => setNewUserForm({ ...newUserForm, nip: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-mono focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jabatan / Deskripsi</label>
                  <input
                    type="text"
                    value={newUserForm.title}
                    onChange={(e) => setNewUserForm({ ...newUserForm, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 shadow-md shadow-indigo-200 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftarkan Akun Baru</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE USER CONFIRM */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base text-rose-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Konfirmasi Hapus Akun Pengguna
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus akun <strong>{deleteConfirmUser.name}</strong> (Username: <code>{deleteConfirmUser.username}</code>)? Pengguna tidak akan dapat login lagi menggunakan akun ini.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-rose-200 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Akun</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: FACTORY RESET CONFIRM */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base text-rose-600 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Reset ke Data Default Pabrik
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Tindakan ini akan mengembalikan seluruh akun, nilai, presensi, dan pengaturan sekolah ke kondisi awal demo resmi.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-rose-200 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL 5: USER PROFILE & PHOTO MODAL */}
      <UserProfileModal
        isOpen={!!userForPhotoModal}
        onClose={() => setUserForPhotoModal(null)}
        targetUser={userForPhotoModal || undefined}
      />
    </div>
  );
};
