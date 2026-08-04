export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return formatDate(dateString);
};

export const getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case 'high':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case 'medium':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'low':
    default:
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'in_progress':
      return 'bg-brand-500/10 text-brand-400 border-brand-500/20';
    case 'pending':
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};
