import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Copy,
  Check,
  RefreshCw,
  X,
  BookOpen,
  Send
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { calculateSubjectSummary } from '../../utils/gradeCalculations';

interface AiDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiDescriptionModal: React.FC<AiDescriptionModalProps> = ({ isOpen, onClose }) => {
  const { students, subjects, grades, updateStudentNotes, selectedStudentId } = useSchool();
  const [selectedStudentForAi, setSelectedStudentForAi] = useState<string>(selectedStudentId);
  const [generatedNotes, setGeneratedNotes] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const targetStudent = students.find((s) => s.id === selectedStudentForAi) || students[0];

  const handleGenerateAiDescription = () => {
    setIsGenerating(true);

    // Calculate summaries for this student
    const summaries = subjects.map((subj) => calculateSubjectSummary(targetStudent.id, subj, grades));
    const sortedByScore = [...summaries].sort((a, b) => b.finalScore - a.finalScore);
    const highestSubj = sortedByScore[0];
    const lowestSubj = sortedByScore[sortedByScore.length - 1];

    const avg = Math.round(summaries.reduce((a, b) => a + b.finalScore, 0) / summaries.length);

    setTimeout(() => {
      let narrative = '';
      if (avg >= 90) {
        narrative = `Ananda ${targetStudent.name} menunjukkan prestasi akademik yang sangat istimewa pada semester ini (Rata-rata: ${avg}). Penguasaan konsep sangat unggul terutama pada mata pelajaran ${highestSubj.subjectName} (${highestSubj.finalScore}). Sikap kedisiplinan dan kolaborasi dalam proyek kelas patut menjadi teladan. Terus pertahankan semangat berprestasi pada semester berikutnya.`;
      } else if (avg >= 80) {
        narrative = `Ananda ${targetStudent.name} memiliki perkembangan belajar yang sangat baik dan konsisten (Rata-rata: ${avg}). Memiliki potensi dan minat tinggi pada bidang ${highestSubj.subjectName}. Disarankan untuk meningkatkan latihan mandiri pada materi ${lowestSubj.subjectName} guna mencapai ketuntasan kompetensi yang lebih optimal.`;
      } else {
        narrative = `Ananda ${targetStudent.name} telah berupaya dengan baik dalam mengikuti seluruh proses pembelajaran. Perlu bimbingan dan pendampingan remedial lebih intensif pada mata pelajaran ${lowestSubj.subjectName} serta peningkatan ketepatan waktu dalam pengumpulan tugas mandiri.`;
      }

      setGeneratedNotes(narrative);
      setIsGenerating(false);
      setApplied(false);
    }, 600);
  };

  const handleApplyToStudent = () => {
    if (generatedNotes && targetStudent) {
      updateStudentNotes(targetStudent.id, generatedNotes);
      setApplied(true);
      setTimeout(() => setApplied(false), 3000);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedNotes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                AI Generator Deskripsi Capaian Rapor
              </h3>
              <p className="text-[11px] text-slate-500">
                Penyusunan narasi capaian belajar otomatis berbasis Kurikulum Merdeka.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Pilih Siswa Target:
          </label>
          <select
            value={selectedStudentForAi}
            onChange={(e) => {
              setSelectedStudentForAi(e.target.value);
              setGeneratedNotes('');
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-900"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.nis}) - {s.className}
              </option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="button"
            onClick={handleGenerateAiDescription}
            disabled={isGenerating}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menganalisis Nilai & Membuat Narasi...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Narasi Capaian Rapor Siswa</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Output */}
        {generatedNotes && (
          <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-purple-600" />
                Rekomendasi Catatan Wali Kelas (Kurikulum Merdeka):
              </span>
              <button
                onClick={handleCopy}
                className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={generatedNotes}
              onChange={(e) => setGeneratedNotes(e.target.value)}
              className="w-full bg-white border border-purple-200 rounded-xl p-3 text-xs text-slate-800 leading-relaxed font-sans focus:ring-2 focus:ring-purple-400"
            />

            <div className="flex items-center justify-end gap-2 pt-1">
              {applied && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Berhasil diterapkan ke Rapor Siswa!
                </span>
              )}
              <button
                onClick={handleApplyToStudent}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Terapkan Langsung ke Rapor {targetStudent.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
