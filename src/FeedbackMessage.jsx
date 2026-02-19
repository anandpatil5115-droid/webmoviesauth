import React from 'react';
import { motion } from 'framer-motion';

export default function FeedbackMessage({ type, message }) {
    const icon = type === 'success' ? '✓' : '⚠';

    return (
        <motion.div
            className={`feedback ${type}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            role="alert"
            aria-live="polite"
        >
            <span className="feedback-icon">{icon}</span>
            <span>{message}</span>
        </motion.div>
    );
}
