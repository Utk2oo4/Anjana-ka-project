import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'lavender', trend }) => {
  const colorStyles = {
    lavender: {
      bg: 'bg-[#8B7EC8]/10',
      text: 'text-[#8B7EC8]',
      border: 'border-[#8B7EC8]/20',
    },
    sage: {
      bg: 'bg-[#A8BBA0]/15',
      text: 'text-[#4F6A45]',
      border: 'border-[#A8BBA0]/30',
    },
    coral: {
      bg: 'bg-[#E88C7D]/15',
      text: 'text-[#D05D4A]',
      border: 'border-[#E88C7D]/30',
    },
    sky: {
      bg: 'bg-[#6B9AC4]/15',
      text: 'text-[#3E74A5]',
      border: 'border-[#6B9AC4]/30',
    },
  };

  const style = colorStyles[color] || colorStyles.lavender;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#2D2A3E]/5 card-shadow card-shadow-hover flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl ${style.bg} ${style.border} flex items-center justify-center ${style.text}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {trend}
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="text-3xl sm:text-4xl font-extrabold text-[#2D2A3E] font-display tracking-tight">
          {value}
        </div>
        <div className="text-sm font-semibold text-[#2D2A3E]/80 mt-1">{title}</div>
        {subtitle && <p className="text-xs text-[#6E6A82] mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
};
