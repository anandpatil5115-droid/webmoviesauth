import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import FeedbackMessage from './FeedbackMessage';

export default function RegisterForm({ onSwitchToLogin, onSuccess }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const validate = () => {
        if (!name.trim()) return 'Please enter your full name.';
        if (name.trim().length < 2) return 'Name must be at least 2 characters.';
        if (!email.trim()) return 'Please enter your email address.';
        if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address.';
        if (!password) return 'Please enter a password.';
        if (password.length < 8) return 'Password must be at least 8 characters.';
        if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
        if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback(null);

        const validationError = validate();
        if (validationError) {
            setFeedback({ type: 'error', message: validationError });
            return;
        }

        setLoading(true);
        try {
            // 1. Create Supabase auth user
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: name.trim() } },
            });
            if (signUpError) throw signUpError;

            const userId = data.user?.id;
            if (!userId) throw new Error('User creation failed. Please try again.');

            // 2. Insert profile into users table
            const { error: insertError } = await supabase.from('users').insert({
                id: userId,
                name: name.trim(),
                email: email.toLowerCase().trim(),
                created_at: new Date().toISOString(),
            });

            // Insert error is non-blocking — the auth account is already created
            if (insertError) {
                console.warn('Profile insert warning:', insertError.message);
            }

            onSuccess({ name: name.trim(), email });
        } catch (err) {
            const msg = err.message?.includes('already registered') || err.message?.includes('already been registered')
                ? 'This email is already registered. Try signing in instead.'
                : err.message || 'Registration failed. Please try again.';
            setFeedback({ type: 'error', message: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <InputField
                label="Full Name"
                type="text"
                placeholder="John Appleseed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon="👤"
                disabled={loading}
            />
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
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon="🔑"
                isPassword
                disabled={loading}
            />

            <SubmitButton loading={loading} label="Create Account" loadingLabel="Creating account…" />

            {feedback && (
                <FeedbackMessage type={feedback.type} message={feedback.message} />
            )}

            <p className="auth-footer">
                Already have an account?{' '}
                <button type="button" onClick={onSwitchToLogin}>
                    Sign in →
                </button>
            </p>
        </form>
    );
}
