import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, icon, color = 'indigo', subtext, trend }) => {
  const colorMap = {
    indigo: {
      bg: '#e0e7ff',
      text: '#4338ca',
      border: '#c7d2fe',
    },
    blue: {
      bg: '#dbeafe',
      text: '#1d4ed8',
      border: '#bfdbfe',
    },
    orange: {
      bg: '#ffedd5',
      text: '#c2410c',
      border: '#fed7aa',
    },
    green: {
      bg: '#dcfce7',
      text: '#15803d',
      border: '#bbf7d0',
    },
    pink: {
      bg: '#fce7f3',
      text: '#be185d',
      border: '#fbcfe8',
    },
  };

  const activeColor = colorMap[color] || colorMap.indigo;

  return (
    <div className="card bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: activeColor.bg, color: activeColor.text }}
        >
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{value}</span>
          {trend !== undefined && trend !== null && (
            <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
              trend >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend >= 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
        </div>
        {subtext && <p className="text-xs font-medium text-slate-500 mt-1">{subtext}</p>}
      </div>
    </div>
  );
};
