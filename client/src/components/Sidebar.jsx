import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Trophy,
  Award,
  LogOut,
  ShieldCheck,
  PlusCircle,
  Bug,
  Radar,
} from 'lucide-react';

export function Sidebar({ page, setPage, user, logout }) {
  const navItems = [
    { id: 'cases', label: 'Incident Board', icon: LayoutDashboard, shortcut: '1' },
    { id: 'atlas', label: 'Atlas Map', icon: Radar, shortcut: 'M' },
    { id: 'analytics', label: 'Intelligence', icon: BarChart3, shortcut: '2' },
    { id: 'leaderboard', label: 'Contributors', icon: Trophy, shortcut: '3' },
    { id: 'achievements', label: 'Milestones', icon: Award, shortcut: '4' },
  ];

  const currentXpInLevel = user ? user.xp % 500 : 0;
  const xpProgressPercent = Math.min(100, Math.round((currentXpInLevel / 500) * 100));

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand" onClick={() => setPage('cases')}>
        <div className="brand-icon">
          <Bug size={18} />
        </div>
        <div className="brand-text">
          <span className="brand-name">BugAtlas</span>
          <span className="brand-tag">INCIDENT PLATFORM</span>
        </div>
      </div>

      {/* Quick Action */}
      <div className="sidebar-action">
        <button className="btn-new-incident" onClick={() => setPage('create')}>
          <PlusCircle size={15} />
          <span>New Incident</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <span className="nav-group-label">WORKSPACE</span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = page === item.id || (item.id === 'cases' && page === 'investigate');
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              <Icon size={16} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              <kbd className="nav-shortcut">{item.shortcut}</kbd>
            </button>
          );
        })}
      </nav>

      {/* User Progress & Profile */}
      <div className="sidebar-footer">
        {user && (
          <div className="user-card">
            <div className="user-progress-bar">
              <div className="progress-info">
                <span>XP: {user.xp}</span>
                <span>Level {user.level}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${xpProgressPercent}%` }} />
              </div>
            </div>

            <div className="user-profile">
              <div className="user-avatar">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-role">
                  <ShieldCheck size={11} /> {user.role || 'INVESTIGATOR'}
                </span>
              </div>
              <button
                className="btn-logout"
                title="Sign out"
                onClick={logout}
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
