import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, FileText, Sparkles, Plus, Trash2, Edit3, ArrowLeft, Save, CheckSquare } from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { meetingsApi } from '../api/meetingsApi';
import { notesApi } from '../api/notesApi';
import { tasksApi } from '../api/tasksApi';
import { formatDate } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

export const MeetingDetails = () => {
  const { id } = useParams();
  const meetingId = parseInt(id, 10);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [meeting, setMeeting] = useState(null);
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Note taking state
  const [rawNote, setRawNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [aiProvider, setAiProvider] = useState('');

  // Task creation state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [creatingTask, setCreatingTask] = useState(false);

  const fetchData = async () => {
    try {
      const [mRes, nRes, tRes] = await Promise.all([
        meetingsApi.getMeetingById(meetingId),
        notesApi.getNotes(meetingId),
        tasksApi.getTasks(meetingId),
      ]);
      setMeeting(mRes);
      setNotes(nRes);
      setTasks(tRes);

      // If existing note exists, pre-fill text area
      if (nRes && nRes.length > 0) {
        setRawNote(nRes[0].raw_note);
        if (nRes[0].ai_summary) {
          setAiSummary(nRes[0].ai_summary);
        }
      }
    } catch (err) {
      showError("Failed to load meeting details");
      navigate('/meetings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [meetingId]);

  const handleSaveNote = async () => {
    if (!rawNote.trim()) {
      showError("Note content cannot be empty");
      return;
    }
    setSavingNote(true);
    try {
      if (notes.length > 0) {
        // Update existing latest note
        const updated = await notesApi.updateNote(notes[0].id, { raw_note: rawNote });
        setNotes([updated, ...notes.slice(1)]);
      } else {
        // Create new note
        const created = await notesApi.createNote({ meeting_id: meetingId, raw_note: rawNote });
        setNotes([created]);
      }
      showSuccess("Meeting notes saved!");
    } catch (err) {
      showError("Failed to save note");
    } finally {
      setSavingNote(false);
    }
  };

  const handleSummarize = async () => {
    if (!rawNote.trim()) {
      showError("Please enter notes before generating an AI summary");
      return;
    }
    setSummarizing(true);
    try {
      // First ensure raw notes are saved
      await handleSaveNote();

      const res = await notesApi.summarizeNote({ meeting_id: meetingId, raw_note: rawNote });
      setAiSummary(res.ai_summary);
      setAiProvider(res.provider);
      showSuccess(`AI Summary generated via ${res.provider}!`);
    } catch (err) {
      showError("AI summarization failed");
    } finally {
      setSummarizing(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      showError("Task title is required");
      return;
    }
    setCreatingTask(true);
    try {
      const newTask = await tasksApi.createTask({
        meeting_id: meetingId,
        title: taskTitle,
        description: taskDesc,
        priority: taskPriority,
        status: 'pending',
        due_date: taskDueDate ? new Date(taskDueDate).toISOString() : null,
      });
      setTasks([newTask, ...tasks]);
      showSuccess("Action item added!");
      setIsTaskModalOpen(false);
      setTaskTitle('');
      setTaskDesc('');
      setTaskPriority('medium');
      setTaskDueDate('');
    } catch (err) {
      showError("Failed to create task");
    } finally {
      setCreatingTask(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Meeting Details">
        <LoadingSpinner label="Loading workspace..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={meeting?.title || 'Meeting Details'}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/meetings')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-200 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Meetings
      </button>

      {/* Meeting Header Info */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{meeting?.title}</h1>
          <p className="text-xs text-gray-400 flex items-center gap-2 mt-2">
            <Clock className="w-4 h-4 text-brand-400" />
            <span>Scheduled: {formatDate(meeting?.meeting_date)}</span>
          </p>
          {meeting?.description && (
            <p className="text-sm text-gray-300 mt-3 max-w-3xl">{meeting.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={Plus} onClick={() => setIsTaskModalOpen(true)}>
            Add Action Item
          </Button>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Notes Editor & AI Summary */}
        <div className="space-y-8">
          {/* Notes Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FileText className="w-5 h-5 text-brand-400" />
                Raw Meeting Notes
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={handleSaveNote} isLoading={savingNote} icon={Save}>
                  Save Notes
                </Button>
                <Button size="sm" onClick={handleSummarize} isLoading={summarizing} icon={Sparkles}>
                  AI Summarize
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <textarea
                rows={10}
                placeholder="Type or paste your meeting notes, key discussions, and action points here..."
                value={rawNote}
                onChange={(e) => setRawNote(e.target.value)}
                className="w-full bg-gray-900/90 border border-gray-800 rounded-xl p-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-mono leading-relaxed"
              />
            </CardContent>
          </Card>

          {/* AI Summary Display Card */}
          {aiSummary && (
            <Card className="border-purple-500/30 bg-purple-950/10">
              <CardHeader>
                <CardTitle className="text-purple-300">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  AI Executive Summary
                </CardTitle>
                {aiProvider && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                    {aiProvider}
                  </span>
                )}
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {aiSummary}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Action Items / Tasks Board */}
        <div>
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader>
                <CardTitle>
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                  Action Items ({tasks.length})
                </CardTitle>
                <Button size="sm" icon={Plus} onClick={() => setIsTaskModalOpen(true)}>
                  Add Task
                </Button>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <p className="text-sm text-gray-400 py-8 text-center">
                    No action items created yet. Click "Add Task" to assign deliverables.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex flex-col gap-2"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-gray-100 text-sm">{task.title}</h4>
                          <div className="flex items-center gap-2">
                            <PriorityBadge priority={task.priority} />
                            <StatusBadge status={task.status} />
                          </div>
                        </div>
                        {task.description && (
                          <p className="text-xs text-gray-400">{task.description}</p>
                        )}
                        {task.due_date && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-gray-500" />
                            Due: {formatDate(task.due_date)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        </div>
      </div>

      {/* Task Creation Modal */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Create Action Item">
        <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
          <Input
            label="Task Title"
            placeholder="e.g. Prepare API documentation"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Task details..."
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              className="w-full bg-gray-900/90 border border-gray-700/80 rounded-xl text-gray-100 placeholder-gray-500 text-sm p-3 focus:outline-none focus:border-brand-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
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
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800 mt-2">
            <Button type="button" variant="secondary" onClick={() => setIsTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={creatingTask}>
              Save Task
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
