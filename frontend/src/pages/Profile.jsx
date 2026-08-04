import React, { useState } from 'react';
import { User, Mail, Save, Calendar, ShieldCheck } from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [isLoading, setIsLoading] = useState(false);

  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showError("Full name cannot be empty");
      return;
    }
    setIsLoading(true);
    try {
      await updateUser(fullName);
      showSuccess("Profile updated successfully!");
    } catch (err) {
      showError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Profile Management">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Card Header */}
        <Card className="flex items-center gap-5 p-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center font-extrabold text-2xl text-white shadow-glow">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-100">{user?.full_name || 'User Profile'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium mt-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified JWT Session
            </div>
          </div>
        </Card>

        {/* Update Form */}
        <Card>
          <div className="pb-4 mb-6 border-b border-gray-800">
            <h3 className="font-bold text-gray-100">Personal Information</h3>
            <p className="text-xs text-gray-400">Update your account name and preferences</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={User}
              required
            />
            <Input
              label="Email Address"
              value={user?.email || ''}
              disabled
              icon={Mail}
              className="opacity-60 cursor-not-allowed"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Account Created</label>
              <div className="flex items-center gap-2 p-3 bg-gray-900/60 rounded-xl border border-gray-800 text-xs text-gray-400">
                <Calendar className="w-4 h-4 text-brand-400" />
                <span>{user?.created_at ? formatDate(user.created_at) : 'N/A'}</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-800 mt-2">
              <Button type="submit" isLoading={isLoading} icon={Save}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};
