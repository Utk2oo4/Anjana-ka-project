# Anjana — AI-Assisted Cognitive Care Platform (PWA)

> **An AI-assisted cognitive support and caregiver platform** that provides engaging cognitive activities, daily routine recall, and personalized assistance for elderly patients while offering caregivers intuitive tools to monitor and manage their care.

---

## 🌟 Overview

**Anjana** addresses the daily challenges faced by elderly individuals with memory difficulties and cognitive decline (such as forgetting medicines, appointments, daily routines, and family members' names). It bridges the gap between patient engagement and caregiver oversight through a Progressive Web App (PWA) with offline resilience, voice assistance, and AI adaptive difficulty.

> **Important Notice**: Anjana is designed for cognitive engagement, daily memory assistance, and caregiver support. It is not a diagnostic tool or a medical treatment system.

---

## ✨ Key Features

### 1. 🧩 Cognitive Activities & Games (FR-03, FR-04)
- **Memory Matching**: Visual card pairing and personal family memory recall.
- **Pattern Spotter**: Sequence and pattern identification.
- **Object Recognition**: Everyday object naming exercises.
- **Focus Timer**: Attention and sustained concentration exercises.
- **Daily Recall**: Morning and evening routine recall quizzes.
- **Interactive Simulator**: Playable mini-game simulator built directly into the dashboard.

### 2. 🤖 AI Adaptive Difficulty (FR-05)
- Tracks accuracy, completion attempts, mistake patterns, and response time.
- Dynamically auto-calibrates difficulty levels (`Easy` → `Medium` → `Hard`).
- Recommends tailored cognitive activities based on individual longitudinal performance.

### 3. ⏰ Reminders & Alerts (FR-06, FR-08)
- Categorized schedules for **Medicine**, **Hydration**, **Appointments**, and **Daily Routines**.
- Real-time active/completed tracking and deletion controls.
- Direct **Caregiver-to-Patient Custom Alerts** with quick pre-filled templates.

### 4. 📸 Personalized Family Memories (FR-07)
- Add family members' names, photos, relationships, and memory prompts.
- Integrates personal family memories into patient recall activities.

### 5. 🎙️ Voice Assistant (FR-09)
- Built with the Web Speech API (`speechSynthesis` + speech recognition).
- Supports vocal queries for daily routine, next medicine reminder, and score summaries.

### 6. 📊 Performance Analytics & Dashboard (FR-10)
- **30-Day Accuracy Trend**: Smooth SVG area curve tracking cognitive stability.
- **Games by Category**: Visual donut breakdown of exercise distribution.
- **Daily Activity**: Weekly bar charts showing day-by-day engagement.
- **Spotlight Patient**: Quick overview of active patients and recent activities.

### 7. 📱 Progressive Web App & Offline Resiliency (FR-11)
- Built with `vite-plugin-pwa` and Workbox caching.
- Full offline support with LocalStorage / SQLite persistence.
- Installable on desktop, tablet, and mobile devices as a standalone app.

---

## 🛠️ Technology Stack

- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **PWA**: `vite-plugin-pwa` + Workbox
- **Icons**: Lucide React
- **Voice / Speech**: Web Speech API (`speechSynthesis`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed on your machine
- npm / yarn / pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/<your-username>/Project-Anjana.git
cd Project-Anjana
```

2. Install dependencies:
```bash
npm install
```

3. Start the local development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Build for production:
```bash
npm run build
```

---

## 📁 Project Structure

```
Project-Anjana/
├── public/
│   ├── anjana-icon.svg          # PWA App Icon
│   └── favicon.svg              # Browser Favicon
├── src/
│   ├── components/
│   │   ├── AddFamilyMemberModal.jsx
│   │   ├── AddPatientModal.jsx
│   │   ├── Charts.jsx           # SVG Area, Donut, and Bar charts
│   │   ├── CognitiveGameModal.jsx # Playable mini-game simulator
│   │   ├── CreateReminderModal.jsx
│   │   ├── PWAInstallPrompt.jsx
│   │   ├── SendAlertModal.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   ├── TopBar.jsx
│   │   └── VoiceAssistantModal.jsx
│   ├── context/
│   │   └── AppContext.jsx       # State management & offline sync logic
│   ├── data/
│   │   └── mockData.js          # Demo patients, games, and reminders
│   ├── pages/
│   │   ├── Analytics.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Games.jsx
│   │   ├── Login.jsx
│   │   ├── PatientDetail.jsx
│   │   ├── Patients.jsx
│   │   ├── Reminders.jsx
│   │   └── Settings.jsx
│   ├── App.jsx                  # App routing & protected shell
│   ├── index.css                # Tailwind CSS v4 styling
│   └── main.jsx
├── anjana.docx                  # Product Requirements Document
├── vite.config.js               # Vite + Tailwind + PWA Configuration
└── package.json
```

---

## 📄 License

This project is developed for cognitive engagement and caregiver assistance.
# Anjana-ka-project
