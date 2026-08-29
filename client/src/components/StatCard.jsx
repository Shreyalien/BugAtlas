import React from 'react';
import { motion } from 'framer-motion';

export function StatCard({ icon: Icon, title, value, subtitle }) {
  return (
    <motion.div
      className="stat-card"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {Icon && <Icon className="stat-card-icon" size={16} />}
      </div>
      <div className="stat-card-body">
        <span className="stat-card-value">{value}</span>
        {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
      </div>
    </motion.div>
  );
}
