import React, { useState } from 'react';
import { X, Send, AlertCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SendAlertModal = ({ isOpen, onClose, defaultPatientId }) => {
  const { patients, sendCustomAlert } = useApp();
  const [patientId, setPatientId] = useState(defaultPatientId || (patients[0]?.id || ''));
  const [message, setMessage] = useState('');

  const quickTemplates = [
    'Time for your afternoon walk and fresh air!',
    'Remember to drink a glass of water.',
    'Doctor appointment in 30 minutes. Get ready!',
    'Great job on your cognitive game today!'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) return;

    const patient = patients.find(p => p.id === patientId) || patients[0];
    sendCustomAlert(patient.name, message);
    onClose();
    setMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 card-shadow border border-[#2D2A3E]/10 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#6E6A82] hover:text-[#2D2A3E] hover:bg-[#FDFBF7]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#E88C7D]/15 flex items-center justify-center text-[#D05D4A]">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#2D2A3E] font-display">Send Custom Alert</h3>
            <p className="text-xs text-[#6E6A82]">FR-08 Send direct audio/visual notification to patient</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5">Select Patient</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#2D2A3E]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.relationship})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5">Alert Message *</label>
            <textarea
              required
              rows="3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a clear, friendly reminder or message..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#2D2A3E]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6E6A82] mb-1.5">Quick Templates</label>
            <div className="space-y-1.5">
              {quickTemplates.map((tpl, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setMessage(tpl)}
                  className="w-full text-left text-xs p-2 rounded-xl bg-[#FDFBF7] hover:bg-[#8B7EC8]/10 text-[#2D2A3E] transition-colors truncate border border-[#2D2A3E]/5"
                >
                  "{tpl}"
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-[#6E6A82] hover:bg-[#FDFBF7] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold bg-[#8B7EC8] hover:bg-[#796BB9] text-white rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send to Device</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
