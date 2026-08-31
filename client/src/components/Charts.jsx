import React, { useState } from 'react';
import {
  ChevronDown,
  FileText,
  Edit3,
  CheckCircle2,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';

/**
 * 1. Task Progress Overview Donut Chart Card
 */
export const TaskProgressChart = ({ breakdown = {} }) => {
  const [filter, setFilter] = useState('This Month');

  // Fallback to reference screenshot numbers if breakdown is empty
  const todoCount = breakdown.TODO ?? 28;
  const inProgressCount = breakdown.IN_PROGRESS ?? 23;
  const reviewCount = breakdown.REVIEW ?? 15;
  const completedCount = breakdown.COMPLETED ?? 18;

  const total = todoCount + inProgressCount + reviewCount + completedCount || 84;

  const stages = [
    { label: 'To Do', count: todoCount, color: '#6366f1', pct: Math.round((todoCount / total) * 100) },
    { label: 'In Progress', count: inProgressCount, color: '#0284c7', pct: Math.round((inProgressCount / total) * 100) },
    { label: 'Review', count: reviewCount, color: '#f59e0b', pct: Math.round((reviewCount / total) * 100) },
    { label: 'Completed', count: completedCount, color: '#10b981', pct: Math.round((completedCount / total) * 100) },
  ];

  // Donut SVG circumference calculation (r = 45 -> C = 2 * PI * 45 = 282.74)
  const strokeDasharray = 282.74;
  
  // Calculate stroke offsets for multi-segment SVG donut
  const todoOffset = 0;
  const inProgressOffset = strokeDasharray * (todoCount / total);
  const reviewOffset = inProgressOffset + strokeDasharray * (inProgressCount / total);
  const completedOffset = reviewOffset + strokeDasharray * (reviewCount / total);

  return (
    <div className="card bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-base text-slate-900">Task Progress Overview</h3>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Distribution of tasks across workflow stages</p>
        </div>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-extrabold px-3 py-1.5 pr-7 rounded-xl outline-none cursor-pointer hover:border-slate-300 transition"
          >
            <option value="This Month">This Month</option>
            <option value="This Week">This Week</option>
            <option value="This Year">This Year</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
        {/* SVG Donut Chart */}
        <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
          <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 110 110">
            {/* Background ring */}
            <circle cx="55" cy="55" r="45" stroke="#f1f5f9" strokeWidth="11" fill="transparent" />

            {/* To Do Segment */}
            <circle
              cx="55"
              cy="55"
              r="45"
              stroke="#6366f1"
              strokeWidth="11"
              strokeDasharray={`${(todoCount / total) * strokeDasharray} ${strokeDasharray}`}
              strokeDashoffset={-todoOffset}
              fill="transparent"
            />
            {/* In Progress Segment */}
            <circle
              cx="55"
              cy="55"
              r="45"
              stroke="#0284c7"
              strokeWidth="11"
              strokeDasharray={`${(inProgressCount / total) * strokeDasharray} ${strokeDasharray}`}
              strokeDashoffset={-inProgressOffset}
              fill="transparent"
            />
            {/* Review Segment */}
            <circle
              cx="55"
              cy="55"
              r="45"
              stroke="#f59e0b"
              strokeWidth="11"
              strokeDasharray={`${(reviewCount / total) * strokeDasharray} ${strokeDasharray}`}
              strokeDashoffset={-reviewOffset}
              fill="transparent"
            />
            {/* Completed Segment */}
            <circle
              cx="55"
              cy="55"
              r="45"
              stroke="#10b981"
              strokeWidth="11"
              strokeDasharray={`${(completedCount / total) * strokeDasharray} ${strokeDasharray}`}
              strokeDashoffset={-completedOffset}
              fill="transparent"
            />
          </svg>

          {/* Donut Center Total Label */}
          <div className="absolute text-center">
            <span className="font-black text-2xl text-slate-900 block leading-none">
              {total}
            </span>
            <span className="text-[11px] font-bold text-slate-400 mt-1 block">Total Tasks</span>
          </div>
        </div>

        {/* Breakdown Legend Table */}
        <div className="w-full space-y-3">
          {stages.map((st) => (
            <div key={st.label} className="flex items-center justify-between text-xs font-bold py-1 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: st.color }} />
                <span className="text-slate-700">{st.label}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-slate-900 font-extrabold">{st.count}</span>
                <span className="text-slate-400 w-8 text-right">{st.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Team Workload Card Component
 */
export const TeamWorkloadChart = ({ developerWorkload = [] }) => {
  // Reference fallback data if live workload is empty
  const defaultTeam = [
    {
      name: 'Rahul Sharma',
      title: 'Senior Frontend Developer',
      completed: 16,
      total: 20,
      pct: 80,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Sarah Chen',
      title: 'Full Stack Engineer',
      completed: 12,
      total: 18,
      pct: 67,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Prashant Dhekal',
      title: 'Frontend Developer',
      completed: 8,
      total: 15,
      pct: 53,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    },
  ];

  const teamList = developerWorkload.length > 0
    ? developerWorkload.map((item) => {
        const dev = item.developer || {};
        const comp = item.completedTasks || 0;
        const tot = item.totalTasks || 1;
        return {
          name: dev.name || 'Developer',
          title: dev.title || 'Software Developer',
          completed: comp,
          total: tot,
          pct: Math.round((comp / tot) * 100),
          avatar: dev.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dev.name}`,
        };
      })
    : defaultTeam;

  return (
    <div className="card bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-base text-slate-900">Team Workload</h3>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Task allocation and progress per developer</p>
        </div>
        <button className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 transition">
          View All
        </button>
      </div>

      <div className="space-y-4 pt-1">
        {teamList.map((member, idx) => (
          <div key={member.name + idx} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">{member.name}</h4>
                  <p className="text-[11px] font-semibold text-slate-400">{member.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-extrabold">
                <span className="text-slate-600">{member.completed} / {member.total} Tasks</span>
                <span className="text-slate-900 font-black w-8 text-right">{member.pct}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${member.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 3. Upcoming Tasks Widget Component
 */
export const UpcomingTasksWidget = ({ upcomingDeadlines = [] }) => {
  const defaultTasks = [
    {
      id: '1',
      title: 'Fix login issue on mobile',
      project: 'DevTask Platform',
      priority: 'High',
      date: '20 May, 2024',
      status: 'In Progress',
    },
    {
      id: '2',
      title: 'Implement dark mode',
      project: 'DevTask Platform',
      priority: 'Medium',
      date: '22 May, 2024',
      status: 'To Do',
    },
    {
      id: '3',
      title: 'Review API integration',
      project: 'DevTask Platform',
      priority: 'Low',
      date: '24 May, 2024',
      status: 'Review',
    },
    {
      id: '4',
      title: 'Improve dashboard UI',
      project: 'DevTask Platform',
      priority: 'High',
      date: '26 May, 2024',
      status: 'To Do',
    },
  ];

  const tasksList = upcomingDeadlines.length > 0
    ? upcomingDeadlines.slice(0, 4).map((t) => ({
        id: t._id,
        title: t.title,
        project: t.project?.title || 'DevTask Platform',
        priority: t.priority ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1) : 'Medium',
        date: '20 May, 2024',
        status: t.status === 'IN_PROGRESS' ? 'In Progress' : t.status === 'REVIEW' ? 'Review' : 'To Do',
      }))
    : defaultTasks;

  const priorityStyles = {
    High: 'bg-rose-100 text-rose-700',
    Medium: 'bg-amber-100 text-amber-700',
    Low: 'bg-emerald-100 text-emerald-700',
  };

  const statusStyles = {
    'In Progress': 'bg-sky-100 text-sky-700',
    'To Do': 'bg-indigo-100 text-indigo-700',
    'Review': 'bg-amber-100 text-amber-700',
    'Completed': 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="card bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-base text-slate-900">Upcoming Tasks</h3>
        <button className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 transition">
          View All
        </button>
      </div>

      <div className="space-y-3.5">
        {tasksList.map((t) => (
          <div key={t.id} className="flex items-center justify-between text-xs py-1.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <FileText size={17} />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 leading-tight">{t.title}</h4>
                <p className="text-[11px] text-slate-400 font-semibold">*{t.project}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold ${priorityStyles[t.priority] || priorityStyles.Medium}`}>
                {t.priority}
              </span>
              <span className="text-slate-500 font-bold hidden sm:inline-block w-24 text-center">{t.date}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold w-24 text-center ${statusStyles[t.status] || statusStyles['To Do']}`}>
                {t.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 4. Recent Activity Component (Connected Vertical Timeline)
 */
export const RecentActivityWidget = ({ recentTasks = [] }) => {
  const defaultActivities = [
    {
      id: '1',
      text: 'You updated the task',
      highlight: '"Fix login issue on mobile"',
      time: '2 minutes ago',
      icon: <Edit3 size={15} className="text-white" />,
      color: 'bg-indigo-600',
    },
    {
      id: '2',
      text: 'Rahul Sharma completed the task',
      highlight: '"API Integration"',
      time: '1 hour ago',
      icon: <CheckCircle2 size={15} className="text-white" />,
      color: 'bg-emerald-500',
    },
    {
      id: '3',
      text: 'Sarah Chen commented on',
      highlight: '"Implement dark mode"',
      time: '2 hours ago',
      icon: <MessageSquare size={15} className="text-white" />,
      color: 'bg-amber-500',
    },
    {
      id: '4',
      text: 'Prashant Dhekal updated task status to',
      highlight: 'In Progress',
      time: '3 hours ago',
      icon: <RefreshCw size={15} className="text-white" />,
      color: 'bg-blue-600',
    },
  ];

  return (
    <div className="card bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-base text-slate-900">Recent Activity</h3>
        <button className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 transition">
          View All
        </button>
      </div>

      <div className="relative space-y-4 pl-1 pt-1">
        {/* Vertical Timeline Line */}
        <div className="absolute left-[17px] top-3 bottom-3 w-[2px] bg-slate-100" />

        {defaultActivities.map((act) => (
          <div key={act.id} className="relative flex items-start gap-3.5 text-xs z-10">
            <div className={`w-8 h-8 rounded-full ${act.color} flex items-center justify-center flex-shrink-0 shadow-xs`}>
              {act.icon}
            </div>
            <div className="pt-0.5">
              <p className="text-slate-700 font-semibold leading-snug">
                {act.text} <span className="font-extrabold text-slate-900">{act.highlight}</span>
              </p>
              <span className="text-[11px] text-slate-400 font-medium block mt-0.5">{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
