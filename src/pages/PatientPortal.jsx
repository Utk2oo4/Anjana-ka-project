import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Volume2,
  PhoneCall,
  CheckCircle2,
  Brain,
  Sparkles,
  Gamepad2,
  Clock,
  Calendar,
  LogOut,
  Trophy,
  Mic,
  Smile,
  X,
  Play
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CognitiveGameModal } from '../components/CognitiveGameModal';
import { VoiceAssistantModal } from '../components/VoiceAssistantModal';

export const PatientPortal = () => {
  const {
    currentPatient,
    reminders,
    completePatientReminder,
    familyMembers,
    activePatientAlert,
    dismissPatientAlert,
    patientCallCaregiver,
    switchPortal
  } = useApp();

  const navigate = useNavigate();

  // Accessibility & UI State
  const [largeFont, setLargeFont] = useState(false);
  const [activeTab, setActiveTab] = useState('routine'); // 'routine', 'games', 'family'
  const [currentTime, setCurrentTime] = useState(new Date());
  const [callSent, setCallSent] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [familyQuizMember, setFamilyQuizMember] = useState(null);
  const [familyQuizAnswer, setFamilyQuizAnswer] = useState(null);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter reminders for current patient
  const patientReminders = reminders.filter(
    (r) => r.patientId === currentPatient.id || r.patient === currentPatient.name
  );

  const patientFamily = familyMembers.filter(
    (fm) => fm.patientId === currentPatient.id
  );

  // Text to speech helper
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speak incoming alert automatically
  useEffect(() => {
    if (activePatientAlert && activePatientAlert.patientName === currentPatient.name) {
      speakText(`Caregiver message: ${activePatientAlert.message}`);
    }
  }, [activePatientAlert, currentPatient.name]);

  // Handle Caregiver Emergency Call
  const handleCallCaregiver = () => {
    patientCallCaregiver();
    setCallSent(true);
    speakText("Notifying your caregiver right away. Help is on the way!");
    setTimeout(() => setCallSent(false), 5000);
  };

  // Greeting based on time of day
  const hour = currentTime.getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Games list tailored for patient
  const patientGames = [
    {
      id: 'g-001',
      name: 'Memory Match',
      desc: 'Pair matching cards of friendly nature icons & flowers',
      icon: '🌸',
      category: 'Memory Recall'
    },
    {
      id: 'g-002',
      name: 'Pattern Spotter',
      desc: 'Discover and choose what comes next in the sequence',
      icon: '🔷',
      category: 'Pattern Spotting'
    },
    {
      id: 'g-003',
      name: 'Everyday Object Finder',
      desc: 'Name familiar everyday objects with gentle clues',
      icon: '🍎',
      category: 'Object Recognition'
    },
    {
      id: 'g-004',
      name: 'Calm Focus Timer',
      desc: 'Peaceful guided breathing to center and refresh your mind',
      icon: '🕊️',
      category: 'Focus & Relaxation'
    },
    {
      id: 'g-005',
      name: 'Daily Routine Recall',
      desc: 'Fun daily questions about morning habits, meals, and family',
      icon: '📋',
      category: 'Routine Recall'
    }
  ];

  return (
    <div
      className={`min-h-screen bg-[#FDFBF7] text-[#2D2A3E] ${
        largeFont ? 'text-lg' : 'text-base'
      } pb-32 sm:pb-16`}
    >
      {/* Top Patient Header Bar - Mobile Optimized with Safe Area */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#2D2A3E]/10 shadow-xs pt-safe px-3 sm:px-6 py-2.5 sm:py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          {/* Patient Profile & Greeting */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#8B7EC8] to-[#A8BBA0] text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-xs shrink-0">
              {currentPatient.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <h1 className="font-extrabold text-[#2D2A3E] text-base sm:text-xl font-display leading-tight truncate">
                  {greeting}, {currentPatient.name.split(' ')[0]}!
                </h1>
                <span className="text-base sm:text-lg shrink-0">🌸</span>
              </div>
              <p className="text-[11px] text-[#6E6A82] font-semibold truncate">
                Patient Portal • AI Level: <span className="text-[#8B7EC8] font-bold">{currentPatient.currentDifficulty}</span>
              </p>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Font Size Toggle */}
            <button
              onClick={() => setLargeFont(!largeFont)}
              className="px-2.5 py-1.5 rounded-xl border border-[#2D2A3E]/15 bg-[#FDFBF7] hover:bg-[#8B7EC8]/10 text-xs font-bold transition-all cursor-pointer touch-press"
              title="Toggle Large Font"
            >
              {largeFont ? 'A' : 'A+'}
            </button>

            {/* Emergency / Call Caregiver Button */}
            <button
              onClick={handleCallCaregiver}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-xs touch-press ${
                callSent
                  ? 'bg-emerald-600 text-white animate-pulse'
                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline sm:inline">{callSent ? 'Notified!' : 'Call Caregiver'}</span>
              <span className="inline xs:hidden sm:hidden">{callSent ? '✓' : 'Call'}</span>
            </button>

            {/* Switch to Caretaker Portal */}
            <button
              onClick={() => {
                switchPortal('caregiver');
                navigate('/');
              }}
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl border border-[#2D2A3E]/15 hover:bg-[#2D2A3E]/5 text-xs font-bold text-[#6E6A82] flex items-center gap-1.5 transition-all cursor-pointer touch-press"
              title="Switch back to Caretaker Dashboard"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Caretaker Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-6 space-y-5 sm:space-y-6">
        {/* Date & Motivational Status Banner */}
        <div className="bg-gradient-to-br from-[#8B7EC8] via-[#9F91D9] to-[#A8BBA0] rounded-3xl p-5 sm:p-7 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {currentTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold font-display leading-tight">
                Welcome to your daily space, {currentPatient.name.split(' ')[0]}.
              </h2>
              <p className="text-xs sm:text-sm text-white/90 max-w-xl font-medium leading-relaxed">
                Take your medicines on time, practice fun cognitive games, and keep your memory bright today!
              </p>
            </div>

            {/* Quick Motivational Stats */}
            <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/20 shrink-0 self-start sm:self-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center text-xl sm:text-2xl">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
              </div>
              <div>
                <p className="text-[11px] text-white/80 font-medium">Cognitive Score</p>
                <p className="text-lg sm:text-xl font-extrabold font-display leading-tight">
                  {currentPatient.avgAccuracy}%
                </p>
                <p className="text-[10px] text-white/80 mt-0.5">
                  AI Difficulty: <strong>{currentPatient.currentDifficulty}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop / Tablet Tab Navigation (Hidden on small mobile screens in favor of bottom nav) */}
        <div className="hidden sm:flex items-center gap-3 border-b border-[#2D2A3E]/10 pb-2">
          <button
            onClick={() => setActiveTab('routine')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'routine'
                ? 'bg-[#2D2A3E] text-white shadow-sm'
                : 'bg-white text-[#6E6A82] hover:bg-[#8B7EC8]/10 hover:text-[#2D2A3E]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Today's Routine</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 ml-1">
              {patientReminders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('games')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'games'
                ? 'bg-[#8B7EC8] text-white shadow-sm'
                : 'bg-white text-[#6E6A82] hover:bg-[#8B7EC8]/10 hover:text-[#2D2A3E]'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Cognitive Games</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 ml-1">5</span>
          </button>

          <button
            onClick={() => setActiveTab('family')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'family'
                ? 'bg-[#A8BBA0] text-[#2D2A3E] shadow-sm'
                : 'bg-white text-[#6E6A82] hover:bg-[#A8BBA0]/20 hover:text-[#2D2A3E]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Family Album</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#2D2A3E]/10 ml-1">
              {patientFamily.length}
            </span>
          </button>
        </div>

        {/* TAB 1: TODAY'S ROUTINE & REMINDERS */}
        {activeTab === 'routine' && (
          <section className="space-y-3.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-2xl font-extrabold text-[#2D2A3E] font-display">
                  Today's Care Schedule
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6A82] font-medium">
                  Tap "I Did This! ✅" after taking your medicines.
                </p>
              </div>

              <button
                onClick={() =>
                  speakText(
                    `You have ${patientReminders.length} scheduled reminders today. First reminder is ${patientReminders[0]?.title || 'none'}`
                  )
                }
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white border border-[#2D2A3E]/15 hover:bg-[#8B7EC8]/10 text-xs font-bold text-[#8B7EC8] flex items-center gap-1.5 transition-colors cursor-pointer touch-press shrink-0"
              >
                <Volume2 className="w-4 h-4" />
                <span>Read to me</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              {patientReminders.map((reminder) => {
                const isCompleted = reminder.status === 'completed';
                const isMedicine = reminder.category === 'medicine';
                const isHydration = reminder.category === 'hydration';

                return (
                  <div
                    key={reminder.id}
                    className={`rounded-3xl p-4 sm:p-6 border transition-all card-shadow flex flex-col justify-between ${
                      isCompleted
                        ? 'bg-emerald-50/70 border-emerald-200 opacity-80'
                        : 'bg-white border-[#2D2A3E]/10 hover:border-[#8B7EC8]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-xs shrink-0 ${
                              isMedicine
                                ? 'bg-purple-100 text-purple-700'
                                : isHydration
                                ? 'bg-cyan-100 text-cyan-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {isMedicine ? '💊' : isHydration ? '💧' : '⏰'}
                          </div>

                          <div className="min-w-0">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6A82]">
                              {reminder.category} • {reminder.recurrence}
                            </span>
                            <h4
                              className={`text-base sm:text-xl font-bold font-display truncate ${
                                isCompleted
                                  ? 'line-through text-[#6E6A82]'
                                  : 'text-[#2D2A3E]'
                              }`}
                            >
                              {reminder.title}
                            </h4>
                          </div>
                        </div>

                        {/* Speech Button */}
                        <button
                          onClick={() =>
                            speakText(
                              `${reminder.title}, scheduled for ${reminder.time}`
                            )
                          }
                          className="p-2 rounded-xl text-[#6E6A82] hover:text-[#8B7EC8] hover:bg-[#8B7EC8]/10 cursor-pointer touch-press shrink-0"
                          title="Read reminder aloud"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#6E6A82]">
                        <Clock className="w-4 h-4 text-[#8B7EC8]" />
                        <span>Scheduled: <strong className="text-[#2D2A3E]">{reminder.time}</strong></span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#2D2A3E]/5">
                      {isCompleted ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-2 rounded-xl justify-center">
                          <CheckCircle2 className="w-4 h-4" /> Completed for today
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            completePatientReminder(reminder.id);
                            speakText(`Great job completing ${reminder.title}!`);
                          }}
                          className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer touch-press transition-transform"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          <span>I Did This! (Mark as Done)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {patientReminders.length === 0 && (
                <div className="col-span-2 text-center py-10 bg-white rounded-3xl border border-[#2D2A3E]/10 p-6">
                  <Smile className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-[#2D2A3E]">All caught up!</p>
                  <p className="text-xs text-[#6E6A82] mt-1">
                    No pending reminders scheduled for today.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB 2: COGNITIVE GAMES HUB */}
        {activeTab === 'games' && (
          <section className="space-y-3.5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
              <div>
                <h3 className="text-lg sm:text-2xl font-extrabold text-[#2D2A3E] font-display">
                  Daily Brain Exercises
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6A82] font-medium">
                  Designed by therapists to sustain memory, focus, and agility.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B7EC8] bg-[#8B7EC8]/10 px-3 py-1 rounded-full w-fit">
                <Brain className="w-3.5 h-3.5" />
                <span>AI Difficulty: {currentPatient.currentDifficulty}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {patientGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-[#2D2A3E]/10 card-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#8B7EC8]/15 flex items-center justify-center text-2xl sm:text-3xl">
                        {game.icon}
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FDFBF7] border border-[#2D2A3E]/10 text-[#6E6A82]">
                        {game.category}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-extrabold text-[#2D2A3E] font-display mt-3">
                      {game.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#6E6A82] font-medium mt-1 leading-relaxed">
                      {game.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#2D2A3E]/5">
                    <button
                      onClick={() => setSelectedGame(game)}
                      className="w-full py-3.5 px-4 rounded-2xl bg-[#8B7EC8] hover:bg-[#796BB9] active:bg-[#6D5FA8] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer touch-press"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Activity</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: FAMILY MEMORIES PHOTO WALL */}
        {activeTab === 'family' && (
          <section className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-lg sm:text-2xl font-extrabold text-[#2D2A3E] font-display">
                  Your Loved Ones
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6A82] font-medium">
                  Tap any photo to hear a warm memory story about your family.
                </p>
              </div>

              <button
                onClick={() => {
                  if (patientFamily.length > 0) {
                    const randomMember =
                      patientFamily[Math.floor(Math.random() * patientFamily.length)];
                    setFamilyQuizMember(randomMember);
                    setFamilyQuizAnswer(null);
                  }
                }}
                className="px-4 py-2.5 rounded-2xl bg-[#A8BBA0] hover:bg-[#97AA8E] text-[#2D2A3E] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer touch-press w-fit"
              >
                <Sparkles className="w-4 h-4" />
                <span>Play "Who is this?" Quiz</span>
              </button>
            </div>

            {/* Family Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {patientFamily.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-[#2D2A3E]/10 card-shadow flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      style={{ backgroundColor: member.avatarColor || '#8B7EC8' }}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl text-white flex items-center justify-center text-xl sm:text-2xl font-bold font-display shadow-xs shrink-0"
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base sm:text-lg font-bold text-[#2D2A3E] truncate">
                        {member.name}
                      </h4>
                      <p className="text-xs font-semibold text-[#8B7EC8]">
                        {member.relationship}
                      </p>
                      <p className="text-[11px] text-[#6E6A82] mt-0.5 truncate">
                        {member.relationDetail || 'Family member'}
                      </p>
                    </div>
                  </div>

                  {member.prompt && (
                    <div className="mt-3.5 p-3 bg-[#FDFBF7] rounded-2xl border border-[#2D2A3E]/5 text-xs text-[#2D2A3E] italic">
                      "{member.prompt}"
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-[#2D2A3E]/5">
                    <button
                      onClick={() =>
                        speakText(
                          `This is ${member.name}, your ${member.relationship}. ${
                            member.prompt || ''
                          }`
                        )
                      }
                      className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#8B7EC8]/10 text-[#8B7EC8] border border-[#8B7EC8]/20 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer touch-press"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Tell me about {member.name.split(' ')[0]}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {patientFamily.length === 0 && (
              <div className="text-center py-10 bg-white rounded-3xl border border-[#2D2A3E]/10 p-6">
                <Heart className="w-10 h-10 text-rose-400 mx-auto mb-2" />
                <p className="font-bold text-[#2D2A3E]">No family memories added yet</p>
                <p className="text-xs text-[#6E6A82] mt-1">
                  Your caregiver can add family member photos from the Caregiver Portal.
                </p>
              </div>
            )}
          </section>
        )}
      </main>

      {/* MOBILE-FIRST PATIENT BOTTOM NAVIGATION BAR */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#2D2A3E]/10 pb-safe shadow-[0_-4px_25px_rgba(0,0,0,0.06)] select-none">
        <div className="flex items-center justify-around px-2 py-1.5">
          {/* Routine & Meds Tab */}
          <button
            onClick={() => setActiveTab('routine')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 touch-press cursor-pointer transition-colors ${
              activeTab === 'routine' ? 'text-[#2D2A3E]' : 'text-[#6E6A82]'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                activeTab === 'routine' ? 'bg-[#2D2A3E] text-white shadow-xs' : ''
              }`}
            >
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold mt-0.5">Routine</span>
          </button>

          {/* Brain Games Tab */}
          <button
            onClick={() => setActiveTab('games')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 touch-press cursor-pointer transition-colors ${
              activeTab === 'games' ? 'text-[#8B7EC8]' : 'text-[#6E6A82]'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                activeTab === 'games' ? 'bg-[#8B7EC8] text-white shadow-xs' : ''
              }`}
            >
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold mt-0.5">Games</span>
          </button>

          {/* Center Voice Action Button */}
          <button
            onClick={() => setIsVoiceOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 px-1 touch-press cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B7EC8] to-[#9F91D9] text-white flex items-center justify-center shadow-md -mt-5 border-2 border-white group-active:scale-95 transition-transform">
              <Mic className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-[10px] font-extrabold text-[#8B7EC8] mt-1">
              Ask Voice
            </span>
          </button>

          {/* Family Album Tab */}
          <button
            onClick={() => setActiveTab('family')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 touch-press cursor-pointer transition-colors ${
              activeTab === 'family' ? 'text-[#4F6A45]' : 'text-[#6E6A82]'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                activeTab === 'family' ? 'bg-[#A8BBA0] text-[#2D2A3E] shadow-xs' : ''
              }`}
            >
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold mt-0.5">Family</span>
          </button>
        </div>
      </nav>

      {/* MODAL: DIRECT CAREGIVER ALERT POP-UP (FR-08) */}
      {activePatientAlert && activePatientAlert.patientName === currentPatient.name && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in zoom-in-95">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-6 sm:p-8 card-shadow border-2 border-[#8B7EC8] text-center space-y-4 animate-bottom-sheet sm:animate-none">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#8B7EC8]/15 text-[#8B7EC8] flex items-center justify-center mx-auto text-3xl shadow-inner animate-bounce-short">
              📢
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B7EC8]">
                Message from your Caregiver (Sarah)
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A3E] font-display mt-1">
                "{activePatientAlert.message}"
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => speakText(activePatientAlert.message)}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-[#FDFBF7] hover:bg-[#8B7EC8]/10 border border-[#2D2A3E]/10 text-xs font-bold text-[#8B7EC8] flex items-center justify-center gap-2 cursor-pointer touch-press"
              >
                <Volume2 className="w-4 h-4" />
                <span>Repeat Aloud</span>
              </button>

              <button
                onClick={dismissPatientAlert}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#8B7EC8] hover:bg-[#796BB9] text-white font-bold text-sm shadow-md cursor-pointer touch-press"
              >
                Thank You! ❤️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: WHO IS IN THIS PHOTO QUIZ */}
      {familyQuizMember && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 sm:p-8 card-shadow border border-[#2D2A3E]/10 relative text-center space-y-4 animate-bottom-sheet sm:animate-none">
            <button
              onClick={() => setFamilyQuizMember(null)}
              className="absolute top-4 right-4 p-2 text-[#6E6A82] hover:text-[#2D2A3E] rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              style={{ backgroundColor: familyQuizMember.avatarColor || '#8B7EC8' }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl text-white flex items-center justify-center text-3xl sm:text-4xl font-bold font-display mx-auto shadow-md"
            >
              {familyQuizMember.name.charAt(0)}
            </div>

            <div>
              <h4 className="text-lg sm:text-xl font-extrabold text-[#2D2A3E] font-display">
                Do you recognize who this is?
              </h4>
              <p className="text-xs text-[#6E6A82] mt-1">
                Hint: {familyQuizMember.prompt || `Your ${familyQuizMember.relationship}`}
              </p>
            </div>

            <div className="space-y-2">
              {[
                familyQuizMember.name,
                'A neighbor down the street',
                'Your high school teacher'
              ]
                .sort(() => 0.5 - Math.random())
                .map((nameOption, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (nameOption === familyQuizMember.name) {
                        setFamilyQuizAnswer('correct');
                        speakText(`That's right! It is ${familyQuizMember.name}, your ${familyQuizMember.relationship}!`);
                      } else {
                        setFamilyQuizAnswer('try_again');
                        speakText('Almost! Give it another try.');
                      }
                    }}
                    className="w-full py-3 px-4 rounded-2xl border-2 border-[#2D2A3E]/10 hover:border-[#8B7EC8] hover:bg-[#8B7EC8]/5 font-bold text-sm text-[#2D2A3E] transition-all cursor-pointer touch-press"
                  >
                    {nameOption}
                  </button>
                ))}
            </div>

            {familyQuizAnswer === 'correct' && (
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 animate-in zoom-in-95">
                <CheckCircle2 className="w-4 h-4" />
                <span>Correct! Wonderful memory recall! 🌟</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Cognitive Mini-Game Modal */}
      {selectedGame && (
        <CognitiveGameModal
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          game={selectedGame}
          patient={currentPatient}
        />
      )}

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />
    </div>
  );
};
