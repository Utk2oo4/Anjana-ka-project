import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { PatientDetail } from './pages/PatientDetail';
import { Games } from './pages/Games';
import { Reminders } from './pages/Reminders';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { PatientPortal } from './pages/PatientPortal';
import { MobileBottomNav } from './components/MobileBottomNav';

// Layout wrapper for Caretaker authenticated routes
const AppLayout = ({ children, onOpenVoice }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex text-[#2D2A3E]">
      {/* Caretaker Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenVoice={onOpenVoice}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <TopBar
          onOpenMobileMenu={() => setMobileOpen(true)}
          onOpenVoice={onOpenVoice}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 pb-28 lg:pb-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile-first bottom navigation bar for Caregiver */}
      <MobileBottomNav />

      <PWAInstallPrompt />
    </div>
  );
};

// Route protection for Caretaker portal
const ProtectedRoute = ({ children, onOpenVoice }) => {
  const { isAuthenticated, userRole } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // If user signed in as a patient, redirect them to the Patient Portal
  if (userRole === 'patient') {
    return <Navigate to="/patient" replace />;
  }
  return <AppLayout onOpenVoice={onOpenVoice}>{children}</AppLayout>;
};

// Route protection for Patient portal
const PatientProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = () => {
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const { userRole } = useApp();

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Dedicated Patient Portal Route */}
        <Route
          path="/patient"
          element={
            <PatientProtectedRoute>
              <PatientPortal />
            </PatientProtectedRoute>
          }
        />

        {/* Caretaker Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute onOpenVoice={() => setIsVoiceOpen(true)}>
              <Dashboard onOpenVoice={() => setIsVoiceOpen(true)} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patients"
          element={
            <ProtectedRoute onOpenVoice={() => setIsVoiceOpen(true)}>
              <Patients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patients/:id"
          element={
            <ProtectedRoute onOpenVoice={() => setIsVoiceOpen(true)}>
              <PatientDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/games"
          element={
            <ProtectedRoute onOpenVoice={() => setIsVoiceOpen(true)}>
              <Games />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reminders"
          element={
            <ProtectedRoute onOpenVoice={() => setIsVoiceOpen(true)}>
              <Reminders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute onOpenVoice={() => setIsVoiceOpen(true)}>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute onOpenVoice={() => setIsVoiceOpen(true)}>
              <Settings onOpenVoice={() => setIsVoiceOpen(true)} />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={userRole === 'patient' ? '/patient' : '/'} replace />}
        />
      </Routes>

      {/* Global Voice Assistant Modal for Caregiver Portal */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
