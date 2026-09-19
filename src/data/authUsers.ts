import { AuthUser } from '../types';

export const predefinedUsers: AuthUser[] = [
  // 0. Administrator Sistem
  {
    id: 'user-admin-1',
    username: 'admin',
    password: 'admin123',
    name: 'Administrator SIAKAD (Admin)',
    role: 'ADMIN',
    title: 'Admin Sistem & Pengelola Akun Sekolah',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    assignedClass: 'Semua Akses & Pengaturan'
  },

  // 1. Kepala Sekolah
  {
    id: 'user-kepsek-1',
    username: 'kepsek',
    password: 'kepsek2024',
    name: 'Drs. H. Bambang Suryanto, M.Pd.',
    role: 'PRINCIPAL',
    nip: '19680512 199303 1 004',
    title: 'Kepala Sekolah SMP 04 Atadei Satap Ilekimok',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    assignedClass: 'Semua Kelas (Supervisi)'
  },

  // 2. Guru & Wali Kelas (Siti Rahmawati)
  {
    id: 'user-guru-1',
    username: 'siti.rahmawati',
    password: 'guru123',
    name: 'Siti Rahmawati, S.Pd., M.Si.',
    role: 'TEACHER',
    nip: '19840214 200801 2 009',
    title: 'Wali Kelas VII - Merdeka & Guru Bahasa Indonesia',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    subjectAssigned: 'Bahasa Indonesia',
    isHomeroom: true,
    assignedClass: 'VII - Merdeka'
  },

  // 3. Guru Matematika (Ahmad Fauzi)
  {
    id: 'user-guru-2',
    username: 'ahmad.fauzi',
    password: 'guru123',
    name: 'Ahmad Fauzi, M.Sc.',
    role: 'TEACHER',
    nip: '19890723 201502 1 003',
    title: 'Guru Mata Pelajaran Matematika',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    subjectAssigned: 'Matematika',
    isHomeroom: false,
    assignedClass: 'VII - Merdeka'
  },

  // 4. Orang Tua Siswa (Bpk. Hendra Pratama - Orang Tua Arya)
  {
    id: 'user-ortu-1',
    username: 'ortu.arya',
    password: 'ortu123',
    name: 'Bpk. Hendra Pratama, S.E.',
    role: 'PARENT',
    title: 'Orang Tua / Wali Murid (Arya Putra Pratama)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    studentId: 'std-1',
    assignedClass: 'VII - Merdeka'
  },

  // 5. Orang Tua Siswa (Ibu Ratna Dewi - Orang Tua Clarissa)
  {
    id: 'user-ortu-2',
    username: 'ortu.clarissa',
    password: 'ortu123',
    name: 'Ibu Ratna Dewi, M.M.',
    role: 'PARENT',
    title: 'Orang Tua / Wali Murid (Clarissa Putri)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    studentId: 'std-3',
    assignedClass: 'VII - Merdeka'
  }
];
