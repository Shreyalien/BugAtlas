import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, UserCheck, Shield } from 'lucide-react';
import { api } from '../api/client';

export function Leaderboard() {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/leaderboard');
        setBoard(response.data.leaderboard || []);
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankBadge = (index) => {
    if (index === 0) return <span className="rank-medal gold"><Trophy size={14} /> #1</span>;
    if (index === 1) return <span className="rank-medal silver"><Medal size={14} /> #2</span>;
    if (index === 2) return <span className="rank-medal bronze"><Award size={14} /> #3</span>;
    return <span className="rank-num">#{String(index + 1).padStart(2, '0')}</span>;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Engineering Contributors</h1>
          <p className="page-description">
            Team members ranked by verified evidence unlocks and root-cause isolations.
          </p>
        </div>
      </div>

      <div className="leaderboard-card">
        <div className="table-header">
          <span className="col-rank">RANK</span>
          <span className="col-user">CONTRIBUTOR</span>
          <span className="col-role">ACCESS ROLE</span>
          <span className="col-level">RANK LEVEL</span>
          <span className="col-xp">TOTAL XP</span>
        </div>

        <div className="table-body">
          {loading ? (
            <div className="skeleton-container">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-row" />
              ))}
            </div>
          ) : board.length > 0 ? (
            board.map((user, idx) => (
              <motion.div
                key={user.id}
                className="leaderboard-row"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: idx * 0.03 }}
              >
                <div className="col-rank">{getRankBadge(idx)}</div>

                <div className="col-user">
                  <div className="contributor-avatar">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="contributor-info">
                    <span className="contributor-name">{user.name}</span>
                    <span className="contributor-id">User ID: #{user.id}</span>
                  </div>
                </div>

                <div className="col-role">
                  <span className="role-tag">
                    <Shield size={11} /> {user.role || 'DETECTIVE'}
                  </span>
                </div>

                <div className="col-level">
                  <span className="level-badge">Level {user.level}</span>
                </div>

                <div className="col-xp">
                  <span className="xp-score">{user.xp.toLocaleString()} XP</span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="empty-state">
              <UserCheck size={32} className="empty-icon" />
              <h3 className="empty-title">No contributors registered</h3>
              <p className="empty-description">Investigations completed will rank here automatically.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
