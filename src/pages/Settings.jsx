import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Smartphone,
  Wifi,
  Volume2,
  Database,
  Download,
  RefreshCw,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Settings = ({ onOpenVoice }) => {
  const { caregiver, isOnline, pendingSyncCount, patients, reminders, activities } = useApp();
  const [voiceVolume, setVoiceVolume] = useState(80);
  const [speechRate, setSpeechRate] = useState(1);
  const [offlineSyncInterval, setOfflineSyncInterval] = useState('Immediate');
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleClearCache = () => {
    if (confirm('Clear local offline cached database? Data will re-sync from initial seed.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2D2A3E] font-display tracking-tight">
          System & PWA Settings
        </h1>
        <p className="text-sm font-medium text-[#6E6A82] mt-1">
          Configure offline storage, PWA installation, speech synthesis, and caregiver access.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Caregiver Profile */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#2D2A3E]/5 card-shadow space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8B7EC8]/15 text-[#8B7EC8] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#2D2A3E] font-display">Caregiver Profile</h2>
              <p className="text-xs text-[#6E6A82]">Account details for system administration and patient management.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#2D2A3E] mb-1">Caregiver Name</label>
              <input
                type="text"
                defaultValue={caregiver.name}
                className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#2D2A3E]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2D2A3E] mb-1">Email Address</label>
              <input
                type="email"
                defaultValue={caregiver.email}
                className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#2D2A3E]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40"
              />
            </div>
          </div>
        </div>

        {/* Section 2: PWA & Offline Sync Diagnostics (Section 5.7 & FR-11) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#2D2A3E]/5 card-shadow space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#A8BBA0]/20 text-[#4F6A45] flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#2D2A3E] font-display">
                PWA & Offline Synchronization
              </h2>
              <p className="text-xs text-[#6E6A82]">
                Local database persistence (SQLite/LocalStorage) and Service Worker cache.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#2D2A3E]/5">
              <span className="text-[#6E6A82] font-semibold">Network State:</span>
              <div className="text-sm font-bold text-[#2D2A3E] mt-1 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {isOnline ? 'Online (Connected)' : 'Offline (Local Cache)'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#2D2A3E]/5">
              <span className="text-[#6E6A82] font-semibold">Local Storage Records:</span>
              <div className="text-sm font-bold text-[#8B7EC8] mt-1">
                {patients.length} Patients • {reminders.length} Reminders
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#2D2A3E]/5">
              <span className="text-[#6E6A82] font-semibold">Pending Cloud Sync:</span>
              <div className="text-sm font-bold text-[#4F6A45] mt-1">
                {pendingSyncCount} operations
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
            <button
              type="button"
              onClick={handleClearCache}
              className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold transition-colors"
            >
              Reset Local Storage Cache
            </button>
            <span className="text-[11px] text-[#6E6A82]">
              Service Worker active (vite-plugin-pwa workbox)
            </span>
          </div>
        </div>

        {/* Section 3: Voice Assistance & Accessibility Settings (FR-09) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#2D2A3E]/5 card-shadow space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E88C7D]/15 text-[#D05D4A] flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#2D2A3E] font-display">Voice Assistant & Audio</h2>
              <p className="text-xs text-[#6E6A82]">Elderly text-to-speech rate and speech recognition options.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#2D2A3E] mb-1">
                Voice Output Speed ({speechRate}x)
              </label>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-full accent-[#8B7EC8]"
              />
              <div className="flex justify-between text-[10px] text-[#6E6A82] mt-1">
                <span>Gentle (Elderly)</span>
                <span>Normal</span>
                <span>Fast</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FDFBF7] rounded-2xl border border-[#2D2A3E]/5">
              <div>
                <div className="font-bold text-[#2D2A3E]">Interactive Voice Testing</div>
                <div className="text-[11px] text-[#6E6A82]">Open assistant simulator</div>
              </div>
              <button
                type="button"
                onClick={onOpenVoice}
                className="px-3.5 py-1.5 bg-[#8B7EC8] text-white font-bold rounded-xl text-xs hover:bg-[#796BB9]"
              >
                Test Voice
              </button>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedAlert && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> Settings updated successfully!
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#8B7EC8] hover:bg-[#796BB9] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
