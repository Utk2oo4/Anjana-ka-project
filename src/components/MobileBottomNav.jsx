import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Gamepad2,
  Bell,
  HeartHandshake
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileBottomNav = () => {
  const { switchPortal, selectedPatientId, reminders } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const activeRemindersCount = reminders.filter(r => r.status === 'active').length;

  const handleLaunchPatient = () => {
    switchPortal('patient', selectedPatientId);
    navigate('/patient');
  };

  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/patients', label: 'Patients', icon: Users },
    {
      isAction: true,
      label: 'Patient View',
      icon: HeartHandshake,
      onClick: handleLaunchPatient
    },
    { to: '/games', label: 'Games', icon: Gamepad2 },
    {
      to: '/reminders',
      label: 'Reminders',
      icon: Bell,
      badge: activeRemindersCount > 0 ? activeRemindersCount : null
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#2D2A3E]/10 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.04)] select-none">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item, idx) => {
          if (item.isAction) {
            return (
              <button
                key={idx}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center flex-1 py-1 px-1 touch-press cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B7EC8] to-[#9F91D9] text-white flex items-center justify-center shadow-md -mt-5 border-2 border-white group-active:scale-95 transition-transform">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#8B7EC8] mt-1">
                  {item.label}
                </span>
              </button>
            );
          }

          const isActive = location.pathname === item.to;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className="flex flex-col items-center justify-center flex-1 py-1 px-1 touch-press cursor-pointer transition-colors relative"
            >
              <div
                className={`p-1.5 rounded-xl transition-all relative ${
                  isActive
                    ? 'bg-[#8B7EC8]/15 text-[#8B7EC8]'
                    : 'text-[#6E6A82] hover:text-[#2D2A3E]'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-bold mt-0.5 tracking-tight ${
                  isActive ? 'text-[#8B7EC8]' : 'text-[#6E6A82]'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
