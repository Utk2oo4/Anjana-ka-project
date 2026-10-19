import React, { useState, useEffect } from 'react';
import { Download, Sparkles, X, Smartphone } from 'lucide-react';

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after brief delay
      setTimeout(() => setIsVisible(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled || !isVisible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-5 right-2 left-2 sm:left-auto sm:right-5 z-50 sm:max-w-sm w-auto animate-in slide-in-from-bottom-5 duration-300 p-1 sm:p-2">
      <div className="bg-[#2D2A3E] text-white rounded-3xl p-5 shadow-2xl border border-white/10 relative overflow-hidden flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B7EC8] to-[#A8BBA0] flex items-center justify-center text-white shrink-0 shadow-sm">
          <Smartphone className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
            Install Anjana PWA
          </h4>
          <p className="text-[11px] text-white/70 mt-0.5 leading-snug">
            Install app for fast offline access and push reminder alerts.
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={handleInstall}
              className="px-3.5 py-1.5 bg-[#8B7EC8] hover:bg-[#796BB9] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install Now</span>
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="px-2.5 py-1.5 text-xs text-white/60 hover:text-white font-medium"
            >
              Later
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-white/40 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
