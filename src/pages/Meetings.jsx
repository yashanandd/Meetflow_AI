import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Search, Trash2, Edit3, ArrowRight, Clock } from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { meetingsApi } from '../api/meetingsApi';
import { formatDate } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

export const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchMeetings = async () => {
    try {
      const data = await meetingsApi.getMeetings();
      setMeetings(data);
    } catch (err) {
      showError("Failed to fetch meetings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await meetingsApi.deleteMeeting(deleteId);
      showSuccess("Meeting deleted successfully");
      setMeetings((prev) => prev.filter((m) => m.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      showError("Failed to delete meeting");
    } finally {
      setDeleting(false);
    }
  };

  const filteredMeetings = meetings.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    (m.description && m.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout title="Meetings">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search meetings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </div>
        <Link to="/meetings/new">
          <Button icon={Plus}>Schedule Meeting</Button>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading meetings..." />
      ) : filteredMeetings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No meetings found"
          description={search ? "No meetings match your search query." : "Schedule your first meeting to begin taking notes and generating summaries."}
          actionLabel={search ? null : "Schedule Meeting"}
          onAction={() => window.location.href = '/meetings/new'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeetings.map((meeting) => (
            <Card key={meeting.id} hoverable className="flex flex-col justify-between group">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-bold text-lg text-gray-100 group-hover:text-brand-400 transition-colors line-clamp-1">
                    {meeting.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setDeleteId(meeting.id);
                    }}
                    className="text-gray-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                    title="Delete meeting"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-3">
                  <Clock className="w-3.5 h-3.5 text-brand-400" />
                  {formatDate(meeting.meeting_date)}
                </p>

                {meeting.description && (
                  <p className="text-sm text-gray-300 line-clamp-2 mb-4">
                    {meeting.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-800 flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="px-2.5 py-0.5 rounded-full bg-gray-800 border border-gray-700">
                    {meeting.notes_count || 0} Notes
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-gray-800 border border-gray-700">
                    {meeting.tasks_count || 0} Tasks
                  </span>
                </div>
                <Link to={`/meetings/${meeting.id}`} className="text-xs font-semibold text-brand-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Open <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Meeting"
        message="Are you sure you want to delete this meeting? All associated notes and tasks will be permanently removed."
        isLoading={deleting}
      />
    </DashboardLayout>
  );
};
