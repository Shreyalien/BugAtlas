import React, { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { useStore } from './store/useStore';
import { api, SOCKET_URL } from './api/client';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { Toast } from './components/Toast';

import { Auth } from './pages/Auth';
import { Cases } from './pages/Cases';
import { Investigation } from './pages/Investigation';
import { Analytics } from './pages/Analytics';
import { Leaderboard } from './pages/Leaderboard';
import { Achievements } from './pages/Achievements';
import { CreateCase } from './pages/CreateCase';
import { Atlas } from './pages/Atlas';

export function App() {
  const { token, user, login, logout, setUser } = useStore();
  const [page, setPage] = useState('cases');
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [casesRes, meRes] = await Promise.all([
        api.get('/cases'),
        api.get('/auth/me'),
      ]);
      setCases(casesRes.data.cases || []);
      setUser(meRes.data.user);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [token, logout, setUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Realtime events
  useEffect(() => {
    if (!token) return;
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });

    socket.on('case:created', (payload) => {
      setToastMessage(`New Incident Reported: INC-${String(payload.id).padStart(3, '0')} (${payload.title})`);
      loadData();
      setTimeout(() => setToastMessage(''), 5000);
    });

    return () => socket.disconnect();
  }, [token, loadData]);

  // Global keyboard shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenCase = async (id) => {
    try {
      const res = await api.get(`/cases/${id}`);
      setSelectedCase(res.data);
      setPage('investigate');
    } catch (err) {
      console.error('Failed to open case', err);
    }
  };

  const handleRefreshCurrentCase = async () => {
    if (!selectedCase?.case?.id) return;
    try {
      const res = await api.get(`/cases/${selectedCase.case.id}`);
      setSelectedCase(res.data);
      // Also refresh user data for updated XP/Level
      const meRes = await api.get('/auth/me');
      setUser(meRes.data.user);
    } catch (err) {
      console.error('Failed to refresh case', err);
    }
  };

  const handleCreateCaseDone = async (formData) => {
    await api.post('/cases', formData);
    await loadData();
    setPage('cases');
  };

  if (!token) {
    return <Auth onLogin={login} />;
  }

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Sidebar */}
      <Sidebar page={page} setPage={setPage} user={user} logout={logout} />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header user={user} page={page} onCommand={() => setIsCmdOpen(true)} />

        <main className="content-viewport">
          <AnimatePresence mode="wait">
            {page === 'atlas' && (
              <motion.div
                key="atlas"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <Atlas cases={cases} onOpenCase={handleOpenCase} />
              </motion.div>
            )}

            {page === 'cases' && (
              <motion.div
                key="cases"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <Cases
                  cases={cases}
                  loading={loading}
                  onOpenCase={handleOpenCase}
                  onCreateCase={() => setPage('create')}
                />
              </motion.div>
            )}

            {page === 'investigate' && selectedCase && (
              <motion.div
                key="investigate"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <Investigation
                  data={selectedCase}
                  onBack={() => setPage('cases')}
                  onRefresh={handleRefreshCurrentCase}
                />
              </motion.div>
            )}

            {page === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <Analytics />
              </motion.div>
            )}

            {page === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <Leaderboard />
              </motion.div>
            )}

            {page === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <Achievements />
              </motion.div>
            )}

            {page === 'create' && (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <CreateCase
                  onBack={() => setPage('cases')}
                  onDone={handleCreateCaseDone}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        onSelect={(pageId) => setPage(pageId)}
      />
    </div>
  );
}
