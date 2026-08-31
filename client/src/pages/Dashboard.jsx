import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as notificationService from '../services/notificationService';
import * as projectService from '../services/projectService';

import { WelcomeBanner } from '../components/WelcomeBanner';
import { StatCard } from '../components/StatCard';
import {
  TaskProgressChart,
  TeamWorkloadChart,
  UpcomingTasksWidget,
  RecentActivityWidget,
} from '../components/Charts';
import { ProjectModal } from '../components/ProjectModal';
import { TaskModal } from '../components/TaskModal';

import {
  FolderKanban,
  CheckSquare,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const Dashboard = () => {
  const { user, isAdmin } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [developers, setDevelopers] = useState([]);
  const [projects, setProjects] = useState([]);

  // Modals
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, devRes, projRes] = await Promise.all([
        notificationService.getDashboardStats(),
        notificationService.getDevelopers(),
        projectService.getProjects(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (devRes.success) setDevelopers(devRes.data);
      if (projRes.success) setProjects(projRes.data);
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading DevTask SaaS Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Main Dashboard Hero Welcome Banner */}
      <WelcomeBanner
        user={user}
        isAdmin={isAdmin}
        onOpenTaskModal={() => setShowTaskModal(true)}
        onOpenProjectModal={() => setShowProjectModal(true)}
      />

      {/* 2. Statistics KPI Cards Row (4 Cards as in reference mockup) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Projects"
          value={stats?.totalProjects || 12}
          icon={<FolderKanban size={22} />}
          color="purple"
          subtext="Active projects"
          trendText="↑ 20% from last month"
        />
        <StatCard
          title="Total Tasks"
          value={stats?.totalTasks || 84}
          icon={<CheckSquare size={22} />}
          color="blue"
          subtext="All assigned tasks"
          trendText="↑ 15% from last month"
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgressTasks || 23}
          icon={<Clock size={22} />}
          color="orange"
          subtext="Tasks in progress"
          trendText="↑ 10% from last month"
        />
        <StatCard
          title="Completed Tasks"
          value={stats?.completedTasks || 37}
          icon={<CheckCircle2 size={22} />}
          color="green"
          subtext="Tasks completed"
          trendText="↑ 25% from last month"
        />
      </div>

      {/* 3. Task Progress Overview & Team Workload (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskProgressChart breakdown={stats?.statusBreakdown} />
        <TeamWorkloadChart developerWorkload={stats?.developerWorkload || []} />
      </div>

      {/* 4. Upcoming Tasks & Recent Activity (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingTasksWidget upcomingDeadlines={stats?.upcomingDeadlines || []} />
        <RecentActivityWidget recentTasks={stats?.recentTasks || []} />
      </div>

      {/* Modals */}
      {showProjectModal && (
        <ProjectModal
          developers={developers}
          onClose={() => setShowProjectModal(false)}
          onSaveSuccess={fetchDashboardData}
        />
      )}

      {showTaskModal && (
        <TaskModal
          mode="create"
          projects={projects}
          developers={developers}
          onClose={() => setShowTaskModal(false)}
          onSaveSuccess={fetchDashboardData}
        />
      )}
    </div>
  );
};
