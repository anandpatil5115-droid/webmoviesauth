import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthCard from './AuthCard';
import './index.css';

export default function App() {
  const [pageExiting, setPageExiting] = useState(false);

  const handleLoginSuccess = () => {
    setPageExiting(true);
    // Redirect after dissolve animation completes
    setTimeout(() => {
      window.location.href = 'http://webmovies-two.vercel.app/';
    }, 1300);
  };

  return (
    <AnimatePresence>
      {!pageExiting ? (
        <motion.div
          key="page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Animated gradient background */}
          <div className="bg-gradient" aria-hidden="true" />
          {/* Floating ambient orbs */}
          <div className="orb orb-1" aria-hidden="true" />
          <div className="orb orb-2" aria-hidden="true" />
          <div className="orb orb-3" aria-hidden="true" />
          {/* Centered auth card */}
          <main className="app-container">
            <AuthCard onLoginSuccess={handleLoginSuccess} />
          </main>
        </motion.div>
      ) : (
        /* Full-screen success overlay during dissolve */
        <motion.div
          key="overlay"
          className="success-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="redirecting-indicator"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="redirect-spinner" />
            <span>Redirecting…</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
