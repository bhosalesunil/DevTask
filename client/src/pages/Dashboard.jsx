import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as notificationService from '../services/notificationService';
import * as projectService from '../services/projectService';

import { WelcomeBanner } from '../components/WelcomeBanner';
import { StatCard } from '../components/StatCard';
import {
  TaskProgressChart,
  ProductivityChart,
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
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

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

      {/* 2. Statistics KPI Cards Row (5 Cards) */}
      <div className="grid-5">
        <StatCard
          title="Total Projects"
          value={stats?.totalProjects || 0}
          icon={<FolderKanban size={22} />}
          color="indigo"
          subtext="Active workspace projects"
          trend={20}
        />
        <StatCard
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          icon={<CheckSquare size={22} />}
          color="blue"
          subtext={`${stats?.statusBreakdown?.TODO || 0} pending in To Do`}
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgressTasks || 0}
          icon={<Clock size={22} />}
          color="orange"
          subtext={`${stats?.reviewTasks || 0} in review stage`}
        />
        <StatCard
          title="Completed Tasks"
          value={stats?.completedTasks || 0}
          icon={<CheckCircle2 size={22} />}
          color="green"
          subtext="Finished tasks"
          trend={stats?.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}
        />
        <StatCard
          title="Team Members"
          value={developers?.length || stats?.totalDevelopers || 0}
          icon={<Users size={22} />}
          color="pink"
          subtext="Active developers"
        />
      </div>

      {/* 3. Task Analytics & Productivity Section (2 Columns) */}
      <div className="grid-2">
        <TaskProgressChart breakdown={stats?.statusBreakdown} />
        <ProductivityChart />
      </div>

      {/* 4. Team Workload & Activity / Deadlines Section (2 Columns) */}
      <div className="grid-2">
        <TeamWorkloadChart developerWorkload={stats?.developerWorkload || []} />

        <div className="space-y-6">
          <UpcomingTasksWidget upcomingDeadlines={stats?.upcomingDeadlines || []} />
          <RecentActivityWidget recentTasks={stats?.recentTasks || []} />
        </div>
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
