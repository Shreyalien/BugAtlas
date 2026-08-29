import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';

export function Toast({ message, onClose }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="toast-container"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="toast-content">
            <Bell size={15} className="toast-icon" />
            <span className="toast-text">{message}</span>
            {onClose && (
              <button className="toast-close" onClick={onClose}>
                <X size={14} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
