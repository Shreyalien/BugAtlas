import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Lock, CheckCircle2, Star, ShieldCheck, Zap } from 'lucide-react';
import { api } from '../api/client';

export function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await api.get('/achievements');
        setAchievements(response.data.achievements || []);
      } catch (err) {
        console.error('Failed to load achievements', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Milestones & Badges</h1>
          <p className="page-description">
            Recognized milestones achieved through disciplined root-cause discovery and telemetry analysis.
          </p>
        </div>
      </div>

      <div className="achievements-grid">
        {loading ? (
          [1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton-card" />
          ))
        ) : (
          achievements.map((item, idx) => {
            const isUnlocked = item.unlocked;

            return (
              <motion.div
                key={item.id}
                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: idx * 0.03 }}
              >
                <div className="achievement-icon-box">
                  {isUnlocked ? (
                    <Award size={20} className="icon-unlocked" />
                  ) : (
                    <Lock size={18} className="icon-locked" />
                  )}
                </div>

                <div className="achievement-body">
                  <div className="achievement-header-row">
                    <h3 className="achievement-title">{item.title}</h3>
                    <span className={`achievement-badge ${isUnlocked ? 'badge-completed' : 'badge-pending'}`}>
                      {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                  </div>
                  <p className="achievement-desc">{item.description}</p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
