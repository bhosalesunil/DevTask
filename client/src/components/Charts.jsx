import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  ChevronDown,
  Activity,
  ListTodo,
  Calendar as CalendarIcon,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

/**
 * 1. Task Progress Overview Donut Chart Card
 */
export const TaskProgressChart = ({ breakdown = { TODO: 0, IN_PROGRESS: 0, REVIEW: 0, COMPLETED: 0 } }) => {
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0) || 0;

  const stats = [
    { label: 'TODO', count: breakdown.TODO || 0, color: '#64748b', bg: 'bg-slate-500' },
    { label: 'IN PROGRESS', count: breakdown.IN_PROGRESS || 0, color: '#4f46e5', bg: 'bg-indigo-600' },
    { label: 'REVIEW', count: breakdown.REVIEW || 0, color: '#f59e0b', bg: 'bg-amber-500' },
    { label: 'COMPLETED', count: breakdown.COMPLETED || 0, color: '#10b981', bg: 'bg-emerald-500' },
  ];

  return (
    <div className="card bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-base text-slate-900">Task Progress Overview</h3>
          <p className="text-xs font-semibold text-slate-500">Distribution of tasks across workflow stages</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
          Total: {total} Tasks
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
        {/* Donut Gauge Chart */}
        <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
          <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
            {total > 0 && (
              <>
                <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" strokeDasharray="238" strokeDashoffset={238 - (breakdown.COMPLETED / total) * 238} fill="transparent" />
                <circle cx="50" cy="50" r="38" stroke="#4f46e5" strokeWidth="12" strokeDasharray="238" strokeDashoffset={238 - (breakdown.IN_PROGRESS / total) * 238} fill="transparent" />
              </>
            )}
          </svg>
          <div className="absolute text-center">
            <span className="font-black text-xl text-slate-900 block leading-tight">
              {total > 0 ? Math.round((breakdown.COMPLETED / total) * 100) : 0}%
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Completed</span>
          </div>
        </div>

        {/* Breakdown Legend */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {stats.map((item) => {
            const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
            return (
              <div key={item.label} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase">{item.label}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-slate-900">{item.count}</span>
                  <span className="text-xs font-bold text-slate-400">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Productivity Metrics Line / Area Chart Card
 */
export const ProductivityChart = () => {
  return (
    <div className="card bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-base text-slate-900">Productivity Metrics</h3>
          <p className="text-xs font-semibold text-slate-500">Task completion and project activity over time</p>
        </div>
        <button className="flex items-center gap-1 px-3 py-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl">
          Monthly <ChevronDown size={14} />
        </button>
      </div>

      <div className="relative w-full h-40">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 500 130">
          <defs>
            <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid */}
          <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
          <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeDasharray="3 3" />
          <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeDasharray="3 3" />

          {/* Area Path */}
          <path
            d="M 10 100 Q 60 70 120 80 T 250 30 T 370 60 T 490 40 L 490 120 L 10 120 Z"
            fill="url(#purpleGrad)"
          />

          {/* Line Path */}
          <path
            d="M 10 100 Q 60 70 120 80 T 250 30 T 370 60 T 490 40"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Data Tooltip Point */}
          <line x1="250" y1="30" x2="250" y2="115" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="250" cy="30" r="6" fill="#4f46e5" stroke="#ffffff" strokeWidth="2.5" />
        </svg>

        <div className="absolute top-1 left-[50%] -translate-x-1/2 bg-slate-900 text-white px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-md z-10">
          75 tasks completed
        </div>
      </div>

      <div className="flex justify-between text-[11px] font-bold text-slate-400 pt-1 px-1">
        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
        <span className="text-slate-900 font-extrabold">Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
      </div>
    </div>
  );
};

/**
 * 3. Team Workload Card Component
 */
export const TeamWorkloadChart = ({ developerWorkload = [] }) => {
  return (
    <div className="card bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-base text-slate-900">Team Workload</h3>
          <p className="text-xs font-semibold text-slate-500">Task allocation and progress per developer</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
          {developerWorkload.length} Developers
        </span>
      </div>

      <div className="space-y-3">
        {developerWorkload.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No developer workload data available</p>
        ) : (
          developerWorkload.map((item) => {
            const dev = item.developer;
            if (!dev) return null;

            const completionPercent = item.totalTasks > 0
              ? Math.round((item.completedTasks / item.totalTasks) * 100)
              : 0;

            return (
              <div
                key={dev._id || dev.name}
                className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={dev.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dev.name}`}
                    alt={dev.name}
                    className="w-10 h-10 rounded-full border border-slate-200 object-cover shadow-xs"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{dev.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{dev.title || 'Senior Software Developer'}</p>
                  </div>
                </div>

                <div className="w-full sm:w-48">
                  <div className="flex items-center justify-between text-xs font-extrabold mb-1">
                    <span className="text-slate-700">
                      {item.completedTasks} / {item.totalTasks} Tasks
                    </span>
                    <span className="text-indigo-600 font-black">{completionPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

/**
 * 4. Upcoming Tasks Component
 */
export const UpcomingTasksWidget = ({ upcomingDeadlines = [] }) => {
  return (
    <div className="card bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-base text-slate-900">Upcoming Tasks</h3>
        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
          {upcomingDeadlines.length} Due Soon
        </span>
      </div>

      <div className="space-y-2.5">
        {upcomingDeadlines.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center font-medium">No upcoming deadlines this week!</p>
        ) : (
          upcomingDeadlines.map((t) => (
            <div
              key={t._id}
              className="p-3.5 border border-amber-200/70 bg-amber-50/40 rounded-xl flex items-center justify-between gap-3"
            >
              <div>
                <h4 className="font-bold text-xs text-slate-900">{t.title}</h4>
                <span className="text-[11px] font-medium text-slate-500">{t.project?.title || 'Project'}</span>
              </div>

              <div className="text-right">
                <span className="text-xs font-extrabold text-amber-700 block">
                  {formatDate(t.dueDate)}
                </span>
                <span className="badge badge-high text-[9px] uppercase font-bold">
                  {t.priority}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/**
 * 5. Recent Activity Component
 */
export const RecentActivityWidget = ({ recentTasks = [] }) => {
  return (
    <div className="card bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-base text-slate-900">Recent Activity</h3>
        <Activity size={16} className="text-indigo-600" />
      </div>

      <div className="space-y-3">
        {recentTasks.slice(0, 4).map((t, idx) => (
          <div key={t._id || idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl hover:bg-slate-50 transition">
            <div className="flex items-center gap-3">
              <span className={`badge badge-${t.status?.toLowerCase() || 'in_progress'}`}>
                {t.status?.replace('_', ' ')}
              </span>
              <div>
                <h4 className="font-bold text-slate-900">{t.title}</h4>
                <span className="text-[10px] text-slate-400 font-semibold">{t.project?.title || 'General'}</span>
              </div>
            </div>

            {t.assignedTo && (
              <img
                src={t.assignedTo.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.assignedTo.name}`}
                alt={t.assignedTo.name}
                className="w-7 h-7 rounded-full border border-slate-200 object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
