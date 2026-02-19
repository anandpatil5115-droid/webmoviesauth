import React from 'react';

export default function SubmitButton({ loading, label, loadingLabel }) {
    return (
        <button
            type="submit"
            className="submit-btn"
            disabled={loading}
        >
            <span className="btn-content">
                {loading ? (
                    <>
                        <span className="spinner" />
                        {loadingLabel}
                    </>
                ) : (
                    label
                )}
            </span>
        </button>
    );
}
