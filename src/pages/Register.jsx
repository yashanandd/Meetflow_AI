import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      showError('Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      showError('Password must be at least 6 characters long');
      return;
    }
    setIsLoading(true);
    try {
      await register(fullName, email, password);
      showSuccess('Account created successfully!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to create account';
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Get started with MeetFlow AI in seconds">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          icon={User}
          required
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
          required
        />
        <Button type="submit" isLoading={isLoading} icon={UserPlus} size="lg" className="mt-2">
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-400 font-semibold hover:underline">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
};
