import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Users,
  BarChart3,
  Sparkles,
  Printer,
  Plus
} from 'lucide-react';
import { GradeEntryMatrix } from './GradeEntryMatrix';
import { StudentManagement } from './StudentManagement';
import { ClassAnalytics } from './ClassAnalytics';
import { useSchool } from '../../context/SchoolContext';

type SubTab = 'INPUT_NILAI' | 'SISWA_PRESENSI' | 'ANALITIK';

interface TeacherDashboardProps {
  onOpenAiHelper: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onOpenAiHelper }) => {
  const [subTab, setSubTab] = useState<SubTab>('INPUT_NILAI');
  const { schoolSettings, setActiveRole } = useSchool();

  return (
    <div className="space-y-6">
      {/* Subtab navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setSubTab('INPUT_NILAI')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'INPUT_NILAI'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Input Nilai Siswa</span>
          </button>

          <button
            onClick={() => setSubTab('SISWA_PRESENSI')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'SISWA_PRESENSI'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Data Siswa & Presensi</span>
          </button>

          <button
            onClick={() => setSubTab('ANALITIK')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'ANALITIK'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Rekap & Analitik Kelas</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAiHelper}
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Generate Deskripsi Rapor AI</span>
          </button>

          <button
            onClick={() => setActiveRole('ADMIN')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Buka Cetak Rapor</span>
          </button>
        </div>
      </div>

      {/* Subtab Content */}
      {subTab === 'INPUT_NILAI' && <GradeEntryMatrix />}
      {subTab === 'SISWA_PRESENSI' && <StudentManagement />}
      {subTab === 'ANALITIK' && <ClassAnalytics />}
    </div>
  );
};
