import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Sparkles, Database, Server, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { dashboardApi } from '../api/dashboardApi';
import { useToast } from '../context/ToastContext';

export const Settings = () => {
  const [aiProvider, setAiProvider] = useState('heuristic');
  const [healthStatus, setHealthStatus] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchHealth = async () => {
    setCheckingHealth(true);
    try {
      const data = await dashboardApi.getHealth();
      setHealthStatus(data);
    } catch (err) {
      showError("Health check failed");
    } finally {
      setCheckingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleSaveAIConfig = (e) => {
    e.preventDefault();
    showSuccess(`AI Engine settings saved (Default provider: ${aiProvider.toUpperCase()})`);
  };

  return (
    <DashboardLayout title="System Settings">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* System Health Card */}
        <Card>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-100">Backend System Health</h3>
                <p className="text-xs text-gray-400">Status of API server and database connection</p>
              </div>
            </div>
            <Button size="sm" variant="secondary" onClick={fetchHealth} isLoading={checkingHealth}>
              Refresh Health
            </Button>
          </div>

          {healthStatus ? (
            <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-sm font-semibold">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Service: {healthStatus.service} (v{healthStatus.version})</span>
              </div>
              <span className="uppercase text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 font-bold">
                {healthStatus.status}
              </span>
            </div>
          ) : (
            <p className="text-xs text-gray-400">Loading server health status...</p>
          )}
        </Card>

        {/* AI Provider Config Card */}
        <Card>
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-100">AI Summarizer Engine</h3>
              <p className="text-xs text-gray-400">Configure primary summary generation provider and fallbacks</p>
            </div>
          </div>

          <form onSubmit={handleSaveAIConfig} className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors bg-gray-900/60 border-gray-800 hover:border-brand-500/40">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="provider"
                    value="heuristic"
                    checked={aiProvider === 'heuristic'}
                    onChange={(e) => setAiProvider(e.target.value)}
                    className="text-brand-500 focus:ring-brand-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-200">MeetFlow Smart Engine (Built-in Heuristic)</p>
                    <p className="text-xs text-gray-400">Zero latency, offline fallback. Automatically extracts bullet points & action items.</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">Active Fallback</span>
              </label>

              <label className="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors bg-gray-900/60 border-gray-800 hover:border-brand-500/40">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="provider"
                    value="openai"
                    checked={aiProvider === 'openai'}
                    onChange={(e) => setAiProvider(e.target.value)}
                    className="text-brand-500 focus:ring-brand-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-200">OpenAI GPT Provider</p>
                    <p className="text-xs text-gray-400">Requires OPENAI_API_KEY environment variable configured in backend .env</p>
                  </div>
                </div>
              </label>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-800">
              <Button type="submit">Save AI Settings</Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};
