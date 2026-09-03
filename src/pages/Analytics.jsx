import React, { useState } from 'react';
import { BarChart3, TrendingUp, Clock, Brain, Calendar, Sparkles, Download, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AccuracyTrendChart, CategoryDonutChart, DailyActivityBarChart } from '../components/Charts';

export const Analytics = () => {
  const { patients, selectedPatient, setSelectedPatientId, performanceData } = useApp();
  const [timeRange, setTimeRange] = useState('30d'); // '7d', '30d', '90d'

  const timeTabs = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header with Patient Selector (Faithful to Reference Image) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2D2A3E] font-display tracking-tight">
            Performance Analytics
          </h1>
          <p className="text-sm font-medium text-[#6E6A82] mt-1">
            Section 5.6 & FR-10 — Cognitive session metrics, accuracy trends, and activity tracking.
          </p>
        </div>

        {/* Patient Dropdown */}
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-[#2D2A3E]/10 card-shadow text-xs">
          <span className="text-[#6E6A82] font-semibold">Patient:</span>
          <select
            value={selectedPatient.id}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="font-bold text-[#8B7EC8] bg-transparent outline-none cursor-pointer"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Time Range Tabs (Underline style from Reference) */}
      <div className="flex items-center gap-6 border-b border-[#2D2A3E]/10 overflow-x-auto text-sm font-semibold pb-1">
        {timeTabs.map((t) => {
          const isActive = timeRange === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id)}
              className={`pb-3 relative transition-colors whitespace-nowrap cursor-pointer ${
                isActive ? 'text-[#2D2A3E] font-bold' : 'text-[#6E6A82] hover:text-[#2D2A3E]'
              }`}
            >
              {t.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D2A3E] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 4 Summary Stat Cards (Faithful to Reference Image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#2D2A3E]/5 card-shadow">
          <div className="text-xs font-semibold text-[#6E6A82]">Games Completed:</div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#2D2A3E] font-display mt-1.5">
            {selectedPatient.gamesPlayed || 42}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">↑ 12% from previous cycle</div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#2D2A3E]/5 card-shadow">
          <div className="text-xs font-semibold text-[#6E6A82]">Average Accuracy:</div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#8B7EC8] font-display mt-1.5">
            {selectedPatient.avgAccuracy}%
          </div>
          <div className="text-[11px] text-[#8B7EC8] font-semibold mt-1">Cognitive stability indicator</div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#2D2A3E]/5 card-shadow">
          <div className="text-xs font-semibold text-[#6E6A82]">Response Time:</div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#2D2A3E] font-display mt-1.5">
            4.2s
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Optimal speed range</div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#2D2A3E]/5 card-shadow">
          <div className="text-xs font-semibold text-[#6E6A82]">Difficulty Level:</div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#4F6A45] font-display mt-1.5">
            {selectedPatient.currentDifficulty}
          </div>
          <div className="text-[11px] text-[#4F6A45] font-semibold mt-1">AI auto-calibrated</div>
        </div>
      </div>

      {/* Main Accuracy Trend Chart (Faithful to Reference Image) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D2A3E]/5 card-shadow space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#2D2A3E] font-display">Accuracy Trend</h2>
            <p className="text-xs text-[#6E6A82]">Daily cognitive activity accuracy over time</p>
          </div>
          <span className="text-xs font-bold text-[#8B7EC8] bg-[#8B7EC8]/10 px-3 py-1 rounded-full">
            {timeRange === '7d' ? '7 Days' : timeRange === '30d' ? '30 Days' : '90 Days'}
          </span>
        </div>

        <AccuracyTrendChart data={performanceData.accuracyTrend} timeRange={timeRange} />
      </div>

      {/* Two Side-by-Side Charts (Faithful to Reference Image) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Games by Category Donut */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#2D2A3E]/5 card-shadow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#2D2A3E] font-display mb-1">Games by Category</h3>
            <p className="text-xs text-[#6E6A82] mb-6">Distribution across cognitive exercise types</p>
          </div>
          <CategoryDonutChart data={performanceData.gamesByCategory} />
        </div>

        {/* Right: Daily Activity Bar Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#2D2A3E]/5 card-shadow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#2D2A3E] font-display mb-1">Daily Activity</h3>
            <p className="text-xs text-[#6E6A82] mb-4">Sessions completed per day of the week</p>
          </div>
          <DailyActivityBarChart data={performanceData.dailyActivity} />
        </div>
      </div>

      {/* Non-diagnostic Disclaimer (Section 15) */}
      <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#2D2A3E]/10 text-xs text-[#6E6A82] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#8B7EC8] shrink-0" />
          <span>Scores reflect engagement and game proficiency. They are not clinical diagnoses.</span>
        </div>
        <button
          onClick={() => alert(`Exported cognitive engagement summary for ${selectedPatient.name}.`)}
          className="px-3.5 py-1.5 rounded-xl bg-white border border-[#2D2A3E]/10 hover:border-[#8B7EC8] text-[#2D2A3E] font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-[#8B7EC8]" />
          <span>Export Summary</span>
        </button>
      </div>
    </div>
  );
};
