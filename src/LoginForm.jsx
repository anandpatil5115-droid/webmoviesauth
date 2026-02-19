import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabaseClient';
import InputField from './InputField';
import FeedbackMessage from './FeedbackMessage';

export default function LoginForm({ onSwitchToRegister, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [shakeKey, setShakeKey] = useState(0); // increment to re-trigger shake

    const triggerShake = useCallback(() => {
        setShakeKey((k) => k + 1);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback(null);

        // Basic validation
        if (!email.trim() || !password.trim()) {
            setFeedback({ type: 'error', message: 'Please fill in all fields.' });
            triggerShake();
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setFeedback({ type: 'error', message: 'Please enter a valid email address.' });
            triggerShake();
            return;
        }
        if (password.length < 6) {
            setFeedback({ type: 'error', message: 'Password must be at least 6 characters.' });
            triggerShake();
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            // ✅ Auth successful — trigger success animation sequence
            setLoginSuccess(true);
            setFeedback({ type: 'success', message: `Welcome back! Signed in as ${data.user.email}` });

            // Wait for success animation, then tell parent to start page dissolve
            setTimeout(() => {
                onLoginSuccess();
            }, 700);

        } catch (err) {
            const msg =
                err.message === 'Invalid login credentials'
                    ? 'Invalid email or password. Please try again.'
                    : err.message || 'Sign in failed. Please try again.';
            setFeedback({ type: 'error', message: msg });
            triggerShake();
        } finally {
            if (!loginSuccess) setLoading(false);
        }
    };

    return (
        <motion.form
            key={shakeKey}
            onSubmit={handleSubmit}
            noValidate
            animate={
                shakeKey > 0
                    ? { x: [0, -10, 10, -8, 8, -4, 4, 0] }
                    : { x: 0 }
            }
            transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
            <InputField
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon="✉"
                disabled={loading || loginSuccess}
                error={feedback?.type === 'error'}
            />
            <InputField
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon="🔑"
                isPassword
                disabled={loading || loginSuccess}
                error={feedback?.type === 'error'}
            />

            {/* Animated Submit Button */}
            <motion.button
                type="submit"
                className={`submit-btn${loginSuccess ? ' submit-btn--success' : ''}`}
                disabled={loading || loginSuccess}
                whileHover={!loading && !loginSuccess ? { scale: 1.015, y: -2 } : {}}
                whileTap={!loading && !loginSuccess ? { scale: 0.99 } : {}}
                animate={loginSuccess ? { scale: [1, 1.04, 1] } : {}}
                transition={{ duration: 0.3 }}
            >
                <span className="btn-content">
                    {loginSuccess ? (
                        <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                            className="btn-success-check"
                        >
                            ✓ Authenticated!
                        </motion.span>
                    ) : loading ? (
                        <>
                            <span className="spinner" />
                            Signing in…
                        </>
                    ) : (
                        'Sign In'
                    )}
                </span>
            </motion.button>

            <AnimatePresence mode="wait">
                {feedback && (
                    <FeedbackMessage key={feedback.message} type={feedback.type} message={feedback.message} />
                )}
            </AnimatePresence>

            {!loginSuccess && (
                <p className="auth-footer">
                    Don't have an account?{' '}
                    <button type="button" onClick={onSwitchToRegister}>
                        Create one free →
                    </button>
                </p>
            )}
        </motion.form>
    );
}
