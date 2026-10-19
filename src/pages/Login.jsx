import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Heart,
  Shield,
  ArrowRight,
  CheckCircle2,
  Users,
  UserCheck,
  Gamepad2,
  Clock,
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Login = () => {
  const { loginCaregiver, loginPatient, patients } = useApp();
  const navigate = useNavigate();

  // Tab: 'caregiver' or 'patient'
  const [selectedPortal, setSelectedPortal] = useState('caregiver');
  const [email, setEmail] = useState('sarah.anderson@example.com');
  const [password, setPassword] = useState('password123');

  const handleCaregiverSubmit = (e) => {
    e.preventDefault();
    loginCaregiver(email, password);
    navigate('/');
  };

  const handlePatientSelect = (patientId) => {
    loginPatient(patientId);
    navigate('/patient');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl w-full bg-white rounded-3xl sm:rounded-[32px] overflow-hidden card-shadow border border-[#2D2A3E]/5 grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Warm Illustration & Brand Story (compact on mobile) */}
        <div className="bg-gradient-to-br from-[#8B7EC8] via-[#8B7EC8]/90 to-[#A8BBA0] p-6 sm:p-10 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#A8BBA0]/30 rounded-full blur-2xl pointer-events-none" />

          {/* Top Brand */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">Anjana</h1>
              <p className="text-[11px] sm:text-xs text-white/80 font-medium">Cognitive Care Platform (PWA)</p>
            </div>
          </div>

          {/* Center Graphic & Quote */}
          <div className="relative z-10 my-4 lg:my-10 space-y-3 sm:space-y-6">
            <div className="hidden sm:flex w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/15 backdrop-blur-md items-center justify-center text-white shadow-inner">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white/20" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display leading-tight">
              Gentle care, empowered by cognitive AI.
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium max-w-md hidden sm:block">
              A dual-portal ecosystem: caregivers monitor longitudinal health and schedules, while elderly patients enjoy an accessible space for daily memory games and routines.
            </p>

            <div className="pt-1 space-y-2 text-xs text-white/90 hidden sm:block">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                <span><strong>Caretaker Portal:</strong> Analytics, patient monitoring & difficulty control</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                <span><strong>Patient Portal:</strong> Memory games, audio reminders & family album</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust disclaimer */}
          <div className="relative z-10 text-[10px] sm:text-[11px] text-white/70 flex items-center gap-1.5 pt-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Designed for cognitive support & daily engagement</span>
          </div>
        </div>

        {/* Right Side: Dual-Portal Login Switcher */}
        <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            {/* Portal Tab Switcher */}
            <div>
              <label className="block text-xs font-bold text-[#6E6A82] uppercase tracking-wider mb-2">
                Select Portal
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#FDFBF7] rounded-2xl border border-[#2D2A3E]/10">
                <button
                  type="button"
                  onClick={() => setSelectedPortal('caregiver')}
                  className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedPortal === 'caregiver'
                      ? 'bg-[#2D2A3E] text-white shadow-xs'
                      : 'text-[#6E6A82] hover:text-[#2D2A3E]'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Caretaker Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPortal('patient')}
                  className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedPortal === 'patient'
                      ? 'bg-[#8B7EC8] text-white shadow-xs'
                      : 'text-[#6E6A82] hover:text-[#2D2A3E]'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>Patient Portal</span>
                </button>
              </div>
            </div>

            {/* CARETAKER PORTAL FORM */}
            {selectedPortal === 'caregiver' ? (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#2D2A3E] font-display">
                    Caretaker Sign In
                  </h3>
                  <p className="text-xs text-[#6E6A82] mt-1 font-medium">
                    Monitor patient stability, adjust cognitive difficulty, and manage schedules.
                  </p>
                </div>

                <form onSubmit={handleCaregiverSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5 uppercase tracking-wider">
                      Caretaker Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="caregiver@example.com"
                      className="w-full px-4 py-3 text-sm bg-[#FDFBF7] border border-[#2D2A3E]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40 focus:border-[#8B7EC8] transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-[#2D2A3E] uppercase tracking-wider">
                        Password
                      </label>
                      <a href="#forgot" className="text-xs font-semibold text-[#8B7EC8] hover:underline">
                        Forgot?
                      </a>
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 text-sm bg-[#FDFBF7] border border-[#2D2A3E]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40 focus:border-[#8B7EC8] transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#2D2A3E] hover:bg-[#1F1C2B] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Sign In to Caretaker Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      loginCaregiver('sarah.anderson@example.com');
                      navigate('/');
                    }}
                    className="text-xs font-bold text-[#8B7EC8] hover:text-[#796BB9] underline underline-offset-4 cursor-pointer"
                  >
                    ⚡ Quick Demo 1-Click Login (Sarah Anderson)
                  </button>
                </div>
              </div>
            ) : (
              /* PATIENT PORTAL SELECTION */
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#2D2A3E] font-display">
                    Who is playing today? 🌸
                  </h3>
                  <p className="text-xs text-[#6E6A82] mt-1 font-medium">
                    Tap your profile to open your daily memory games, reminders, and family photos.
                  </p>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
                  {patients.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => handlePatientSelect(patient.id)}
                      className="w-full p-3.5 rounded-2xl border-2 border-[#2D2A3E]/10 hover:border-[#8B7EC8] hover:bg-[#8B7EC8]/5 bg-[#FDFBF7] transition-all flex items-center justify-between group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B7EC8] to-[#A8BBA0] text-white flex items-center justify-center font-bold text-lg font-display shadow-xs group-hover:scale-105 transition-transform">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm sm:text-base text-[#2D2A3E] group-hover:text-[#8B7EC8] transition-colors">
                            {patient.name}
                          </h4>
                          <p className="text-xs text-[#6E6A82]">
                            Age: {patient.age} • {patient.relationship}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#8B7EC8]/10 text-[#8B7EC8]">
                          {patient.currentDifficulty}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#8B7EC8] shadow-xs group-hover:bg-[#8B7EC8] group-hover:text-white transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <p className="text-[11px] text-[#6E6A82] text-center pt-2">
                  No passwords required for patients for smooth cognitive accessibility.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
