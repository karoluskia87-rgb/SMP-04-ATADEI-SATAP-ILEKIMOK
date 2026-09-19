import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Users,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Printer,
  FileCheck2,
  TrendingUp,
  Settings,
  Building2,
  QrCode,
  Edit3,
  Sparkles,
  Search,
  School,
  FileSpreadsheet
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { calculateSubjectSummary, generateReportCard } from '../../utils/gradeCalculations';

export const PrincipalDashboard: React.FC = () => {
  const {
    schoolSettings,
    students,
    subjects,
    grades,
    reportApproval,
    approveReportCards,
    revokeReportApproval,
    updateSchoolSettings,
    setActiveRole,
    setSelectedStudentId
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TEACHER_PROGRESS' | 'APPROVAL' | 'SETTINGS'>('OVERVIEW');
  const [approvalNotesInput, setApprovalNotesInput] = useState(
    reportApproval.approvalNotes || 'Telah diverifikasi dan disahkan oleh Kepala Sekolah untuk didistribusikan kepada Orang Tua.'
  );
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState(schoolSettings);
  const [reminderSuccess, setReminderSuccess] = useState<string | null>(null);

  // Compute school-wide analytics
  const studentReports = students.map((s) =>
    generateReportCard(s, subjects, grades, students, schoolSettings)
  );

  const overallSchoolAverage =
    studentReports.length > 0
      ? Math.round(
          (studentReports.reduce((acc, r) => acc + r.averageScore, 0) /
            studentReports.length) *
            10
        ) / 10
      : 0;

  // Passing rate (> KKTP average of 75)
  const passedStudentsCount = studentReports.filter((r) => r.averageScore >= 75).length;
  const passingRate = Math.round((passedStudentsCount / students.length) * 100);

  // Top 5 rank
  const topStudents = [...studentReports].sort((a, b) => b.averageScore - a.averageScore).slice(0, 5);

  // Remedial alert students (average < 75 or has alpha > 2)
  const studentsNeedAttention = studentReports.filter(
    (r) => r.averageScore < 75 || r.attendance.alpha > 1
  );

  // Teachers progress calculation
  const teacherProgress = subjects.map((subj) => {
    const gradesForSubject = grades.filter((g) => g.subjectId === subj.id);
    const uniqueAssessments = new Set(gradesForSubject.map((g) => g.assessmentTitle));
    const totalGradesCount = gradesForSubject.length;
    const expectedAssessments = 4; // e.g. Tugas, UH, UTS, UAS
    const completionPercentage = Math.min(
      100,
      Math.round((uniqueAssessments.size / expectedAssessments) * 100)
    );

    const isComplete = completionPercentage >= 75;

    return {
      subject: subj,
      uniqueAssessmentsCount: uniqueAssessments.size,
      totalGradesCount,
      completionPercentage,
      isComplete
    };
  });

  const totalTeachers = subjects.length;
  const completedTeachersCount = teacherProgress.filter((t) => t.isComplete).length;
  const overallGradingProgress = Math.round((completedTeachersCount / totalTeachers) * 100);

  const handleSendReminder = (teacherName: string, subjectName: string) => {
    setReminderSuccess(`Pesan WhatsApp pengingat berhasil dikirimkan ke ${teacherName} (${subjectName})`);
    setTimeout(() => setReminderSuccess(null), 4000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolSettings(tempSettings);
    setIsEditingSettings(false);
  };

  return (
    <div className="space-y-6">
      {/* Executive Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Portal Eksekutif Kepala Sekolah</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Supervisi Akademik & Pengesahan e-Rapor
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Selamat datang, <strong>{schoolSettings.headmasterName}</strong>. Pantau capaian pembelajaran, progres penginputan nilai dewan guru, dan sahkan rapor semester secara digital.
            </p>
          </div>

          {/* Quick Approval Action Card */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col items-center sm:items-end gap-2 text-right">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">Status Validasi Rapor:</span>
              {reportApproval.status === 'APPROVED' ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  DISAHKAN
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  MENUNGGU PENGESAHAN
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 font-mono">
              {reportApproval.status === 'APPROVED'
                ? `Kode: ${reportApproval.digitalSignatureCode}`
                : 'Belum dibubuhi tanda tangan digital'}
            </p>

            <button
              onClick={() => setActiveTab('APPROVAL')}
              className="mt-1 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Kelola Pengesahan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'OVERVIEW'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Statistik Akademik</span>
          </button>

          <button
            onClick={() => setActiveTab('TEACHER_PROGRESS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'TEACHER_PROGRESS'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Monitoring Guru ({completedTeachersCount}/{totalTeachers})</span>
          </button>

          <button
            onClick={() => setActiveTab('APPROVAL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'APPROVAL'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Pengesahan e-Rapor</span>
          </button>

          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'SETTINGS'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Identitas Sekolah</span>
          </button>
        </div>

        <button
          onClick={() => setActiveRole('ADMIN')}
          className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Buka Studio Cetak Rapor</span>
        </button>
      </div>

      {reminderSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{reminderSuccess}</span>
        </div>
      )}

      {/* TAB 1: ACADEMIC OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Rata-Rata Nilai Sekolah
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  {overallSchoolAverage}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Fase D Merdeka (SMP)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Skala 0 - 100 lintas 8 mata pelajaran</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tingkat Ketuntasan (KKTP)
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black text-indigo-600 font-mono">
                  {passingRate}%
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {passedStudentsCount}/{students.length} Siswa
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${passingRate}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Progres Input Nilai Guru
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                  {overallGradingProgress}%
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {completedTeachersCount}/{totalTeachers} Mapel
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${overallGradingProgress}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Jumlah Siswa Terdaftar
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  {students.length}
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {schoolSettings.currentClass}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Wali: {schoolSettings.homeroomTeacherName}</p>
            </div>
          </div>

          {/* 2-Column: Honors List & Remedial Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Honors Top 5 */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Peringkat 5 Siswa Berprestasi Tertinggi
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Berdasarkan rata-rata nilai akhir asesmen semester ganjil
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {topStudents.map((rep, idx) => (
                  <div
                    key={rep.student.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                          idx === 0
                            ? 'bg-amber-500 text-white shadow-xs'
                            : idx === 1
                            ? 'bg-slate-400 text-white'
                            : idx === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">
                          {rep.student.name}
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          NIS: {rep.student.nis} • Wali: {rep.student.parentName}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black font-mono text-indigo-700 block">
                        {rep.averageScore}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">
                        Predikat A
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Students Needing Attention */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-rose-50 text-rose-700 rounded-xl">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Perhatian Khusus & Rekomendasi Remedial
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Siswa dengan rata-rata &lt; 75 atau tingkat ketidakhadiran tinggi
                    </p>
                  </div>
                </div>
              </div>

              {studentsNeedAttention.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
                  Semua siswa telah melampaui standar kriteria ketuntasan minimal.
                </div>
              ) : (
                <div className="space-y-2">
                  {studentsNeedAttention.map((rep) => (
                    <div
                      key={rep.student.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/40 border border-rose-100"
                    >
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-xs text-slate-900">
                          {rep.student.name}
                        </h4>
                        <p className="text-[10px] text-slate-600">
                          Rata-rata: <strong className="font-mono text-rose-700">{rep.averageScore}</strong> • Presensi: Sakit ({rep.attendance.sakit}), Izin ({rep.attendance.izin}), Alpha ({rep.attendance.alpha})
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedStudentId(rep.student.id);
                          setActiveRole('ADMIN');
                        }}
                        className="px-3 py-1.5 bg-white border border-rose-200 text-rose-800 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Tinjau Rapor
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEACHER PROGRESS MONITORING */}
      {activeTab === 'TEACHER_PROGRESS' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Monitoring Progres Penginputan Nilai Dewan Guru
              </h3>
              <p className="text-xs text-slate-500">
                Lacak status kelengkapan asesmen formatif, sumatif tengah semester, dan sumatif akhir semester per mata pelajaran.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">
                Total Mapel Selesai:
              </span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-black rounded-xl text-xs font-mono">
                {completedTeachersCount} / {totalTeachers}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="p-3.5">Mata Pelajaran</th>
                  <th className="p-3.5">Guru Pengampu</th>
                  <th className="p-3.5 text-center">KKTP/KKM</th>
                  <th className="p-3.5">Asesmen Terinput</th>
                  <th className="p-3.5">Progres</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teacherProgress.map((tp) => (
                  <tr key={tp.subject.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      {tp.subject.name}
                      <span className="block text-[10px] text-slate-400 font-mono">
                        Kode: {tp.subject.code}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-800">
                      {tp.subject.teacherName}
                      <span className="block text-[10px] text-slate-500 font-mono">
                        {tp.subject.teacherPhone || '0812-xxxx-xxxx'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-bold font-mono text-slate-700">
                      {tp.subject.kkm}
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">
                      <span className="font-bold text-slate-900 font-mono">
                        {tp.uniqueAssessmentsCount}
                      </span>{' '}
                      jenis asesmen ({tp.totalGradesCount} nilai)
                    </td>
                    <td className="p-3.5 w-40">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              tp.completionPercentage >= 75
                                ? 'bg-emerald-600'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${tp.completionPercentage}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-[11px] text-slate-700">
                          {tp.completionPercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-center">
                      {tp.completionPercentage >= 75 ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Lengkap
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Proses Input
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() =>
                          handleSendReminder(tp.subject.teacherName, tp.subject.name)
                        }
                        className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 rounded-xl font-bold text-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim Reminder</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: APPROVAL & DIGITAL SIGNATURE */}
      {activeTab === 'APPROVAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Approval Action Card */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Pengesahan & Tanda Tangan Digital Rapor Semester
                </h3>
                <p className="text-xs text-slate-500">
                  Memberikan keabsahan hukum dokumen e-Rapor dan menyalakan stempel resmi digital.
                </p>
              </div>
            </div>

            {/* Status box */}
            <div
              className={`p-4 rounded-2xl border ${
                reportApproval.status === 'APPROVED'
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50/70 border-amber-200 text-amber-900'
              } space-y-2`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {reportApproval.status === 'APPROVED' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Rapor Semester Telah Disahkan Secara Resmi</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-5 h-5 text-amber-600" />
                      <span>Menunggu Pengesahan Kepala Sekolah</span>
                    </>
                  )}
                </div>

                <span className="text-[10px] font-mono bg-white/80 px-2 py-1 rounded-md border">
                  {reportApproval.digitalSignatureCode || 'NO-HASH-YET'}
                </span>
              </div>

              {reportApproval.status === 'APPROVED' && (
                <div className="text-xs space-y-1 text-slate-700 pt-2 border-t border-emerald-200/60">
                  <p>
                    <strong>Disahkan Oleh:</strong> {reportApproval.approvedBy} (NIP. {reportApproval.approverNip})
                  </p>
                  <p>
                    <strong>Waktu Pengesahan:</strong> {reportApproval.approvedAt}
                  </p>
                  <p className="italic bg-white p-2 rounded-lg border border-emerald-100 mt-2">
                    "{reportApproval.approvalNotes}"
                  </p>
                </div>
              )}
            </div>

            {/* Approval Notes Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Catatan / Arahan Resmi Kepala Sekolah untuk Dokumen Rapor:
              </label>
              <textarea
                rows={3}
                value={approvalNotesInput}
                onChange={(e) => setApprovalNotesInput(e.target.value)}
                placeholder="Tuliskan catatan arahan resmi..."
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {reportApproval.status !== 'APPROVED' ? (
                <button
                  type="button"
                  id="btn-approve-reports"
                  onClick={() => approveReportCards(approvalNotesInput)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-indigo-700 hover:from-amber-700 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-200 flex items-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sahkan & Bubuhkan Tanda Tangan Digital Resmi</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => approveReportCards(approvalNotesInput)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Perbarui Catatan Pengesahan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Batalkan pengesahan rapor semester untuk revisi?')) {
                        revokeReportApproval();
                      }
                    }}
                    className="px-4 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Batalkan Pengesahan (Revisi Nilai)
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Digital Stamp Simulation Preview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col items-center text-center justify-center space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pratinjau Stempel Digital Resmi
            </h4>

            <div className="w-36 h-36 rounded-full border-4 border-double border-indigo-700 text-indigo-800 flex flex-col items-center justify-center p-3 relative rotate-[-6deg] select-none bg-indigo-50/20 text-center">
              <div className="text-[8px] font-black uppercase tracking-tighter">
                PEMERINTAH KAB. LEMBATA
              </div>
              <div className="text-[9px] font-black tracking-tight my-0.5">
                ★ DINAS PENDIDIKAN ★
              </div>
              <div className="text-[9px] font-black uppercase leading-tight">
                SMP 04 ATADEI SATAP ILEKIMOK
              </div>
              <div className="text-[8px] font-bold tracking-widest text-emerald-700 mt-0.5">
                ★ TERSERTIFIKASI SAH ★
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-bold text-slate-900">{schoolSettings.headmasterName}</p>
              <p className="text-[11px] text-slate-500 font-mono">NIP. {schoolSettings.headmasterNip}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 w-full text-[11px] text-slate-500">
              Format enkripsi QR Code terintegrasi pada lembar cetak e-rapor tiap siswa.
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SCHOOL SETTINGS */}
      {activeTab === 'SETTINGS' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Pengaturan Identitas Sekolah & Tahun Pelajaran
              </h3>
              <p className="text-xs text-slate-500">
                Data ini menjadi kop surat resmi dan data legalitas pada e-Rapor dan dokumen kelulusan.
              </p>
            </div>

            {!isEditingSettings ? (
              <button
                onClick={() => setIsEditingSettings(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Identitas Sekolah</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditingSettings(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl cursor-pointer"
              >
                Batal
              </button>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Resmi Sekolah
                </label>
                <input
                  type="text"
                  disabled={!isEditingSettings}
                  value={tempSettings.schoolName}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, schoolName: e.target.value })
                  }
                  className="w-full bg-slate-50 disabled:bg-slate-100/60 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">NPSN</label>
                <input
                  type="text"
                  disabled={!isEditingSettings}
                  value={tempSettings.npsn}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, npsn: e.target.value })
                  }
                  className="w-full bg-slate-50 disabled:bg-slate-100/60 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Kepala Sekolah
                </label>
                <input
                  type="text"
                  disabled={!isEditingSettings}
                  value={tempSettings.headmasterName}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, headmasterName: e.target.value })
                  }
                  className="w-full bg-slate-50 disabled:bg-slate-100/60 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  NIP Kepala Sekolah
                </label>
                <input
                  type="text"
                  disabled={!isEditingSettings}
                  value={tempSettings.headmasterNip}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, headmasterNip: e.target.value })
                  }
                  className="w-full bg-slate-50 disabled:bg-slate-100/60 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tahun Pelajaran & Semester
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    disabled={!isEditingSettings}
                    value={tempSettings.currentAcademicYear}
                    onChange={(e) =>
                      setTempSettings({
                        ...tempSettings,
                        currentAcademicYear: e.target.value
                      })
                    }
                    className="w-full bg-slate-50 disabled:bg-slate-100/60 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                  />
                  <select
                    disabled={!isEditingSettings}
                    value={tempSettings.currentSemester}
                    onChange={(e) =>
                      setTempSettings({
                        ...tempSettings,
                        currentSemester: e.target.value as '1' | '2'
                      })
                    }
                    className="w-full bg-slate-50 disabled:bg-slate-100/60 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                  >
                    <option value="1">Semester 1 (Ganjil)</option>
                    <option value="2">Semester 2 (Genap)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kurikulum & Titimangsa Rapor
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    disabled={!isEditingSettings}
                    value={tempSettings.curriculum}
                    onChange={(e) =>
                      setTempSettings({
                        ...tempSettings,
                        curriculum: e.target.value as 'Kurikulum Merdeka' | 'Kurikulum 2013'
                      })
                    }
                    className="w-full bg-slate-50 disabled:bg-slate-100/60 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                  />
                  <input
                    type="text"
                    disabled={!isEditingSettings}
                    value={tempSettings.reportPlaceDate}
                    onChange={(e) =>
                      setTempSettings({
                        ...tempSettings,
                        reportPlaceDate: e.target.value
                      })
                    }
                    className="w-full bg-slate-50 disabled:bg-slate-100/60 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {isEditingSettings && (
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Simpan Perubahan Identitas Sekolah
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
