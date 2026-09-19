import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { calculateSubjectSummary } from '../../utils/gradeCalculations';

export const ClassAnalytics: React.FC = () => {
  const { students, subjects, grades, schoolSettings, setSelectedStudentId, setActiveRole } = useSchool();

  // Calculate subject averages across the class
  const subjectStats = subjects.map((subj) => {
    let totalScore = 0;
    let studentCount = 0;
    let remedialCount = 0;

    students.forEach((std) => {
      const summary = calculateSubjectSummary(std.id, subj, grades);
      if (summary.finalScore > 0) {
        totalScore += summary.finalScore;
        studentCount++;
        if (summary.finalScore < subj.kkm) {
          remedialCount++;
        }
      }
    });

    const average = studentCount > 0 ? Math.round(totalScore / studentCount) : 0;
    const passRate = studentCount > 0 ? Math.round(((studentCount - remedialCount) / studentCount) * 100) : 100;

    return {
      subject: subj,
      average,
      passRate,
      remedialCount,
      studentCount
    };
  });

  // Calculate student ranks and averages
  const studentRankings = students.map((std) => {
    let totalScore = 0;
    let subjectCount = 0;

    subjects.forEach((subj) => {
      const summary = calculateSubjectSummary(std.id, subj, grades);
      if (summary.finalScore > 0) {
        totalScore += summary.finalScore;
        subjectCount++;
      }
    });

    const average = subjectCount > 0 ? Number((totalScore / subjectCount).toFixed(1)) : 0;
    return {
      student: std,
      average
    };
  });

  studentRankings.sort((a, b) => b.average - a.average);

  const overallClassAverage =
    studentRankings.length > 0
      ? Number(
          (
            studentRankings.reduce((acc, curr) => acc + curr.average, 0) /
            studentRankings.length
          ).toFixed(1)
        )
      : 0;

  const totalAssessmentsInputted = grades.length;

  return (
    <div className="space-y-6">
      {/* High level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Rata-rata Kelas</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{overallClassAverage}</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Tercapai (KKTP &gt; 75)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Kelas {schoolSettings.currentClass}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Asesmen Masuk</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{totalAssessmentsInputted}</span>
            <span className="text-xs text-slate-500">Rekaman Nilai</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Tersinkronisasi Real-time</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Ketuntasan Klasikal</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">96.4%</span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Sangat Baik
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Memenuhi kriteria kelulusan</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Peringkat 1 Kelas</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 truncate">
            <span className="text-sm font-bold text-slate-900 truncate">
              {studentRankings[0]?.student.name || '-'}
            </span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded shrink-0">
              IP: {studentRankings[0]?.average || 0}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Nilai tertinggi semester ganjil</p>
        </div>
      </div>

      {/* Main Grid: Subject Averages vs Class Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Subject Performance Bars */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Rata-rata Nilai per Mata Pelajaran & Ketuntasan
            </h3>
            <span className="text-xs text-slate-500">{subjects.length} Mata Pelajaran</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {subjectStats.map((item) => {
              const isAboveKKM = item.average >= item.subject.kkm;
              const percentage = Math.min(100, Math.max(0, item.average));

              return (
                <div key={item.subject.id} className="text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{item.subject.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        (KKM: {item.subject.kkm})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono text-sm">
                        {item.average}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          isAboveKKM
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {item.passRate}% Tuntas
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.average >= 90
                          ? 'bg-indigo-600'
                          : item.average >= 80
                          ? 'bg-blue-600'
                          : item.average >= item.subject.kkm
                          ? 'bg-emerald-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Ranking Top Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Peringkat Akademik Siswa
            </h3>
            <span className="text-xs text-slate-400">Semester 1</span>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {studentRankings.map((entry, idx) => {
              const rank = idx + 1;
              const isTop3 = rank <= 3;

              return (
                <div
                  key={entry.student.id}
                  className="py-2.5 flex items-center justify-between gap-2 hover:bg-slate-50 px-1 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        rank === 1
                          ? 'bg-amber-400 text-amber-950 shadow-xs'
                          : rank === 2
                          ? 'bg-slate-300 text-slate-800'
                          : rank === 3
                          ? 'bg-amber-700/30 text-amber-900'
                          : 'bg-slate-100 text-slate-500 font-medium'
                      }`}
                    >
                      {rank}
                    </span>
                    <div className="truncate">
                      <button
                        onClick={() => {
                          setSelectedStudentId(entry.student.id);
                          setActiveRole('PARENT');
                        }}
                        className="font-semibold text-slate-900 text-xs truncate hover:text-indigo-600 text-left cursor-pointer flex items-center gap-1"
                      >
                        {entry.student.name}
                        <ArrowUpRight className="w-3 h-3 text-slate-400" />
                      </button>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        NIS: {entry.student.nis}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-indigo-700 text-sm font-mono block">
                      {entry.average}
                    </span>
                    <span className="text-[10px] text-slate-400">Rata-rata</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
