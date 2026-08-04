import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, Clock, Save, ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { meetingsApi } from '../api/meetingsApi';
import { useToast } from '../context/ToastContext';

export const CreateMeeting = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // Default meeting date to now formatted for datetime-local input
  const [meetingDate, setMeetingDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [isLoading, setIsLoading] = useState(false);

  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !meetingDate) {
      showError('Please provide a meeting title and date');
      return;
    }
    setIsLoading(true);
    try {
      const created = await meetingsApi.createMeeting({
        title,
        description,
        meeting_date: new Date(meetingDate).toISOString(),
      });
      showSuccess('Meeting scheduled successfully!');
      navigate(`/meetings/${created.id}`);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to create meeting';
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create Meeting">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Meetings
        </button>

        <Card>
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-100">Schedule New Meeting</h2>
              <p className="text-xs text-gray-400">Enter meeting details and agenda</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Meeting Title"
              placeholder="e.g. Q3 Product Roadmap Sync"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              icon={FileText}
              required
            />

            <Input
              label="Date & Time"
              type="datetime-local"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              icon={Clock}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Description / Agenda (Optional)
              </label>
              <textarea
                rows={4}
                placeholder="Outline discussion points, participants, or goals..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-900/90 border border-gray-700/80 rounded-xl text-gray-100 placeholder-gray-500 text-sm p-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800 mt-2">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading} icon={Save}>
                Save Meeting
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};
