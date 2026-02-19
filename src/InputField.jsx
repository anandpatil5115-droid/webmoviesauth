import React, { useState } from 'react';

export default function InputField({
    label,
    type,
    placeholder,
    value,
    onChange,
    icon,
    isPassword = false,
    disabled = false,
}) {
    const [showPw, setShowPw] = useState(false);
    const inputType = isPassword ? (showPw ? 'text' : 'password') : type;

    return (
        <div className="form-group">
            <label className="form-label">{label}</label>
            <div className="input-wrapper">
                <span className="input-icon">{icon}</span>
                <input
                    className={`form-input${isPassword ? ' has-toggle' : ''}`}
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    autoComplete={type === 'email' ? 'email' : isPassword ? 'current-password' : 'name'}
                    spellCheck={false}
                />
                <span className="input-focus-line" />
                {isPassword && (
                    <button
                        type="button"
                        className="toggle-pw"
                        aria-label={showPw ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPw((s) => !s)}
                        tabIndex={-1}
                    >
                        {showPw ? '🙈' : '👁'}
                    </button>
                )}
            </div>
        </div>
    );
}
