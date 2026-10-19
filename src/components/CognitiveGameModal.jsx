import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Trophy,
  Brain,
  Volume2,
  ChevronRight,
  Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CognitiveGameModal = ({ isOpen, onClose, game, patient }) => {
  const { recordGameResult } = useApp();
  const [gameState, setGameState] = useState('playing'); // 'playing', 'completed'
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [score, setScore] = useState(0);
  const [gameFeedback, setGameFeedback] = useState('');

  // 1. Memory Match State
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [attempts, setAttempts] = useState(0);

  // 2. Pattern Spotter State
  const [patternRound, setPatternRound] = useState(0);
  const [patternScore, setPatternScore] = useState(0);

  // 3. Object Recognition State
  const [objectRound, setObjectRound] = useState(0);
  const [objectScore, setObjectScore] = useState(0);

  // 4. Focus Timer State
  const [focusProgress, setFocusProgress] = useState(0);
  const [breathPhase, setBreathPhase] = useState('Breathe In'); // 'Breathe In', 'Hold', 'Breathe Out'

  // 5. Daily Recall State
  const [recallRound, setRecallRound] = useState(0);
  const [recallScore, setRecallScore] = useState(0);

  const cardIcons = ['🌸', '🌻', '🍎', '🍵', '🕊️', '🏡'];

  // Pattern sequences
  const patternLevels = [
    {
      sequence: ['🔴', '🔷', '🔴', '🔷'],
      options: ['🔴', '🔷', '⭐'],
      correct: '🔴',
      prompt: 'What comes next in the sequence?'
    },
    {
      sequence: ['🌸', '🌿', '🌸', '🌿'],
      options: ['🌸', '🌿', '🍎'],
      correct: '🌸',
      prompt: 'What comes next?'
    },
    {
      sequence: ['⭐', '⭐', '🌙', '⭐', '⭐'],
      options: ['🌙', '⭐', '☀️'],
      correct: '🌙',
      prompt: 'Complete the celestial pattern:'
    },
    {
      sequence: ['1', '2', '3', '4'],
      options: ['5', '6', '3'],
      correct: '5',
      prompt: 'What number follows in sequence?'
    }
  ];

  // Object recognition items
  const objectItems = [
    {
      icon: '🍎',
      name: 'Red Apple',
      clue: 'A crisp, sweet fruit grown on trees, often red or green.',
      options: ['Apple', 'Orange', 'Tomato', 'Clock'],
      correct: 'Apple'
    },
    {
      icon: '⏰',
      name: 'Alarm Clock',
      clue: 'An everyday item with hands and numbers that tells you the time of day.',
      options: ['Teacup', 'Clock', 'Compass', 'Radio'],
      correct: 'Clock'
    },
    {
      icon: '🍵',
      name: 'Warm Teacup',
      clue: 'A ceramic cup with a handle used to drink soothing tea or broth.',
      options: ['Spoon', 'Book', 'Teacup', 'Glasses'],
      correct: 'Teacup'
    },
    {
      icon: '🔑',
      name: 'House Key',
      clue: 'A small metal tool used to unlock your front door safely.',
      options: ['Key', 'Fork', 'Coin', 'Comb'],
      correct: 'Key'
    },
    {
      icon: '👓',
      name: 'Reading Glasses',
      clue: 'Worn on your face to help read books and see clearly.',
      options: ['Glasses', 'Mirror', 'Magnifier', 'Hat'],
      correct: 'Glasses'
    }
  ];

  // Daily Recall Questions
  const getTodayDayName = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  };

  const recallQuestions = [
    {
      question: 'Which day of the week is it today?',
      options: [getTodayDayName(), 'Yesterday', 'Saturday'],
      correct: getTodayDayName(),
      hint: 'Think about today.'
    },
    {
      question: 'Which meal is traditionally enjoyed first in the morning?',
      options: ['Breakfast', 'Dinner', 'Midnight Snack'],
      correct: 'Breakfast',
      hint: 'The morning meal with tea or toast.'
    },
    {
      question: 'What is important to drink throughout the day to stay hydrated?',
      options: ['Fresh Water', 'Hot Mustard', 'Vinegar'],
      correct: 'Fresh Water',
      hint: 'Clear and refreshing.'
    },
    {
      question: 'What season brings blooming flowers and gentle warm breezes?',
      options: ['Spring', 'Snow Blizzard', 'Hailstorm'],
      correct: 'Spring',
      hint: 'When plants grow and flowers open.'
    }
  ];

  // Text to speech helper
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Determine game type from name or id
  const gameName = game?.name || 'Memory Match';
  const isPattern = gameName.toLowerCase().includes('pattern');
  const isObject = gameName.toLowerCase().includes('object');
  const isFocus = gameName.toLowerCase().includes('focus');
  const isRecall = gameName.toLowerCase().includes('recall');
  const isMemory = !isPattern && !isObject && !isFocus && !isRecall;

  // Init Game
  const initGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
    setElapsedSeconds(0);
    setScore(0);
    setGameFeedback('');

    if (isMemory) {
      const pairCount = patient?.currentDifficulty === 'Hard' ? 6 : patient?.currentDifficulty === 'Medium' ? 4 : 3;
      const selectedIcons = cardIcons.slice(0, pairCount);
      const deck = [...selectedIcons, ...selectedIcons]
        .sort(() => Math.random() - 0.5)
        .map((icon, id) => ({ id, icon, matched: false }));

      setCards(deck);
      setFlippedIndices([]);
      setMatchedPairs([]);
      setAttempts(0);
    } else if (isPattern) {
      setPatternRound(0);
      setPatternScore(0);
    } else if (isObject) {
      setObjectRound(0);
      setObjectScore(0);
    } else if (isFocus) {
      setFocusProgress(0);
      setBreathPhase('Breathe In');
    } else if (isRecall) {
      setRecallRound(0);
      setRecallScore(0);
    }
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

  // Focus Timer Breath Cycle
  useEffect(() => {
    if (!isFocus || gameState !== 'playing' || !isOpen) return;

    const interval = setInterval(() => {
      setFocusProgress(prev => {
        const next = prev + 5;
        if (next >= 100) {
          finishGame(95, 'Wonderful concentration! Your mind is calm and centered.');
          return 100;
        }

        // Change breath phase every 5 seconds
        const cycle = Math.floor(next / 15) % 3;
        if (cycle === 0) setBreathPhase('Breathe In Gently 🌿');
        else if (cycle === 1) setBreathPhase('Hold Peacefully 🤍');
        else setBreathPhase('Breathe Out Slowly 🕊️');

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFocus, gameState, isOpen]);

  const finishGame = (finalScore, feedbackText) => {
    setScore(finalScore);
    setGameFeedback(feedbackText);
    setGameState('completed');
    if (patient) {
      recordGameResult(patient.id, gameName, finalScore);
    }
    speakText(`Wonderful job! You scored ${finalScore} percent.`);
  };

  // Memory card handler
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
        const nextMatched = [...matchedPairs, firstCard.icon];
        setMatchedPairs(nextMatched);
        setFlippedIndices([]);

        const pairCount = patient?.currentDifficulty === 'Hard' ? 6 : patient?.currentDifficulty === 'Medium' ? 4 : 3;
        if (nextMatched.length === pairCount) {
          const duration = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
          const calculatedScore = Math.max(65, Math.min(100, Math.round(100 - (attempts * 4) - (duration * 0.4))));
          finishGame(calculatedScore, 'Excellent visual memory! You matched all the pairs.');
        }
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  // Pattern Spotter Handler
  const handlePatternChoice = (choice) => {
    const currentQ = patternLevels[patternRound];
    const isCorrect = choice === currentQ.correct;
    const nextScore = isCorrect ? patternScore + 25 : patternScore;
    setPatternScore(nextScore);

    if (patternRound + 1 < patternLevels.length) {
      setPatternRound(r => r + 1);
    } else {
      finishGame(Math.max(60, nextScore), 'Splendid pattern recognition! You completed the sequence.');
    }
  };

  // Object Recognition Handler
  const handleObjectChoice = (choice) => {
    const currentQ = objectItems[objectRound];
    const isCorrect = choice === currentQ.correct;
    const nextScore = isCorrect ? objectScore + 20 : objectScore;
    setObjectScore(nextScore);

    if (objectRound + 1 < objectItems.length) {
      setObjectRound(r => r + 1);
    } else {
      finishGame(Math.max(60, nextScore), 'Brilliant! You identified all everyday objects.');
    }
  };

  // Daily Recall Handler
  const handleRecallChoice = (choice) => {
    const currentQ = recallQuestions[recallRound];
    const isCorrect = choice === currentQ.correct;
    const nextScore = isCorrect ? recallScore + 25 : recallScore;
    setRecallScore(nextScore);

    if (recallRound + 1 < recallQuestions.length) {
      setRecallRound(r => r + 1);
    } else {
      finishGame(Math.max(60, nextScore), 'Great job recalling your daily routines and environment!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-8 card-shadow border border-[#2D2A3E]/10 relative overflow-hidden max-h-[92dvh] flex flex-col animate-bottom-sheet sm:animate-none">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2D2A3E]/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#8B7EC8]/15 flex items-center justify-center text-2xl shadow-inner">
              {game?.icon || '🧩'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A3E] font-display">
                  {gameName}
                </h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#8B7EC8]/10 text-[#8B7EC8]">
                  {patient?.currentDifficulty || 'Adaptive'}
                </span>
              </div>
              <p className="text-xs text-[#6E6A82] mt-0.5">
                Player: <strong className="text-[#2D2A3E]">{patient?.name || 'Patient'}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full text-[#6E6A82] hover:text-[#2D2A3E] hover:bg-[#FDFBF7] cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-4">
          {gameState === 'playing' ? (
            <div>
              {/* Stats ticker */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#FDFBF7] rounded-2xl border border-[#2D2A3E]/5 text-xs font-semibold mb-6">
                <span className="text-[#6E6A82]">Time: <strong className="text-[#2D2A3E]">{elapsedSeconds}s</strong></span>
                {isMemory && (
                  <>
                    <span className="text-[#6E6A82]">Attempts: <strong className="text-[#2D2A3E]">{attempts}</strong></span>
                    <span className="text-[#6E6A82]">Pairs Matched: <strong className="text-[#4F6A45]">{matchedPairs.length}</strong></span>
                  </>
                )}
                {isPattern && (
                  <span className="text-[#6E6A82]">Question: <strong className="text-[#8B7EC8]">{patternRound + 1} of {patternLevels.length}</strong></span>
                )}
                {isObject && (
                  <span className="text-[#6E6A82]">Object: <strong className="text-[#8B7EC8]">{objectRound + 1} of {objectItems.length}</strong></span>
                )}
                {isFocus && (
                  <span className="text-[#6E6A82]">Calm Focus: <strong className="text-[#8B7EC8]">{focusProgress}%</strong></span>
                )}
                {isRecall && (
                  <span className="text-[#6E6A82]">Question: <strong className="text-[#8B7EC8]">{recallRound + 1} of {recallQuestions.length}</strong></span>
                )}
              </div>

              {/* GAME 1: MEMORY MATCH */}
              {isMemory && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 my-2">
                  {cards.map((card, idx) => {
                    const isFlipped = flippedIndices.includes(idx) || matchedPairs.includes(card.icon);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleCardClick(idx)}
                        className={`h-24 sm:h-28 rounded-2xl border text-3xl sm:text-4xl transition-all duration-300 flex items-center justify-center font-display ${
                          isFlipped
                            ? 'bg-white border-[#8B7EC8] shadow-md scale-95'
                            : 'bg-gradient-to-br from-[#8B7EC8]/15 to-[#A8BBA0]/20 border-[#2D2A3E]/10 hover:scale-102 cursor-pointer shadow-xs'
                        }`}
                      >
                        {isFlipped ? card.icon : '✨'}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* GAME 2: PATTERN SPOTTER */}
              {isPattern && (
                <div className="space-y-6 text-center py-4">
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-base font-bold text-[#2D2A3E]">
                      {patternLevels[patternRound].prompt}
                    </p>
                    <button
                      onClick={() => speakText(patternLevels[patternRound].prompt)}
                      className="p-1.5 rounded-lg text-[#8B7EC8] hover:bg-[#8B7EC8]/10"
                      title="Read aloud"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-3 p-6 bg-[#FDFBF7] rounded-3xl border border-[#2D2A3E]/10 text-4xl">
                    {patternLevels[patternRound].sequence.map((item, i) => (
                      <div key={i} className="w-14 h-14 rounded-2xl bg-white shadow-xs flex items-center justify-center border border-[#2D2A3E]/5">
                        {item}
                      </div>
                    ))}
                    <div className="w-14 h-14 rounded-2xl bg-[#8B7EC8]/20 border-2 border-dashed border-[#8B7EC8] flex items-center justify-center text-2xl font-bold text-[#8B7EC8]">
                      ?
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
                    {patternLevels[patternRound].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handlePatternChoice(opt)}
                        className="py-4 text-2xl font-bold rounded-2xl bg-white hover:bg-[#8B7EC8]/10 border-2 border-[#8B7EC8]/20 hover:border-[#8B7EC8] transition-all shadow-xs hover:scale-105 cursor-pointer flex items-center justify-center"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME 3: OBJECT RECOGNITION */}
              {isObject && (
                <div className="space-y-6 text-center py-4">
                  <div className="w-28 h-28 rounded-3xl bg-amber-50 border-2 border-amber-200 text-6xl flex items-center justify-center mx-auto shadow-sm animate-bounce-short">
                    {objectItems[objectRound].icon}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <h4 className="text-lg font-extrabold text-[#2D2A3E]">What is this everyday item?</h4>
                      <button
                        onClick={() => speakText(objectItems[objectRound].clue)}
                        className="p-1 text-[#8B7EC8] hover:bg-[#8B7EC8]/10 rounded-lg"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-xs text-[#6E6A82] max-w-md mx-auto">
                      "{objectItems[objectRound].clue}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                    {objectItems[objectRound].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleObjectChoice(opt)}
                        className="py-3 px-4 text-sm font-bold rounded-2xl bg-white hover:bg-[#8B7EC8] hover:text-white border border-[#2D2A3E]/10 transition-all shadow-xs hover:scale-102 cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME 4: FOCUS TIMER */}
              {isFocus && (
                <div className="text-center py-6 space-y-6">
                  <p className="text-sm font-bold text-[#6E6A82]">
                    Follow the circle's rhythm to relax and build sustained focus.
                  </p>

                  <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#8B7EC8]/10 animate-ping opacity-25" />
                    <div
                      className="w-40 h-40 rounded-full bg-gradient-to-tr from-[#8B7EC8] to-[#A8BBA0] text-white flex flex-col items-center justify-center p-4 text-center shadow-lg transition-transform duration-1000 ease-in-out scale-105"
                    >
                      <Sparkles className="w-8 h-8 mb-1 animate-pulse" />
                      <span className="text-sm font-bold font-display">{breathPhase}</span>
                    </div>
                  </div>

                  <div className="max-w-xs mx-auto">
                    <div className="w-full bg-[#2D2A3E]/10 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-[#8B7EC8] h-full transition-all duration-300"
                        style={{ width: `${focusProgress}%` }}
                      />
                    </div>
                    <p className="text-xs font-semibold text-[#6E6A82] mt-2">
                      Focus Session Progress: {focusProgress}%
                    </p>
                  </div>
                </div>
              )}

              {/* GAME 5: DAILY RECALL */}
              {isRecall && (
                <div className="space-y-6 text-center py-4">
                  <div className="space-y-2 max-w-md mx-auto">
                    <div className="flex items-center justify-center gap-2">
                      <h4 className="text-lg sm:text-xl font-extrabold text-[#2D2A3E] font-display">
                        {recallQuestions[recallRound].question}
                      </h4>
                      <button
                        onClick={() => speakText(recallQuestions[recallRound].question)}
                        className="p-1 text-[#8B7EC8] hover:bg-[#8B7EC8]/10 rounded-lg"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-xs text-[#6E6A82]">
                      Hint: {recallQuestions[recallRound].hint}
                    </p>
                  </div>

                  <div className="space-y-3 max-w-md mx-auto">
                    {recallQuestions[recallRound].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleRecallChoice(opt)}
                        className="w-full py-3.5 px-6 text-sm sm:text-base font-bold rounded-2xl bg-white hover:bg-[#8B7EC8] hover:text-white border-2 border-[#2D2A3E]/10 hover:border-transparent transition-all shadow-xs cursor-pointer flex items-center justify-between"
                      >
                        <span>{opt}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* COMPLETED SCREEN */
            <div className="text-center py-8 space-y-6 animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
                <Trophy className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-[#2D2A3E] font-display">
                  Game Completed!
                </h4>
                <p className="text-sm text-[#4F6A45] font-semibold mt-1">
                  {gameFeedback}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto p-4 bg-[#FDFBF7] rounded-3xl border border-[#2D2A3E]/10">
                <div>
                  <span className="text-xs text-[#6E6A82] font-semibold">Final Score</span>
                  <p className="text-3xl font-extrabold text-[#8B7EC8] font-display mt-0.5">
                    {score}%
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[#6E6A82] font-semibold">Time Spent</span>
                  <p className="text-3xl font-extrabold text-[#2D2A3E] font-display mt-0.5">
                    {elapsedSeconds}s
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={initGame}
                  className="px-6 py-3 rounded-2xl bg-white hover:bg-[#FDFBF7] text-[#2D2A3E] font-bold text-sm border border-[#2D2A3E]/15 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-[#8B7EC8] hover:bg-[#796BB9] text-white font-bold text-sm shadow-md cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
