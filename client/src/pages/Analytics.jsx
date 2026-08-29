import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Bug,
  ShieldAlert,
  CheckCircle2,
  Database,
  TrendingUp,
  Activity,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import { api } from '../api/client';
import { StatCard } from '../components/StatCard';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <span className="tooltip-label">{label}</span>
        <span className="tooltip-value">{payload[0].value} Incidents</span>
      </div>
    );
  }
  return null;
};

export function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to load stats', err);
        setStats({ total: 0, critical: 0, resolved: 0, clues: 0, categories: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner-ring" />
          <p className="loading-text">Aggregating system intelligence...</p>
        </div>
      </div>
    );
  }

  const barColors = ['#6366f1', '#4f46e5', '#818cf8', '#3b82f6', '#06b6d4', '#10b981'];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Intelligence</h1>
          <p className="page-description">
            Aggregated telemetry, failure taxonomy, and operational vulnerability distribution.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={Bug}
          title="Total Incidents"
          value={stats.total}
          subtitle="Cumulative logged"
        />
        <StatCard
          icon={ShieldAlert}
          title="Critical Incidents"
          value={stats.critical}
          subtitle="High-impact failures"
        />
        <StatCard
          icon={CheckCircle2}
          title="Resolved"
          value={stats.resolved}
          subtitle={`${stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0}% resolution rate`}
        />
        <StatCard
          icon={Database}
          title="Evidence Indexed"
          value={stats.clues}
          subtitle="Discoverable telemetry points"
        />
      </div>

      {/* Main Chart Card */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div className="chart-header-left">
            <h2 className="chart-title">Failure Taxonomy</h2>
            <p className="chart-subtitle">Distribution of incidents across engineering architecture categories</p>
          </div>
          <div className="live-indicator">
            <span className="live-dot" />
            <span>REAL-TIME METRICS</span>
          </div>
        </div>

        <div className="chart-body">
          {stats.categories && stats.categories.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={stats.categories}
                margin={{ top: 20, right: 20, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                <XAxis
                  dataKey="category"
                  stroke="#64748b"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={{ stroke: '#1f293d' }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={{ stroke: '#1f293d' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.categories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={barColors[index % barColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">
              <Activity size={24} />
              <p>No category breakdown available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
