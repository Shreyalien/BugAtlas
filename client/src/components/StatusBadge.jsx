import React from 'react';

export function StatusBadge({ severity, status }) {
  if (severity) {
    const s = String(severity).toUpperCase();
    const map = {
      CRITICAL: 'badge-critical',
      HIGH: 'badge-high',
      MEDIUM: 'badge-medium',
      LOW: 'badge-low',
    };
    return <span className={`badge ${map[s] || 'badge-default'}`}>{s}</span>;
  }

  if (status) {
    const st = String(status).toUpperCase();
    const isResolved = st === 'RESOLVED';
    return (
      <span className={`badge ${isResolved ? 'badge-resolved' : 'badge-investigating'}`}>
        <span className="badge-dot" />
        {st}
      </span>
    );
  }

  return null;
}
