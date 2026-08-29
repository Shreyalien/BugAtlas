import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Layers, AlertTriangle } from 'lucide-react';

export function CreateCase({ onBack, onDone }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    severity: 'HIGH',
    environment: 'Production',
    category: 'Backend',
    language: 'JavaScript',
    framework: 'Node.js',
    root_cause: '',
    solution: '',
    tags: '',
    clues: [
      {
        title: 'Initial Symptom & Log Trace',
        description: 'Observe the initial failure conditions and error rates.',
        evidence: 'HTTP 504 Gateway Timeout\nupstream connect timed out (110: Connection timed out)',
        xp_reward: 20,
      },
      {
        title: 'Dependency Telemetry',
        description: 'Check downstream service degradation or resource saturation.',
        evidence: 'pool.active_connections: 100/100\nwaiting_requests: 412',
        xp_reward: 30,
      },
      {
        title: 'Root Cause Isolation',
        description: 'Confirm root cause with code / configuration inspection.',
        evidence: 'Missing database connection timeout and unbounded query retry loop',
        xp_reward: 50,
      },
    ],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateClue = (index, field, value) => {
    setForm((prev) => {
      const updatedClues = [...prev.clues];
      updatedClues[index] = { ...updatedClues[index], [field]: value };
      return { ...prev, clues: updatedClues };
    });
  };

  const addClue = () => {
    if (form.clues.length >= 8) return;
    setForm((prev) => ({
      ...prev,
      clues: [
        ...prev.clues,
        {
          title: `Clue Layer ${prev.clues.length + 1}`,
          description: 'Investigate technical evidence.',
          evidence: 'Evidence dump pending...',
          xp_reward: 25,
        },
      ],
    }));
  };

  const removeClue = (index) => {
    if (form.clues.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      clues: prev.clues.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError('Please provide a title and incident summary.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await onDone(form);
    } catch (err) {
      console.error('Failed to create incident', err);
      setError(err.response?.data?.message || 'Failed to submit incident. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container max-w-4xl">
      <button className="btn-back" onClick={onBack}>
        <ArrowLeft size={14} />
        <span>Back to Incident Board</span>
      </button>

      <div className="page-header">
        <div>
          <h1 className="page-title">Report New Incident</h1>
          <p className="page-description">
            Document an outage, bug, or performance degradation along with discoverable evidence layers.
          </p>
        </div>
      </div>

      {error && (
        <div className="auth-error mb-4">
          <AlertTriangle size={15} />
          <span>{error}</span>
        </div>
      )}

      <form className="incident-form" onSubmit={handleSubmit}>
        <div className="form-card">
          <h2 className="form-section-title">Incident Details</h2>

          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Incident Title *
            </label>
            <input
              id="title"
              type="text"
              className="form-input"
              placeholder="e.g. Database Connection Pool Exhaustion on Checkout"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              required
              maxLength={120}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="desc">
              Incident Summary & Symptom Description *
            </label>
            <textarea
              id="desc"
              className="form-textarea"
              rows={3}
              placeholder="What is failing, which services are impacted, and what are the observed user symptoms?"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              required
              maxLength={1000}
            />
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label" htmlFor="severity">
                Severity
              </label>
              <select
                id="severity"
                className="form-select"
                value={form.severity}
                onChange={(e) => updateField('severity', e.target.value)}
              >
                <option value="CRITICAL">CRITICAL (P0 - Service Down)</option>
                <option value="HIGH">HIGH (P1 - Major Degradation)</option>
                <option value="MEDIUM">MEDIUM (P2 - Partial Issue)</option>
                <option value="LOW">LOW (P3 - Minor / Cosmetic)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="env">
                Environment
              </label>
              <input
                id="env"
                type="text"
                className="form-input"
                placeholder="Production / Staging"
                value={form.environment}
                onChange={(e) => updateField('environment', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Category
              </label>
              <input
                id="category"
                type="text"
                className="form-input"
                placeholder="Backend / Database / Security"
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label" htmlFor="lang">
                Primary Language
              </label>
              <input
                id="lang"
                type="text"
                className="form-input"
                placeholder="e.g. TypeScript / Java / Go"
                value={form.language}
                onChange={(e) => updateField('language', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="framework">
                Framework / Engine
              </label>
              <input
                id="framework"
                type="text"
                className="form-input"
                placeholder="e.g. Express / Spring / React"
                value={form.framework}
                onChange={(e) => updateField('framework', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tags">
                Index Tags (comma-separated)
              </label>
              <input
                id="tags"
                type="text"
                className="form-input"
                placeholder="database, timeout, p99"
                value={form.tags}
                onChange={(e) => updateField('tags', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Evidence Clues Section */}
        <div className="form-card">
          <div className="form-card-header">
            <div>
              <h2 className="form-section-title">Evidence & Investigation Layers</h2>
              <p className="form-section-desc">
                Provide progressive clues and technical telemetry for team members to investigate.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={addClue}
              disabled={form.clues.length >= 8}
            >
              <Plus size={13} /> Add Evidence Layer
            </button>
          </div>

          <div className="form-clues-list">
            {form.clues.map((clue, idx) => (
              <div key={idx} className="clue-builder-card">
                <div className="clue-builder-header">
                  <div className="clue-builder-title-badge">
                    <Layers size={13} />
                    <span>Evidence Layer {idx + 1}</span>
                  </div>
                  {form.clues.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove-clue"
                      onClick={() => removeClue(idx)}
                      title="Remove clue"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Clue Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={clue.title}
                      onChange={(e) => updateClue(idx, 'title', e.target.value)}
                      placeholder="e.g. Network latency spike"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">XP Reward (5–100)</label>
                    <input
                      type="number"
                      className="form-input"
                      min={5}
                      max={100}
                      value={clue.xp_reward}
                      onChange={(e) => updateClue(idx, 'xp_reward', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Investigation Objective / Hint</label>
                  <input
                    type="text"
                    className="form-input"
                    value={clue.description}
                    onChange={(e) => updateClue(idx, 'description', e.target.value)}
                    placeholder="e.g. Inspect the database connection pool settings."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Telemetry / Code / Log Snippet (Evidence Dump)</label>
                  <textarea
                    className="form-textarea code-font"
                    rows={2}
                    value={clue.evidence}
                    onChange={(e) => updateClue(idx, 'evidence', e.target.value)}
                    placeholder="Paste logs, HTTP responses, or stack trace evidence here..."
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RCA & Resolution Section */}
        <div className="form-card">
          <h2 className="form-section-title">Root Cause & Remediation (Postmortem)</h2>
          <div className="form-group">
            <label className="form-label" htmlFor="root_cause">
              Confirmed Root Cause
            </label>
            <input
              id="root_cause"
              type="text"
              className="form-input"
              placeholder="e.g. Missing pool acquisition timeout leading to cascading worker thread exhaustion"
              value={form.root_cause}
              onChange={(e) => updateField('root_cause', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="solution">
              Remediation & Action Items
            </label>
            <textarea
              id="solution"
              className="form-textarea"
              rows={2}
              placeholder="e.g. Configured 3000ms acquireTimeout on HikariCP pool and implemented circuit breaker."
              value={form.solution}
              onChange={(e) => updateField('solution', e.target.value)}
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="form-footer">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publishing Incident...' : 'Publish Incident & Clues'}
          </button>
        </div>
      </form>
    </div>
  );
}
