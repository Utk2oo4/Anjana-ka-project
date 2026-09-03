import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Pill,
  Droplets,
  Calendar,
  ListTodo,
  CheckCircle2,
  Trash2,
  Edit,
  Send,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CreateReminderModal } from '../components/CreateReminderModal';
import { SendAlertModal } from '../components/SendAlertModal';

export const Reminders = () => {
  const { reminders, toggleReminderStatus, deleteReminder, patients, sendCustomAlert } = useApp();
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'medicine', 'hydration', 'appointment', 'routine'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Quick alert form state
  const [alertPatientId, setAlertPatientId] = useState(patients[0]?.id || '');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSentFeedback, setAlertSentFeedback] = useState(false);

  const tabs = [
    { id: 'All', label: 'All Reminders' },
    { id: 'medicine', label: 'Medicine' },
    { id: 'hydration', label: 'Hydration' },
    { id: 'appointment', label: 'Appointments' },
    { id: 'routine', label: 'Routine' },
  ];

  const filteredReminders = reminders.filter((r) => {
    if (activeTab === 'All') return true;
    return r.category.toLowerCase() === activeTab.toLowerCase();
  });

  const handleSendAlert = (e) => {
    e.preventDefault();
    if (!alertMessage) return;

    const patient = patients.find(p => p.id === alertPatientId) || patients[0];
    sendCustomAlert(patient.name, alertMessage);
    setAlertMessage('');
    setAlertSentFeedback(true);
    setTimeout(() => setAlertSentFeedback(false), 3000);
  };

  const getCategoryDotColor = (cat) => {
    switch (cat.toLowerCase()) {
      case 'medicine': return 'bg-amber-400';
      case 'hydration': return 'bg-sky-400';
      case 'appointment': return 'bg-rose-400';
      case 'routine': return 'bg-emerald-400';
      default: return 'bg-[#8B7EC8]';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header (Faithful to Reference Image) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2D2A3E] font-display tracking-tight">
            Reminders & Alerts
          </h1>
          <p className="text-sm font-medium text-[#6E6A82] mt-1">
            Section 5.4 — Medicine, hydration, appointments, and routine alerts for all patients.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-[#8B7EC8] hover:bg-[#796BB9] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Reminder</span>
        </button>
      </div>

      {/* Filter Tabs (Underline active style from reference) */}
      <div className="flex items-center gap-6 border-b border-[#2D2A3E]/10 overflow-x-auto text-sm font-semibold pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 relative transition-colors whitespace-nowrap cursor-pointer ${
                isActive ? 'text-[#2D2A3E] font-bold' : 'text-[#6E6A82] hover:text-[#2D2A3E]'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D2A3E] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Stacked Full-Width Reminder Cards (Faithful to Reference Image) */}
      <div className="space-y-3.5">
        {filteredReminders.map((r) => {
          const isCompleted = r.status === 'completed';
          return (
            <div
              key={r.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all card-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isCompleted ? 'border-[#2D2A3E]/5 bg-white/70 opacity-75' : 'border-[#2D2A3E]/10 hover:border-[#8B7EC8]/30'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Category Color Dot */}
                <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${getCategoryDotColor(r.category)}`} />

                {/* Info Text */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                  <span className={`font-bold text-[#2D2A3E] ${isCompleted ? 'line-through text-[#6E6A82]' : ''}`}>
                    {r.title}
                  </span>
                  <span className="text-[#6E6A82]">—</span>
                  <span className="font-semibold text-[#8B7EC8]">{r.patient}</span>
                  <span className="text-[#6E6A82]">—</span>
                  <span className="text-[#6E6A82] font-medium">{r.time}</span>
                  <span className="text-[#6E6A82] font-medium">({r.recurrence})</span>
                  <span className="text-[#6E6A82]">—</span>
                  <span
                    className={`font-semibold text-xs ${
                      r.status === 'active'
                        ? 'text-emerald-600'
                        : r.status === 'upcoming'
                        ? 'text-purple-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {r.status === 'active' ? 'Active' : r.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => toggleReminderStatus(r.id)}
                  title={isCompleted ? 'Mark Active' : 'Mark Completed'}
                  className={`p-2 rounded-xl border text-xs font-semibold transition-colors ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-[#FDFBF7] text-[#6E6A82] border-[#2D2A3E]/10 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteReminder(r.id)}
                  title="Delete Reminder"
                  className="p-2 rounded-xl bg-[#FDFBF7] text-rose-500 border border-rose-200/50 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredReminders.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#2D2A3E]/5 card-shadow">
            <p className="text-sm font-bold text-[#2D2A3E]">No reminders found for this category.</p>
            <p className="text-xs text-[#6E6A82] mt-1">Tap "Create Reminder" above to add one.</p>
          </div>
        )}
      </div>

      {/* Send Custom Alert Section (Faithful to Reference Image) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D2A3E]/5 card-shadow space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D2A3E] font-display">Send Custom Alert</h2>
          <p className="text-xs text-[#6E6A82]">FR-08 Send an immediate alert notification to patient's device.</p>
        </div>

        <form onSubmit={handleSendAlert} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5">Select Patient</label>
              <select
                value={alertPatientId}
                onChange={(e) => setAlertPatientId(e.target.value)}
                className="w-full px-3.5 py-3 text-sm bg-[#FDFBF7] border border-[#2D2A3E]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40 font-semibold"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.relationship})</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5">Message Text</label>
              <input
                type="text"
                required
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                placeholder="e.g. Afternoon tea and gentle walk time! Drink some fresh water."
                className="w-full px-4 py-3 text-sm bg-[#FDFBF7] border border-[#2D2A3E]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {alertSentFeedback ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> Alert successfully transmitted to patient device!
              </span>
            ) : <div />}

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#8B7EC8] hover:bg-[#796BB9] text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Alert</span>
            </button>
          </div>
        </form>
      </div>

      {/* Create Reminder Modal */}
      <CreateReminderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
