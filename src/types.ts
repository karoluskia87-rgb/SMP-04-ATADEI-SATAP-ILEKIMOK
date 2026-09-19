export type UserRole = 'TEACHER' | 'PRINCIPAL' | 'PARENT' | 'ADMIN';

export interface AuthUser {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  nip?: string;
  title: string;
  avatar?: string;
  subjectAssigned?: string;
  isHomeroom?: boolean;
  assignedClass?: string;
  studentId?: string; // For parent login
  email?: string;
  phone?: string;
}

export interface ReportApproval {
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  approvedAt?: string;
  approvedBy?: string;
  approverNip?: string;
  approvalNotes?: string;
  digitalSignatureCode: string;
}

export type AssessmentType = 'TUGAS' | 'UH' | 'UTS' | 'UAS' | 'PRAKTIK' | 'PROYEK_P5';

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  classId: string;
  className: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  address: string;
  photoUrl: string;
  attendance: {
    sakit: number;
    izin: number;
    alpha: number;
  };
  extracurriculars: {
    name: string;
    predicate: 'Sangat Baik' | 'Baik' | 'Cukup';
    description: string;
  }[];
  notesWaliKelas: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  kkm: number; // Kriteria Ketercapaian Tujuan Pembelajaran (KKTP / KKM)
  category: 'Wajib' | 'Pilihan' | 'Muatan Lokal';
  teacherName: string;
  teacherPhone?: string;
}

export interface AssessmentItem {
  id: string;
  title: string;
  type: AssessmentType;
  weight: number; // percentage or factor (e.g., 1, 2)
  maxScore: number;
  date: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  subjectId: string;
  assessmentType: AssessmentType;
  assessmentTitle: string;
  score: number; // 0 - 100
  weight: number;
  date: string;
  semester: '1' | '2';
  academicYear: string;
  feedback?: string;
  isPublished: boolean;
  publishedAt?: string;
}

export interface SubjectReportSummary {
  subjectId: string;
  subjectName: string;
  kkm: number;
  formativeAvg: number;
  summativeUTS: number;
  summativeUAS: number;
  finalScore: number;
  predicate: 'A' | 'B' | 'C' | 'D';
  competencyAchieved: string;
  competencyImproving: string;
}

export interface ReportCard {
  student: Student;
  academicYear: string;
  semester: '1' | '2';
  schoolName: string;
  npsn: string;
  schoolAddress: string;
  headmasterName: string;
  headmasterNip: string;
  homeroomTeacher: string;
  homeroomTeacherNip: string;
  reportDate: string;
  subjectSummaries: SubjectReportSummary[];
  averageScore: number;
  rank: number;
  totalStudents: number;
  attendance: {
    sakit: number;
    izin: number;
    alpha: number;
  };
  notes: string;
  extracurriculars: {
    name: string;
    predicate: string;
    description: string;
  }[];
  qrVerificationId: string;
}

export interface NotificationMessage {
  id: string;
  studentId: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  title: string;
  body: string;
  subjectName: string;
  score: number;
  assessmentType: string;
  timestamp: string;
  channel: 'WHATSAPP' | 'SMS' | 'PUSH';
  status: 'TERKIRIM' | 'DIBACA' | 'GAGAL';
  deepLinkUrl?: string;
}

export interface SchoolSettings {
  schoolName: string;
  npsn: string;
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  website: string;
  headmasterName: string;
  headmasterNip: string;
  homeroomTeacherName: string;
  homeroomTeacherNip: string;
  currentClass: string;
  currentAcademicYear: string;
  currentSemester: '1' | '2';
  curriculum: 'Kurikulum Merdeka' | 'Kurikulum 2013';
  reportPlaceDate: string;
  autoNotifyOnGradeUpload: boolean;
  notifyChannels: ('WHATSAPP' | 'PUSH' | 'SMS')[];
}
