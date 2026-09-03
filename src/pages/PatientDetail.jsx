import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Gamepad2,
  BarChart3,
  Bell,
  Heart,
  Edit,
  Send,
  Play,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Sparkles,
  Brain,
  Clock,
  Pill,
  Droplets
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AccuracyTrendChart, CategoryDonutChart, DailyActivityBarChart } from '../components/Charts';
import { SendAlertModal } from '../components/SendAlertModal';
import { CreateReminderModal } from '../components/CreateReminderModal';
import { AddFamilyMemberModal } from '../components/AddFamilyMemberModal';
import { CognitiveGameModal } from '../components/CognitiveGameModal';

export const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    patients,
    reminders,
    familyMembers,
    deleteFamilyMember,
    toggleReminderStatus,
    deleteReminder,
    performanceData
  } = useApp();

  const [activeTab, setActiveTab] = useState('performance'); // 'profile', 'games', 'performance', 'reminders', 'family'
  const [isSendAlertOpen, setIsSendAlertOpen] = useState(false);
  const [isCreateReminderOpen, setIsCreateReminderOpen] = useState(false);
  const [isAddFamilyOpen, setIsAddFamilyOpen] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [selectedGameForModal, setSelectedGameForModal] = useState({ name: 'Memory Match', icon: '🧩' });

  const patient = patients.find((p) => p.id === id) || patients[0];
  if (!patient) {
    return <div className="p-8 text-center">Patient profile not found.</div>;
  }

  const patientReminders = reminders.filter((r) => r.patientId === patient.id || r.patient === patient.name);
  const patientFamily = familyMembers.filter((fm) => fm.patientId === patient.id);

  const tabs = [
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'profile', label: 'Profile & Notes', icon: User },
    { id: 'games', label: 'Cognitive Games', icon: Gamepad2 },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'family', label: 'Family Memories', icon: Heart },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Back button & Breadcrumb */}
      <button
        onClick={() => navigate('/patients')}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#6E6A82] hover:text-[#2D2A3E] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Patient Directory</span>
      </button>

      {/* Patient Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D2A3E]/5 card-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#8B7EC8] to-[#A8BBA0] text-white flex items-center justify-center text-3xl font-bold font-display shadow-md shrink-0">
            {patient.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D2A3E] font-display">
                {patient.name}
              </h1>
              <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {patient.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-sm font-medium text-[#6E6A82] mt-1">
              Age: {patient.age} • {patient.relationship} • Primary Caregiver: Sarah Anderson
            </p>
            <p className="text-xs text-[#8B7EC8] font-semibold mt-1.5 flex items-center gap-1">
              <Brain className="w-3.5 h-3.5" />
              AI Cognitive Difficulty: <strong>{patient.currentDifficulty}</strong>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setSelectedGameForModal({ name: 'Memory Match', icon: '🧩' });
              setIsGameModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#A8BBA0]/20 hover:bg-[#A8BBA0]/30 text-[#4F6A45] text-xs font-bold border border-[#A8BBA0]/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>Launch Activity</span>
          </button>
          <button
            onClick={() => setIsSendAlertOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#2D2A3E]/15 hover:border-[#8B7EC8] text-[#2D2A3E] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 text-[#8B7EC8]" />
            <span>Send Alert</span>
          </button>
          <button
            onClick={() => setIsCreateReminderOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#8B7EC8] hover:bg-[#796BB9] text-white text-xs font-bold shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Reminder</span>
          </button>
        </div>
      </div>

      {/* Horizontal Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#2D2A3E]/10 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#8B7EC8] text-white shadow-sm'
                  : 'text-[#6E6A82] hover:text-[#2D2A3E] hover:bg-white/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Performance Tab (Faithful to Reference Image) */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* 3 Mini Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl p-5 border border-[#2D2A3E]/5 card-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#A8BBA0]/20 text-[#4F6A45] flex items-center justify-center font-bold text-xl">
                🧩
              </div>
              <div>
                <div className="text-xs text-[#6E6A82] font-semibold">Total Games</div>
                <div className="text-2xl font-extrabold text-[#2D2A3E] font-display">{patient.gamesPlayed}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#2D2A3E]/5 card-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#8B7EC8]/20 text-[#8B7EC8] flex items-center justify-center font-bold text-xl">
                🎯
              </div>
              <div>
                <div className="text-xs text-[#6E6A82] font-semibold">Avg Accuracy</div>
                <div className="text-2xl font-extrabold text-[#8B7EC8] font-display">{patient.avgAccuracy}%</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#2D2A3E]/5 card-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#6B9AC4]/20 text-[#3E74A5] flex items-center justify-center font-bold text-xl">
                📊
              </div>
              <div>
                <div className="text-xs text-[#6E6A82] font-semibold">Current Difficulty</div>
                <div className="text-2xl font-extrabold text-[#2D2A3E] font-display">{patient.currentDifficulty}</div>
              </div>
            </div>
          </div>

          {/* Main Chart Area & Recent Games Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-[#2D2A3E]/5 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#2D2A3E] font-display">Accuracy Over Time</h3>
                  <p className="text-xs text-[#6E6A82]">30-Day performance trend (Cognitive stability metric)</p>
                </div>
                <span className="text-xs font-bold text-[#8B7EC8] bg-[#8B7EC8]/10 px-3 py-1 rounded-full">
                  Last 30 days
                </span>
              </div>
              <AccuracyTrendChart data={performanceData.accuracyTrend} />
            </div>

            {/* Recent Games List */}
            <div className="bg-white rounded-3xl p-6 border border-[#2D2A3E]/5 card-shadow">
              <h3 className="text-lg font-bold text-[#2D2A3E] font-display mb-4">Recent Games</h3>
              <div className="divide-y divide-[#2D2A3E]/5">
                {performanceData.recentGames.map((rg, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#2D2A3E]">{rg.name}</p>
                      <p className="text-[#6E6A82] text-[11px]">{rg.date}</p>
                    </div>
                    <span className="font-extrabold text-sm text-[#8B7EC8] font-display">{rg.accuracy}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Reminders Strip */}
          <div className="bg-white rounded-3xl p-6 border border-[#2D2A3E]/5 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#2D2A3E] font-display">Upcoming Reminders for {patient.name}</h3>
              <button
                onClick={() => setActiveTab('reminders')}
                className="text-xs font-bold text-[#8B7EC8] hover:underline"
              >
                Manage All →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {patientReminders.slice(0, 3).map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#2D2A3E]/5 flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${
                    r.category === 'medicine' ? 'bg-amber-400' : r.category === 'hydration' ? 'bg-sky-400' : 'bg-rose-400'
                  }`} />
                  <div>
                    <p className="text-xs font-bold text-[#2D2A3E]">{r.title}</p>
                    <p className="text-[11px] text-[#6E6A82]">{r.time} ({r.recurrence})</p>
                  </div>
                </div>
              ))}
              {patientReminders.length === 0 && (
                <p className="text-xs text-[#6E6A82] col-span-3">No reminders set for this patient yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Profile & Notes */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D2A3E]/5 card-shadow space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#2D2A3E] font-display">Caregiver Clinical & Routine Notes</h3>
            <p className="text-xs text-[#6E6A82]">Important context for daily cognitive engagement and routines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4 p-5 rounded-2xl bg-[#FDFBF7] border border-[#2D2A3E]/5">
              <h4 className="font-bold text-sm text-[#2D2A3E]">Personal Information</h4>
              <p><strong className="text-[#6E6A82]">Full Name:</strong> {patient.name}</p>
              <p><strong className="text-[#6E6A82]">Age:</strong> {patient.age} years old</p>
              <p><strong className="text-[#6E6A82]">Relationship:</strong> {patient.relationship}</p>
              <p><strong className="text-[#6E6A82]">Status:</strong> {patient.status}</p>
              <p><strong className="text-[#6E6A82]">Emergency Contact:</strong> (555) 234-5678 (Dr. Patel)</p>
            </div>

            <div className="space-y-4 p-5 rounded-2xl bg-[#FDFBF7] border border-[#2D2A3E]/5">
              <h4 className="font-bold text-sm text-[#2D2A3E]">Caregiver Observations</h4>
              <p className="text-xs text-[#2D2A3E] leading-relaxed">
                {patient.medicalNotes || "Patient responds warmly to family photo memory recall and musical patterns. Enjoys morning memory matching sessions. Prefers hydration reminders at 2-hour intervals."}
              </p>
              <div className="pt-2">
                <span className="inline-block bg-[#8B7EC8]/10 text-[#8B7EC8] text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  Non-diagnostic cognitive engagement profile
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Cognitive Games */}
      {activeTab === 'games' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#2D2A3E]/5 card-shadow flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#2D2A3E] font-display">Assigned Cognitive Activities</h3>
              <p className="text-xs text-[#6E6A82]">FR-03 & FR-05 AI adaptive difficulty based on recent response metrics.</p>
            </div>
            <span className="text-xs font-bold text-[#8B7EC8] bg-[#8B7EC8]/10 px-3 py-1.5 rounded-xl">
              AI Difficulty: {patient.currentDifficulty}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Memory Match', category: 'Memory', icon: '🧩', desc: 'Card matching for visual memory recall' },
              { name: 'Pattern Spotter', category: 'Pattern Recognition', icon: '🔷', desc: 'Sequence and pattern identification' },
              { name: 'Object Finder', category: 'Object Recognition', icon: '🔍', desc: 'Everyday item naming and identification' },
              { name: 'Focus Timer', category: 'Attention', icon: '⏱️', desc: 'Concentration and sustained attention' },
              { name: 'Daily Recall', category: 'Daily Routine', icon: '📋', desc: 'Morning schedule recall quiz' }
            ].map((g, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-[#2D2A3E]/5 card-shadow flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#8B7EC8]/10 flex items-center justify-center text-2xl mb-4">
                    {g.icon}
                  </div>
                  <h4 className="font-bold text-base text-[#2D2A3E]">{g.name}</h4>
                  <p className="text-xs text-[#8B7EC8] font-semibold mt-0.5">{g.category}</p>
                  <p className="text-xs text-[#6E6A82] mt-2 leading-relaxed">{g.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#2D2A3E]/5">
                  <button
                    onClick={() => {
                      setSelectedGameForModal(g);
                      setIsGameModalOpen(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#8B7EC8] hover:bg-[#796BB9] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Launch & Test Game</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Reminders */}
      {activeTab === 'reminders' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D2A3E]/5 card-shadow space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#2D2A3E] font-display">Patient Reminders & Schedules</h3>
              <p className="text-xs text-[#6E6A82]">FR-06 Active medicine, hydration, and appointment alerts for {patient.name}</p>
            </div>
            <button
              onClick={() => setIsCreateReminderOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#8B7EC8] hover:bg-[#796BB9] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Reminder</span>
            </button>
          </div>

          <div className="divide-y divide-[#2D2A3E]/5">
            {patientReminders.map((r) => (
              <div key={r.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleReminderStatus(r.id)}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs transition-colors ${
                      r.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[#2D2A3E]/20 bg-white hover:border-[#8B7EC8]'
                    }`}
                  >
                    {r.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <div>
                    <h4 className={`text-sm font-bold ${r.status === 'completed' ? 'line-through text-[#6E6A82]' : 'text-[#2D2A3E]'}`}>
                      {r.title}
                    </h4>
                    <p className="text-xs text-[#6E6A82] mt-0.5">
                      {r.time} • Recurrence: <span className="font-semibold text-[#2D2A3E]">{r.recurrence}</span> • Category: {r.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    r.status === 'completed' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {r.status}
                  </span>
                  <button
                    onClick={() => deleteReminder(r.id)}
                    className="p-1.5 text-[#6E6A82] hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {patientReminders.length === 0 && (
              <div className="py-12 text-center text-xs text-[#6E6A82]">
                No reminders scheduled for this patient. Click "Add Reminder" to schedule one.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Family Memories */}
      {activeTab === 'family' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#2D2A3E]/5 card-shadow flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#2D2A3E] font-display">Personalized Family Memories</h3>
              <p className="text-xs text-[#6E6A82]">FR-07 Family photos and hints used in personalized cognitive activities</p>
            </div>
            <button
              onClick={() => setIsAddFamilyOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#8B7EC8] hover:bg-[#796BB9] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Memory</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {patientFamily.map((fm) => (
              <div key={fm.id} className="bg-white rounded-3xl p-6 border border-[#2D2A3E]/5 card-shadow flex flex-col justify-between">
                <div>
                  <div
                    style={{ backgroundColor: fm.photoColor || '#8B7EC8' }}
                    className="w-16 h-16 rounded-2xl text-white flex items-center justify-center font-bold text-2xl mb-4 shadow-sm"
                  >
                    {fm.name.charAt(0)}
                  </div>
                  <h4 className="text-base font-bold text-[#2D2A3E]">{fm.name}</h4>
                  <p className="text-xs font-semibold text-[#8B7EC8] mt-0.5">{fm.relationship}</p>
                  {fm.favoriteMemory && (
                    <p className="text-xs text-[#6E6A82] mt-2 italic">"{fm.favoriteMemory}"</p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-[#2D2A3E]/5 flex justify-between items-center text-xs">
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                    Active in recall game
                  </span>
                  <button
                    onClick={() => deleteFamilyMember(fm.id)}
                    className="text-[#6E6A82] hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <SendAlertModal
        isOpen={isSendAlertOpen}
        onClose={() => setIsSendAlertOpen(false)}
        defaultPatientId={patient.id}
      />
      <CreateReminderModal
        isOpen={isCreateReminderOpen}
        onClose={() => setIsCreateReminderOpen(false)}
        defaultPatientId={patient.id}
      />
      <AddFamilyMemberModal
        isOpen={isAddFamilyOpen}
        onClose={() => setIsAddFamilyOpen(false)}
        patientId={patient.id}
      />
      <CognitiveGameModal
        isOpen={isGameModalOpen}
        onClose={() => setIsGameModalOpen(false)}
        game={selectedGameForModal}
        patient={patient}
      />
    </div>
  );
};
