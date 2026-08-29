import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  BarChart3,
  Trophy,
  Award,
  PlusCircle,
  Radar,
  X,
  ArrowRight,
} from 'lucide-react';

export function CommandPalette({ isOpen, onClose, onSelect }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    { id: 'cases', label: 'Go to Incident Board', category: 'Navigation', icon: LayoutDashboard, shortcut: '1' },
    { id: 'atlas', label: 'Open the interactive Atlas Map', category: 'Navigation', icon: Radar, shortcut: 'M' },
    { id: 'analytics', label: 'View System Intelligence & Analytics', category: 'Navigation', icon: BarChart3, shortcut: '2' },
    { id: 'leaderboard', label: 'View Team Leaderboard & XP', category: 'Navigation', icon: Trophy, shortcut: '3' },
    { id: 'achievements', label: 'View Badges & Milestones', category: 'Navigation', icon: Award, shortcut: '4' },
    { id: 'create', label: 'Report a New Incident', category: 'Action', icon: PlusCircle, shortcut: 'N' },
  ];

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="cmd-backdrop" onClick={onClose}>
      <motion.div
        className="cmd-modal"
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cmd-header">
          <Search size={16} className="cmd-search-icon" />
          <input
            type="text"
            className="cmd-input"
            placeholder="Type a command or jump to page..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button className="cmd-close" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <div className="cmd-list">
          {filtered.length === 0 ? (
            <div className="cmd-empty">No matching commands found.</div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className="cmd-item"
                  onClick={() => {
                    onSelect(item.id);
                    onClose();
                  }}
                >
                  <div className="cmd-item-left">
                    <Icon size={16} className="cmd-item-icon" />
                    <span className="cmd-item-label">{item.label}</span>
                  </div>
                  <div className="cmd-item-right">
                    <span className="cmd-item-category">{item.category}</span>
                    <kbd className="cmd-item-key">{item.shortcut}</kbd>
                    <ArrowRight size={13} className="cmd-item-arrow" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="cmd-footer">
          <span>Navigate with <kbd>↑</kbd> <kbd>↓</kbd></span>
          <span>Select with <kbd>↵</kbd></span>
          <span>Close with <kbd>ESC</kbd></span>
        </div>
      </motion.div>
    </div>
  );
}
