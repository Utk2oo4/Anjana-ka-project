import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Gamepad2,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Mic,
  X,
  HeartHandshake
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar = ({ mobileOpen, setMobileOpen, onOpenVoice }) => {
  const { caregiver, logout, isOnline, pendingSyncCount, switchPortal, selectedPatientId } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/patients', label: 'Patients', icon: Users },
    { to: '/games', label: 'Games & AI', icon: Gamepad2 },
    { to: '/reminders', label: 'Reminders', icon: Bell },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#2D2A3E] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B7EC8] to-[#A8BBA0] flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white font-display flex items-center gap-1.5">
                Anjana
              </h1>
              <p className="text-xs text-[#A8BBA0] font-medium tracking-wide">Caretaker Portal</p>
            </div>
          </div>
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-white/70 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Action Shortcuts: Patient Portal & Voice Assistant */}
        <div className="px-4 pt-4 space-y-2">
          {/* Switch to Patient Portal */}
          <button
            onClick={() => {
              if (setMobileOpen) setMobileOpen(false);
              switchPortal('patient', selectedPatientId);
              navigate('/patient');
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B7EC8] to-[#9F91D9] hover:from-[#7B6EB8] hover:to-[#8E80C8] text-white text-sm font-semibold transition-all shadow-sm group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-4 h-4 text-white" />
            </div>
            <div className="text-left flex-1">
              <div className="text-xs font-bold text-white">Patient Portal</div>
              <div className="text-[10px] text-white/80">Launch interactive view</div>
            </div>
          </button>

          {/* Voice Assistant Shortcut */}
          <button
            onClick={() => {
              if (setMobileOpen) setMobileOpen(false);
              if (onOpenVoice) onOpenVoice();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white text-sm font-medium transition-all group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#8B7EC8]/40 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Mic className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="text-left flex-1">
              <div className="text-xs font-semibold text-white">Voice Assistant</div>
              <div className="text-[10px] text-white/60">Audio commands</div>
            </div>
          </button>
        </div>

        {/* Caregiver Navigation Items */}
        <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#8B7EC8] text-white shadow-sm font-semibold translate-x-1'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Offline / Sync Status Indicator */}
        <div className="px-4 py-3 mx-4 mb-3 rounded-xl bg-white/5 border border-white/10 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-white/80">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'
                }`}
              />
              {isOnline ? 'Cloud Synced' : 'Offline Mode (Local)'}
            </span>
            {pendingSyncCount > 0 && (
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                {pendingSyncCount} pending
              </span>
            )}
          </div>
        </div>

        {/* Caregiver Profile & Logout */}
        <div className="p-4 border-t border-white/10 bg-black/15 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-[#8B7EC8]/30 border border-[#8B7EC8]/40 flex items-center justify-center text-sm font-semibold text-white shrink-0">
              {caregiver.name.charAt(0)}
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-white truncate">{caregiver.name}</p>
              <p className="text-xs text-white/50 truncate">Caretaker</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="text-white/60 hover:text-rose-300 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
