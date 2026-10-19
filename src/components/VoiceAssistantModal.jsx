import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VoiceAssistantModal = ({ isOpen, onClose }) => {
  const { patients, reminders, selectedPatient, sendCustomAlert } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState("Hello! I am Anjana's voice assistant. You can speak or tap a command below to assist your patient.");
  const [speaking, setSpeaking] = useState(false);

  const sampleCommands = [
    "What is today's routine?",
    "When is the next medicine reminder?",
    "How is Margaret's cognitive score?",
    "Send a hydration alert to Robert"
  ];

  // Text to speech helper
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCommand = (cmd) => {
    setTranscript(cmd);
    setIsListening(false);

    let reply = '';
    const lower = cmd.toLowerCase();

    if (lower.includes('routine') || lower.includes("today's")) {
      reply = `Today's schedule for ${selectedPatient.name} includes morning walk, memory match game session, and afternoon reading time.`;
    } else if (lower.includes('medicine') || lower.includes('reminder')) {
      const pReminders = reminders.filter(r => r.patient === selectedPatient.name && r.category === 'medicine');
      if (pReminders.length > 0) {
        reply = `The next medicine reminder for ${selectedPatient.name} is "${pReminders[0].title}" scheduled for ${pReminders[0].time}.`;
      } else {
        reply = `All scheduled medicines for ${selectedPatient.name} are currently on track.`;
      }
    } else if (lower.includes('score') || lower.includes('accuracy') || lower.includes('cognitive')) {
      reply = `${selectedPatient.name} has completed ${selectedPatient.gamesPlayed} cognitive games with an average accuracy of ${selectedPatient.avgAccuracy}%. The current adaptive difficulty is ${selectedPatient.currentDifficulty}.`;
    } else if (lower.includes('hydration') || lower.includes('alert')) {
      sendCustomAlert(selectedPatient.name, 'Time for a glass of water! Stay hydrated.');
      reply = `Sent a hydration reminder alert directly to ${selectedPatient.name}.`;
    } else {
      reply = `I heard: "${cmd}". Cognitive activity recommendations and daily reminders have been synchronized for ${selectedPatient.name}.`;
    }

    setResponse(reply);
    speakText(reply);
  };

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    // Check for web speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setTranscript('Listening to your voice...');
        };

        recognition.onresult = (event) => {
          const spokenText = event.results[0][0].transcript;
          handleCommand(spokenText);
        };

        recognition.onerror = () => {
          setIsListening(false);
          handleCommand("What is today's routine?");
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err) {
        // Fallback simulation
        setIsListening(true);
        setTimeout(() => {
          handleCommand("When is the next medicine reminder?");
        }, 1500);
      }
    } else {
      // Fallback simulation
      setIsListening(true);
      setTimeout(() => {
        handleCommand("What is today's routine?");
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 card-shadow border border-[#2D2A3E]/10 relative overflow-hidden animate-bottom-sheet sm:animate-none max-h-[92dvh] overflow-y-auto">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#8B7EC8]/15 via-[#A8BBA0]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={() => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full text-[#6E6A82] hover:text-[#2D2A3E] hover:bg-[#FDFBF7] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B7EC8] to-[#A8BBA0] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#2D2A3E] font-display">Anjana Voice Assistant</h3>
            <p className="text-xs text-[#6E6A82]">FR-09 Voice commands for elderly & caregivers</p>
          </div>
        </div>

        {/* Patient Context */}
        <div className="mb-4 px-3.5 py-2 bg-[#FDFBF7] rounded-xl border border-[#2D2A3E]/5 text-xs flex items-center justify-between">
          <span className="text-[#6E6A82]">Active Patient Context:</span>
          <span className="font-bold text-[#8B7EC8]">{selectedPatient.name}</span>
        </div>

        {/* Assistant Speech Bubble */}
        <div className="bg-gradient-to-r from-[#8B7EC8]/10 via-[#A8BBA0]/10 to-[#FDFBF7] p-4 sm:p-5 rounded-2xl border border-[#8B7EC8]/20 mb-6 min-h-[100px] flex flex-col justify-between">
          <div className="text-sm sm:text-base font-medium text-[#2D2A3E] leading-relaxed">
            "{response}"
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#8B7EC8]/15 text-xs text-[#6E6A82]">
            <span>{speaking ? '🔊 Speaking...' : '💡 Ready'}</span>
            <button
              onClick={() => speakText(response)}
              className="flex items-center gap-1 text-[#8B7EC8] hover:text-[#796BB9] font-semibold"
            >
              <Volume2 className="w-3.5 h-3.5" /> Replay Voice
            </button>
          </div>
        </div>

        {/* Microphone Central Action */}
        <div className="flex flex-col items-center justify-center my-6">
          <button
            onClick={toggleMic}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isListening
                ? 'bg-rose-500 text-white animate-bounce ring-8 ring-rose-200'
                : 'bg-[#8B7EC8] text-white hover:bg-[#796BB9] hover:scale-105 ring-8 ring-[#8B7EC8]/20'
            }`}
          >
            {isListening ? <Mic className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
          <p className="text-xs font-semibold text-[#2D2A3E] mt-3">
            {isListening ? 'Listening... Speak now' : 'Tap microphone to speak'}
          </p>
          {transcript && (
            <p className="text-xs text-[#6E6A82] italic mt-1 max-w-xs text-center truncate">
              "{transcript}"
            </p>
          )}
        </div>

        {/* Quick Voice Command Prompts */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#6E6A82] mb-2">
            Suggested Voice Commands
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => handleCommand(cmd)}
                className="text-left text-xs p-2.5 rounded-xl bg-white border border-[#2D2A3E]/10 hover:border-[#8B7EC8] hover:bg-[#8B7EC8]/5 text-[#2D2A3E] font-medium transition-all flex items-center justify-between group"
              >
                <span className="truncate">{cmd}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8B7EC8] opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
