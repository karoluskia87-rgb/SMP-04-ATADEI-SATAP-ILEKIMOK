/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Header } from './components/Header';
import { TeacherDashboard } from './components/TeacherDashboard/TeacherDashboard';
import { ParentDashboard } from './components/ParentPortal/ParentDashboard';
import { PrincipalDashboard } from './components/Principal/PrincipalDashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { ReportCardPreview } from './components/ReportCard/ReportCardPreview';
import { MobileNotificationSimulator } from './components/Notifications/MobileNotificationSimulator';
import { AiDescriptionModal } from './components/AiAssistant/AiDescriptionModal';
import { NotificationToast } from './components/Notifications/NotificationToast';
import { LoginModal } from './components/Auth/LoginModal';

function MainLayout() {
  const { activeRole, currentUser, isLoginModalOpen, setIsLoginModalOpen } = useSchool();
  const [isMobileSimulatorOpen, setIsMobileSimulatorOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Application Header */}
      <Header
        onOpenMobileSimulator={() => setIsMobileSimulatorOpen((prev) => !prev)}
        isMobileSimulatorOpen={isMobileSimulatorOpen}
        onOpenAiHelper={() => setIsAiModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!currentUser ? (
          <LoginModal isOpen={true} asPage={true} />
        ) : (
          <>
            {activeRole === 'PRINCIPAL' && <PrincipalDashboard />}

            {activeRole === 'TEACHER' && (
              <TeacherDashboard onOpenAiHelper={() => setIsAiModalOpen(true)} />
            )}

            {activeRole === 'PARENT' && <ParentDashboard />}

            {activeRole === 'ADMIN' && <AdminDashboard />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Sistem Informasi Akademik & Rapor Cloud. Kemendikbudristek Kurikulum Merdeka.</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Sinkronisasi Nilai Real-Time</span>
            <span>•</span>
            <span>Notifikasi WhatsApp Otomatis</span>
            <span>•</span>
            <span>e-Rapor Sah Ber-barcode</span>
          </div>
        </div>
      </footer>

      {/* Real-time Toast Alert */}
      <NotificationToast onOpenMobileSimulator={() => setIsMobileSimulatorOpen(true)} />

      {/* Smartphone Notification Simulator Drawer */}
      {isMobileSimulatorOpen && (
        <MobileNotificationSimulator onClose={() => setIsMobileSimulatorOpen(false)} />
      )}

      {/* AI Description Generator Modal */}
      <AiDescriptionModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Account Login / Switch Modal */}
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <SchoolProvider>
      <MainLayout />
    </SchoolProvider>
  );
}
