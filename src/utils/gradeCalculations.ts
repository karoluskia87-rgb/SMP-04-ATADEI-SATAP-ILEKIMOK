import { GradeRecord, Subject, Student, SubjectReportSummary, ReportCard, SchoolSettings } from '../types';

export function calculateSubjectSummary(
  studentId: string,
  subject: Subject,
  grades: GradeRecord[]
): SubjectReportSummary {
  const studentSubjectGrades = grades.filter(
    (g) => g.studentId === studentId && g.subjectId === subject.id && g.isPublished
  );

  if (studentSubjectGrades.length === 0) {
    return {
      subjectId: subject.id,
      subjectName: subject.name,
      kkm: subject.kkm,
      formativeAvg: 0,
      summativeUTS: 0,
      summativeUAS: 0,
      finalScore: 0,
      predicate: 'D',
      competencyAchieved: 'Belum ada catatan penilaian formatif.',
      competencyImproving: 'Perlu mengikuti asesmen pembelajaran.'
    };
  }

  // Split by assessment type
  const formativeGrades = studentSubjectGrades.filter(
    (g) => g.assessmentType === 'TUGAS' || g.assessmentType === 'UH' || g.assessmentType === 'PRAKTIK' || g.assessmentType === 'PROYEK_P5'
  );
  const utsGrades = studentSubjectGrades.filter((g) => g.assessmentType === 'UTS');
  const uasGrades = studentSubjectGrades.filter((g) => g.assessmentType === 'UAS');

  // Formative average
  const formativeAvg =
    formativeGrades.length > 0
      ? Math.round(
          formativeGrades.reduce((acc, curr) => acc + curr.score * curr.weight, 0) /
            formativeGrades.reduce((acc, curr) => acc + curr.weight, 0)
        )
      : (uasGrades[0]?.score ?? 80);

  const summativeUTS = utsGrades.length > 0 ? utsGrades[0].score : formativeAvg;
  const summativeUAS = uasGrades.length > 0 ? uasGrades[0].score : formativeAvg;

  // Final score standard formula: 40% Formatif + 30% UTS + 30% UAS (or direct weighted average)
  let finalScore = 0;
  if (formativeGrades.length > 0 && utsGrades.length > 0 && uasGrades.length > 0) {
    finalScore = Math.round(formativeAvg * 0.4 + summativeUTS * 0.3 + summativeUAS * 0.3);
  } else if (uasGrades.length > 0) {
    // If only UAS is inputted yet
    finalScore = summativeUAS;
  } else {
    finalScore = formativeAvg;
  }

  // Predicate based on KKM and score
  let predicate: 'A' | 'B' | 'C' | 'D' = 'C';
  if (finalScore >= 90) predicate = 'A';
  else if (finalScore >= 80) predicate = 'B';
  else if (finalScore >= subject.kkm) predicate = 'C';
  else predicate = 'D';

  // Generate Kurikulum Merdeka competency descriptions
  const highestAssessment = [...studentSubjectGrades].sort((a, b) => b.score - a.score)[0];
  const lowestAssessment = [...studentSubjectGrades].sort((a, b) => a.score - b.score)[0];

  let competencyAchieved = `Menunjukkan penguasaan yang sangat baik dalam memahami konsep dasar dan materi pembelajaran ${subject.name}.`;
  if (highestAssessment && highestAssessment.score >= 85) {
    competencyAchieved = `Menunjukkan pemahaman yang sangat istimewa terutama pada ${highestAssessment.assessmentTitle} dengan ketelitian dan penalaran tinggi.`;
  }

  let competencyImproving = `Perlu mempertahankan konsistensi belajar dan keaktifan berdiskusi.`;
  if (lowestAssessment && lowestAssessment.score < subject.kkm) {
    competencyImproving = `Perlu bimbingan dan peningkatan pemahaman remedial pada topik ${lowestAssessment.assessmentTitle}.`;
  } else if (finalScore < 85) {
    competencyImproving = `Perlu penguatan latihan mandiri dan eksplorasi studi kasus yang lebih mendalam.`;
  }

  return {
    subjectId: subject.id,
    subjectName: subject.name,
    kkm: subject.kkm,
    formativeAvg,
    summativeUTS,
    summativeUAS,
    finalScore,
    predicate,
    competencyAchieved,
    competencyImproving
  };
}

export function generateReportCard(
  student: Student,
  subjects: Subject[],
  grades: GradeRecord[],
  allStudents: Student[],
  schoolSettings: SchoolSettings
): ReportCard {
  const subjectSummaries = subjects.map((sub) =>
    calculateSubjectSummary(student.id, sub, grades)
  );

  const totalScores = subjectSummaries.reduce((acc, curr) => acc + curr.finalScore, 0);
  const averageScore =
    subjectSummaries.length > 0
      ? Number((totalScores / subjectSummaries.length).toFixed(1))
      : 0;

  // Calculate rank across all students in class
  const studentAverages = allStudents.map((s) => {
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
  const rankIndex = studentAverages.findIndex((s) => s.studentId === student.id);
  const rank = rankIndex !== -1 ? rankIndex + 1 : 1;

  // Verification Hash / QR code id
  const qrVerificationId = `RAPOR-${schoolSettings.npsn}-${student.nis}-${schoolSettings.currentAcademicYear.replace('/', '')}-${schoolSettings.currentSemester}`;

  return {
    student,
    academicYear: schoolSettings.currentAcademicYear,
    semester: schoolSettings.currentSemester,
    schoolName: schoolSettings.schoolName,
    npsn: schoolSettings.npsn,
    schoolAddress: schoolSettings.address + ', ' + schoolSettings.city,
    headmasterName: schoolSettings.headmasterName,
    headmasterNip: schoolSettings.headmasterNip,
    homeroomTeacher: schoolSettings.homeroomTeacherName,
    homeroomTeacherNip: schoolSettings.homeroomTeacherNip,
    reportDate: schoolSettings.reportPlaceDate,
    subjectSummaries,
    averageScore,
    rank,
    totalStudents: allStudents.length,
    attendance: student.attendance,
    notes: student.notesWaliKelas,
    extracurriculars: student.extracurriculars,
    qrVerificationId
  };
}

export function formatWhatsAppMessage(
  parentName: string,
  studentName: string,
  subjectName: string,
  assessmentTitle: string,
  score: number,
  kkm: number,
  schoolName: string
): string {
  const status = score >= kkm ? '✅ TUNTAS' : '⚠️ PERLU PERBAIKAN';
  const predicate = score >= 90 ? 'A (Sangat Baik)' : score >= 80 ? 'B (Baik)' : score >= kkm ? 'C (Cukup)' : 'D (Kurang)';

  return `*SISTEM INFORMASI AKADEMIK & RAPOR DIGITAL*
🏫 *${schoolName}*
----------------------------------------
Yth. Bapak/Ibu *${parentName}*,

Pemberitahuan resmi hasil penilaian ananda:
👤 *Nama Siswa:* ${studentName}
📚 *Mata Pelajaran:* ${subjectName}
📝 *Asesmen:* ${assessmentTitle}
📊 *Nilai Diperoleh:* *${score}* / 100
🎯 *KKM / Kriteria:* ${kkm} (${status})
🏆 *Predikat:* ${predicate}

Nilai telah terintegrasi secara otomatis ke *Buku Rapor Cloud*. Bapak/Ibu dapat memantau grafik perkembangan belajar dan mengunduh e-Rapor resmi secara real-time melalui Portal Orang Tua.

Terima kasih atas kerja sama dan pendampingan belajar di rumah.
_Wali Kelas & Kurikulum ${schoolName}_`;
}
