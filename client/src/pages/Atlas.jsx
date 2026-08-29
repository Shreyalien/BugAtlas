import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, AlertTriangle, ArrowUpRight, Bug, CheckCircle2,
  Crosshair, Database, Layers3, Search, ShieldAlert, Zap
} from 'lucide-react';

const ZONES = [
  { id: 'FRONTEND', label: 'Frontend', icon: Layers3, x: '18%', y: '24%', tone: 'violet' },
  { id: 'BACKEND', label: 'Backend', icon: Database, x: '67%', y: '18%', tone: 'cyan' },
  { id: 'SECURITY', label: 'Security', icon: ShieldAlert, x: '73%', y: '65%', tone: 'red' },
  { id: 'PERFORMANCE', label: 'Performance', icon: Zap, x: '29%', y: '67%', tone: 'amber' },
];

const severityWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };

export function Atlas({ cases = [], onOpenCase }) {
  const [query, setQuery] = useState('');
  const [activeZone, setActiveZone] = useState('ALL');

  const visibleCases = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter((item) => {
      const zoneMatch = activeZone === 'ALL' || item.category === activeZone;
      const text = `${item.title} ${item.description} ${item.framework} ${item.tags}`.toLowerCase();
      return zoneMatch && (!q || text.includes(q));
    });
  }, [cases, query, activeZone]);

  const byZone = useMemo(() => {
    return Object.fromEntries(
      ZONES.map((zone) => [
        zone.id,
        cases.filter((item) => item.category === zone.id)
      ])
    );
  }, [cases]);

  const totalRisk = visibleCases.reduce((sum, item) => sum + (severityWeight[item.severity] || 0), 0);
  const critical = visibleCases.filter((item) => item.severity === 'CRITICAL').length;
  const resolved = visibleCases.filter((item) => item.status === 'RESOLVED').length;

  return (
    <div className="page-container atlas-page">
      <div className="page-header atlas-header">
        <div>
          <div className="eyebrow"><Crosshair size={13} /> LIVE SYSTEM MAP</div>
          <h1 className="page-title">BugAtlas <span>// Atlas</span></h1>
          <p className="page-description">
            A spatial view of where failures concentrate across the system.
            Select a zone, then open an incident to investigate the evidence trail.
          </p>
        </div>
        <div className="atlas-live">
          <span className="pulse-dot" /> {cases.length} incidents indexed
        </div>
      </div>

      <div className="atlas-toolbar">
        <div className="atlas-search">
          <Search size={15} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search incidents, frameworks, tags..."
          />
        </div>
        <div className="atlas-filters">
          <button className={activeZone === 'ALL' ? 'atlas-filter active' : 'atlas-filter'} onClick={() => setActiveZone('ALL')}>All zones</button>
          {ZONES.map((zone) => (
            <button
              key={zone.id}
              className={activeZone === zone.id ? 'atlas-filter active' : 'atlas-filter'}
              onClick={() => setActiveZone(zone.id)}
            >
              {zone.label}
            </button>
          ))}
        </div>
      </div>

      <div className="atlas-metrics">
        <div className="atlas-metric"><span>VISIBLE INCIDENTS</span><strong>{visibleCases.length}</strong></div>
        <div className="atlas-metric"><span>CRITICAL SIGNALS</span><strong>{critical}</strong></div>
        <div className="atlas-metric"><span>RISK INDEX</span><strong>{totalRisk}</strong></div>
        <div className="atlas-metric"><span>RESOLVED</span><strong>{resolved}</strong></div>
      </div>

      <section className="atlas-map-card">
        <div className="atlas-map-grid" />
        <div className="atlas-map-scan" />
        <div className="atlas-map-label top">SYSTEM TOPOLOGY / ABSTRACTED INCIDENT DENSITY</div>

        <div className="atlas-orbit orbit-one" />
        <div className="atlas-orbit orbit-two" />

        {ZONES.map((zone) => {
          const Icon = zone.icon;
          const zoneCases = byZone[zone.id] || [];
          const active = activeZone === zone.id;
          return (
            <motion.button
              key={zone.id}
              className={`atlas-zone ${zone.tone} ${active ? 'selected' : ''}`}
              style={{ left: zone.x, top: zone.y }}
              onClick={() => setActiveZone(active ? 'ALL' : zone.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="zone-ring" />
              <span className="zone-icon"><Icon size={18} /></span>
              <span className="zone-copy">
                <strong>{zone.label}</strong>
                <small>{zoneCases.length} incident{zoneCases.length === 1 ? '' : 's'}</small>
              </span>
              {zoneCases.length > 0 && <span className="zone-count">{zoneCases.length}</span>}
            </motion.button>
          );
        })}

        <div className="atlas-map-center">
          <div className="center-core"><Bug size={23} /></div>
          <strong>FAILURE FIELD</strong>
          <span>{visibleCases.length ? 'signals active' : 'no matching signals'}</span>
        </div>

        <div className="atlas-map-label bottom-left">X: INCIDENT DOMAIN</div>
        <div className="atlas-map-label bottom-right">Y: FAILURE PRESSURE</div>
      </section>

      <section className="atlas-results">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><Activity size={13} /> SIGNAL STREAM</div>
            <h2>Incidents in this field</h2>
          </div>
          <span>{visibleCases.length} results</span>
        </div>

        {visibleCases.length === 0 ? (
          <div className="empty-state atlas-empty">
            <AlertTriangle size={22} />
            <strong>No matching incidents</strong>
            <p>Try a different zone or search term.</p>
          </div>
        ) : (
          <div className="atlas-incident-grid">
            {visibleCases.map((item, index) => (
              <motion.button
                key={item.id}
                className="atlas-incident"
                onClick={() => onOpenCase(item.id)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.025 }}
                whileHover={{ y: -3 }}
              >
                <div className="incident-topline">
                  <span className={`severity-dot ${String(item.severity || '').toLowerCase()}`} />
                  <span>INC-{String(item.id).padStart(3, '0')}</span>
                  <ArrowUpRight size={14} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="incident-meta">
                  <span>{item.category}</span>
                  <span>{item.framework}</span>
                  <span className={`status-mini ${String(item.status || '').toLowerCase()}`}>
                    {item.status === 'RESOLVED' ? <CheckCircle2 size={11} /> : <Activity size={11} />}
                    {item.status}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
