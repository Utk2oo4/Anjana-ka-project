import React, { useState } from 'react';
import { X, Heart, Image, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AddFamilyMemberModal = ({ isOpen, onClose, patientId }) => {
  const { addFamilyMember } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'Son',
    favoriteMemory: '',
    photoColor: '#8B7EC8'
  });

  const sampleColors = ['#8B7EC8', '#A8BBA0', '#E88C7D', '#6B9AC4', '#D4A359', '#7BA7C9'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    addFamilyMember({
      patientId: patientId || 'pt-001',
      name: formData.name,
      relationship: formData.relationship,
      favoriteMemory: formData.favoriteMemory,
      photoColor: formData.photoColor,
      photo: null
    });

    onClose();
    setFormData({
      name: '',
      relationship: 'Son',
      favoriteMemory: '',
      photoColor: '#8B7EC8'
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
          <div className="w-10 h-10 rounded-2xl bg-[#E88C7D]/15 flex items-center justify-center text-[#D05D4A]">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#2D2A3E] font-display">Add Family Member Memory</h3>
            <p className="text-xs text-[#6E6A82]">FR-07 Add family photos/names for cognitive recall games</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5">Family Member Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. David Johnson"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#2D2A3E]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5">Relationship to Patient</label>
            <select
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#2D2A3E]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40"
            >
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Grandson">Grandson</option>
              <option value="Granddaughter">Granddaughter</option>
              <option value="Sister">Sister</option>
              <option value="Brother">Brother</option>
              <option value="Spouse">Spouse</option>
              <option value="Friend">Close Friend</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5">Avatar Color Accent</label>
            <div className="flex gap-3">
              {sampleColors.map((col) => (
                <button
                  type="button"
                  key={col}
                  onClick={() => setFormData({ ...formData, photoColor: col })}
                  style={{ backgroundColor: col }}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    formData.photoColor === col ? 'scale-125 ring-2 ring-offset-2 ring-[#2D2A3E]' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5">Key Memory / Hint for Recall Activity</label>
            <textarea
              rows="2"
              value={formData.favoriteMemory}
              onChange={(e) => setFormData({ ...formData, favoriteMemory: e.target.value })}
              placeholder="e.g. Loves gardening with Margaret every Sunday morning."
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
              Save Memory Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
