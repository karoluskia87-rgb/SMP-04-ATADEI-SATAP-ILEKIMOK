import React, { useRef } from 'react';
import {
  Printer,
  Download,
  Share2,
  CheckCircle,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  QrCode,
  Sparkles
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { generateReportCard } from '../../utils/gradeCalculations';

export const ReportCardPreview: React.FC = () => {
  const {
    students,
    subjects,
    grades,
    schoolSettings,
    reportApproval,
    approveReportCards,
    currentUser,
    selectedStudentId,
    setSelectedStudentId
  } = useSchool();

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const currentIndex = students.findIndex((s) => s.id === currentStudent.id);

  const reportData = generateReportCard(
    currentStudent,
    subjects,
    grades,
    students,
    schoolSettings
  );

  const handlePrint = () => {
    window.print();
  };

  const handleNextStudent = () => {
    if (currentIndex < students.length - 1) {
      setSelectedStudentId(students[currentIndex + 1].id);
    }
  };

  const handlePrevStudent = () => {
    if (currentIndex > 0) {
      setSelectedStudentId(students[currentIndex - 1].id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar (Hidden on print) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Studio Cetak Rapor Otomatis (Kurikulum Merdeka)
            </h2>
            <p className="text-xs text-slate-500">
              Format baku Kemendikbudristek dengan verifikasi QR Code Cloud.
            </p>
          </div>
        </div>

        {/* Navigation between students & Print Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Approval status pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500">Status Pengesahan:</span>
            {reportApproval.status === 'APPROVED' ? (
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Sah Digital (Kepsek)
              </span>
            ) : (
              <span className="font-bold text-amber-700">Draft Revisi</span>
            )}
          </div>

          {currentUser?.role === 'PRINCIPAL' && reportApproval.status !== 'APPROVED' && (
            <button
              onClick={() => approveReportCards()}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Sahkan Rapor Sekarang</span>
            </button>
          )}

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={handlePrevStudent}
              disabled={currentIndex === 0}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent hover:bg-white cursor-pointer"
              title="Siswa Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 px-2 py-1 outline-hidden"
            >
              {students.map((s, idx) => (
                <option key={s.id} value={s.id}>
                  {idx + 1}. {s.name} ({s.nis})
                </option>
              ))}
            </select>

            <button
              onClick={handleNextStudent}
              disabled={currentIndex === students.length - 1}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent hover:bg-white cursor-pointer"
              title="Siswa Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handlePrint}
            id="btn-print-report"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Unduh PDF Rapor</span>
          </button>
        </div>
      </div>

      {/* Official Report Card Printable Document Paper */}
      <div className="flex justify-center">
        <div
          id="official-report-document"
          className="bg-white w-full max-w-4xl p-8 sm:p-12 border border-slate-300 shadow-md print:border-none print:shadow-none print:p-0 print:m-0 text-black font-serif"
          style={{ minHeight: '1120px' }}
        >
          {/* Header Kop Surat Sekolah Resmi */}
          <div className="border-b-4 border-double border-black pb-4 mb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="w-16 h-16 flex items-center justify-center border-2 border-black rounded-full font-bold text-xs text-center p-1 uppercase">
                TUT WURI
              </div>

              <div className="text-center flex-1">
                <h3 className="text-xs uppercase tracking-widest font-sans font-semibold text-slate-800">
                  PEMERINTAH PROVINSI {schoolSettings.province.toUpperCase()}
                </h3>
                <h4 className="text-xs uppercase tracking-wider font-sans font-semibold text-slate-800">
                  DINAS PENDIDIKAN DAN KEBUDAYAAN
                </h4>
                <h1 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-black mt-0.5">
                  {schoolSettings.schoolName}
                </h1>
                <p className="text-[11px] font-sans text-slate-700 mt-0.5">
                  {schoolSettings.address}, Kec. {schoolSettings.subdistrict}, {schoolSettings.city}
                </p>
                <p className="text-[10px] font-sans text-slate-600">
                  NPSN: {schoolSettings.npsn} • Telp: {schoolSettings.phone} • Website: {schoolSettings.website}
                </p>
              </div>

              <div className="w-16 h-16 flex flex-col items-center justify-center border-2 border-black rounded-lg p-1 text-center">
                <span className="text-[9px] font-sans font-bold leading-tight">RAPOR RESMI</span>
                <span className="text-[8px] font-sans text-slate-600">e-Cloud</span>
              </div>
            </div>
          </div>

          {/* Title Document */}
          <div className="text-center my-4">
            <h2 className="text-base font-bold uppercase tracking-wide underline">
              LAPORAN HASIL BELAJAR (RAPOR SISWA)
            </h2>
            <p className="text-xs font-sans text-slate-700">
              {schoolSettings.curriculum.toUpperCase()}
            </p>
          </div>

          {/* Student Identity Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs font-sans mb-6 bg-slate-50/70 print:bg-transparent p-3 rounded-lg border border-slate-200 print:border-none print:p-0">
            <div className="space-y-1">
              <div className="flex">
                <span className="w-36 text-slate-700">Nama Peserta Didik</span>
                <span className="font-bold text-black">: {currentStudent.name}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-slate-700">NIS / NISN</span>
                <span className="font-mono">: {currentStudent.nis} / {currentStudent.nisn}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-slate-700">Nama Sekolah</span>
                <span>: {schoolSettings.schoolName}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-slate-700">Alamat Sekolah</span>
                <span>: {schoolSettings.address}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex">
                <span className="w-32 text-slate-700">Kelas</span>
                <span className="font-bold">: {currentStudent.className}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-700">Fase</span>
                <span>: E (Sepuluh)</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-700">Semester</span>
                <span>: {schoolSettings.currentSemester} (Ganjil)</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-700">Tahun Ajaran</span>
                <span>: {schoolSettings.currentAcademicYear}</span>
              </div>
            </div>
          </div>

          {/* Main Table: Capaian Hasil Belajar */}
          <div className="mb-6">
            <h4 className="text-xs font-bold font-sans uppercase mb-2">
              A. LAPORAN NILAI DAN CAPAIAN KOMPETENSI
            </h4>

            <table className="w-full text-xs border-collapse border border-black font-sans">
              <thead>
                <tr className="bg-slate-100 print:bg-slate-100 text-black font-bold">
                  <th className="border border-black p-2 w-8 text-center">No</th>
                  <th className="border border-black p-2 w-48 text-left">Mata Pelajaran</th>
                  <th className="border border-black p-2 w-16 text-center">Nilai Akhir</th>
                  <th className="border border-black p-2 text-left">Capaian Kompetensi Pembelajaran</th>
                </tr>
              </thead>
              <tbody>
                {reportData.subjectSummaries.map((item, idx) => (
                  <tr key={item.subjectId} className="border-b border-black">
                    <td className="border border-black p-2 text-center font-mono align-top">
                      {idx + 1}
                    </td>
                    <td className="border border-black p-2 font-semibold align-top">
                      {item.subjectName}
                    </td>
                    <td className="border border-black p-2 text-center font-bold font-mono align-top text-sm">
                      {item.finalScore}
                    </td>
                    <td className="border border-black p-2 text-[11px] leading-relaxed align-top space-y-1">
                      <p>
                        <strong className="text-slate-800">Tercapai: </strong>
                        {item.competencyAchieved}
                      </p>
                      <p className="text-slate-700">
                        <strong className="text-slate-800">Peningkatan: </strong>
                        {item.competencyImproving}
                      </p>
                    </td>
                  </tr>
                ))}

                {/* Summary Row */}
                <tr className="bg-slate-50 print:bg-transparent font-bold">
                  <td colSpan={2} className="border border-black p-2 text-right uppercase">
                    Rata-Rata Nilai Akhir Siswa:
                  </td>
                  <td className="border border-black p-2 text-center font-mono text-base font-black">
                    {reportData.averageScore}
                  </td>
                  <td className="border border-black p-2 text-xs">
                    Peringkat ke-<strong>{reportData.rank}</strong> dari{' '}
                    <strong>{reportData.totalStudents}</strong> siswa di kelas.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section B: Ekstrakurikuler */}
          <div className="mb-5 avoid-break">
            <h4 className="text-xs font-bold font-sans uppercase mb-2">
              B. KEGIATAN EKSTRAKURIKULER
            </h4>
            <table className="w-full text-xs border-collapse border border-black font-sans">
              <thead>
                <tr className="bg-slate-100 print:bg-slate-100 text-black font-bold">
                  <th className="border border-black p-1.5 w-8 text-center">No</th>
                  <th className="border border-black p-1.5 w-56 text-left">Kegiatan Ekstrakurikuler</th>
                  <th className="border border-black p-1.5 w-24 text-center">Predikat</th>
                  <th className="border border-black p-1.5 text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {currentStudent.extracurriculars.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="border border-black p-2 text-center italic text-slate-500">
                      Tidak ada data ekstrakurikuler.
                    </td>
                  </tr>
                ) : (
                  currentStudent.extracurriculars.map((ekskul, idx) => (
                    <tr key={idx}>
                      <td className="border border-black p-1.5 text-center font-mono">{idx + 1}</td>
                      <td className="border border-black p-1.5 font-semibold">{ekskul.name}</td>
                      <td className="border border-black p-1.5 text-center font-bold">{ekskul.predicate}</td>
                      <td className="border border-black p-1.5 text-[11px]">{ekskul.description}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Section C: Ketidakhadiran & Catatan Wali Kelas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 avoid-break">
            {/* Presensi */}
            <div>
              <h4 className="text-xs font-bold font-sans uppercase mb-2">
                C. KETIDAKHADIRAN
              </h4>
              <table className="w-full text-xs border-collapse border border-black font-sans">
                <tbody>
                  <tr>
                    <td className="border border-black p-1.5 font-medium">Sakit (S)</td>
                    <td className="border border-black p-1.5 text-center font-bold w-20">
                      {currentStudent.attendance.sakit} hari
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1.5 font-medium">Izin (I)</td>
                    <td className="border border-black p-1.5 text-center font-bold w-20">
                      {currentStudent.attendance.izin} hari
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1.5 font-medium">Tanpa Keterangan (A)</td>
                    <td className="border border-black p-1.5 text-center font-bold w-20">
                      {currentStudent.attendance.alpha} hari
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Catatan Wali Kelas */}
            <div>
              <h4 className="text-xs font-bold font-sans uppercase mb-2">
                D. CATATAN WALI KELAS
              </h4>
              <div className="border border-black p-2.5 h-[104px] text-xs font-sans italic leading-relaxed bg-white">
                "{currentStudent.notesWaliKelas || 'Pertahankan prestasi belajar dan keaktifan berorganisasi.'}"
              </div>
            </div>
          </div>

          {/* Signatures Section */}
          <div className="avoid-break mt-8 pt-4 font-sans text-xs">
            <div className="text-right mb-4">
              <p>{schoolSettings.reportPlaceDate}</p>
            </div>

            <div className="grid grid-cols-3 text-center gap-4">
              {/* Parent */}
              <div>
                <p>Mengetahui,</p>
                <p>Orang Tua / Wali Murid</p>
                <div className="h-20" />
                <p className="font-bold underline">({currentStudent.parentName})</p>
              </div>

              {/* QR Verification */}
              <div className="flex flex-col items-center justify-center">
                <div className="p-2 border border-slate-300 rounded bg-white inline-block">
                  <div className="w-16 h-16 bg-slate-900 flex flex-col items-center justify-center text-white rounded text-[8px] text-center font-mono">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 mb-0.5" />
                    <span>VERIFIED</span>
                    <span>CLOUD RAPOR</span>
                  </div>
                </div>
                <span className="text-[9px] text-slate-500 font-mono mt-1">
                  ID: {reportData.qrVerificationId}
                </span>
              </div>

              {/* Homeroom Teacher */}
              <div>
                <p>Wali Kelas,</p>
                <div className="h-20" />
                <p className="font-bold underline">{schoolSettings.homeroomTeacherName}</p>
                <p className="text-[10px] font-mono">NIP. {schoolSettings.homeroomTeacherNip}</p>
              </div>
            </div>

            {/* Headmaster centered */}
            <div className="text-center mt-6">
              <p>Mengetahui,</p>
              <p>Kepala Sekolah {schoolSettings.schoolName}</p>
              <div className="h-20 flex items-center justify-center relative">
                {/* Official digital stamp simulation */}
                {reportApproval.status === 'APPROVED' ? (
                  <div className="w-24 h-24 rounded-full border-2 border-indigo-700/60 text-indigo-800 flex flex-col items-center justify-center text-[7px] font-bold uppercase rotate-[-12deg] tracking-tighter opacity-80 absolute select-none pointer-events-none bg-indigo-50/20 text-center">
                    <span>★ SMP 04 ATADEI ★</span>
                    <span className="text-[6px]">LEMBATA - NTT</span>
                    <span className="text-[8px] font-black text-emerald-800">SAH DIGITAL</span>
                  </div>
                ) : (
                  <div className="px-3 py-1 border border-dashed border-amber-600 text-amber-700 text-[10px] font-bold uppercase rotate-[-6deg] opacity-70 absolute">
                    DRAFT (BELUM DISAHKAN)
                  </div>
                )}
              </div>
              <p className="font-bold underline">{schoolSettings.headmasterName}</p>
              <p className="text-[10px] font-mono">NIP. {schoolSettings.headmasterNip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
