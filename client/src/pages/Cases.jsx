import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Bug,
  ShieldAlert,
  CheckCircle2,
  Layers,
  ChevronRight,
  Eye,
  X,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { StatCard } from '../components/StatCard';

export function Cases({ cases = [], loading, onOpenCase, onCreateCase }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const categories = useMemo(() => {
    const set = new Set();
    cases.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [cases]);

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        (item.title + ' ' + item.description + ' ' + (item.tags || '') + ' ' + (item.framework || ''))
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesSeverity =
        severityFilter === 'ALL' || item.severity === severityFilter;

      const matchesCategory =
        categoryFilter === 'ALL' || item.category === categoryFilter;

      const matchesStatus =
        statusFilter === 'ALL' || item.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesCategory && matchesStatus;
    });
  }, [cases, searchQuery, severityFilter, categoryFilter, statusFilter]);

  const criticalCount = cases.filter((c) => c.severity === 'CRITICAL').length;
  const resolvedCount = cases.filter((c) => c.status === 'RESOLVED').length;
  const totalClues = cases.reduce((sum, c) => sum + (c.clue_count || 0), 0);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Incident Board</h1>
          <p className="page-description">
            Track, investigate, and isolate root causes across active technical incidents.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onCreateCase}>
          <Plus size={15} />
          <span>Report Incident</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="stats-grid">
        <StatCard
          icon={Bug}
          title="Active Incidents"
          value={cases.length}
          subtitle="Indexed in registry"
        />
        <StatCard
          icon={ShieldAlert}
          title="Critical Severity"
          value={criticalCount}
          subtitle="Immediate attention"
        />
        <StatCard
          icon={CheckCircle2}
          title="Resolved"
          value={resolvedCount}
          subtitle="Root causes isolated"
        />
        <StatCard
          icon={Layers}
          title="Evidence Clues"
          value={totalClues}
          subtitle="Total discovery points"
        />
      </div>

      {/* Filter Toolbar */}
      <div className="filter-toolbar">
        <div className="search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Filter by title, stack, tags, or root cause..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>
              <X size={13} />
            </button>
          )}
        </div>

        <div className="filter-controls">
          <div className="select-wrapper">
            <Filter size={13} className="select-icon" />
            <select
              className="select-input"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="select-wrapper">
            <select
              className="select-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          {categories.length > 0 && (
            <div className="select-wrapper">
              <select
                className="select-input"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Cases List */}
      <div className="incident-table-card">
        <div className="table-header">
          <span className="col-id">INCIDENT ID</span>
          <span className="col-title">TITLE & SUMMARY</span>
          <span className="col-severity">SEVERITY</span>
          <span className="col-status">STATUS</span>
          <span className="col-clues">EVIDENCE</span>
          <span className="col-action" />
        </div>

        <div className="table-body">
          {loading && !cases.length ? (
            <div className="skeleton-container">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-row" />
              ))}
            </div>
          ) : filteredCases.length > 0 ? (
            filteredCases.map((item, index) => (
              <motion.div
                key={item.id}
                className="incident-row"
                onClick={() => onOpenCase(item.id)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: index * 0.02 }}
              >
                <div className="col-id">
                  <span className="incident-id-tag">INC-{String(item.id).padStart(3, '0')}</span>
                </div>

                <div className="col-title">
                  <div className="incident-row-title">{item.title}</div>
                  <div className="incident-row-desc">{item.description}</div>
                  <div className="incident-tags">
                    {item.framework && <span className="tag-pill">{item.framework}</span>}
                    {item.language && <span className="tag-pill">{item.language}</span>}
                    {item.environment && <span className="tag-pill">{item.environment}</span>}
                  </div>
                </div>

                <div className="col-severity">
                  <StatusBadge severity={item.severity} />
                </div>

                <div className="col-status">
                  <StatusBadge status={item.status} />
                </div>

                <div className="col-clues">
                  <span className="clues-indicator">
                    <Eye size={13} />
                    <span>{item.clue_count || 0} clues</span>
                  </span>
                </div>

                <div className="col-action">
                  <ChevronRight size={15} className="row-chevron" />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="empty-state">
              <Bug size={32} className="empty-icon" />
              <h3 className="empty-title">
                {searchQuery ? 'No matching incidents found' : 'No incidents registered'}
              </h3>
              <p className="empty-description">
                {searchQuery
                  ? 'Try adjusting your search query or severity filters.'
                  : 'Get started by creating your first incident investigation.'}
              </p>
              {!searchQuery && (
                <button className="btn btn-secondary mt-3" onClick={onCreateCase}>
                  <Plus size={14} /> Report First Incident
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
