import React, { useState } from 'react';
import {
  Users,
  Award,
  TrendingUp,
  CalendarCheck,
  CheckCircle2,
  BookOpen,
  MessageSquare,
  Printer,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Phone,
  ShieldCheck,
  Bell,
  ArrowRight
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { calculateSubjectSummary } from '../../utils/gradeCalculations';

export const ParentDashboard: React.FC = () => {
  const {
    students,
    subjects,
    grades,
    notifications,
    selectedStudentId,
    setSelectedStudentId,
    schoolSettings,
    setActiveRole
  } = useSchool();

  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Subject summaries for the current student
  const subjectSummaries = subjects.map((subj) =>
    calculateSubjectSummary(currentStudent.id, subj, grades)
  );

  const totalScores = subjectSummaries.reduce((acc, curr) => acc + curr.finalScore, 0);
  const averageScore =
    subjectSummaries.length > 0
      ? Number((totalScores / subjectSummaries.length).toFixed(1))
      : 0;

  // Calculate rank
  const studentAverages = students.map((s) => {
    const sSummaries = subjects.map((sub) =>
      calculateSubjectSummary(s.id, sub, grades)
    );
    const sTotal = sSummaries.reduce((acc, curr) => acc + curr.finalScore, 0);
    return {
      studentId: s.id,
      average: sSummaries.length > 0 ? sTotal / sSummaries.length : 0
    };
  });

  studentAverages.sort((a, b) => b.average - a.average);
  const rankIndex = studentAverages.findIndex((s) => s.studentId === currentStudent.id);
  const rank = rankIndex !== -1 ? rankIndex + 1 : 1;

  // Student specific notifications
  const studentNotifications = notifications.filter(
    (n) => n.studentId === currentStudent.id
  );

  const toggleExpand = (subjId: string) => {
    setExpandedSubjectId(expandedSubjectId === subjId ? null : subjId);
  };

  const handleWhatsAppTeacher = () => {
    const text = encodeURIComponent(
      `Halo Ibu ${schoolSettings.homeroomTeacherName}, saya orang tua dari ${currentStudent.name} (${currentStudent.className}). Ingin berkonsultasi mengenai hasil capaian belajar ananda pada semester ini. Terima kasih.`
    );
    window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Parent Welcome & Student Selector Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={currentStudent.photoUrl}
              alt={currentStudent.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Mode Orang Tua (Hanya Baca / Read-Only)
                </span>
                <span className="text-xs text-indigo-200">
                  {schoolSettings.schoolName}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold mt-1 tracking-tight">
                {currentStudent.name}
              </h1>

              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-indigo-200">
                <span>NIS: <strong>{currentStudent.nis}</strong></span>
                <span>NISN: <strong>{currentStudent.nisn}</strong></span>
                <span>Kelas: <strong>{currentStudent.className}</strong></span>
                <span>Wali Murid: <strong>{currentStudent.parentName}</strong></span>
              </div>
            </div>
          </div>

          {/* Student Selector Switcher */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div>
              <label className="block text-[11px] text-indigo-200 font-medium mb-1">
                Ganti Akun Siswa (Demo):
              </label>
              <select
                id="select-parent-student"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="bg-indigo-950/80 border border-indigo-400/40 text-white text-xs font-semibold rounded-xl p-2 focus:ring-2 focus:ring-indigo-400 outline-hidden"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                    {s.name} ({s.nis})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setActiveRole('ADMIN')}
              className="px-4 py-2 bg-white text-indigo-950 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer shrink-0"
            >
              <Printer className="w-4 h-4 text-indigo-700" />
              <span>Cetak e-Rapor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time KPI summary cards for Parent */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Rata-rata Nilai</span>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-indigo-900 font-mono">
              {averageScore}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {averageScore >= 90 ? 'Predikat A' : averageScore >= 80 ? 'Predikat B' : 'Predikat C'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Status: Sangat Memuaskan</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Peringkat Kelas</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
              #{rank}
            </span>
            <span className="text-xs text-slate-500">dari {students.length} siswa</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Kelas {currentStudent.className}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Kehadiran Siswa</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-slate-900">
              S:{currentStudent.attendance.sakit} I:{currentStudent.attendance.izin} A:{currentStudent.attendance.alpha}
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            {currentStudent.attendance.alpha === 0 ? '✓ Kedisiplinan Baik (0 Alpha)' : 'Perlu perhatian ketidakhadiran'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Notifikasi HP</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
              {studentNotifications.length}
            </span>
            <span className="text-xs text-slate-500">Terkirim ke WA</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{currentStudent.parentPhone}</p>
        </div>
      </div>

      {/* Read-Only Notice for Parents */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-start gap-3 text-xs">
        <div className="p-2 bg-slate-200 text-slate-700 rounded-xl shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4 text-indigo-700" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Hak Akses Portal: Pemantauan Orang Tua (Hanya Baca)</span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">READ ONLY</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Seluruh data diri siswa, absensi, dan penilaian akademik dikelola serta diverifikasi secara resmi oleh Dewan Guru dan Wali Kelas. Orang tua murid tidak dapat merubah data secara mandiri untuk menjamin integritas dan keabsahan rapor. Apabila terdapat perubahan data diri atau nomor kontak, silakan hubungi Wali Kelas.
          </p>
        </div>
      </div>

      {/* Main Grid: Subject Grades Breakdown & Real-Time WhatsApp Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Subject Grade Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Capaian Nilai Real-Time per Mata Pelajaran
            </h2>
            <span className="text-xs text-slate-500">
              Kurikulum Merdeka • Semester {schoolSettings.currentSemester}
            </span>
          </div>

          <div className="space-y-3">
            {subjectSummaries.map((summary) => {
              const isExpanded = expandedSubjectId === summary.subjectId;
              const subjectGrades = grades.filter(
                (g) => g.studentId === currentStudent.id && g.subjectId === summary.subjectId && g.isPublished
              );

              const isPassed = summary.finalScore >= summary.kkm;

              return (
                <div
                  key={summary.subjectId}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300"
                >
                  {/* Card Header */}
                  <div
                    onClick={() => toggleExpand(summary.subjectId)}
                    className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          summary.finalScore >= 90
                            ? 'bg-indigo-100 text-indigo-700'
                            : summary.finalScore >= 80
                            ? 'bg-blue-100 text-blue-700'
                            : isPassed
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {summary.predicate}
                      </div>
                      <div className="truncate">
                        <h3 className="font-bold text-slate-900 text-sm truncate">
                          {summary.subjectName}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>KKM: <strong className="text-slate-700">{summary.kkm}</strong></span>
                          <span>•</span>
                          <span>Formatif: <strong className="text-slate-700">{summary.formativeAvg}</strong></span>
                          <span>•</span>
                          <span>SAS: <strong className="text-slate-700">{summary.summativeUAS}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-lg font-black text-slate-900 font-mono block">
                          {summary.finalScore}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            isPassed
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {isPassed ? 'TUNTAS' : 'REMEDIAL'}
                        </span>
                      </div>

                      <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600 bg-slate-100">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3 text-xs">
                      {/* Kurikulum Merdeka Competency Description */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-800 block text-xs mb-1 flex items-center gap-1.5 text-indigo-700">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          Capaian Kompetensi Pembelajaran (Rapor Resmi):
                        </span>
                        <p className="text-slate-700 leading-relaxed">
                          • {summary.competencyAchieved}
                        </p>
                        <p className="text-slate-500 leading-relaxed mt-1">
                          • {summary.competencyImproving}
                        </p>
                      </div>

                      {/* Assessment Breakdown List */}
                      <div>
                        <span className="font-semibold text-slate-700 block mb-1.5">
                          Rincian Asesmen Yang Telah Dikerjakan:
                        </span>
                        {subjectGrades.length === 0 ? (
                          <p className="text-slate-400 italic">Belum ada rincian asesmen terinput.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {subjectGrades.map((g) => (
                              <div
                                key={g.id}
                                className="bg-white p-2 rounded-lg border border-slate-200/80 flex items-center justify-between gap-2"
                              >
                                <div className="truncate">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700">
                                      {g.assessmentType}
                                    </span>
                                    <span className="font-medium text-slate-800 truncate">
                                      {g.assessmentTitle}
                                    </span>
                                  </div>
                                  {g.feedback && (
                                    <p className="text-[11px] text-slate-500 italic mt-0.5">
                                      "{g.feedback}"
                                    </p>
                                  )}
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="font-bold font-mono text-xs text-indigo-700">
                                    {g.score} / 100
                                  </span>
                                  <span className="text-[10px] text-slate-400 block">{g.date}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Live WhatsApp Notification Log & Teacher Communication */}
        <div className="space-y-4">
          {/* Notification History Feed */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                Notifikasi HP Terkirim
              </h3>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                Real-Time Sync
              </span>
            </div>

            <div className="mt-3 space-y-3 max-h-96 overflow-y-auto pr-1">
              {studentNotifications.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Belum ada notifikasi baru untuk siswa ini.
                </div>
              ) : (
                studentNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 hover:bg-emerald-50/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-3 bg-white p-2 rounded border border-slate-100 font-sans">
                      {notif.body}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                      <span>No. Tujuan: {notif.parentPhone}</span>
                      <span className="text-emerald-600 font-semibold">Terkirim ✓</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Wali Kelas Contact Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Konsultasi Wali Kelas
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Bapak/Ibu dapat berkomunikasi langsung dengan Wali Kelas mengenai perkembangan akademik dan karakter ananda.
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-4 text-xs space-y-1">
              <p className="font-semibold text-slate-800">{schoolSettings.homeroomTeacherName}</p>
              <p className="text-slate-500 font-mono">NIP. {schoolSettings.homeroomTeacherNip}</p>
              <p className="text-[11px] text-slate-500">Wali Kelas {currentStudent.className}</p>
            </div>

            <button
              onClick={handleWhatsAppTeacher}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Hubungi via WhatsApp</span>
            </button>
          </div>

          {/* School Office Hotline Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-indigo-600" />
              Kontak Tata Usaha & Hotline Sekolah
            </h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Hubungi layanan informasi resmi sekolah untuk urusan administrasi, legalisir rapor, atau pembayaran.
            </p>

            <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-indigo-700 font-semibold">No. Telepon Sekolah:</span>
                <span className="font-mono font-bold text-indigo-950 text-xs">{schoolSettings.phone}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-indigo-100/60">
                <span>Email:</span>
                <span className="text-slate-800">{schoolSettings.email}</span>
              </div>
            </div>

            <a
              href={`tel:${schoolSettings.phone.replace(/[^0-9+]/g, '')}`}
              className="mt-3 w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hubungi Hotline Sekolah</span>
            </a>
          </div>

          {/* Quick Rapor Button */}
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-xs space-y-2">
            <span className="font-bold text-indigo-900 block flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-indigo-700" />
              Unduh Buku Rapor Resmi
            </span>
            <p className="text-indigo-700 leading-relaxed text-[11px]">
              Rapor digital Kurikulum Merdeka telah ditandatangani digital oleh Kepala Sekolah dan Wali Kelas.
            </p>
            <button
              onClick={() => setActiveRole('ADMIN')}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Buka Pratinjau & Cetak PDF</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
