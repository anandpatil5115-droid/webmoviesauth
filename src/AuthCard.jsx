import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

const formVariants = {
    enter: (dir) => ({
        x: dir > 0 ? 60 : -60,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] }
    },
    exit: (dir) => ({
        x: dir > 0 ? -60 : 60,
        opacity: 0,
        transition: { duration: 0.25, ease: [0.55, 0, 1, 0.45] }
    })
};

export default function AuthCard() {
    const [mode, setMode] = useState('login'); // 'login' | 'register' | 'success'
    const [direction, setDirection] = useState(1);
    const [successData, setSuccessData] = useState(null);

    const switchTo = (newMode) => {
        setDirection(newMode === 'register' ? 1 : -1);
        setMode(newMode);
    };

    const handleRegisterSuccess = (userData) => {
        setSuccessData(userData);
        setMode('success');
    };

    return (
        <motion.div
            className="auth-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Brand */}
            <div className="brand">
                <div className="brand-icon">✦</div>
                <h1>NovaSphere</h1>
                <p>Premium cloud workspace platform</p>
            </div>

            <AnimatePresence mode="wait" custom={direction}>
                {mode === 'success' ? (
                    <motion.div
                        key="success"
                        custom={1}
                        variants={formVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="success-state"
                    >
                        <motion.div
                            className="success-icon"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
                        >
                            ✓
                        </motion.div>
                        <h2>Welcome aboard! 🎉</h2>
                        <p>
                            Your account has been created successfully.<br />
                            <strong style={{ color: '#a78bfa' }}>{successData?.name}</strong>, you're all set!
                        </p>
                        <button
                            className="submit-btn"
                            style={{ marginTop: '1.5rem' }}
                            onClick={() => switchTo('login')}
                        >
                            Sign in to your account →
                        </button>
                    </motion.div>
                ) : (
                    <motion.div key={mode} custom={direction} variants={formVariants} initial="enter" animate="center" exit="exit">
                        {/* Tab Switcher */}
                        <div className="tab-switcher">
                            <button
                                className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
                                onClick={() => switchTo('login')}
                            >
                                Sign In
                            </button>
                            <button
                                className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
                                onClick={() => switchTo('register')}
                            >
                                Create Account
                            </button>
                        </div>

                        {mode === 'login' ? (
                            <LoginForm onSwitchToRegister={() => switchTo('register')} />
                        ) : (
                            <RegisterForm
                                onSwitchToLogin={() => switchTo('login')}
                                onSuccess={handleRegisterSuccess}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
