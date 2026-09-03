import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  currentCaregiver as initialCaregiver,
  patients as initialPatients,
  games as initialGames,
  reminders as initialReminders,
  recentActivity as initialActivity,
  familyMembers as initialFamilyMembers,
  performanceData as initialPerformanceData,
  dashboardStats as initialStats
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [caregiver, setCaregiver] = useState(() => {
    const saved = localStorage.getItem('anjana_caregiver');
    return saved ? JSON.parse(saved) : initialCaregiver;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('anjana_auth') === 'true';
  });

  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('anjana_patients');
    return saved ? JSON.parse(saved) : initialPatients;
  });

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || 'pt-001');

  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('anjana_reminders');
    return saved ? JSON.parse(saved) : initialReminders;
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('anjana_activities');
    return saved ? JSON.parse(saved) : initialActivity;
  });

  const [familyMembers, setFamilyMembers] = useState(() => {
    const saved = localStorage.getItem('anjana_family');
    return saved ? JSON.parse(saved) : initialFamilyMembers;
  });

  const [games, setGames] = useState(initialGames);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [notifications, setNotifications] = useState([
    { id: 'n-1', text: 'Robert Chen missed Hydration Check (2:00 PM)', read: false, time: '15m ago', type: 'alert' },
    { id: 'n-2', text: 'Margaret Johnson completed Memory Match with 85% accuracy', read: false, time: '2m ago', type: 'success' },
    { id: 'n-3', text: 'AI adjusted Dorothy Williams difficulty to Hard', read: true, time: '1h ago', type: 'info' }
  ]);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('anjana_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('anjana_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('anjana_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('anjana_family', JSON.stringify(familyMembers));
  }, [familyMembers]);

  useEffect(() => {
    localStorage.setItem('anjana_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  // Network offline listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (pendingSyncCount > 0) {
        setTimeout(() => {
          setPendingSyncCount(0);
          addActivity({
            type: 'sync',
            message: 'Synced local data with cloud server',
            detail: `${pendingSyncCount} changes uploaded`,
            icon: '☁️'
          });
        }, 1200);
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingSyncCount]);

  const login = (email, password) => {
    setIsAuthenticated(true);
    setCaregiver({
      ...initialCaregiver,
      email: email || initialCaregiver.email
    });
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('anjana_auth');
  };

  const addActivity = (item) => {
    const newActivity = {
      id: `a-${Date.now()}`,
      time: 'Just now',
      ...item
    };
    setActivities(prev => [newActivity, ...prev]);
    if (!isOnline) {
      setPendingSyncCount(c => c + 1);
    }
  };

  const addPatient = (patientData) => {
    const newPatient = {
      id: `pt-${Date.now()}`,
      gamesPlayed: 0,
      avgAccuracy: 0,
      currentDifficulty: 'Easy',
      missedReminders: 0,
      status: 'active',
      lastActivity: 'Just added',
      ...patientData
    };
    setPatients(prev => [newPatient, ...prev]);
    addActivity({
      type: 'patient',
      message: `Added new patient: ${newPatient.name}`,
      detail: `Age: ${newPatient.age} | ${newPatient.relationship}`,
      icon: '👤'
    });
    return newPatient;
  };

  const updatePatient = (id, updatedData) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const addReminder = (reminderData) => {
    const newReminder = {
      id: `r-${Date.now()}`,
      status: 'active',
      ...reminderData
    };
    setReminders(prev => [newReminder, ...prev]);
    addActivity({
      type: 'reminder',
      message: `Created reminder: "${newReminder.title}" for ${newReminder.patient}`,
      detail: `Time: ${newReminder.time} (${newReminder.category})`,
      icon: '⏰'
    });
  };

  const deleteReminder = (id) => {
    const target = reminders.find(r => r.id === id);
    setReminders(prev => prev.filter(r => r.id !== id));
    if (target) {
      addActivity({
        type: 'reminder',
        message: `Removed reminder: "${target.title}"`,
        detail: `Patient: ${target.patient}`,
        icon: '🗑️'
      });
    }
  };

  const toggleReminderStatus = (id) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const nextStatus = r.status === 'active' ? 'completed' : 'active';
        return { ...r, status: nextStatus };
      }
      return r;
    }));
  };

  const sendCustomAlert = (patientName, message) => {
    addActivity({
      type: 'alert',
      message: `Sent direct alert to ${patientName}`,
      detail: `"${message}"`,
      icon: '📢'
    });
    setNotifications(prev => [
      { id: `n-${Date.now()}`, text: `Alert sent to ${patientName}: "${message}"`, read: false, time: 'Just now', type: 'alert' },
      ...prev
    ]);
  };

  const addFamilyMember = (memberData) => {
    const newMember = {
      id: `fm-${Date.now()}`,
      ...memberData
    };
    setFamilyMembers(prev => [...prev, newMember]);
    addActivity({
      type: 'memory',
      message: `Added family memory photo for ${memberData.name}`,
      detail: `Relationship: ${memberData.relationship}`,
      icon: '📸'
    });
  };

  const deleteFamilyMember = (id) => {
    setFamilyMembers(prev => prev.filter(m => m.id !== id));
  };

  const recordGameResult = (patientId, gameName, score, difficulty) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    const newGamesPlayed = (patient.gamesPlayed || 0) + 1;
    const newAvg = Math.round(((patient.avgAccuracy || 70) * (newGamesPlayed - 1) + score) / newGamesPlayed);

    let nextDifficulty = patient.currentDifficulty;
    if (score >= 80 && patient.currentDifficulty === 'Easy') nextDifficulty = 'Medium';
    else if (score >= 85 && patient.currentDifficulty === 'Medium') nextDifficulty = 'Hard';
    else if (score < 50 && patient.currentDifficulty === 'Hard') nextDifficulty = 'Medium';
    else if (score < 40 && patient.currentDifficulty === 'Medium') nextDifficulty = 'Easy';

    updatePatient(patientId, {
      gamesPlayed: newGamesPlayed,
      avgAccuracy: newAvg,
      currentDifficulty: nextDifficulty,
      lastActivity: 'Just now'
    });

    addActivity({
      type: 'game',
      message: `${patient.name} completed ${gameName}`,
      detail: `Score: ${score}% | AI Difficulty: ${nextDifficulty}`,
      icon: '🎯'
    });
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  return (
    <AppContext.Provider
      value={{
        caregiver,
        isAuthenticated,
        login,
        logout,
        patients,
        selectedPatient,
        selectedPatientId,
        setSelectedPatientId,
        addPatient,
        updatePatient,
        reminders,
        addReminder,
        deleteReminder,
        toggleReminderStatus,
        activities,
        addActivity,
        familyMembers,
        addFamilyMember,
        deleteFamilyMember,
        games,
        isOnline,
        pendingSyncCount,
        notifications,
        sendCustomAlert,
        recordGameResult,
        performanceData: initialPerformanceData,
        stats: {
          activePatients: patients.filter(p => p.status === 'active').length,
          gamesPlayedToday: 34,
          remindersDue: reminders.filter(r => r.status === 'active').length,
          avgAccuracy: Math.round(patients.reduce((acc, p) => acc + (p.avgAccuracy || 0), 0) / (patients.length || 1))
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
