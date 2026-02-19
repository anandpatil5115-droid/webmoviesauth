import React from 'react';
import { motion } from 'framer-motion';
import AuthCard from './AuthCard';
import './index.css';

export default function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated gradient background */}
      <div className="bg-gradient" aria-hidden="true" />

      {/* Floating ambient orbs */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      {/* Centered auth card */}
      <main className="app-container">
        <AuthCard />
      </main>
    </motion.div>
  );
}
