import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Filter, AlertTriangle, ArrowRight, Brain, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AddPatientModal } from '../components/AddPatientModal';

export const Patients = () => {
  const { patients } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All'); // 'All', 'Active', 'Inactive'
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.relationship.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' ||
                          (filter === 'Active' && p.status === 'active') ||
                          (filter === 'Inactive' && p.status === 'inactive');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2D2A3E] font-display tracking-tight">
            Your Patients
          </h1>
          <p className="text-sm font-medium text-[#6E6A82] mt-1">
            Manage profiles, cognitive difficulty, and daily schedules for your loved ones.
          </p>
        </div>

        <button
          onClick={() => setIsAddPatientOpen(true)}
          className="px-5 py-3 rounded-2xl bg-[#8B7EC8] hover:bg-[#796BB9] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-[#2D2A3E]/5 card-shadow">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A82]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients by name or relation..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#FDFBF7] border border-[#2D2A3E]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Active', 'Inactive'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-[#2D2A3E] text-white shadow-2xs'
                  : 'bg-[#FDFBF7] text-[#6E6A82] hover:bg-[#8B7EC8]/10 hover:text-[#2D2A3E]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Patients 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => {
          const hasMissedReminders = patient.missedReminders > 0;
          return (
            <div
              key={patient.id}
              className="bg-white rounded-3xl p-6 border border-[#2D2A3E]/5 card-shadow card-shadow-hover flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Missed Reminder Banner if any */}
              {hasMissedReminders && (
                <div className="absolute top-4 right-4 bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <AlertTriangle className="w-3 h-3 text-rose-500" />
                  <span>{patient.missedReminders} missed</span>
                </div>
              )}

              {/* Patient Profile Info */}
              <div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8B7EC8] to-[#A8BBA0] text-white flex items-center justify-center text-xl font-bold font-display shadow-sm group-hover:scale-105 transition-transform shrink-0">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-[#2D2A3E] leading-snug">{patient.name}</h3>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          patient.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                        title={patient.status}
                      />
                    </div>
                    <p className="text-xs text-[#6E6A82] mt-0.5 font-medium">
                      Age: {patient.age} • {patient.relationship}
                    </p>
                    <p className="text-[11px] text-[#6E6A82]/80 mt-1">
                      Last activity: <span className="font-semibold text-[#2D2A3E]">{patient.lastActivity}</span>
                    </p>
                  </div>
                </div>

                {/* Cognitive Metrics Row */}
                <div className="mt-5 grid grid-cols-2 gap-2 p-3 bg-[#FDFBF7] rounded-2xl border border-[#2D2A3E]/5 text-xs">
                  <div className="text-center">
                    <div className="text-[11px] text-[#6E6A82] font-semibold">Games Completed</div>
                    <div className="text-base font-extrabold text-[#2D2A3E] font-display mt-0.5">
                      {patient.gamesPlayed}
                    </div>
                  </div>
                  <div className="text-center border-l border-[#2D2A3E]/10">
                    <div className="text-[11px] text-[#6E6A82] font-semibold">Cognitive Score</div>
                    <div className="text-base font-extrabold text-[#8B7EC8] font-display mt-0.5">
                      {patient.avgAccuracy}%
                    </div>
                  </div>
                </div>

                {/* Adaptive Difficulty Pill */}
                <div className="mt-3 flex items-center justify-between text-xs px-1">
                  <span className="text-[#6E6A82] font-medium flex items-center gap-1">
                    <Brain className="w-3.5 h-3.5 text-[#8B7EC8]" /> AI Difficulty:
                  </span>
                  <span className="font-bold text-[#2D2A3E] px-2 py-0.5 bg-[#8B7EC8]/10 rounded-lg text-[11px] text-[#8B7EC8]">
                    {patient.currentDifficulty}
                  </span>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="mt-6 pt-4 border-t border-[#2D2A3E]/5">
                <button
                  onClick={() => navigate(`/patients/${patient.id}`)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#8B7EC8]/10 text-[#8B7EC8] font-bold text-xs border border-[#8B7EC8]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>View Full Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#2D2A3E]/5 card-shadow p-8">
          <p className="text-base font-bold text-[#2D2A3E]">No patients found matching your search</p>
          <p className="text-xs text-[#6E6A82] mt-1">Try adjusting the filter or search keyword.</p>
        </div>
      )}

      {/* Add Patient Modal */}
      <AddPatientModal isOpen={isAddPatientOpen} onClose={() => setIsAddPatientOpen(false)} />
    </div>
  );
};
