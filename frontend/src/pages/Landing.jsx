import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, CheckSquare, Zap, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 overflow-hidden flex flex-col justify-between">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-brand-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header Navigation */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-glow">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            MeetFlow <span className="text-brand-400">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl w-full mx-auto px-6 py-16 md:py-24 text-center relative z-10 flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-8 animate-pulse">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>Next-Generation AI Meeting SaaS v1.0</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
          Transform Meetings into <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Actionable Intelligence</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mt-6 leading-relaxed">
          MeetFlow AI organizes your meeting notes, extracts key executive summaries instantly using pluggable AI engines, and manages team action items effortlessly.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <Link to="/register">
            <Button size="lg" icon={ArrowRight}>
              Start Free Trial
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="secondary">
              View Demo Dashboard
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left w-full">
          <div className="glass-panel p-8 rounded-3xl border border-gray-800 hover:border-brand-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">Automated AI Summarization</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Instant executive summaries generated from raw notes with intelligent fallback technology. Never miss key decisions.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-gray-800 hover:border-brand-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">Full Meeting Lifecycle</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Schedule, track, edit, and organize all team meetings in a centralized dashboard with history.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-gray-800 hover:border-brand-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">Action Item Tracking</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Assign priority badges, status trackers, and due dates linked directly to meeting conversations.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 py-8 px-6 text-center text-xs text-gray-500 relative z-10">
        <p>© 2026 MeetFlow AI – All rights reserved.</p>
      </footer>
    </div>
  );
};
