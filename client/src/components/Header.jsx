import React from 'react';
import { Command, Search, User } from 'lucide-react';

const PAGE_TITLES = {
  cases: 'Incident Board',
  atlas: 'Atlas Map',
  investigate: 'Investigation Workbench',
  analytics: 'System Intelligence',
  leaderboard: 'Team Contributors',
  achievements: 'Milestones & Badges',
  create: 'Report Incident',
};

export function Header({ user, page, onCommand }) {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  return (
    <header className="top-header">
      <div className="header-breadcrumbs">
        <span className="breadcrumb-root">BugAtlas</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{PAGE_TITLES[page] || 'Overview'}</span>
      </div>

      <div className="header-actions">
        <button className="btn-search-trigger" onClick={onCommand}>
          <Search size={14} className="search-icon" />
          <span>Quick Find...</span>
          <kbd>{isMac ? '⌘K' : 'Ctrl+K'}</kbd>
        </button>

        {user && (
          <div className="header-user-badge">
            <span className="user-status-dot" />
            <User size={13} className="header-user-icon" />
            <span className="header-user-email">{user.email}</span>
          </div>
        )}
      </div>
    </header>
  );
}
