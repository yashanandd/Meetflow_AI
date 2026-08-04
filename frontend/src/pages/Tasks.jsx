import React, { useEffect, useState } from 'react';
import { CheckSquare, Plus, Search, Trash2, Filter, Clock } from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Modal } from '../components/common/Modal';
import { tasksApi } from '../api/tasksApi';
import { meetingsApi } from '../api/meetingsApi';
import { formatDate } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskMeetingId, setTaskMeetingId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchData = async () => {
    try {
      const [tData, mData] = await Promise.all([
        tasksApi.getTasks(),
        meetingsApi.getMeetings(),
      ]);
      setTasks(tData);
      setMeetings(mData);
      if (mData.length > 0) {
        setTaskMeetingId(mData[0].id.toString());
      }
    } catch (err) {
      showError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (task, newStatus) => {
    try {
      const updated = await tasksApi.updateTask(task.id, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      showSuccess(`Task status changed to ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      showError("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await tasksApi.deleteTask(deleteId);
      showSuccess("Task deleted successfully");
      setTasks((prev) => prev.filter((t) => t.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      showError("Failed to delete task");
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title || !taskMeetingId) {
      showError("Please select a meeting and enter a task title");
      return;
    }
    setSubmitting(true);
    try {
      const created = await tasksApi.createTask({
        meeting_id: parseInt(taskMeetingId, 10),
        title,
        description,
        priority,
        status,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
      });
      setTasks([created, ...tasks]);
      showSuccess("Task created successfully!");
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
    } catch (err) {
      showError("Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <DashboardLayout title="Action Items & Tasks">
      {/* Filter and Action Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Filter tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-900 border border-gray-700/80 rounded-xl px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-gray-900 border border-gray-700/80 rounded-xl px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          New Task
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading action items..." />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No action items found"
          description="Create a task linked to a meeting to track deliverables."
          actionLabel="Create Task"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                    className="bg-gray-900 text-xs font-semibold rounded-lg px-2.5 py-1 border border-gray-700 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <h3 className={`font-bold text-gray-100 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </h3>
                </div>

                {task.description && (
                  <p className="text-xs text-gray-400 pl-1">{task.description}</p>
                )}

                <div className="flex items-center gap-3 text-xs text-gray-500 pl-1 pt-1">
                  {task.meeting_title && <span>Meeting: {task.meeting_title}</span>}
                  {task.due_date && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-brand-400" /> Due: {formatDate(task.due_date)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <PriorityBadge priority={task.priority} />
                <StatusBadge status={task.status} />
                <button
                  onClick={() => setDeleteId(task.id)}
                  className="text-gray-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Action Item">
        <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Associated Meeting</label>
            <select
              value={taskMeetingId}
              onChange={(e) => setTaskMeetingId(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-sm text-gray-100 focus:outline-none focus:border-brand-500"
              required
            >
              <option value="" disabled>Select meeting</option>
              {meetings.map((m) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          <Input
            label="Task Title"
            placeholder="e.g. Finalize architecture specs"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Description (Optional)</label>
            <textarea
              rows={3}
              placeholder="Task details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-sm text-gray-100 focus:outline-none focus:border-brand-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <Input
              label="Due Date"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800 mt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Save Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Action Item"
        message="Are you sure you want to delete this action item?"
        isLoading={deleting}
      />
    </DashboardLayout>
  );
};
