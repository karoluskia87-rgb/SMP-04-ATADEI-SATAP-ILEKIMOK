import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  PlusCircle,
  MessageSquare,
  History,
  TrendingUp,
  Edit3,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AssessmentType, GradeRecord } from '../../types';

export const GradeEntryMatrix: React.FC = () => {
  const {
    students,
    subjects,
    grades,
    selectedSubjectId,
    setSelectedSubjectId,
    batchSaveGrades,
    addOrUpdateGrade,
    deleteGradeRecord,
    schoolSettings
  } = useSchool();

  const [assessmentType, setAssessmentType] = useState<AssessmentType>('UH');
  const [assessmentTitle, setAssessmentTitle] = useState('Ulangan Harian 2: Analisis & Evaluasi');
  const [assessmentDate, setAssessmentDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [notifyParents, setNotifyParents] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit single grade state
  const [editingGrade, setEditingGrade] = useState<GradeRecord | null>(null);
  const [editScoreVal, setEditScoreVal] = useState<number>(85);
  const [editTitleVal, setEditTitleVal] = useState<string>('');
  const [editFeedbackVal, setEditFeedbackVal] = useState<string>('');

  // Student scores draft for the matrix
  const [scoresDraft, setScoresDraft] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    students.forEach((s) => {
      initial[s.id] = 85;
    });
    return initial;
  });

  const [feedbacksDraft, setFeedbacksDraft] = useState<Record<string, string>>({});

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const handleScoreChange = (studentId: string, val: string) => {
    const num = Math.min(100, Math.max(0, parseInt(val, 10) || 0));
    setScoresDraft((prev) => ({ ...prev, [studentId]: num }));
  };

  const handleFeedbackChange = (studentId: string, val: string) => {
    setFeedbacksDraft((prev) => ({ ...prev, [studentId]: val }));
  };

  const handleQuickFill = (score: number) => {
    const updated: Record<string, number> = {};
    students.forEach((s) => {
      updated[s.id] = score;
    });
    setScoresDraft(updated);
  };

  const handleSubmitBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSubject) return;

    const records = students.map((s) => ({
      studentId: s.id,
      score: scoresDraft[s.id] ?? 80,
      feedback: feedbacksDraft[s.id] || undefined
    }));

    batchSaveGrades(
      currentSubject.id,
      assessmentTitle,
      assessmentType,
      assessmentDate,
      records,
      notifyParents
    );

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  // Recent grades for this subject
  const subjectGrades = grades
    .filter((g) => g.subjectId === currentSubject?.id)
    .slice(0, 15);

  const avgDraft =
    students.length > 0
      ? Math.round(
          Object.values(scoresDraft).reduce((a, b) => a + b, 0) / students.length
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Top Controls: Subject selection & Quick Presets */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              Input Nilai Siswa & Sinkronisasi Cloud
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Input nilai asesmen formatif & sumatif. Nilai langsung terhubung ke Buku Rapor Cloud & Notifikasi HP Orang Tua.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Pilih Mapel:</label>
            <select
              id="select-subject"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2 font-medium"
            >
              {subjects.map((subj) => (
                <option key={subj.id} value={subj.id}>
                  {subj.code} - {subj.name} (KKM: {subj.kkm})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Assessment Settings Form */}
        <form onSubmit={handleSubmitBatch} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Asesmen
              </label>
              <select
                id="select-assessment-type"
                value={assessmentType}
                onChange={(e) => {
                  const val = e.target.value as AssessmentType;
                  setAssessmentType(val);
                  if (val === 'TUGAS') setAssessmentTitle('Tugas Mandiri: Pemahaman Konsep');
                  else if (val === 'UH') setAssessmentTitle('Ulangan Harian: Capaian Pembelajaran');
                  else if (val === 'UTS') setAssessmentTitle('Sumatif Tengah Semester (STS)');
                  else if (val === 'UAS') setAssessmentTitle('Sumatif Akhir Semester (SAS)');
                  else if (val === 'PRAKTIK') setAssessmentTitle('Asesmen Unjuk Kerja & Praktikum');
                  else if (val === 'PROYEK_P5') setAssessmentTitle('Asesmen Proyek Profil Pelajar Pancasila');
                }}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="TUGAS">Tugas Mandiri / Kelompok (Formatif)</option>
                <option value="UH">Ulangan Harian (Formatif)</option>
                <option value="PRAKTIK">Praktikum / Unjuk Kerja</option>
                <option value="PROYEK_P5">Proyek Penguatan Profil (P5)</option>
                <option value="UTS">Sumatif Tengah Semester (STS)</option>
                <option value="UAS">Sumatif Akhir Semester (SAS/Rapor)</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Asesmen / Topik Pembelajaran
              </label>
              <input
                type="text"
                id="input-assessment-title"
                value={assessmentTitle}
                onChange={(e) => setAssessmentTitle(e.target.value)}
                placeholder="Contoh: Ulangan Harian 2: Fungsi Eksponensial"
                className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Pelaksanaan
              </label>
              <input
                type="date"
                id="input-assessment-date"
                value={assessmentDate}
                onChange={(e) => setAssessmentDate(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Quick filling tools */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/60">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Isi Cepat Nilai:</span>
              <button
                type="button"
                onClick={() => handleQuickFill(85)}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
              >
                85
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill(90)}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
              >
                90
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill(95)}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
              >
                95
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill(75)}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
              >
                75
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-slate-600 font-medium">
                Rata-rata Draft: <strong className="text-indigo-600 text-sm font-bold">{avgDraft}</strong> / 100
              </span>
              <span className="text-slate-500">
                KKM Mapel: <strong className="text-slate-700">{currentSubject?.kkm}</strong>
              </span>
            </div>
          </div>

          {/* Student Matrix Spreadsheet Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-10">No</th>
                  <th className="py-2.5 px-3">NIS</th>
                  <th className="py-2.5 px-3">Nama Siswa</th>
                  <th className="py-2.5 px-3 w-32">Nilai (0-100)</th>
                  <th className="py-2.5 px-3 w-28 text-center">Status</th>
                  <th className="py-2.5 px-3">Catatan / Feedback Guru</th>
                  <th className="py-2.5 px-3">No. HP Orang Tua</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student, idx) => {
                  const score = scoresDraft[student.id] ?? 80;
                  const isPassed = currentSubject ? score >= currentSubject.kkm : true;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-600">{student.nis}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={student.photoUrl}
                            alt={student.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 block">{student.name}</span>
                            <span className="text-[10px] text-slate-400">Ortu: {student.parentName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            id={`score-input-${student.id}`}
                            min={0}
                            max={100}
                            value={scoresDraft[student.id] ?? ''}
                            onChange={(e) => handleScoreChange(student.id, e.target.value)}
                            className={`w-full font-bold text-center text-sm rounded-lg border py-1.5 px-2 focus:ring-2 transition-all ${
                              isPassed
                                ? 'bg-white border-slate-300 text-slate-900 focus:ring-indigo-400 focus:border-indigo-500'
                                : 'bg-red-50 border-red-300 text-red-700 focus:ring-red-400'
                            }`}
                          />
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {isPassed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Tuntas
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-3 h-3" />
                            Remedial
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          placeholder="Komentar pembelajaran..."
                          value={feedbacksDraft[student.id] || ''}
                          onChange={(e) => handleFeedbackChange(student.id, e.target.value)}
                          className="w-full bg-transparent border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-indigo-500 rounded-md px-2 py-1 text-xs text-slate-700 transition-colors"
                        />
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-emerald-500" />
                          {student.parentPhone}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Action Bar & Notification toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2.5 cursor-pointer select-none bg-emerald-50/70 hover:bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200/80 transition-colors">
              <input
                type="checkbox"
                id="check-notify-parents"
                checked={notifyParents}
                onChange={(e) => setNotifyParents(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <div className="text-left">
                <span className="text-xs font-bold text-emerald-900 block flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  Kirim Notifikasi Otomatis ke HP Orang Tua (WhatsApp)
                </span>
                <span className="text-[11px] text-emerald-700/80">
                  Orang tua akan menerima pesan rincian nilai beserta link e-rapor secara real-time
                </span>
              </div>
            </label>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {saveSuccess && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-bounce">
                  <CheckCircle2 className="w-4 h-4" />
                  Nilai Berhasil Disimpan & Notifikasi Terkirim!
                </span>
              )}

              <button
                type="submit"
                id="btn-submit-grades"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-semibold text-xs shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan & Publikasikan ke Cloud</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Recent Grade History Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-600" />
            Riwayat Nilai Tersimpan ({currentSubject?.name})
          </h3>
          <span className="text-xs text-slate-500">
            Total {subjectGrades.length} rekaman tersinkronisasi
          </span>
        </div>

        <div className="mt-3 divide-y divide-slate-100 max-h-72 overflow-y-auto">
          {subjectGrades.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              Belum ada nilai yang diinput untuk mata pelajaran ini. Silakan input pada form di atas.
            </p>
          ) : (
            subjectGrades.map((g) => {
              const student = students.find((s) => s.id === g.studentId);
              return (
                <div key={g.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {g.assessmentType}
                    </span>
                    <div className="truncate">
                      <strong className="text-slate-800 font-semibold truncate block">
                        {student?.name}
                      </strong>
                      <span className="text-[11px] text-slate-500 truncate block">
                        {g.assessmentTitle} • {g.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`font-mono font-bold text-sm px-2.5 py-0.5 rounded-lg ${
                        currentSubject && g.score >= currentSubject.kkm
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {g.score}
                    </span>
                    <button
                      onClick={() => {
                        setEditingGrade(g);
                        setEditScoreVal(g.score);
                        setEditTitleVal(g.assessmentTitle);
                        setEditFeedbackVal(g.feedback || '');
                      }}
                      className="p-1 text-indigo-600 hover:bg-indigo-100 rounded cursor-pointer"
                      title="Edit Nilai"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteGradeRecord(g.id)}
                      className="p-1 text-rose-600 hover:bg-rose-100 rounded cursor-pointer"
                      title="Hapus Nilai"
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

      {/* Edit Grade Modal */}
      {editingGrade && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Nilai Siswa
              </h4>
              <button
                onClick={() => setEditingGrade(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Siswa:</span>
              <strong className="text-slate-900 text-sm block">
                {students.find((s) => s.id === editingGrade.studentId)?.name}
              </strong>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Judul Asesmen</label>
              <input
                type="text"
                value={editTitleVal}
                onChange={(e) => setEditTitleVal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nilai (0 - 100)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={editScoreVal}
                onChange={(e) => setEditScoreVal(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-indigo-900 text-center"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Catatan / Umpan Balik</label>
              <input
                type="text"
                value={editFeedbackVal}
                onChange={(e) => setEditFeedbackVal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingGrade(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  addOrUpdateGrade(
                    {
                      ...editingGrade,
                      score: editScoreVal,
                      assessmentTitle: editTitleVal,
                      feedback: editFeedbackVal
                    },
                    false
                  );
                  setEditingGrade(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
