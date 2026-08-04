import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showError('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      showSuccess('Welcome back to MeetFlow AI!');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid email or password';
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign in to your account" subtitle="Access your AI meeting workspace">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
          required
        />
        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded bg-gray-900 border-gray-700 text-brand-500 focus:ring-brand-500" />
            <span>Remember me</span>
          </label>
          <a href="#" className="hover:text-brand-400 transition-colors">Forgot password?</a>
        </div>
        <Button type="submit" isLoading={isLoading} icon={LogIn} size="lg" className="mt-2">
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-brand-400 font-semibold hover:underline">
          Create account
        </Link>
      </div>
    </AuthLayout>
  );
};
