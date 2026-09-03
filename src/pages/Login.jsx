import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('sarah.anderson@example.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl w-full bg-white rounded-3xl sm:rounded-[32px] overflow-hidden card-shadow border border-[#2D2A3E]/5 grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Warm Illustration & Brand Story */}
        <div className="bg-gradient-to-br from-[#8B7EC8] via-[#8B7EC8]/90 to-[#A8BBA0] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#A8BBA0]/30 rounded-full blur-2xl pointer-events-none" />

          {/* Top Brand */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-display">Anjana</h1>
              <p className="text-xs text-white/80 font-medium">Cognitive Engagement Platform</p>
            </div>
          </div>

          {/* Center Graphic & Quote */}
          <div className="relative z-10 my-12 space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Heart className="w-10 h-10 text-white fill-white/20" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display leading-tight">
              Gentle care, empowered by cognitive AI.
            </h2>
            <p className="text-sm text-white/90 leading-relaxed font-medium max-w-md">
              A caregiver-controlled platform providing adaptive cognitive activities, daily reminders, and personalized memory assistance for your loved ones.
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                <span>Personalized cognitive games & routine recall</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                <span>Offline support with local data synchronization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                <span>Voice assistance & scheduled medicine alerts</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust disclaimer */}
          <div className="relative z-10 text-[11px] text-white/70 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Designed for cognitive support & daily engagement</span>
          </div>
        </div>

        {/* Right Side: Clean Login Form */}
        <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-[#2D2A3E] font-display">Welcome back</h2>
              <p className="text-sm text-[#6E6A82] mt-1.5 font-medium">
                Sign in to your caregiver portal to monitor loved ones.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#2D2A3E] mb-1.5 uppercase tracking-wider">
                  Caregiver Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="caregiver@example.com"
                  className="w-full px-4 py-3.5 text-sm bg-[#FDFBF7] border border-[#2D2A3E]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40 focus:border-[#8B7EC8] transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#2D2A3E] uppercase tracking-wider">
                    Password
                  </label>
                  <a href="#forgot" className="text-xs font-semibold text-[#8B7EC8] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 text-sm bg-[#FDFBF7] border border-[#2D2A3E]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B7EC8]/40 focus:border-[#8B7EC8] transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-[#8B7EC8] hover:bg-[#796BB9] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  login('sarah.anderson@example.com', 'demo');
                  navigate('/');
                }}
                className="text-xs font-bold text-[#8B7EC8] hover:text-[#796BB9] underline underline-offset-4"
              >
                ⚡ Quick Demo 1-Click Login (Sarah Anderson)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
