import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

// Layout wrapper for authenticated routes
const AppLayout = ({ children, onOpenVoice }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex text-[#2D2A3E]">
      {/* Sidebar */}
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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <PWAInstallPrompt />
    </div>
  );
};

// Route protection component
const ProtectedRoute = ({ children, onOpenVoice }) => {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <AppLayout onOpenVoice={onOpenVoice}>{children}</AppLayout>;
};

const AppContent = () => {
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Voice Assistant Simulator Modal */}
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
