import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, Sparkles, CheckSquare, Plus, ArrowRight, Clock } from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { dashboardApi } from '../api/dashboardApi';
import { formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardApi.getDashboard();
        setData(res);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <LoadingSpinner label="Loading dashboard metrics..." />
      </DashboardLayout>
    );
  }

  const {
    total_meetings = 0,
    total_notes = 0,
    ai_summaries_generated = 0,
    task_stats = { total: 0, pending: 0, in_progress: 0, completed: 0 },
    upcoming_meetings = [],
    recent_tasks = [],
  } = data || {};

  return (
    <DashboardLayout title="Dashboard">
      {/* Welcome Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-gray-800 bg-gradient-to-r from-brand-950/40 via-purple-950/20 to-gray-900 mb-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.full_name || 'User'} 👋
          </h2>
          <p className="text-sm text-gray-400 mt-2 max-w-xl">
            Here is your AI meeting summary and action items overview for today.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/meetings/new">
            <Button icon={Plus}>New Meeting</Button>
          </Link>
        </div>
      </div>

      {/* Metrics Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Meetings</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{total_meetings}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Meeting Notes</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{total_notes}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Summaries</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{ai_summaries_generated}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Action Items</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">
                {task_stats.completed}/{task_stats.total}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckSquare className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Meetings */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming & Recent Meetings</CardTitle>
            <Link to="/meetings" className="text-xs text-brand-400 font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {upcoming_meetings.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No meetings scheduled"
                description="Create a meeting to start organizing notes and AI summaries."
                actionLabel="Create Meeting"
                onAction={() => window.location.href = '/meetings/new'}
              />
            ) : (
              <div className="space-y-3">
                {upcoming_meetings.map((meeting) => (
                  <Link
                    key={meeting.id}
                    to={`/meetings/${meeting.id}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-900/60 border border-gray-800 hover:border-brand-500/40 transition-colors group"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-100 group-hover:text-brand-400 transition-colors">
                        {meeting.title}
                      </h4>
                      <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        {formatDate(meeting.meeting_date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="px-2.5 py-1 rounded-lg bg-gray-800 border border-gray-700">
                        {meeting.notes_count || 0} Notes
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-gray-800 border border-gray-700">
                        {meeting.tasks_count || 0} Tasks
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Action Items</CardTitle>
            <Link to="/tasks" className="text-xs text-brand-400 font-semibold hover:underline flex items-center gap-1">
              Task board <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {recent_tasks.length === 0 ? (
              <EmptyState
                icon={CheckSquare}
                title="No action items"
                description="Assign tasks inside meeting notes to track team deliverables."
              />
            ) : (
              <div className="space-y-3">
                {recent_tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-900/60 border border-gray-800"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-200 text-sm">{task.title}</h4>
                      {task.meeting_title && (
                        <p className="text-xs text-gray-400 mt-0.5">Meeting: {task.meeting_title}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
