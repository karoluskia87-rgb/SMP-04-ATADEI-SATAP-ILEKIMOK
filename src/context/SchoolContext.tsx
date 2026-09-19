import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Student,
  Subject,
  GradeRecord,
  SchoolSettings,
  NotificationMessage,
  UserRole,
  AssessmentType,
  AuthUser,
  ReportApproval
} from '../types';
import {
  initialSchoolSettings,
  initialStudents,
  initialSubjects,
  initialGradeRecords,
  initialNotifications
} from '../data/initialData';
import { predefinedUsers } from '../data/authUsers';
import { formatWhatsAppMessage } from '../utils/gradeCalculations';

interface SchoolContextType {
  schoolSettings: SchoolSettings;
  students: Student[];
  subjects: Subject[];
  grades: GradeRecord[];
  notifications: NotificationMessage[];
  users: AuthUser[];
  activeRole: UserRole;
  currentUser: AuthUser | null;
  reportApproval: ReportApproval;
  selectedStudentId: string;
  selectedSubjectId: string;
  latestDispatchedNotification: NotificationMessage | null;
  unreadNotifCount: number;
  isLoginModalOpen: boolean;

  // Actions
  setActiveRole: (role: UserRole) => void;
  setCurrentUser: (user: AuthUser | null) => void;
  login: (userOrRole: AuthUser | UserRole) => void;
  logout: () => void;
  setIsLoginModalOpen: (open: boolean) => void;
  updateUserCredentials: (
    userId: string,
    updates: {
      username?: string;
      password?: string;
      name?: string;
      role?: UserRole;
      nip?: string;
      title?: string;
      assignedClass?: string;
      avatar?: string;
      email?: string;
      phone?: string;
    }
  ) => { success: boolean; message: string };
  updateUserProfilePhoto: (userId: string, avatarUrl: string) => { success: boolean; message: string };
  updateUserProfile: (userId: string, updates: Partial<AuthUser>) => { success: boolean; message: string };
  addNewUser: (userData: Omit<AuthUser, 'id'>) => { success: boolean; message: string };
  deleteUser: (userId: string) => { success: boolean; message: string };
  approveReportCards: (notes?: string) => void;
  revokeReportApproval: () => void;
  setSelectedStudentId: (id: string) => void;
  setSelectedSubjectId: (id: string) => void;
  addOrUpdateGrade: (
    gradeData: Omit<GradeRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string },
    triggerNotification?: boolean
  ) => void;
  batchSaveGrades: (
    subjectId: string,
    assessmentTitle: string,
    assessmentType: AssessmentType,
    date: string,
    records: { studentId: string; score: number; feedback?: string }[],
    notifyParents: boolean
  ) => void;
  updateStudentAttendance: (
    studentId: string,
    attendance: { sakit: number; izin: number; alpha: number }
  ) => void;
  updateStudentNotes: (studentId: string, notes: string) => void;
  updateStudentProfile: (studentId: string, updatedData: Partial<Student>) => void;
  addNewStudent: (studentData: Omit<Student, 'id'>) => string;
  deleteStudent: (studentId: string) => void;
  deleteGradeRecord: (gradeId: string) => void;
  updateSchoolSettings: (newSettings: Partial<SchoolSettings>) => void;
  sendCustomNotification: (studentId: string, customTitle: string, customBody: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearLatestNotification: () => void;
  resetToDefaultData: () => void;
  triggerAudioChime: () => void;
  exportAllDataAsJSON: () => void;
  importDataFromJSON: (jsonString: string) => { success: boolean; message: string };
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'siakad_cloud_rapor_v2';

const initialReportApproval: ReportApproval = {
  status: 'APPROVED',
  approvedAt: '2024-12-20 09:30 WITA',
  approvedBy: 'Drs. H. Bambang Suryanto, M.Pd.',
  approverNip: '19680512 199303 1 004',
  approvalNotes: 'Seluruh nilai telah diverifikasi dan memenuhi standar capaian Kurikulum Merdeka Fase D.',
  digitalSignatureCode: 'SMP04ATADEI-RAPOR-2024-884920'
};

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or default
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : initialSchoolSettings;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_students`);
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_subjects`);
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [grades, setGrades] = useState<GradeRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_grades`);
    return saved ? JSON.parse(saved) : initialGradeRecords;
  });

  const [notifications, setNotifications] = useState<NotificationMessage[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [users, setUsers] = useState<AuthUser[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : predefinedUsers;
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_current_user`);
    return saved ? JSON.parse(saved) : predefinedUsers[1]; // Default to Siti Rahmawati (Guru / Wali Kelas)
  });

  const [reportApproval, setReportApproval] = useState<ReportApproval>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_report_approval`);
    return saved ? JSON.parse(saved) : initialReportApproval;
  });

  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_current_user`);
    if (saved) {
      const user = JSON.parse(saved) as AuthUser;
      return user.role;
    }
    return 'TEACHER';
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string>('std-1');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('subj-1');
  const [latestDispatchedNotification, setLatestDispatchedNotification] = useState<NotificationMessage | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_settings`, JSON.stringify(schoolSettings));
  }, [schoolSettings]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_subjects`, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_grades`, JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_current_user`);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_report_approval`, JSON.stringify(reportApproval));
  }, [reportApproval]);

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
  };

  const login = (userOrRole: AuthUser | UserRole) => {
    if (typeof userOrRole === 'string') {
      const matched = users.find((u) => u.role === userOrRole) || predefinedUsers.find((u) => u.role === userOrRole);
      if (matched) {
        setCurrentUser(matched);
        setActiveRoleState(matched.role);
        if (matched.studentId) {
          setSelectedStudentId(matched.studentId);
        }
      }
    } else {
      // Find latest updated version of this user if exists in state
      const freshUser = users.find((u) => u.id === userOrRole.id) || userOrRole;
      setCurrentUser(freshUser);
      setActiveRoleState(freshUser.role);
      if (freshUser.studentId) {
        setSelectedStudentId(freshUser.studentId);
      }
    }
    setIsLoginModalOpen(false);
  };

  const updateUserCredentials = (
    userId: string,
    updates: {
      username?: string;
      password?: string;
      name?: string;
      role?: UserRole;
      nip?: string;
      title?: string;
      assignedClass?: string;
      avatar?: string;
      email?: string;
      phone?: string;
    }
  ): { success: boolean; message: string } => {
    // Check if new username is already taken by another user
    if (updates.username) {
      const trimmed = updates.username.trim().toLowerCase();
      const duplicate = users.find((u) => u.id !== userId && u.username.toLowerCase() === trimmed);
      if (duplicate) {
        return {
          success: false,
          message: `Username "${updates.username}" sudah digunakan oleh akun ${duplicate.name}. Silakan gunakan username lain.`
        };
      }
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated: AuthUser = {
            ...u,
            username: updates.username !== undefined ? updates.username.trim() : u.username,
            password: updates.password !== undefined && updates.password.trim() !== '' ? updates.password.trim() : u.password,
            name: updates.name !== undefined ? updates.name.trim() : u.name,
            role: updates.role || u.role,
            nip: updates.nip !== undefined ? updates.nip.trim() : u.nip,
            title: updates.title !== undefined ? updates.title.trim() : u.title,
            assignedClass: updates.assignedClass !== undefined ? updates.assignedClass : u.assignedClass,
            avatar: updates.avatar !== undefined ? updates.avatar : u.avatar,
            email: updates.email !== undefined ? updates.email.trim() : u.email,
            phone: updates.phone !== undefined ? updates.phone.trim() : u.phone
          };

          // If updating currently logged in user, keep session in sync
          if (currentUser?.id === userId) {
            setCurrentUser(updated);
          }

          return updated;
        }
        return u;
      })
    );

    return {
      success: true,
      message: 'Kredensial dan data akun berhasil diperbarui secara permanen.'
    };
  };

  const updateUserProfilePhoto = (userId: string, avatarUrl: string): { success: boolean; message: string } => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated: AuthUser = { ...u, avatar: avatarUrl };
          if (currentUser?.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    triggerAudioChime();
    return {
      success: true,
      message: 'Foto profil akun berhasil diperbarui!'
    };
  };

  const updateUserProfile = (userId: string, updates: Partial<AuthUser>): { success: boolean; message: string } => {
    if (updates.username) {
      const trimmed = updates.username.trim().toLowerCase();
      const duplicate = users.find((u) => u.id !== userId && u.username.toLowerCase() === trimmed);
      if (duplicate) {
        return {
          success: false,
          message: `Username "${updates.username}" sudah digunakan.`
        };
      }
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated: AuthUser = {
            ...u,
            ...updates,
            name: updates.name !== undefined ? updates.name.trim() : u.name,
            email: updates.email !== undefined ? updates.email.trim() : u.email,
            phone: updates.phone !== undefined ? updates.phone.trim() : u.phone
          };
          if (currentUser?.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    triggerAudioChime();
    return {
      success: true,
      message: 'Profil pengguna berhasil diperbarui!'
    };
  };

  const addNewUser = (userData: Omit<AuthUser, 'id'>): { success: boolean; message: string } => {
    const trimmedUsername = userData.username.trim().toLowerCase();
    const duplicate = users.find((u) => u.username.toLowerCase() === trimmedUsername);
    if (duplicate) {
      return {
        success: false,
        message: `Username "${userData.username}" sudah terdaftar. Silakan pilih username lain.`
      };
    }

    const newUser: AuthUser = {
      ...userData,
      id: `user-custom-${Date.now()}`,
      username: userData.username.trim(),
      password: userData.password || 'password123',
      name: userData.name.trim(),
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };

    setUsers((prev) => [newUser, ...prev]);
    return {
      success: true,
      message: `Akun baru "${newUser.name}" dengan role ${newUser.role} berhasil didaftarkan.`
    };
  };

  const deleteUser = (userId: string): { success: boolean; message: string } => {
    if (currentUser?.id === userId) {
      return {
        success: false,
        message: 'Tidak dapat menghapus akun yang sedang aktif digunakan saat ini.'
      };
    }

    setUsers((prev) => prev.filter((u) => u.id !== userId));
    return {
      success: true,
      message: 'Akun pengguna berhasil dihapus dari sistem.'
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoginModalOpen(true);
  };

  const approveReportCards = (notes?: string) => {
    const approval: ReportApproval = {
      status: 'APPROVED',
      approvedAt: new Date().toLocaleString('id-ID', {
        dateStyle: 'full',
        timeStyle: 'short'
      }),
      approvedBy: schoolSettings.headmasterName,
      approverNip: schoolSettings.headmasterNip,
      approvalNotes: notes || 'Telah diverifikasi dan disahkan oleh Kepala Sekolah untuk didistribusikan kepada Orang Tua.',
      digitalSignatureCode: `SMAN1-E-RAPOR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };
    setReportApproval(approval);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    triggerAudioChime();
  };

  const revokeReportApproval = () => {
    setReportApproval({
      status: 'DRAFT',
      digitalSignatureCode: ''
    });
  };

  // Audio tone helper
  const triggerAudioChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  // Send single grade notification
  const dispatchSingleNotification = (
    student: Student,
    subject: Subject,
    assessmentTitle: string,
    score: number,
    assessmentType: AssessmentType
  ) => {
    const formattedMsg = formatWhatsAppMessage(
      student.parentName,
      student.name,
      subject.name,
      assessmentTitle,
      score,
      subject.kkm,
      schoolSettings.schoolName
    );

    const newNotif: NotificationMessage = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      studentId: student.id,
      studentName: student.name,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      title: `Nilai Baru: ${subject.name} (${assessmentTitle})`,
      body: formattedMsg,
      subjectName: subject.name,
      score,
      assessmentType,
      timestamp: new Date().toISOString(),
      channel: 'WHATSAPP',
      status: 'TERKIRIM',
      deepLinkUrl: `/#/parent?student=${student.id}`
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setLatestDispatchedNotification(newNotif);
    triggerAudioChime();
  };

  // Add single grade or update
  const addOrUpdateGrade = (
    gradeData: Omit<GradeRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string },
    triggerNotification = true
  ) => {
    const id = gradeData.id || `gr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newRecord: GradeRecord = {
      ...gradeData,
      id,
      semester: schoolSettings.currentSemester,
      academicYear: schoolSettings.currentAcademicYear,
      isPublished: true,
      publishedAt: new Date().toISOString()
    };

    setGrades((prev) => {
      const exists = prev.some((g) => g.id === id);
      if (exists) {
        return prev.map((g) => (g.id === id ? newRecord : g));
      }
      return [...prev, newRecord];
    });

    if (triggerNotification && schoolSettings.autoNotifyOnGradeUpload) {
      const targetStudent = students.find((s) => s.id === gradeData.studentId);
      const targetSubj = subjects.find((s) => s.id === gradeData.subjectId);
      if (targetStudent && targetSubj) {
        dispatchSingleNotification(
          targetStudent,
          targetSubj,
          gradeData.assessmentTitle,
          gradeData.score,
          gradeData.assessmentType
        );
      }
    }
  };

  // Batch save multiple students for one assessment
  const batchSaveGrades = (
    subjectId: string,
    assessmentTitle: string,
    assessmentType: AssessmentType,
    date: string,
    records: { studentId: string; score: number; feedback?: string }[],
    notifyParents: boolean
  ) => {
    const now = new Date().toISOString();
    const newRecords: GradeRecord[] = records.map((rec) => ({
      id: `gr-${Date.now()}-${rec.studentId}-${Math.random().toString(36).substr(2, 4)}`,
      studentId: rec.studentId,
      subjectId,
      assessmentTitle,
      assessmentType,
      score: rec.score,
      weight: assessmentType === 'UAS' || assessmentType === 'UTS' ? 2 : 1,
      date,
      semester: schoolSettings.currentSemester,
      academicYear: schoolSettings.currentAcademicYear,
      feedback: rec.feedback || '',
      isPublished: true,
      publishedAt: now
    }));

    setGrades((prev) => {
      const filtered = prev.filter(
        (g) =>
          !(
            g.subjectId === subjectId &&
            g.assessmentTitle.toLowerCase() === assessmentTitle.toLowerCase()
          )
      );
      return [...filtered, ...newRecords];
    });

    if (notifyParents) {
      const targetSubj = subjects.find((s) => s.id === subjectId);
      if (targetSubj) {
        const firstRec = records[0];
        const firstStudent = students.find((s) => s.id === firstRec?.studentId);

        records.forEach((rec, idx) => {
          const st = students.find((s) => s.id === rec.studentId);
          if (st) {
            const formattedMsg = formatWhatsAppMessage(
              st.parentName,
              st.name,
              targetSubj.name,
              assessmentTitle,
              rec.score,
              targetSubj.kkm,
              schoolSettings.schoolName
            );

            const notifItem: NotificationMessage = {
              id: `notif-${Date.now()}-${idx}`,
              studentId: st.id,
              studentName: st.name,
              parentName: st.parentName,
              parentPhone: st.parentPhone,
              title: `Nilai ${targetSubj.name} (${assessmentTitle})`,
              body: formattedMsg,
              subjectName: targetSubj.name,
              score: rec.score,
              assessmentType,
              timestamp: new Date().toISOString(),
              channel: 'WHATSAPP',
              status: 'TERKIRIM'
            };

            setNotifications((prev) => [notifItem, ...prev]);

            if (idx === 0) {
              setLatestDispatchedNotification(notifItem);
            }
          }
        });

        triggerAudioChime();
      }
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const updateStudentAttendance = (
    studentId: string,
    attendance: { sakit: number; izin: number; alpha: number }
  ) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, attendance } : s))
    );
  };

  const updateStudentNotes = (studentId: string, notes: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, notesWaliKelas: notes } : s))
    );
  };

  const updateStudentProfile = (studentId: string, updatedData: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ...updatedData } : s))
    );
  };

  const addNewStudent = (studentData: Omit<Student, 'id'>): string => {
    const newId = `std-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newStudent: Student = {
      ...studentData,
      id: newId
    };
    setStudents((prev) => [...prev, newStudent]);
    return newId;
  };

  const deleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    // Also remove associated grades
    setGrades((prev) => prev.filter((g) => g.studentId !== studentId));
    // Also remove notifications
    setNotifications((prev) => prev.filter((n) => n.studentId !== studentId));
  };

  const deleteGradeRecord = (gradeId: string) => {
    setGrades((prev) => prev.filter((g) => g.id !== gradeId));
  };

  const updateSchoolSettings = (newSettings: Partial<SchoolSettings>) => {
    setSchoolSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const sendCustomNotification = (studentId: string, customTitle: string, customBody: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const notif: NotificationMessage = {
      id: `notif-custom-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      title: customTitle,
      body: customBody,
      subjectName: 'Informasi Sekolah',
      score: 0,
      assessmentType: 'PENGUMUMAN',
      timestamp: new Date().toISOString(),
      channel: 'WHATSAPP',
      status: 'TERKIRIM'
    };

    setNotifications((prev) => [notif, ...prev]);
    setLatestDispatchedNotification(notif);
    triggerAudioChime();
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'DIBACA' } : n))
    );
  };

  const clearLatestNotification = () => {
    setLatestDispatchedNotification(null);
  };

  const resetToDefaultData = () => {
    setSchoolSettings(initialSchoolSettings);
    setStudents(initialStudents);
    setSubjects(initialSubjects);
    setGrades(initialGradeRecords);
    setNotifications(initialNotifications);
    setUsers(predefinedUsers);
    setCurrentUser(predefinedUsers[1]);
    setReportApproval(initialReportApproval);
    setSelectedStudentId('std-1');
    setSelectedSubjectId('subj-1');
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_settings`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_students`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_subjects`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_grades`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_notifications`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_users`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_current_user`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_report_approval`);
  };

  const exportAllDataAsJSON = () => {
    const exportPayload = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      schoolSettings,
      users,
      students,
      subjects,
      grades,
      notifications,
      reportApproval
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `BACKUP_SIAKAD_${(schoolSettings.schoolName || 'SEKOLAH').replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDataFromJSON = (jsonString: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.schoolSettings) setSchoolSettings(parsed.schoolSettings);
      if (Array.isArray(parsed.users)) setUsers(parsed.users);
      if (Array.isArray(parsed.students)) setStudents(parsed.students);
      if (Array.isArray(parsed.subjects)) setSubjects(parsed.subjects);
      if (Array.isArray(parsed.grades)) setGrades(parsed.grades);
      if (Array.isArray(parsed.notifications)) setNotifications(parsed.notifications);
      if (parsed.reportApproval) setReportApproval(parsed.reportApproval);

      triggerAudioChime();
      return {
        success: true,
        message: `Data cadangan berhasil dipulihkan! Total ${parsed.students?.length || 0} siswa dan ${parsed.users?.length || 0} pengguna telah dimuat & disimpan.`
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Gagal memulihkan file cadangan: Format JSON tidak valid (${err.message || 'Error'}).`
      };
    }
  };

  const unreadNotifCount = notifications.filter((n) => n.status !== 'DIBACA').length;

  return (
    <SchoolContext.Provider
      value={{
        schoolSettings,
        students,
        subjects,
        grades,
        notifications,
        users,
        activeRole,
        currentUser,
        reportApproval,
        selectedStudentId,
        selectedSubjectId,
        latestDispatchedNotification,
        unreadNotifCount,
        isLoginModalOpen,
        setActiveRole,
        setCurrentUser,
        login,
        logout,
        setIsLoginModalOpen,
        updateUserCredentials,
        updateUserProfilePhoto,
        updateUserProfile,
        addNewUser,
        deleteUser,
        approveReportCards,
        revokeReportApproval,
        setSelectedStudentId,
        setSelectedSubjectId,
        addOrUpdateGrade,
        batchSaveGrades,
        deleteGradeRecord,
        updateStudentAttendance,
        updateStudentNotes,
        updateStudentProfile,
        addNewStudent,
        deleteStudent,
        updateSchoolSettings,
        sendCustomNotification,
        markNotificationAsRead,
        clearLatestNotification,
        resetToDefaultData,
        triggerAudioChime,
        exportAllDataAsJSON,
        importDataFromJSON
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
