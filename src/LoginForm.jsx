import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from './supabaseClient';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import FeedbackMessage from './FeedbackMessage';

export default function LoginForm({ onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null); // { type: 'error'|'success', message: '' }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback(null);

        // Basic validation
        if (!email.trim() || !password.trim()) {
            setFeedback({ type: 'error', message: 'Please fill in all fields.' });
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setFeedback({ type: 'error', message: 'Please enter a valid email address.' });
            return;
        }
        if (password.length < 6) {
            setFeedback({ type: 'error', message: 'Password must be at least 6 characters.' });
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            setFeedback({ type: 'success', message: `Welcome back! Signed in as ${data.user.email}` });
        } catch (err) {
            const msg = err.message === 'Invalid login credentials'
                ? 'Invalid email or password. Please try again.'
                : err.message || 'Sign in failed. Please try again.';
            setFeedback({ type: 'error', message: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <InputField
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon="✉"
                disabled={loading}
            />
            <InputField
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon="🔑"
                isPassword
                disabled={loading}
            />

            <SubmitButton loading={loading} label="Sign In" loadingLabel="Signing in…" />

            {feedback && (
                <FeedbackMessage type={feedback.type} message={feedback.message} />
            )}

            <p className="auth-footer">
                Don't have an account?{' '}
                <button type="button" onClick={onSwitchToRegister}>
                    Create one free →
                </button>
            </p>
        </form>
    );
}
