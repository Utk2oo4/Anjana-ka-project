import React, { useState, useEffect } from 'react';
import { X, Play, RotateCcw, CheckCircle2, Sparkles, Trophy, Brain } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CognitiveGameModal = ({ isOpen, onClose, game, patient }) => {
  const { recordGameResult } = useApp();
  const [gameState, setGameState] = useState('playing'); // 'playing', 'completed'
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [score, setScore] = useState(0);

  const cardIcons = ['🌸', '🌻', '🍎', '🍵', '🕊️', '🏡'];

  // Initialize game cards
  const initGame = () => {
    const pairCount = patient?.currentDifficulty === 'Hard' ? 6 : patient?.currentDifficulty === 'Medium' ? 4 : 3;
    const selectedIcons = cardIcons.slice(0, pairCount);
    const deck = [...selectedIcons, ...selectedIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, id) => ({ id, icon, matched: false }));

    setCards(deck);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setAttempts(0);
    setGameState('playing');
    setStartTime(Date.now());
    setElapsedSeconds(0);
  };

  useEffect(() => {
    if (isOpen) {
      initGame();
    }
  }, [isOpen, game, patient]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing' || !isOpen) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState, startTime, isOpen]);

  const handleCardClick = (index) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedPairs.includes(cards[index].icon)) {
      return;
    }

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setAttempts(a => a + 1);
      const [firstIdx, secondIdx] = nextFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.icon === secondCard.icon) {
        // Match!
        const nextMatched = [...matchedPairs, firstCard.icon];
        setMatchedPairs(nextMatched);
        setFlippedIndices([]);

        const pairCount = patient?.currentDifficulty === 'Hard' ? 6 : patient?.currentDifficulty === 'Medium' ? 4 : 3;
        if (nextMatched.length === pairCount) {
          // Completed!
          const duration = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
          const calculatedScore = Math.max(60, Math.min(100, Math.round(100 - (attempts * 5) - (duration * 0.5))));
          setScore(calculatedScore);
          setGameState('completed');
          recordGameResult(patient.id, game?.name || 'Memory Match', calculatedScore, patient.currentDifficulty);
        }
      } else {
        // No match, flip back
        setTimeout(() => {
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 card-shadow border border-[#2D2A3E]/10 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#6E6A82] hover:text-[#2D2A3E] hover:bg-[#FDFBF7]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#8B7EC8]/15 flex items-center justify-center text-xl">
            {game?.icon || '🧩'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-[#2D2A3E] font-display">{game?.name || 'Cognitive Activity'}</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#8B7EC8]/10 text-[#8B7EC8]">
                {patient?.currentDifficulty || 'Medium'}
              </span>
            </div>
            <p className="text-xs text-[#6E6A82]">Playing on behalf of: <strong className="text-[#2D2A3E]">{patient?.name}</strong></p>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#FDFBF7] rounded-2xl border border-[#2D2A3E]/5 text-xs font-semibold mb-6">
          <span className="text-[#6E6A82]">Attempts: <strong className="text-[#2D2A3E]">{attempts}</strong></span>
          <span className="text-[#6E6A82]">Time: <strong className="text-[#2D2A3E]">{elapsedSeconds}s</strong></span>
          <span className="text-[#6E6A82]">
            Matches: <strong className="text-[#4F6A45]">{matchedPairs.length}</strong>
          </span>
        </div>

        {/* Game Area */}
        {gameState === 'playing' ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 my-4">
            {cards.map((card, idx) => {
              const isFlipped = flippedIndices.includes(idx) || matchedPairs.includes(card.icon);
              return (
                <button
                  key={idx}
                  onClick={() => handleCardClick(idx)}
                  className={`h-24 sm:h-28 rounded-2xl border flex items-center justify-center text-3xl sm:text-4xl transition-all duration-300 font-display ${
                    isFlipped
                      ? 'bg-white border-[#8B7EC8] shadow-md scale-95'
                      : 'bg-gradient-to-br from-[#8B7EC8]/20 to-[#A8BBA0]/20 border-transparent hover:scale-102 cursor-pointer shadow-xs'
                  }`}
                >
                  {isFlipped ? card.icon : '✨'}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-[#2D2A3E] font-display">Activity Completed!</h4>
              <p className="text-sm text-[#6E6A82] mt-1">Accuracy score recorded for {patient?.name}</p>
            </div>
            <div className="inline-block px-6 py-3 bg-[#8B7EC8]/10 rounded-2xl border border-[#8B7EC8]/20">
              <span className="text-3xl font-extrabold text-[#8B7EC8] font-display">{score}%</span>
              <p className="text-xs text-[#6E6A82] font-semibold mt-0.5">Cognitive Performance Score</p>
            </div>
            <p className="text-xs text-[#6E6A82] max-w-sm mx-auto">
              AI has recorded this session metrics (response speed: {elapsedSeconds}s, attempts: {attempts}) and updated difficulty recommendations.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#2D2A3E]/10 flex items-center justify-between">
          <button
            onClick={initGame}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#6E6A82] hover:bg-[#FDFBF7] rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold bg-[#2D2A3E] hover:bg-[#1E1B2C] text-white rounded-xl transition-colors"
          >
            {gameState === 'completed' ? 'Done & Record' : 'Close Simulator'}
          </button>
        </div>
      </div>
    </div>
  );
};
