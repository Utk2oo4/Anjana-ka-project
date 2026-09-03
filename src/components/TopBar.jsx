import React, { useState } from 'react';
import { Search, Bell, Menu, Wifi, WifiOff, Download, Check, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TopBar = ({ onOpenMobileMenu, onOpenVoice, searchQuery, setSearchQuery }) => {
  const { caregiver, notifications, isOnline, pendingSyncCount, patients, selectedPatientId, setSelectedPatientId } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#2D2A3E]/5 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile menu toggle + Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[#2D2A3E] hover:bg-[#2D2A3E]/5 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A82]" />
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="Search patients, reminders, games..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#2D2A3E]/10 rounded-xl placeholder:text-[#6E6A82]/60 focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40 focus:border-[#8B7EC8] shadow-2xs transition-all"
          />
        </div>
      </div>

      {/* Right: Actions, Patient Switcher & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Patient Switcher */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-[#2D2A3E]/10 rounded-xl text-xs font-medium text-[#2D2A3E]">
          <span className="text-[#6E6A82]">Patient:</span>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="bg-transparent font-semibold text-[#8B7EC8] outline-none cursor-pointer"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.relationship})
              </option>
            ))}
          </select>
        </div>

        {/* Offline Status Pill */}
        <div
          title={isOnline ? 'Online - synced with server' : 'Offline - local storage mode active'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            isOnline ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-white border border-[#2D2A3E]/10 text-[#2D2A3E] hover:bg-[#2D2A3E]/5 transition-colors shadow-2xs"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#2D2A3E]/10 py-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 pb-2 border-b border-[#2D2A3E]/5 flex items-center justify-between">
                <div className="font-semibold text-sm text-[#2D2A3E]">Notifications & Alerts</div>
                <span className="text-[11px] text-[#6E6A82] font-medium">{notifications.length} recent</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-[#2D2A3E]/5">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3.5 hover:bg-[#FDFBF7] transition-colors">
                    <div className="flex items-start gap-2.5">
                      <span className="text-sm">
                        {n.type === 'alert' ? '🔔' : n.type === 'success' ? '🎯' : 'ℹ️'}
                      </span>
                      <div className="flex-1 text-xs">
                        <p className="text-[#2D2A3E] font-medium leading-snug">{n.text}</p>
                        <p className="text-[#6E6A82] text-[10px] mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Caregiver Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#2D2A3E]/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B7EC8] to-[#A8BBA0] flex items-center justify-center text-white text-xs font-bold shadow-2xs">
            {caregiver.name.charAt(0)}
          </div>
          <div className="hidden xl:block text-left text-xs">
            <p className="font-bold text-[#2D2A3E] leading-none">{caregiver.name}</p>
            <p className="text-[10px] text-[#6E6A82] mt-0.5">Caregiver</p>
          </div>
        </div>
      </div>
    </header>
  );
};
