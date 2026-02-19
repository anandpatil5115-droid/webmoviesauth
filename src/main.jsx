import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0f0c29',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
          fontFamily: 'Inter, sans-serif',
          color: '#f1f5f9',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem' }}>⚠️</div>
          <h2 style={{ color: '#f87171', margin: 0 }}>Something went wrong</h2>
          <p style={{ color: 'rgba(241,245,249,0.6)', maxWidth: '400px', lineHeight: 1.6 }}>
            {this.state.error?.message?.includes('supabase') || this.state.error?.message?.includes('Invalid URL')
              ? 'Supabase environment variables are not configured. Please check your deployment settings.'
              : this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg,#7c3aed,#2563eb)',
              border: 'none',
              color: '#fff',
              padding: '0.7rem 1.5rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
            }}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
