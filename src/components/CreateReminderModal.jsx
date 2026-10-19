import React, { useState } from 'react';
import { X, Bell, Pill, Droplets, Calendar, ListTodo } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CreateReminderModal = ({ isOpen, onClose, defaultPatientId }) => {
  const { patients, addReminder } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    patientId: defaultPatientId || (patients[0]?.id || ''),
    category: 'medicine',
    time: '08:00 AM',
    recurrence: 'Daily',
  });

  const categories = [
    { id: 'medicine', label: 'Medicine', icon: Pill, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'hydration', label: 'Hydration', icon: Droplets, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { id: 'appointment', label: 'Appointment', icon: Calendar, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { id: 'routine', label: 'Daily Routine', icon: ListTodo, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    const patient = patients.find(p => p.id === formData.patientId) || patients[0];

    addReminder({
      title: formData.title,
      patient: patient.name,
      patientId: patient.id,
      category: formData.category,
      time: formData.time,
      recurrence: formData.recurrence,
    });

    onClose();
    setFormData({
      title: '',
      patientId: patients[0]?.id || '',
      category: 'medicine',
      time: '08:00 AM',
      recurrence: 'Daily',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 card-shadow border border-[#2D2A3E]/10 relative animate-bottom-sheet sm:animate-none max-h-[92dvh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#6E6A82] hover:text-[#2D2A3E] hover:bg-[#FDFBF7]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#8B7EC8]/15 flex items-center justify-center text-[#8B7EC8]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#2D2A3E] font-display">Create Reminder</h3>
            <p className="text-xs text-[#6E6A82]">FR-06 Schedule medicines, hydration, or appointments</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = formData.category === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-[#8B7EC8] bg-[#8B7EC8]/10 text-[#8B7EC8] shadow-xs'
                        : 'border-[#2D2A3E]/10 bg-white text-[#6E6A82] hover:bg-[#FDFBF7]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5">Reminder Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Donepezil 5mg with breakfast"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#2D2A3E]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5">Patient</label>
              <select
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#2D2A3E]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5">Time / Schedule</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g. 8:00 AM or Every 2 hours"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#2D2A3E]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5">Recurrence</label>
            <div className="grid grid-cols-4 gap-2">
              {['Daily', 'Weekdays', 'Weekly', 'One-time'].map((rec) => (
                <button
                  type="button"
                  key={rec}
                  onClick={() => setFormData({ ...formData, recurrence: rec })}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                    formData.recurrence === rec
                      ? 'bg-[#8B7EC8] text-white border-[#8B7EC8]'
                      : 'bg-white text-[#2D2A3E] border-[#2D2A3E]/15 hover:bg-[#FDFBF7]'
                  }`}
                >
                  {rec}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-[#6E6A82] hover:bg-[#FDFBF7] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold bg-[#8B7EC8] hover:bg-[#796BB9] text-white rounded-xl shadow-sm transition-all"
            >
              Save Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
