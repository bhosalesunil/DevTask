import React from 'react';

export const StatCard = ({ title, value, icon, color = 'purple', subtext, trendText }) => {
  const colorMap = {
    purple: {
      bg: '#f3e8ff',
      text: '#7e22ce',
      iconBg: 'bg-purple-100 text-purple-700',
    },
    blue: {
      bg: '#e0f2fe',
      text: '#0369a1',
      iconBg: 'bg-sky-100 text-sky-700',
    },
    orange: {
      bg: '#fef3c7',
      text: '#b45309',
      iconBg: 'bg-amber-100 text-amber-700',
    },
    green: {
      bg: '#dcfce7',
      text: '#15803d',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
  };

  const activeColor = colorMap[color] || colorMap.purple;

  return (
    <div className="card bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${activeColor.iconBg}`}>
          {icon}
        </div>
        <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wide">{title}</span>
      </div>

      <div className="mt-4 space-y-1">
        <div className="text-3xl font-black text-slate-900 tracking-tight leading-none">
          {value}
        </div>

        <div className="pt-1">
          <p className="text-xs font-semibold text-slate-400">{subtext}</p>
          {trendText && (
            <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <span>{trendText}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
