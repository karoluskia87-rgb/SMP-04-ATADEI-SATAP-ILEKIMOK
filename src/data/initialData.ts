import { Student, Subject, GradeRecord, SchoolSettings, NotificationMessage } from '../types';

export const initialSchoolSettings: SchoolSettings = {
  schoolName: 'SMP 04 ATADEI SATAP ILEKIMOK',
  npsn: '69888421',
  address: 'Desa Ile Kimok, Kec. Atadei',
  subdistrict: 'Atadei',
  city: 'Kab. Lembata',
  province: 'Nusa Tenggara Timur',
  phone: '0813-3921-8842',
  email: 'smp04atadeisatap@gmail.com',
  website: 'https://smp04atadeisatap.sch.id',
  headmasterName: 'Drs. H. Bambang Suryanto, M.Pd.',
  headmasterNip: '19680512 199303 1 004',
  homeroomTeacherName: 'Siti Rahmawati, S.Pd., M.Si.',
  homeroomTeacherNip: '19840214 200801 2 009',
  currentClass: 'VII - Merdeka',
  currentAcademicYear: '2024/2025',
  currentSemester: '1',
  curriculum: 'Kurikulum Merdeka',
  reportPlaceDate: 'Ile Kimok, 20 Desember 2024',
  autoNotifyOnGradeUpload: true,
  notifyChannels: ['WHATSAPP', 'PUSH']
};

export const initialSubjects: Subject[] = [
  {
    id: 'subj-1',
    code: 'BINDO',
    name: 'Bahasa Indonesia',
    kkm: 75,
    category: 'Wajib',
    teacherName: 'Siti Rahmawati, S.Pd., M.Si.',
    teacherPhone: '081234567890'
  },
  {
    id: 'subj-2',
    code: 'MTK',
    name: 'Matematika',
    kkm: 72,
    category: 'Wajib',
    teacherName: 'Ahmad Fauzi, M.Sc.',
    teacherPhone: '081298765432'
  },
  {
    id: 'subj-3',
    code: 'BING',
    name: 'Bahasa Inggris',
    kkm: 75,
    category: 'Wajib',
    teacherName: 'Dewi Sartika, S.Pd., M.Hum.',
    teacherPhone: '081345678901'
  },
  {
    id: 'subj-4',
    code: 'IPA',
    name: 'Ilmu Pengetahuan Alam (Fisika & Kimia)',
    kkm: 70,
    category: 'Wajib',
    teacherName: 'Dr. Hendra Gunawan, M.Si.',
    teacherPhone: '081567890123'
  },
  {
    id: 'subj-5',
    code: 'IPS',
    name: 'Ilmu Pengetahuan Sosial (Sejarah & Ekonomi)',
    kkm: 75,
    category: 'Wajib',
    teacherName: 'Dra. Nurul Hidayah',
    teacherPhone: '081678901234'
  },
  {
    id: 'subj-6',
    code: 'PAI',
    name: 'Pendidikan Agama dan Budi Pekerti',
    kkm: 78,
    category: 'Wajib',
    teacherName: 'Ust. Muhammad Zaki, S.Ag.',
    teacherPhone: '081789012345'
  },
  {
    id: 'subj-7',
    code: 'PPKN',
    name: 'Pendidikan Pancasila',
    kkm: 75,
    category: 'Wajib',
    teacherName: 'Bagus Pratama, S.Pd., M.H.',
    teacherPhone: '081890123456'
  },
  {
    id: 'subj-8',
    code: 'INFOR',
    name: 'Informatika',
    kkm: 75,
    category: 'Pilihan',
    teacherName: 'Rian Kusuma, S.Kom., M.T.',
    teacherPhone: '081901234567'
  }
];

export const initialStudents: Student[] = [
  {
    id: 'std-1',
    nis: '240101',
    nisn: '0089123451',
    name: 'Arya Putra Pratama',
    gender: 'L',
    classId: 'cls-10m1',
    className: 'X - Merdeka 1',
    parentName: 'Bambang Susilo & Anita Wijaya',
    parentPhone: '0812-8899-7711',
    parentEmail: 'bambang.susilo@gmail.com',
    address: 'Jl. Melati Indah No. 12, Kebayoran Baru, Jakarta Selatan',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    attendance: {
      sakit: 1,
      izin: 0,
      alpha: 0
    },
    extracurriculars: [
      {
        name: 'Robotika & Coding Club',
        predicate: 'Sangat Baik',
        description: 'Aktif merakit IoT mikrokontroler dan juara 2 Lomba Inovasi Tingkat Kota.'
      },
      {
        name: 'Paskibra',
        predicate: 'Baik',
        description: 'Disiplin tinggi dan bertanggung jawab dalam penugasan regu formasi.'
      }
    ],
    notesWaliKelas: 'Ananda Arya menunjukkan dedikasi dan antusiasme tinggi dalam belajar, terutama pada bidang logika Matematika dan Informatika. Pertahankan semangat kolaborasi dan kepemimpinan di kelas.'
  },
  {
    id: 'std-2',
    nis: '240102',
    nisn: '0089123452',
    name: 'Nabila Syakira Azzahra',
    gender: 'P',
    classId: 'cls-10m1',
    className: 'X - Merdeka 1',
    parentName: 'H. Ir. Dani Ramadhan & Fitriani',
    parentPhone: '0813-7766-5544',
    parentEmail: 'dani.ramadhan@corp.id',
    address: 'Jl. Cempaka Putih Blok B No. 8, Jakarta Selatan',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    attendance: {
      sakit: 0,
      izin: 1,
      alpha: 0
    },
    extracurriculars: [
      {
        name: 'English Debating Club',
        predicate: 'Sangat Baik',
        description: 'Menunjukkan kemampuan public speaking yang luar biasa dan aktif menjadi Best Speaker.'
      },
      {
        name: 'PMR (Palang Merah Remaja)',
        predicate: 'Baik',
        description: 'Tanggap dalam pertolongan pertama dan sigap mengelola posko kesehatan.'
      }
    ],
    notesWaliKelas: 'Nabila adalah siswi yang santun, aktif dalam diskusi kelas, dan memiliki kemampuan literasi serta komunikasi bahasa yang sangat unggul.'
  },
  {
    id: 'std-3',
    nis: '240103',
    nisn: '0089123453',
    name: 'Dimas Aditya Nugroho',
    gender: 'L',
    classId: 'cls-10m1',
    className: 'X - Merdeka 1',
    parentName: 'Tri Nugroho, S.E.',
    parentPhone: '0857-1122-3344',
    parentEmail: 'tri.nugroho@yahoo.com',
    address: 'Jl. Senopati Dalam No. 27, Jakarta Selatan',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    attendance: {
      sakit: 2,
      izin: 1,
      alpha: 0
    },
    extracurriculars: [
      {
        name: 'Basket Putra',
        predicate: 'Sangat Baik',
        description: 'Kapten tim basket sekolah, membawa tim ke semifinal DBL Region Jakarta.'
      }
    ],
    notesWaliKelas: 'Dimas memiliki jiwa kepemimpinan dan sportivitas yang membanggakan. Perlu meningkatkan konsistensi belajar mandiri untuk materi sains eksakta.'
  },
  {
    id: 'std-4',
    nis: '240104',
    nisn: '0089123454',
    name: 'Clarissa Aurelia Putri',
    gender: 'P',
    classId: 'cls-10m1',
    className: 'X - Merdeka 1',
    parentName: 'dr. Hendrawan Sp.A & Maya',
    parentPhone: '0811-9988-2233',
    parentEmail: 'hendrawan.pediatric@medika.com',
    address: 'Jl. Gandaria Regency Kav. 14, Jakarta Selatan',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    attendance: {
      sakit: 0,
      izin: 0,
      alpha: 0
    },
    extracurriculars: [
      {
        name: 'KIR (Kelompok Ilmiah Remaja)',
        predicate: 'Sangat Baik',
        description: 'Meraih medali perak Lomba Peneliti Belia Nasional bidang Biologi Lingkungan.'
      },
      {
        name: 'Seni Musik & Paduan Suara',
        predicate: 'Sangat Baik',
        description: 'Menjadi solois utama dalam konser tahunan sekolah.'
      }
    ],
    notesWaliKelas: 'Prestasi akademik dan non-akademik Clarissa sangat seimbang dan cemerlang. Selalu menjadi teladan kerapian dan ketelitian bagi teman sekelas.'
  },
  {
    id: 'std-5',
    nis: '240105',
    nisn: '0089123455',
    name: 'Fikri Haikal Wardhana',
    gender: 'L',
    classId: 'cls-10m1',
    className: 'X - Merdeka 1',
    parentName: 'Agus Wardhana & Sri Mulyani',
    parentPhone: '0819-3344-5566',
    parentEmail: 'agus.wardhana@gmail.com',
    address: 'Jl. Radio Dalam Raya No. 51, Jakarta Selatan',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    attendance: {
      sakit: 1,
      izin: 2,
      alpha: 0
    },
    extracurriculars: [
      {
        name: 'Futsal',
        predicate: 'Baik',
        description: 'Bermain kompak dan memiliki kemampuan teknik mengolah bola yang baik.'
      }
    ],
    notesWaliKelas: 'Fikri sangat aktif dan ramah. Terus pertahankan semangat berkreasi dan disiplin mengerjakan tugas tepat waktu.'
  },
  {
    id: 'std-6',
    nis: '240106',
    nisn: '0089123456',
    name: 'Zahra Cantika Maharani',
    gender: 'P',
    classId: 'cls-10m1',
    className: 'X - Merdeka 1',
    parentName: 'Ir. Ferry Maharani & Ratna',
    parentPhone: '0812-4455-6677',
    parentEmail: 'ferry.m@bumn.go.id',
    address: 'Jl. Panglima Polim V No. 19, Jakarta Selatan',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    attendance: {
      sakit: 0,
      izin: 0,
      alpha: 0
    },
    extracurriculars: [
      {
        name: 'Jurnalistik & Mading',
        predicate: 'Sangat Baik',
        description: 'Pemimpin redaksi majalah dinding sekolah edisi digital.'
      }
    ],
    notesWaliKelas: 'Zahra berintegritas tinggi, tekun, dan memiliki rasa kepedulian sosial yang tinggi terhadap lingkungan kelas.'
  }
];

export const initialGradeRecords: GradeRecord[] = [
  // Arya Putra Pratama (std-1)
  {
    id: 'grd-1-1',
    studentId: 'std-1',
    subjectId: 'subj-1', // B. Indonesia
    assessmentType: 'TUGAS',
    assessmentTitle: 'Tugas 1: Analisis Teks Laporan Hasil Observasi',
    score: 88,
    weight: 1,
    date: '2024-09-10',
    semester: '1',
    academicYear: '2024/2025',
    feedback: 'Struktur teks runtut dan data pendukung faktual lengkap.',
    isPublished: true,
    publishedAt: '2024-09-11 10:30'
  },
  {
    id: 'grd-1-2',
    studentId: 'std-1',
    subjectId: 'subj-1',
    assessmentType: 'UH',
    assessmentTitle: 'Ulangan Harian 1: Kaidah Kebahasaan & Teks Anekdot',
    score: 90,
    weight: 2,
    date: '2024-09-24',
    semester: '1',
    academicYear: '2024/2025',
    feedback: 'Memahami makna tersirat dan kritik sosial dengan sangat tepat.',
    isPublished: true,
    publishedAt: '2024-09-25 14:15'
  },
  {
    id: 'grd-1-3',
    studentId: 'std-1',
    subjectId: 'subj-1',
    assessmentType: 'UTS',
    assessmentTitle: 'Sumatif Tengah Semester (STS) Ganjil',
    score: 87,
    weight: 3,
    date: '2024-10-15',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-10-18 09:00'
  },
  {
    id: 'grd-1-4',
    studentId: 'std-1',
    subjectId: 'subj-1',
    assessmentType: 'UAS',
    assessmentTitle: 'Sumatif Akhir Semester (SAS) Ganjil',
    score: 91,
    weight: 4,
    date: '2024-12-05',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:20'
  },

  // Matematika for Arya
  {
    id: 'grd-1-5',
    studentId: 'std-1',
    subjectId: 'subj-2', // MTK
    assessmentType: 'TUGAS',
    assessmentTitle: 'Tugas Eksponen dan Logaritma',
    score: 95,
    weight: 1,
    date: '2024-09-12',
    semester: '1',
    academicYear: '2024/2025',
    feedback: 'Langkah pengerjaan terstruktur rapi dan akurat.',
    isPublished: true,
    publishedAt: '2024-09-13 08:30'
  },
  {
    id: 'grd-1-6',
    studentId: 'std-1',
    subjectId: 'subj-2',
    assessmentType: 'UH',
    assessmentTitle: 'Ulangan Harian Vektor dan Sistem Pertidaksamaan',
    score: 92,
    weight: 2,
    date: '2024-10-02',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-10-03 13:00'
  },
  {
    id: 'grd-1-7',
    studentId: 'std-1',
    subjectId: 'subj-2',
    assessmentType: 'UTS',
    assessmentTitle: 'STS Matematika Ganjil',
    score: 94,
    weight: 3,
    date: '2024-10-16',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-10-18 10:00'
  },
  {
    id: 'grd-1-8',
    studentId: 'std-1',
    subjectId: 'subj-2',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Matematika Ganjil',
    score: 96,
    weight: 4,
    date: '2024-12-04',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:25'
  },

  // Bahasa Inggris for Arya
  {
    id: 'grd-1-9',
    studentId: 'std-1',
    subjectId: 'subj-3', // BING
    assessmentType: 'TUGAS',
    assessmentTitle: 'Writing Descriptive Text Essay',
    score: 86,
    weight: 1,
    date: '2024-09-15',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-09-16 11:00'
  },
  {
    id: 'grd-1-10',
    studentId: 'std-1',
    subjectId: 'subj-3',
    assessmentType: 'UH',
    assessmentTitle: 'Listening & Speaking Comprehension',
    score: 89,
    weight: 2,
    date: '2024-09-28',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-09-29 09:30'
  },
  {
    id: 'grd-1-11',
    studentId: 'std-1',
    subjectId: 'subj-3',
    assessmentType: 'UTS',
    assessmentTitle: 'STS Bahasa Inggris Ganjil',
    score: 88,
    weight: 3,
    date: '2024-10-17',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-10-19 14:00'
  },
  {
    id: 'grd-1-12',
    studentId: 'std-1',
    subjectId: 'subj-3',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Bahasa Inggris Ganjil',
    score: 90,
    weight: 4,
    date: '2024-12-06',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:30'
  },

  // IPA for Arya
  {
    id: 'grd-1-13',
    studentId: 'std-1',
    subjectId: 'subj-4', // IPA
    assessmentType: 'PRAKTIK',
    assessmentTitle: 'Praktikum Pengukuran dan Hukum Gerak Newton',
    score: 92,
    weight: 2,
    date: '2024-09-20',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-09-21 15:00'
  },
  {
    id: 'grd-1-14',
    studentId: 'std-1',
    subjectId: 'subj-4',
    assessmentType: 'UTS',
    assessmentTitle: 'STS Ilmu Pengetahuan Alam',
    score: 89,
    weight: 3,
    date: '2024-10-18',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-10-20 08:30'
  },
  {
    id: 'grd-1-15',
    studentId: 'std-1',
    subjectId: 'subj-4',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Ilmu Pengetahuan Alam',
    score: 91,
    weight: 4,
    date: '2024-12-08',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:35'
  },

  // IPS for Arya
  {
    id: 'grd-1-16',
    studentId: 'std-1',
    subjectId: 'subj-5', // IPS
    assessmentType: 'TUGAS',
    assessmentTitle: 'Kajian Sejarah Lokal Kerajaan Mataram Kuno',
    score: 87,
    weight: 1,
    date: '2024-09-22',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-09-23 10:00'
  },
  {
    id: 'grd-1-17',
    studentId: 'std-1',
    subjectId: 'subj-5',
    assessmentType: 'UTS',
    assessmentTitle: 'STS IPS Terpadu',
    score: 86,
    weight: 3,
    date: '2024-10-19',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-10-20 09:30'
  },
  {
    id: 'grd-1-18',
    studentId: 'std-1',
    subjectId: 'subj-5',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS IPS Terpadu',
    score: 88,
    weight: 4,
    date: '2024-12-09',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:40'
  },

  // PAI for Arya
  {
    id: 'grd-1-19',
    studentId: 'std-1',
    subjectId: 'subj-6', // PAI
    assessmentType: 'UH',
    assessmentTitle: 'Tafsir Ayat Toleransi & Etika Pergaulan',
    score: 93,
    weight: 2,
    date: '2024-10-05',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-10-06 14:00'
  },
  {
    id: 'grd-1-20',
    studentId: 'std-1',
    subjectId: 'subj-6',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Pendidikan Agama',
    score: 94,
    weight: 4,
    date: '2024-12-03',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:45'
  },

  // PPKN for Arya
  {
    id: 'grd-1-21',
    studentId: 'std-1',
    subjectId: 'subj-7', // PPKN
    assessmentType: 'PROYEK_P5',
    assessmentTitle: 'Proyek Profil Pancasila: Bhinneka Tunggal Ika',
    score: 90,
    weight: 3,
    date: '2024-11-12',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-11-14 09:10'
  },
  {
    id: 'grd-1-22',
    studentId: 'std-1',
    subjectId: 'subj-7',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Pendidikan Pancasila',
    score: 89,
    weight: 4,
    date: '2024-12-07',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:50'
  },

  // Informatika for Arya
  {
    id: 'grd-1-23',
    studentId: 'std-1',
    subjectId: 'subj-8', // INFOR
    assessmentType: 'PRAKTIK',
    assessmentTitle: 'Pemrograman Python & Algoritma Pencarian',
    score: 98,
    weight: 3,
    date: '2024-11-20',
    semester: '1',
    academicYear: '2024/2025',
    feedback: 'Sangat mahir! Logika algoritma efisien dan modular.',
    isPublished: true,
    publishedAt: '2024-11-22 13:40'
  },
  {
    id: 'grd-1-24',
    studentId: 'std-1',
    subjectId: 'subj-8',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Informatika',
    score: 97,
    weight: 4,
    date: '2024-12-02',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:55'
  },

  // Nabila Syakira (std-2)
  {
    id: 'grd-2-1',
    studentId: 'std-2',
    subjectId: 'subj-1',
    assessmentType: 'TUGAS',
    assessmentTitle: 'Tugas 1: Analisis Teks Laporan Hasil Observasi',
    score: 96,
    weight: 1,
    date: '2024-09-10',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-09-11 10:30'
  },
  {
    id: 'grd-2-2',
    studentId: 'std-2',
    subjectId: 'subj-1',
    assessmentType: 'UH',
    assessmentTitle: 'Ulangan Harian 1: Kaidah Kebahasaan & Teks Anekdot',
    score: 94,
    weight: 2,
    date: '2024-09-24',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-09-25 14:15'
  },
  {
    id: 'grd-2-3',
    studentId: 'std-2',
    subjectId: 'subj-1',
    assessmentType: 'UAS',
    assessmentTitle: 'Sumatif Akhir Semester (SAS) Ganjil',
    score: 95,
    weight: 4,
    date: '2024-12-05',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:20'
  },
  {
    id: 'grd-2-4',
    studentId: 'std-2',
    subjectId: 'subj-2',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Matematika Ganjil',
    score: 91,
    weight: 4,
    date: '2024-12-04',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:25'
  },
  {
    id: 'grd-2-5',
    studentId: 'std-2',
    subjectId: 'subj-3',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Bahasa Inggris Ganjil',
    score: 98,
    weight: 4,
    date: '2024-12-06',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:30'
  },
  {
    id: 'grd-2-6',
    studentId: 'std-2',
    subjectId: 'subj-4',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Ilmu Pengetahuan Alam',
    score: 90,
    weight: 4,
    date: '2024-12-08',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:35'
  },
  {
    id: 'grd-2-7',
    studentId: 'std-2',
    subjectId: 'subj-5',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS IPS Terpadu',
    score: 93,
    weight: 4,
    date: '2024-12-09',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:40'
  },
  {
    id: 'grd-2-8',
    studentId: 'std-2',
    subjectId: 'subj-6',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Pendidikan Agama',
    score: 96,
    weight: 4,
    date: '2024-12-03',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:45'
  },
  {
    id: 'grd-2-9',
    studentId: 'std-2',
    subjectId: 'subj-7',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Pendidikan Pancasila',
    score: 95,
    weight: 4,
    date: '2024-12-07',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:50'
  },
  {
    id: 'grd-2-10',
    studentId: 'std-2',
    subjectId: 'subj-8',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Informatika',
    score: 92,
    weight: 4,
    date: '2024-12-02',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:55'
  },

  // Dimas Aditya (std-3)
  {
    id: 'grd-3-1',
    studentId: 'std-3',
    subjectId: 'subj-1',
    assessmentType: 'UAS',
    assessmentTitle: 'Sumatif Akhir Semester (SAS) Ganjil',
    score: 82,
    weight: 4,
    date: '2024-12-05',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:20'
  },
  {
    id: 'grd-3-2',
    studentId: 'std-3',
    subjectId: 'subj-2',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Matematika Ganjil',
    score: 76,
    weight: 4,
    date: '2024-12-04',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:25'
  },
  {
    id: 'grd-3-3',
    studentId: 'std-3',
    subjectId: 'subj-3',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Bahasa Inggris Ganjil',
    score: 84,
    weight: 4,
    date: '2024-12-06',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:30'
  },
  {
    id: 'grd-3-4',
    studentId: 'std-3',
    subjectId: 'subj-4',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Ilmu Pengetahuan Alam',
    score: 75,
    weight: 4,
    date: '2024-12-08',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:35'
  },
  {
    id: 'grd-3-5',
    studentId: 'std-3',
    subjectId: 'subj-5',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS IPS Terpadu',
    score: 85,
    weight: 4,
    date: '2024-12-09',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:40'
  },
  {
    id: 'grd-3-6',
    studentId: 'std-3',
    subjectId: 'subj-6',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Pendidikan Agama',
    score: 88,
    weight: 4,
    date: '2024-12-03',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:45'
  },
  {
    id: 'grd-3-7',
    studentId: 'std-3',
    subjectId: 'subj-7',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Pendidikan Pancasila',
    score: 84,
    weight: 4,
    date: '2024-12-07',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:50'
  },
  {
    id: 'grd-3-8',
    studentId: 'std-3',
    subjectId: 'subj-8',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Informatika',
    score: 80,
    weight: 4,
    date: '2024-12-02',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:55'
  },

  // Clarissa Aurelia (std-4)
  {
    id: 'grd-4-1',
    studentId: 'std-4',
    subjectId: 'subj-1',
    assessmentType: 'UAS',
    assessmentTitle: 'Sumatif Akhir Semester (SAS) Ganjil',
    score: 94,
    weight: 4,
    date: '2024-12-05',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:20'
  },
  {
    id: 'grd-4-2',
    studentId: 'std-4',
    subjectId: 'subj-2',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Matematika Ganjil',
    score: 97,
    weight: 4,
    date: '2024-12-04',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:25'
  },
  {
    id: 'grd-4-3',
    studentId: 'std-4',
    subjectId: 'subj-3',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Bahasa Inggris Ganjil',
    score: 95,
    weight: 4,
    date: '2024-12-06',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:30'
  },
  {
    id: 'grd-4-4',
    studentId: 'std-4',
    subjectId: 'subj-4',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Ilmu Pengetahuan Alam',
    score: 98,
    weight: 4,
    date: '2024-12-08',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:35'
  },
  {
    id: 'grd-4-5',
    studentId: 'std-4',
    subjectId: 'subj-5',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS IPS Terpadu',
    score: 92,
    weight: 4,
    date: '2024-12-09',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:40'
  },
  {
    id: 'grd-4-6',
    studentId: 'std-4',
    subjectId: 'subj-6',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Pendidikan Agama',
    score: 97,
    weight: 4,
    date: '2024-12-03',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:45'
  },
  {
    id: 'grd-4-7',
    studentId: 'std-4',
    subjectId: 'subj-7',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Pendidikan Pancasila',
    score: 94,
    weight: 4,
    date: '2024-12-07',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:50'
  },
  {
    id: 'grd-4-8',
    studentId: 'std-4',
    subjectId: 'subj-8',
    assessmentType: 'UAS',
    assessmentTitle: 'SAS Informatika',
    score: 96,
    weight: 4,
    date: '2024-12-02',
    semester: '1',
    academicYear: '2024/2025',
    isPublished: true,
    publishedAt: '2024-12-10 11:55'
  }
];

export const initialNotifications: NotificationMessage[] = [
  {
    id: 'notif-1',
    studentId: 'std-1',
    studentName: 'Arya Putra Pratama',
    parentName: 'Bambang Susilo',
    parentPhone: '0812-8899-7711',
    title: '🔔 Nilai Baru: SAS Informatika',
    body: 'Yth. Bpk/Ibu Bambang Susilo, nilai SAS Informatika ananda Arya Putra Pratama telah diunggah: 97 (Sangat Baik). Silakan cek rapor real-time melalui portal sekolah.',
    subjectName: 'Informatika',
    score: 97,
    assessmentType: 'Sumatif Akhir Semester',
    timestamp: '2024-12-10 11:55',
    channel: 'WHATSAPP',
    status: 'TERKIRIM',
    deepLinkUrl: '/parent?nis=240101'
  },
  {
    id: 'notif-2',
    studentId: 'std-1',
    studentName: 'Arya Putra Pratama',
    parentName: 'Bambang Susilo',
    parentPhone: '0812-8899-7711',
    title: '🔔 Nilai Baru: SAS Matematika Ganjil',
    body: 'Yth. Bpk/Ibu Bambang Susilo, nilai SAS Matematika ananda Arya Putra Pratama telah diunggah: 96 (Sangat Baik). KKM: 72. Rata-rata kelas: 83.5.',
    subjectName: 'Matematika',
    score: 96,
    assessmentType: 'Sumatif Akhir Semester',
    timestamp: '2024-12-10 11:25',
    channel: 'WHATSAPP',
    status: 'DIBACA',
    deepLinkUrl: '/parent?nis=240101'
  },
  {
    id: 'notif-3',
    studentId: 'std-2',
    studentName: 'Nabila Syakira Azzahra',
    parentName: 'H. Ir. Dani Ramadhan',
    parentPhone: '0813-7766-5544',
    title: '🔔 Nilai Baru: SAS Bahasa Inggris',
    body: 'Yth. Bpk/Ibu Dani Ramadhan, nilai SAS Bahasa Inggris ananda Nabila Syakira telah diunggah: 98 (A - Sangat Baik). Prestasi luar biasa!',
    subjectName: 'Bahasa Inggris',
    score: 98,
    assessmentType: 'Sumatif Akhir Semester',
    timestamp: '2024-12-10 11:30',
    channel: 'WHATSAPP',
    status: 'DIBACA',
    deepLinkUrl: '/parent?nis=240102'
  },
  {
    id: 'notif-4',
    studentId: 'std-4',
    studentName: 'Clarissa Aurelia Putri',
    parentName: 'dr. Hendrawan Sp.A',
    parentPhone: '0811-9988-2233',
    title: '🔔 Nilai Baru: SAS Ilmu Pengetahuan Alam',
    body: 'Yth. dr. Hendrawan, nilai SAS IPA ananda Clarissa Aurelia Putri telah diunggah: 98 (Sangat Baik). Rapor semester ganjil sudah siap diunduh.',
    subjectName: 'Ilmu Pengetahuan Alam',
    score: 98,
    assessmentType: 'Sumatif Akhir Semester',
    timestamp: '2024-12-10 11:35',
    channel: 'WHATSAPP',
    status: 'TERKIRIM',
    deepLinkUrl: '/parent?nis=240104'
  }
];
