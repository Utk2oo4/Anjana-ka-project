import React, { useState } from 'react';
import { X, UserPlus, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AddPatientModal = ({ isOpen, onClose }) => {
  const { addPatient } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    relationship: 'Mother',
    currentDifficulty: 'Easy',
    medicalNotes: '',
    emergencyContact: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    addPatient({
      name: formData.name,
      age: parseInt(formData.age, 10) || 75,
      relationship: formData.relationship,
      currentDifficulty: formData.currentDifficulty,
      medicalNotes: formData.medicalNotes,
      emergencyContact: formData.emergencyContact,
    });

    onClose();
    setFormData({
      name: '',
      age: '',
      relationship: 'Mother',
      currentDifficulty: 'Easy',
      medicalNotes: '',
      emergencyContact: '',
    });
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
          <div className="w-10 h-10 rounded-2xl bg-[#8B7EC8]/15 flex items-center justify-center text-[#8B7EC8]">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#2D2A3E] font-display">Add Patient Profile</h3>
            <p className="text-xs text-[#6E6A82]">FR-02 Create profile for cognitive engagement</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Margaret Johnson"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#2D2A3E]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40 focus:border-[#8B7EC8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5">Age</label>
              <input
                type="number"
                min="50"
                max="110"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="78"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#2D2A3E]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5">Relationship</label>
              <select
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#2D2A3E]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40"
              >
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Grandmother">Grandmother</option>
                <option value="Grandfather">Grandfather</option>
                <option value="Spouse">Spouse</option>
                <option value="Client">Client</option>
                <option value="Relative">Relative</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5">Starting AI Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {['Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  type="button"
                  key={diff}
                  onClick={() => setFormData({ ...formData, currentDifficulty: diff })}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    formData.currentDifficulty === diff
                      ? 'bg-[#8B7EC8] text-white border-[#8B7EC8]'
                      : 'bg-white text-[#2D2A3E] border-[#2D2A3E]/15 hover:bg-[#FDFBF7]'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5">Routine / Health Notes</label>
            <textarea
              rows="2"
              value={formData.medicalNotes}
              onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
              placeholder="e.g. Mild memory lapse in mornings, loves gardening photos."
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#2D2A3E]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40 resize-none"
            />
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
              className="px-5 py-2.5 text-sm font-bold bg-[#8B7EC8] hover:bg-[#796BB9] text-white rounded-xl shadow-sm transition-all"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
