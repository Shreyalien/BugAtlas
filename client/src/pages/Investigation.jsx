import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Sparkles,
  MessageSquare,
  FileCode2,
  Shield,
  Clock,
  Send,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../api/client';

export function Investigation({ data, onBack, onRefresh }) {
  const { case: incident, clues = [], found = [], comments = [] } = data;
  const [activeTab, setActiveTab] = useState('clues');
  const [newComment, setNewComment] = useState('');
  const [unlockingId, setUnlockingId] = useState(null);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const isCompleted = clues.length > 0 && found.length === clues.length;
  const progressPercent = clues.length ? Math.round((found.length / clues.length) * 100) : 0;

  const handleUnlockClue = async (clueId) => {
    if (found.includes(clueId) || unlockingId !== null) return;
    setUnlockingId(clueId);
    try {
      await api.post(`/cases/${incident.id}/clues/${clueId}/unlock`);
      await onRefresh();
    } catch (err) {
      console.error('Failed to unlock clue', err);
    } finally {
      setUnlockingId(null);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isPostingComment) return;
    setIsPostingComment(true);
    try {
      await api.post(`/cases/${incident.id}/comments`, { content: newComment.trim() });
      setNewComment('');
      await onRefresh();
    } catch (err) {
      console.error('Failed to post comment', err);
    } finally {
      setIsPostingComment(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="page-container">
      {/* Back navigation */}
      <button className="btn-back" onClick={onBack}>
        <ArrowLeft size={14} />
        <span>Incident Board</span>
        <span className="breadcrumb-slash">/</span>
        <span className="active-case-num">INC-{String(incident.id).padStart(3, '0')}</span>
      </button>

      {/* Incident Hero Banner */}
      <div className="investigation-hero">
        <div className="hero-main">
          <div className="hero-badges">
            <span className="incident-id-tag">INC-{String(incident.id).padStart(3, '0')}</span>
            <StatusBadge severity={incident.severity} />
            <StatusBadge status={incident.status} />
          </div>
          <h1 className="hero-title">{incident.title}</h1>
          <p className="hero-description">{incident.description}</p>

          <div className="hero-meta-pills">
            {incident.environment && <span className="meta-pill">Env: {incident.environment}</span>}
            {incident.category && <span className="meta-pill">Cat: {incident.category}</span>}
            {incident.language && <span className="meta-pill">Lang: {incident.language}</span>}
            {incident.framework && <span className="meta-pill">Stack: {incident.framework}</span>}
          </div>
        </div>

        {/* Progress Tracker Card */}
        <div className="investigation-progress-card">
          <div className="progress-card-header">
            <span className="progress-card-title">Investigation Progress</span>
            <span className="progress-card-percent">{progressPercent}%</span>
          </div>
          <div className="progress-track-lg">
            <div
              className={`progress-fill-lg ${isCompleted ? 'completed' : ''}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="progress-card-footer">
            <span>
              {found.length} of {clues.length} evidence points isolated
            </span>
            {isCompleted && (
              <span className="status-complete-pill">
                <CheckCircle2 size={12} /> Root Cause Isolated
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="investigation-tabs">
        <button
          className={`tab-btn ${activeTab === 'clues' ? 'active' : ''}`}
          onClick={() => setActiveTab('clues')}
        >
          <FileCode2 size={15} />
          <span>Evidence & Clues</span>
          <span className="tab-counter">
            {found.length}/{clues.length}
          </span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'rca' ? 'active' : ''}`}
          onClick={() => setActiveTab('rca')}
        >
          <Shield size={15} />
          <span>Root Cause & Profile</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'discussion' ? 'active' : ''}`}
          onClick={() => setActiveTab('discussion')}
        >
          <MessageSquare size={15} />
          <span>Incident Notes</span>
          <span className="tab-counter">{comments.length}</span>
        </button>
      </div>

      {/* Tab: Evidence & Clues */}
      {activeTab === 'clues' && (
        <div className="tab-content">
          {/* Completion Callout */}
          {isCompleted && (
            <motion.div
              className="root-cause-banner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="banner-icon-box">
                <Sparkles size={20} />
              </div>
              <div className="banner-text">
                <h3 className="banner-title">Root Cause File Unlocked</h3>
                <p className="banner-desc">
                  <strong>Identified Cause:</strong> {incident.root_cause || 'Root cause identified.'}
                </p>
                {incident.solution && (
                  <p className="banner-solution">
                    <strong>Remediation:</strong> {incident.solution}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          <div className="clues-grid">
            {clues.map((clue, idx) => {
              const isFound = found.includes(clue.id);
              const isBusy = unlockingId === clue.id;

              return (
                <div
                  key={clue.id}
                  className={`clue-card ${isFound ? 'unlocked' : 'locked'}`}
                >
                  <div className="clue-card-header">
                    <span className="clue-number">LAYER {String(idx + 1).padStart(2, '0')}</span>
                    <span className="clue-reward">+{clue.xp_reward} XP</span>
                  </div>

                  <div className="clue-body">
                    <h3 className="clue-title">{isFound ? clue.title : 'Encrypted Evidence'}</h3>
                    <p className="clue-desc">
                      {isFound
                        ? clue.description
                        : 'Examine this layer to uncover logs, network requests, or stack trace telemetry.'}
                    </p>

                    {isFound && clue.evidence && (
                      <div className="evidence-code-block">
                        <div className="code-header">
                          <span className="code-label">TELEMETRY / LOG EVIDENCE</span>
                          <button
                            className="btn-copy-code"
                            onClick={() => copyToClipboard(clue.evidence, clue.id)}
                            title="Copy to clipboard"
                          >
                            {copiedId === clue.id ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                        </div>
                        <pre className="code-content">{clue.evidence}</pre>
                      </div>
                    )}
                  </div>

                  <div className="clue-footer">
                    {isFound ? (
                      <div className="clue-status-unlocked">
                        <CheckCircle2 size={14} />
                        <span>Evidence Discovered</span>
                      </div>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm btn-block"
                        onClick={() => handleUnlockClue(clue.id)}
                        disabled={isBusy}
                      >
                        {isBusy ? (
                          <span>Analyzing Layer...</span>
                        ) : (
                          <>
                            <Lock size={13} />
                            <span>Analyze Clue (+{clue.xp_reward} XP)</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Root Cause & Technical Profile */}
      {activeTab === 'rca' && (
        <div className="tab-content">
          <div className="rca-grid">
            <div className="rca-card highlight-card">
              <span className="rca-label">ROOT CAUSE ANALYSIS</span>
              <h2 className="rca-title">{incident.root_cause || 'Root cause under investigation.'}</h2>
              <div className="rca-section">
                <span className="rca-subtitle">Remediation & Proposed Fix</span>
                <p className="rca-text">{incident.solution || 'Remediation steps not yet documented.'}</p>
              </div>
            </div>

            <div className="rca-card">
              <span className="rca-label">TECHNICAL PROFILE</span>
              <div className="profile-spec-grid">
                <div className="spec-item">
                  <span className="spec-label">Language</span>
                  <span className="spec-val">{incident.language || 'N/A'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Framework</span>
                  <span className="spec-val">{incident.framework || 'N/A'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Environment</span>
                  <span className="spec-val">{incident.environment || 'Production'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Category</span>
                  <span className="spec-val">{incident.category || 'Backend'}</span>
                </div>
              </div>

              {incident.tags && (
                <div className="tags-section">
                  <span className="spec-label">Search Index Tags</span>
                  <div className="tags-container">
                    {incident.tags
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((tag) => (
                        <span key={tag} className="tag-pill">
                          #{tag}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Discussion / Field Log */}
      {activeTab === 'discussion' && (
        <div className="tab-content">
          <div className="comments-layout">
            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map((comm) => (
                  <div key={comm.id} className="comment-item">
                    <div className="comment-avatar">
                      {comm.name ? comm.name[0].toUpperCase() : 'U'}
                    </div>
                    <div className="comment-body">
                      <div className="comment-meta">
                        <span className="comment-author">{comm.name}</span>
                        <span className="comment-time">
                          <Clock size={11} /> {comm.created_at}
                        </span>
                      </div>
                      <p className="comment-content">{comm.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state-compact">
                  <MessageSquare size={24} className="empty-icon" />
                  <p className="empty-text">No investigation notes recorded yet. Add the first entry below.</p>
                </div>
              )}
            </div>

            {/* Add note form */}
            <form className="comment-form" onSubmit={handleAddComment}>
              <label className="form-label" htmlFor="comment-input">
                Add Field Note / Investigation Finding
              </label>
              <textarea
                id="comment-input"
                className="form-textarea"
                rows={3}
                placeholder="Document your findings, hypothesis, or reproduction steps..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={1000}
                required
              />
              <div className="form-action-row">
                <span className="char-count">{1000 - newComment.length} chars left</span>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={isPostingComment || !newComment.trim()}
                >
                  <Send size={13} />
                  <span>{isPostingComment ? 'Posting...' : 'Post Note'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
