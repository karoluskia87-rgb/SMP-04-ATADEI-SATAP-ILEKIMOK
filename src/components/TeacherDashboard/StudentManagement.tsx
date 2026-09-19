import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Edit3,
  CalendarCheck,
  Award,
  Phone,
  MessageSquare,
  Check,
  Trash2,
  BookOpen,
  Plus,
  X,
  Sparkles,
  MapPin,
  Mail,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Student, AssessmentType, GradeRecord } from '../../types';

export const StudentManagement: React.FC = () => {
  const {
    students,
    subjects,
    grades,
    schoolSettings,
    updateStudentAttendance,
    updateStudentNotes,
    updateStudentProfile,
    addNewStudent,
    deleteStudent,
    addOrUpdateGrade,
    deleteGradeRecord,
    sendCustomNotification,
    setSelectedStudentId,
    setActiveRole
  } = useSchool();

  // Modal States
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [editingProfileStudent, setEditingProfileStudent] = useState<Student | null>(null);
  const [studentGradesModal, setStudentGradesModal] = useState<Student | null>(null);
  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState<Student | null>(null);
  const [messageModalStudent, setMessageModalStudent] = useState<Student | null>(null);

  // Quick inline edit for attendance & notes
  const [editingInlineId, setEditingInlineId] = useState<string | null>(null);
  const [attendanceDraft, setAttendanceDraft] = useState<{ sakit: number; izin: number; alpha: number }>({
    sakit: 0,
    izin: 0,
    alpha: 0
  });
  const [notesDraft, setNotesDraft] = useState('');

  // New Student Form State
  const [newStudentForm, setNewStudentForm] = useState<Omit<Student, 'id'>>({
    nis: '',
    nisn: '',
    name: '',
    gender: 'L',
    classId: 'cls-1',
    className: schoolSettings.currentClass || 'VII - Merdeka',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: 'Desa Ile Kimok, Kec. Atadei, Kab. Lembata',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    attendance: { sakit: 0, izin: 0, alpha: 0 },
    extracurriculars: [{ name: 'Pramuka Penggalang', predicate: 'Sangat Baik', description: 'Aktif mengikuti kegiatan rutin kepramukaan.' }],
    notesWaliKelas: 'Menunjukkan motivasi belajar yang baik dan berpartisipasi aktif dalam kegiatan kelas.'
  });

  // Edit Profile Form State
  const [editProfileForm, setEditProfileForm] = useState<Partial<Student>>({});

  // Direct Grade Input within Student Modal
  const [gradeInputSubjectId, setGradeInputSubjectId] = useState(subjects[0]?.id || '');
  const [gradeInputTitle, setGradeInputTitle] = useState('Tugas Harian 1');
  const [gradeInputType, setGradeInputType] = useState<AssessmentType>('TUGAS');
  const [gradeInputScore, setGradeInputScore] = useState<number>(85);
  const [gradeInputFeedback, setGradeInputFeedback] = useState('');
  const [editingGradeRecord, setEditingGradeRecord] = useState<GradeRecord | null>(null);

  // Custom WA modal state
  const [customMsgTitle, setCustomMsgTitle] = useState('Pemberitahuan Wali Kelas: e-Rapor & Akademik');
  const [customMsgBody, setCustomMsgBody] = useState('');

  // Helpers for inline edit
  const startInlineEdit = (student: Student) => {
    setEditingInlineId(student.id);
    setAttendanceDraft(student.attendance);
    setNotesDraft(student.notesWaliKelas || '');
  };

  const saveInlineEdit = (studentId: string) => {
    updateStudentAttendance(studentId, attendanceDraft);
    updateStudentNotes(studentId, notesDraft);
    setEditingInlineId(null);
  };

  // Open Full Profile Edit Modal
  const handleOpenEditProfile = (student: Student) => {
    setEditingProfileStudent(student);
    setEditProfileForm({ ...student });
  };

  const handleSaveProfileEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfileStudent) return;
    updateStudentProfile(editingProfileStudent.id, editProfileForm);
    setEditingProfileStudent(null);
  };

  // Open Add Student Modal
  const handleOpenAddStudent = () => {
    setNewStudentForm({
      nis: `2024${Math.floor(100 + Math.random() * 900)}`,
      nisn: `008${Math.floor(1000000 + Math.random() * 9000000)}`,
      name: '',
      gender: 'L',
      classId: 'cls-1',
      className: schoolSettings.currentClass || 'VII - Merdeka',
      parentName: '',
      parentPhone: '08',
      parentEmail: '',
      address: 'Desa Ile Kimok, Kec. Atadei, Kab. Lembata',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      attendance: { sakit: 0, izin: 0, alpha: 0 },
      extracurriculars: [{ name: 'Pramuka Penggalang', predicate: 'Baik', description: 'Mengikuti latihan rutin pramuka.' }],
      notesWaliKelas: 'Menunjukkan kemajuan belajar yang positif pada semester ini.'
    });
    setIsAddStudentModalOpen(true);
  };

  const handleSaveNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.name.trim() || !newStudentForm.parentName.trim()) return;

    addNewStudent(newStudentForm);
    setIsAddStudentModalOpen(false);
  };

  const handleDeleteStudent = () => {
    if (!deleteConfirmStudent) return;
    deleteStudent(deleteConfirmStudent.id);
    setDeleteConfirmStudent(null);
    if (studentGradesModal?.id === deleteConfirmStudent.id) {
      setStudentGradesModal(null);
    }
  };

  // Open Grade Management for specific student
  const handleOpenStudentGrades = (student: Student) => {
    setStudentGradesModal(student);
    setGradeInputSubjectId(subjects[0]?.id || '');
    setGradeInputTitle('Tugas 1: Pemahaman Konsep');
    setGradeInputType('TUGAS');
    setGradeInputScore(85);
    setGradeInputFeedback('');
    setEditingGradeRecord(null);
  };

  const handleSaveStudentSingleGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentGradesModal) return;

    if (editingGradeRecord) {
      addOrUpdateGrade(
        {
          id: editingGradeRecord.id,
          studentId: studentGradesModal.id,
          subjectId: gradeInputSubjectId,
          assessmentTitle: gradeInputTitle,
          assessmentType: gradeInputType,
          score: gradeInputScore,
          weight: gradeInputType === 'UAS' || gradeInputType === 'UTS' ? 2 : 1,
          date: editingGradeRecord.date || new Date().toISOString().substring(0, 10),
          feedback: gradeInputFeedback,
          semester: schoolSettings.currentSemester,
          academicYear: schoolSettings.currentAcademicYear,
          isPublished: true
        },
        false
      );
      setEditingGradeRecord(null);
    } else {
      addOrUpdateGrade(
        {
          studentId: studentGradesModal.id,
          subjectId: gradeInputSubjectId,
          assessmentTitle: gradeInputTitle,
          assessmentType: gradeInputType,
          score: gradeInputScore,
          weight: gradeInputType === 'UAS' || gradeInputType === 'UTS' ? 2 : 1,
          date: new Date().toISOString().substring(0, 10),
          feedback: gradeInputFeedback,
          semester: schoolSettings.currentSemester,
          academicYear: schoolSettings.currentAcademicYear,
          isPublished: true
        },
        true
      );
    }

    setGradeInputTitle('');
    setGradeInputFeedback('');
  };

  const startEditExistingGrade = (grade: GradeRecord) => {
    setEditingGradeRecord(grade);
    setGradeInputSubjectId(grade.subjectId);
    setGradeInputTitle(grade.assessmentTitle);
    setGradeInputType(grade.assessmentType);
    setGradeInputScore(grade.score);
    setGradeInputFeedback(grade.feedback || '');
  };

  const handleOpenMessageModal = (student: Student) => {
    setMessageModalStudent(student);
    setCustomMsgBody(
      `Yth. Bpk/Ibu ${student.parentName},\n\nKami menginformasikan bahwa proses penilaian semester ananda ${student.name} telah selesai dirangkum. Rapor Kurikulum Merdeka ${schoolSettings.schoolName} sudah dapat dipantau melalui Portal Orang Tua.\n\nSalam hormat,\nWali Kelas ${student.className}`
    );
  };

  const handleSendCustomMsg = () => {
    if (!messageModalStudent) return;
    sendCustomNotification(messageModalStudent.id, customMsgTitle, customMsgBody);
    setMessageModalStudent(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Teacher Authority Notice */}
      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-indigo-900">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold block text-sm">Akses Dewan Guru & Wali Kelas</span>
            <p className="text-indigo-700 text-xs">
              Guru memiliki hak penuh untuk <strong>menginput/mengedit nilai</strong> dan <strong>merubah data diri siswa</strong>. Orang tua murid berada pada mode hanya-baca (read-only).
            </p>
          </div>
        </div>
        <button
          onClick={handleOpenAddStudent}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-98 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Tambah Siswa Baru</span>
        </button>
      </div>

      {/* Main Student Management Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Kelola Siswa, Data Diri, Nilai & Presensi
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola profil biodata lengkap, riwayat nilai per mata pelajaran, rekap kehadiran, dan catatan resmi buku rapor.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
              {students.length} Siswa Terdaftar
            </span>
          </div>
        </div>

        {/* Student Cards List */}
        <div className="mt-4 grid grid-cols-1 gap-4">
          {students.map((student) => {
            const isInlineEditing = editingInlineId === student.id;
            const studentGradeCount = grades.filter((g) => g.studentId === student.id).length;

            return (
              <div
                key={student.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isInlineEditing
                    ? 'border-indigo-400 bg-indigo-50/20 ring-2 ring-indigo-100'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Student Photo & Bio */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={student.photoUrl}
                      alt={student.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-sm">{student.name}</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-700">
                          NIS: {student.nis} • NISN: {student.nisn}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {student.className}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                          {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </span>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                        <span>
                          <strong className="text-slate-800">Orang Tua/Wali:</strong> {student.parentName}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-700 font-medium">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          {student.parentPhone}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {student.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Teacher Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Direct Grade Manager Button */}
                    <button
                      onClick={() => handleOpenStudentGrades(student)}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Kelola & Edit Nilai Siswa Ini"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                      <span>Kelola Nilai ({studentGradeCount})</span>
                    </button>

                    {/* Edit Complete Data Diri */}
                    <button
                      onClick={() => handleOpenEditProfile(student)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Edit Data Diri</span>
                    </button>

                    {/* WA Modal */}
                    <button
                      onClick={() => handleOpenMessageModal(student)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Kirim WA</span>
                    </button>

                    {/* Delete Student */}
                    <button
                      onClick={() => setDeleteConfirmStudent(student)}
                      className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
                      title="Hapus Siswa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Editable Attendance & Notes Block */}
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Attendance block */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between font-semibold text-slate-700 mb-2">
                      <span className="flex items-center gap-1.5">
                        <CalendarCheck className="w-3.5 h-3.5 text-indigo-600" />
                        Presensi Semester Ini
                      </span>
                      {isInlineEditing ? (
                        <button
                          onClick={() => saveInlineEdit(student.id)}
                          className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" /> Simpan
                        </button>
                      ) : (
                        <button
                          onClick={() => startInlineEdit(student)}
                          className="text-[11px] text-indigo-600 hover:underline font-medium cursor-pointer"
                        >
                          Edit Cepat
                        </button>
                      )}
                    </div>

                    {isInlineEditing ? (
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5 font-medium">Sakit</label>
                          <input
                            type="number"
                            min={0}
                            value={attendanceDraft.sakit}
                            onChange={(e) =>
                              setAttendanceDraft((prev) => ({
                                ...prev,
                                sakit: parseInt(e.target.value, 10) || 0
                              }))
                            }
                            className="w-full bg-white border border-slate-300 rounded p-1 text-center font-bold text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5 font-medium">Izin</label>
                          <input
                            type="number"
                            min={0}
                            value={attendanceDraft.izin}
                            onChange={(e) =>
                              setAttendanceDraft((prev) => ({
                                ...prev,
                                izin: parseInt(e.target.value, 10) || 0
                              }))
                            }
                            className="w-full bg-white border border-slate-300 rounded p-1 text-center font-bold text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5 font-medium">Alpha</label>
                          <input
                            type="number"
                            min={0}
                            value={attendanceDraft.alpha}
                            onChange={(e) =>
                              setAttendanceDraft((prev) => ({
                                ...prev,
                                alpha: parseInt(e.target.value, 10) || 0
                              }))
                            }
                            className="w-full bg-white border border-slate-300 rounded p-1 text-center font-bold text-xs"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-around text-center py-1">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Sakit</span>
                          <strong className="text-amber-700 font-bold">{student.attendance.sakit} hari</strong>
                        </div>
                        <div className="border-x border-slate-200 px-3">
                          <span className="text-[10px] text-slate-500 block">Izin</span>
                          <strong className="text-blue-700 font-bold">{student.attendance.izin} hari</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Alpha</span>
                          <strong className="text-rose-700 font-bold">{student.attendance.alpha} hari</strong>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes for report card */}
                  <div className="md:col-span-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                      <span>Catatan Wali Kelas (Tercetak di Buku Rapor Resmi):</span>
                      {!isInlineEditing && (
                        <button
                          onClick={() => startInlineEdit(student)}
                          className="text-[11px] text-indigo-600 hover:underline font-medium cursor-pointer"
                        >
                          Edit Catatan
                        </button>
                      )}
                    </div>
                    {isInlineEditing ? (
                      <div className="space-y-1.5">
                        <textarea
                          rows={2}
                          value={notesDraft}
                          onChange={(e) => setNotesDraft(e.target.value)}
                          placeholder="Tuliskan catatan kemajuan belajar atau motivasi untuk siswa..."
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={() => saveInlineEdit(student.id)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Simpan Catatan
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-600 italic bg-white p-2 rounded-lg border border-slate-200/60 line-clamp-2">
                        "{student.notesWaliKelas || 'Belum ada catatan wali kelas.'}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 1. MODAL: EDIT DATA DIRI LENGKAP SISWA */}
      {editingProfileStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                Edit Data Diri Lengkap Siswa
              </h3>
              <button
                onClick={() => setEditingProfileStudent(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfileEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap Siswa *</label>
                  <input
                    type="text"
                    required
                    value={editProfileForm.name || ''}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jenis Kelamin *</label>
                  <select
                    value={editProfileForm.gender || 'L'}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, gender: e.target.value as 'L' | 'P' })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NIS (Nomor Induk Siswa) *</label>
                  <input
                    type="text"
                    required
                    value={editProfileForm.nis || ''}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, nis: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NISN (Nasional) *</label>
                  <input
                    type="text"
                    required
                    value={editProfileForm.nisn || ''}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, nisn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kelas *</label>
                  <input
                    type="text"
                    required
                    value={editProfileForm.className || ''}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, className: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Orang Tua / Wali *</label>
                  <input
                    type="text"
                    required
                    value={editProfileForm.parentName || ''}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, parentName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">No. WhatsApp / HP Orang Tua *</label>
                  <input
                    type="text"
                    required
                    value={editProfileForm.parentPhone || ''}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, parentPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Orang Tua (Opsional)</label>
                  <input
                    type="email"
                    value={editProfileForm.parentEmail || ''}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, parentEmail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alamat Tempat Tinggal</label>
                <input
                  type="text"
                  value={editProfileForm.address || ''}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Foto Profil Siswa (URL)</label>
                <input
                  type="text"
                  value={editProfileForm.photoUrl || ''}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, photoUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProfileStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 shadow-md shadow-indigo-200 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan Data Diri</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MODAL: TAMBAH SISWA BARU */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                Input / Tambah Siswa Baru
              </h3>
              <button
                onClick={() => setIsAddStudentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap Siswa *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Maria Kristina Barek"
                    value={newStudentForm.name}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jenis Kelamin *</label>
                  <select
                    value={newStudentForm.gender}
                    onChange={(e) =>
                      setNewStudentForm({ ...newStudentForm, gender: e.target.value as 'L' | 'P' })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NIS (Nomor Induk Siswa) *</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.nis}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, nis: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NISN (Nasional) *</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.nisn}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, nisn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kelas *</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.className}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, className: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Orang Tua / Wali *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bpk. Yohanes Barek"
                    value={newStudentForm.parentName}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, parentName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">No. WhatsApp Orang Tua *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 081234567890"
                    value={newStudentForm.parentPhone}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, parentPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Alamat Tempat Tinggal</label>
                  <input
                    type="text"
                    value={newStudentForm.address}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Catatan Awal Wali Kelas</label>
                <textarea
                  rows={2}
                  value={newStudentForm.notesWaliKelas}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, notesWaliKelas: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 shadow-md shadow-indigo-200 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftarkan Siswa ke Kelas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. MODAL: KELOLA & INPUT NILAI KHUSUS SISWA INI */}
      {studentGradesModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={studentGradesModal.photoUrl}
                  alt={studentGradesModal.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Kelola Nilai: {studentGradesModal.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    NIS: {studentGradesModal.nis} • {studentGradesModal.className}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStudentGradesModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grade Input Form */}
            <form
              onSubmit={handleSaveStudentSingleGrade}
              className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  {editingGradeRecord ? 'Edit Nilai Asesmen' : 'Input Nilai Asesmen Baru untuk Siswa Ini'}
                </span>
                {editingGradeRecord && (
                  <button
                    type="button"
                    onClick={() => setEditingGradeRecord(null)}
                    className="text-rose-600 hover:underline text-[11px] font-semibold"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Mata Pelajaran</label>
                  <select
                    value={gradeInputSubjectId}
                    onChange={(e) => setGradeInputSubjectId(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-semibold"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name} (KKM: {sub.kkm})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Jenis Asesmen</label>
                  <select
                    value={gradeInputType}
                    onChange={(e) => setGradeInputType(e.target.value as AssessmentType)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-semibold"
                  >
                    <option value="TUGAS">Tugas / PR</option>
                    <option value="UH">Ulangan Harian (Formatif)</option>
                    <option value="UTS">Sumatif Tengah Semester (STS)</option>
                    <option value="UAS">Sumatif Akhir Semester (SAS)</option>
                    <option value="PRAKTIK">Praktik / Portofolio</option>
                    <option value="PROYEK_P5">Proyek Penguatan Profil Pelajar Pancasila (P5)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Judul Asesmen</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: UH 2 Teks Laporan"
                    value={gradeInputTitle}
                    onChange={(e) => setGradeInputTitle(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nilai (0 - 100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={gradeInputScore}
                    onChange={(e) => setGradeInputScore(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-center font-mono font-bold text-indigo-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Umpan Balik / Catatan Guru
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Menunjukkan pemahaman konsep yang sangat memuaskan..."
                  value={gradeInputFeedback}
                  onChange={(e) => setGradeInputFeedback(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingGradeRecord ? 'Simpan Perubahan Nilai' : 'Simpan & Publikasikan Nilai'}</span>
                </button>
              </div>
            </form>

            {/* List of Existing Grades */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 text-xs block">
                Daftar Nilai Tercatat ({studentGradesModal.name}):
              </span>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {grades.filter((g) => g.studentId === studentGradesModal.id).length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    Belum ada nilai yang tercatat untuk siswa ini.
                  </p>
                ) : (
                  grades
                    .filter((g) => g.studentId === studentGradesModal.id)
                    .map((g) => {
                      const subject = subjects.find((s) => s.id === g.subjectId);
                      return (
                        <div
                          key={g.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{subject?.name}</span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                                {g.assessmentType}
                              </span>
                              <span className="text-slate-500 font-medium truncate">{g.assessmentTitle}</span>
                            </div>
                            {g.feedback && (
                              <p className="text-[11px] text-slate-500 italic mt-0.5">"{g.feedback}"</p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-mono font-bold text-sm text-indigo-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                              {g.score}
                            </span>
                            <button
                              onClick={() => startEditExistingGrade(g)}
                              className="p-1 text-indigo-600 hover:bg-indigo-100 rounded cursor-pointer"
                              title="Edit Nilai Ini"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteGradeRecord(g.id)}
                              className="p-1 text-rose-600 hover:bg-rose-100 rounded cursor-pointer"
                              title="Hapus Nilai Ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStudentGradesModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: KONFIRMASI HAPUS SISWA */}
      {deleteConfirmStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base text-rose-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Konfirmasi Hapus Siswa
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus data siswa <strong>{deleteConfirmStudent.name}</strong> (NIS: {deleteConfirmStudent.nis})?
              Semua nilai dan catatan rapor yang terkait dengan siswa ini juga akan dihapus dari sistem.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                onClick={() => setDeleteConfirmStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteStudent}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-rose-200 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Siswa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: KIRIM PESAN WA KE ORANG TUA */}
      {messageModalStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Kirim Pesan WhatsApp ke Orang Tua
              </h3>
              <button
                onClick={() => setMessageModalStudent(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-600">
                Tujuan: <strong>{messageModalStudent.parentName}</strong> ({messageModalStudent.parentPhone}) - Siswa:{' '}
                <strong>{messageModalStudent.name}</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Notifikasi
              </label>
              <input
                type="text"
                value={customMsgTitle}
                onChange={(e) => setCustomMsgTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Isi Pesan WhatsApp
              </label>
              <textarea
                rows={5}
                value={customMsgBody}
                onChange={(e) => setCustomMsgBody(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMessageModalStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSendCustomMsg}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-emerald-200 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Kirim Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
