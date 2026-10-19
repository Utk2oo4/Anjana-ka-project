import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  currentCaregiver as initialCaregiver,
  patients as initialPatients,
  games as initialGames,
  reminders as initialReminders,
  recentActivity as initialActivity,
  familyMembers as initialFamilyMembers,
  performanceData as initialPerformanceData
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

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('anjana_user_role') || 'caregiver';
  });

  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('anjana_patients');
    return saved ? JSON.parse(saved) : initialPatients;
  });

  const [currentPatientId, setCurrentPatientId] = useState(() => {
    return localStorage.getItem('anjana_patient_id') || patients[0]?.id || 'pt-001';
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

  const [games] = useState(initialGames);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [activePatientAlert, setActivePatientAlert] = useState(null);

  const [notifications, setNotifications] = useState([
    { id: 'n-1', text: 'Robert Chen missed Hydration Check (2:00 PM)', read: false, time: '15m ago', type: 'alert' },
    { id: 'n-2', text: 'Margaret Johnson completed Memory Match with 85% accuracy', read: false, time: '2m ago', type: 'success' },
    { id: 'n-3', text: 'AI adjusted Dorothy Williams difficulty to Hard', read: true, time: '1h ago', type: 'info' }
  ]);

  // Derived current patient
  const currentPatient = patients.find(p => p.id === currentPatientId) || patients[0];
  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Sync to localStorage
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
    localStorage.setItem('anjana_user_role', userRole);
    localStorage.setItem('anjana_patient_id', currentPatientId);
  }, [isAuthenticated, userRole, currentPatientId]);

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

  const addActivity = (item) => {
    const newActivity = {
      id: `a-${Date.now()}`,
      time: 'Just now',
      ...item
    };
    setActivities(prev => [newActivity, ...prev]);
    if (!navigator.onLine) {
      setPendingSyncCount(c => c + 1);
    }
  };

  // Login as Caregiver
  const loginCaregiver = (email) => {
    setIsAuthenticated(true);
    setUserRole('caregiver');
    setCaregiver({
      ...initialCaregiver,
      email: email || initialCaregiver.email
    });
    return true;
  };

  // Backward compatibility
  const login = (email) => loginCaregiver(email);

  // Login as Patient
  const loginPatient = (patientId) => {
    const target = patients.find(p => p.id === patientId) || patients[0];
    setIsAuthenticated(true);
    setUserRole('patient');
    setCurrentPatientId(target.id);
    setSelectedPatientId(target.id);
    addActivity({
      type: 'login',
      message: `${target.name} signed into Patient Portal`,
      detail: `Current difficulty: ${target.currentDifficulty}`,
      icon: '👋'
    });
    return true;
  };

  // Quick switch between portals
  const switchPortal = (role, patientId = null) => {
    setUserRole(role);
    if (patientId) {
      setCurrentPatientId(patientId);
      setSelectedPatientId(patientId);
    }
    localStorage.setItem('anjana_user_role', role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole('caregiver');
    localStorage.removeItem('anjana_auth');
    localStorage.removeItem('anjana_user_role');
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

  const completePatientReminder = (id) => {
    const target = reminders.find(r => r.id === id);
    if (!target) return;

    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'completed' } : r));

    addActivity({
      type: 'reminder',
      message: `${currentPatient.name} completed "${target.title}"`,
      detail: `Confirmed via Patient Portal at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      icon: '✅'
    });

    setNotifications(prev => [
      { id: `n-${Date.now()}`, text: `✅ ${currentPatient.name} completed "${target.title}"`, read: false, time: 'Just now', type: 'success' },
      ...prev
    ]);
  };

  // Direct alert from Caretaker to Patient
  const sendCustomAlert = (patientName, message) => {
    addActivity({
      type: 'alert',
      message: `Caregiver sent alert to ${patientName}`,
      detail: `"${message}"`,
      icon: '📢'
    });
    setNotifications(prev => [
      { id: `n-${Date.now()}`, text: `Alert sent to ${patientName}: "${message}"`, read: false, time: 'Just now', type: 'alert' },
      ...prev
    ]);
    setActivePatientAlert({
      id: `alert-${Date.now()}`,
      patientName,
      message,
      timestamp: Date.now()
    });
  };

  const dismissPatientAlert = () => {
    setActivePatientAlert(null);
  };

  // Patient calls caregiver
  const patientCallCaregiver = () => {
    addActivity({
      type: 'alert',
      message: `📞 ${currentPatient.name} requested caregiver assistance!`,
      detail: `Patient pressed "Call Caregiver" button in Patient Portal`,
      icon: '🚨'
    });
    setNotifications(prev => [
      { id: `n-${Date.now()}`, text: `🚨 ${currentPatient.name} requested caregiver assistance!`, read: false, time: 'Just now', type: 'alert' },
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

  // Dynamic AI Adaptive difficulty tracking
  const recordGameResult = (patientId, gameName, score) => {
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

    setNotifications(prev => [
      { id: `n-${Date.now()}`, text: `🎯 ${patient.name} completed ${gameName} with ${score}% accuracy`, read: false, time: 'Just now', type: 'success' },
      ...prev
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        caregiver,
        isAuthenticated,
        userRole,
        login,
        loginCaregiver,
        loginPatient,
        switchPortal,
        logout,
        patients,
        currentPatient,
        currentPatientId,
        setCurrentPatientId,
        selectedPatient,
        selectedPatientId,
        setSelectedPatientId,
        addPatient,
        updatePatient,
        reminders,
        addReminder,
        deleteReminder,
        toggleReminderStatus,
        completePatientReminder,
        activities,
        addActivity,
        familyMembers,
        addFamilyMember,
        deleteFamilyMember,
        games,
        isOnline,
        pendingSyncCount,
        notifications,
        activePatientAlert,
        dismissPatientAlert,
        sendCustomAlert,
        patientCallCaregiver,
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
