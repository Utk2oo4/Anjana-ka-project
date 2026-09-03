import React, { useState } from 'react';
import { Gamepad2, Brain, Sparkles, Play, Award, Zap, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CognitiveGameModal } from '../components/CognitiveGameModal';

export const Games = () => {
  const { games, patients, selectedPatient, setSelectedPatientId, recordGameResult } = useApp();
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(games[0]);

  const handleLaunchGame = (game) => {
    setSelectedGame(game);
    setIsGameModalOpen(true);
  };

  const cognitiveCategories = [
    {
      title: 'Memory & Recall',
      desc: 'Visual card pairing and personal family memory recall to support short-term memory.',
      icon: '🧩',
      count: '2 Games',
      games: games.filter(g => g.category.includes('Memory') || g.category.includes('Routine'))
    },
    {
      title: 'Pattern & Object Recognition',
      desc: 'Shape sequences, everyday object naming, and spatial orientation.',
      icon: '🔷',
      count: '2 Games',
      games: games.filter(g => g.category.includes('Pattern') || g.category.includes('Object'))
    },
    {
      title: 'Attention & Concentration',
      desc: 'Sustained focus timers and reaction-time cognitive engagement exercises.',
      icon: '⏱️',
      count: '1 Game',
      games: games.filter(g => g.category.includes('Attention'))
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2D2A3E] font-display tracking-tight">
            Cognitive Activities & AI Engine
          </h1>
          <p className="text-sm font-medium text-[#6E6A82] mt-1">
            Section 5.1 & 5.2 — Engaging cognitive activities with real-time adaptive AI difficulty.
          </p>
        </div>

        {/* Patient selector context */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-[#2D2A3E]/10 card-shadow text-xs">
          <span className="text-[#6E6A82] font-semibold">Active Patient:</span>
          <select
            value={selectedPatient.id}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="font-bold text-[#8B7EC8] bg-transparent outline-none cursor-pointer"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.currentDifficulty})</option>
            ))}
          </select>
        </div>
      </div>

      {/* AI Personalization Insight Banner (FR-05) */}
      <div className="bg-gradient-to-r from-[#8B7EC8]/15 via-[#A8BBA0]/15 to-[#FDFBF7] p-6 sm:p-7 rounded-3xl border border-[#8B7EC8]/20 card-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#8B7EC8] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#2D2A3E] font-display">
                AI Adaptive Difficulty System
              </h2>
              <span className="text-[11px] font-bold bg-[#8B7EC8] text-white px-2 py-0.5 rounded-md">
                Active for {selectedPatient.name}
              </span>
            </div>
            <p className="text-xs text-[#6E6A82] mt-1 max-w-xl leading-relaxed">
              The AI records completion attempts, mistake patterns, and response time to automatically calibrate difficulty (Easy → Medium → Hard).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 bg-white/80 backdrop-blur-xs px-4 py-3 rounded-2xl border border-[#2D2A3E]/5 text-xs">
          <div>
            <div className="text-[10px] text-[#6E6A82] uppercase tracking-wider font-bold">Current Level</div>
            <div className="text-base font-extrabold text-[#8B7EC8] font-display">{selectedPatient.currentDifficulty}</div>
          </div>
          <div className="h-8 w-px bg-[#2D2A3E]/10" />
          <div>
            <div className="text-[10px] text-[#6E6A82] uppercase tracking-wider font-bold">Total Accuracy</div>
            <div className="text-base font-extrabold text-[#4F6A45] font-display">{selectedPatient.avgAccuracy}%</div>
          </div>
        </div>
      </div>

      {/* Categorized Game Sections */}
      <div className="space-y-8">
        {cognitiveCategories.map((cat, idx) => (
          <div key={idx} className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#2D2A3E]/5 pb-2">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-[#2D2A3E] font-display">{cat.title}</h3>
                  <p className="text-xs text-[#6E6A82]">{cat.desc}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#8B7EC8] bg-[#8B7EC8]/10 px-2.5 py-1 rounded-full">
                {cat.count}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.games.map((game) => (
                <div
                  key={game.id}
                  className="bg-white rounded-3xl p-6 border border-[#2D2A3E]/5 card-shadow card-shadow-hover flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B7EC8]/15 to-[#A8BBA0]/15 flex items-center justify-center text-3xl mb-4 group-hover:scale-105 transition-transform">
                        {game.icon}
                      </div>
                      <span className="text-[11px] font-bold text-[#8B7EC8] bg-[#8B7EC8]/10 px-2 py-0.5 rounded-lg">
                        {game.category}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-[#2D2A3E]">{game.name}</h4>
                    <p className="text-xs text-[#6E6A82] mt-1.5 leading-relaxed">{game.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#2D2A3E]/5 space-y-2">
                    <button
                      onClick={() => handleLaunchGame(game)}
                      className="w-full py-3 px-4 rounded-xl bg-[#8B7EC8] hover:bg-[#796BB9] text-white font-bold text-xs shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Launch Cognitive Activity</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Important Product Constraint Disclaimer (Section 15 of anjana.docx) */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important Product Note:</strong> The Anjana platform is designed for cognitive engagement, daily memory assistance, and routine support. Cognitive performance metrics are non-diagnostic and do not replace professional medical evaluations.
        </p>
      </div>

      {/* Game Simulator Modal */}
      <CognitiveGameModal
        isOpen={isGameModalOpen}
        onClose={() => setIsGameModalOpen(false)}
        game={selectedGame}
        patient={selectedPatient}
      />
    </div>
  );
};
