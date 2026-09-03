import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Gamepad2,
  Bell,
  TrendingUp,
  UserPlus,
  PlusCircle,
  Send,
  Play,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/StatCard';
import { AddPatientModal } from '../components/AddPatientModal';
import { CreateReminderModal } from '../components/CreateReminderModal';
import { SendAlertModal } from '../components/SendAlertModal';
import { CognitiveGameModal } from '../components/CognitiveGameModal';

export const Dashboard = ({ onOpenVoice }) => {
  const { caregiver, stats, activities, patients, reminders, selectedPatient } = useApp();
  const navigate = useNavigate();

  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isCreateReminderOpen, setIsCreateReminderOpen] = useState(false);
  const [isSendAlertOpen, setIsSendAlertOpen] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2D2A3E] font-display tracking-tight">
            Good morning, {caregiver.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm font-medium text-[#6E6A82] mt-1 flex items-center gap-2">
            <span>{todayStr}</span>
            <span>•</span>
            <span className="text-[#8B7EC8] font-semibold">Caregiver Portal</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenVoice}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#2D2A3E]/10 hover:border-[#8B7EC8] text-[#2D2A3E] text-xs font-bold shadow-2xs hover:shadow-xs transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#8B7EC8]" />
            <span>Voice Assistant</span>
          </button>
          <button
            onClick={() => setIsCreateReminderOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#8B7EC8] hover:bg-[#796BB9] text-white text-xs font-bold shadow-2xs hover:shadow-xs transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Set Reminder</span>
          </button>
        </div>
      </div>

      {/* 4 Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Active Patients"
          value={stats.activePatients}
          subtitle="Profiles monitored"
          icon={Users}
          color="lavender"
          trend="+1 this month"
        />
        <StatCard
          title="Games Played Today"
          value={stats.gamesPlayedToday}
          subtitle="Cognitive sessions"
          icon={Gamepad2}
          color="sage"
          trend="94% completion"
        />
        <StatCard
          title="Reminders Due"
          value={stats.remindersDue}
          subtitle="Active schedules"
          icon={Bell}
          color="coral"
          trend="2 completed"
        />
        <StatCard
          title="Average Accuracy"
          value={`${stats.avgAccuracy}%`}
          subtitle="Across all activities"
          icon={TrendingUp}
          color="sky"
          trend="+4% vs last week"
        />
      </div>

      {/* Main Grid: Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-[#2D2A3E]/5 card-shadow">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-[#2D2A3E] font-display">Recent Activity</h2>
              <p className="text-xs text-[#6E6A82] mt-0.5">Live cognitive completions & patient alerts</p>
            </div>
            <button
              onClick={() => navigate('/analytics')}
              className="text-xs font-bold text-[#8B7EC8] hover:text-[#796BB9] flex items-center gap-1"
            >
              <span>View Analytics</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-[#2D2A3E]/5">
            {activities.slice(0, 6).map((act) => (
              <div key={act.id} className="py-3.5 flex items-start justify-between gap-4 group">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FDFBF7] border border-[#2D2A3E]/5 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
                    {act.icon || '📌'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2D2A3E] leading-snug">{act.message}</p>
                    {act.detail && (
                      <p className="text-xs text-[#6E6A82] mt-0.5">{act.detail}</p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-[#6E6A82] whitespace-nowrap font-medium">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & Featured Patient Card */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 border border-[#2D2A3E]/5 card-shadow space-y-4">
            <h2 className="text-xl font-bold text-[#2D2A3E] font-display">Quick Actions</h2>
            <div className="space-y-2.5">
              <button
                onClick={() => setIsAddPatientOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-[#8B7EC8] hover:bg-[#796BB9] text-white font-bold text-xs shadow-2xs flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <UserPlus className="w-4 h-4" />
                  <span>Add New Patient</span>
                </div>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsCreateReminderOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-[#8B7EC8]/10 hover:bg-[#8B7EC8]/20 text-[#8B7EC8] font-bold text-xs border border-[#8B7EC8]/20 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4" />
                  <span>Set Medicine/Routine Reminder</span>
                </div>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsSendAlertOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-[#E88C7D]/10 hover:bg-[#E88C7D]/20 text-[#D05D4A] font-bold text-xs border border-[#E88C7D]/20 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Send className="w-4 h-4" />
                  <span>Send Custom Patient Alert</span>
                </div>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsGameModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-[#A8BBA0]/20 hover:bg-[#A8BBA0]/30 text-[#4F6A45] font-bold text-xs border border-[#A8BBA0]/30 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Play className="w-4 h-4" />
                  <span>Launch Cognitive Game Simulator</span>
                </div>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Patient Spotlight Card */}
          {selectedPatient && (
            <div className="bg-gradient-to-br from-[#8B7EC8]/10 via-[#FDFBF7] to-[#A8BBA0]/10 rounded-3xl p-6 border border-[#8B7EC8]/20 card-shadow space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8B7EC8] uppercase tracking-wider">Spotlight Patient</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#8B7EC8] text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#2D2A3E] leading-snug">{selectedPatient.name}</h3>
                  <p className="text-xs text-[#6E6A82]">Age: {selectedPatient.age} • {selectedPatient.relationship}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2D2A3E]/5 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-[#2D2A3E]/5">
                  <div className="text-[10px] text-[#6E6A82] font-semibold">Games Played</div>
                  <div className="text-base font-bold text-[#2D2A3E] mt-0.5">{selectedPatient.gamesPlayed}</div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#2D2A3E]/5">
                  <div className="text-[10px] text-[#6E6A82] font-semibold">Accuracy</div>
                  <div className="text-base font-bold text-[#8B7EC8] mt-0.5">{selectedPatient.avgAccuracy}%</div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/patients/${selectedPatient.id}`)}
                className="w-full py-2.5 text-center text-xs font-bold text-[#8B7EC8] hover:underline"
              >
                View Full Patient Profile →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddPatientModal isOpen={isAddPatientOpen} onClose={() => setIsAddPatientOpen(false)} />
      <CreateReminderModal isOpen={isCreateReminderOpen} onClose={() => setIsCreateReminderOpen(false)} />
      <SendAlertModal isOpen={isSendAlertOpen} onClose={() => setIsSendAlertOpen(false)} />
      <CognitiveGameModal
        isOpen={isGameModalOpen}
        onClose={() => setIsGameModalOpen(false)}
        game={{ name: 'Memory Match', icon: '🧩' }}
        patient={selectedPatient}
      />
    </div>
  );
};
