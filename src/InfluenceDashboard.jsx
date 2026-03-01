import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const InfluenceDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [userGoals, setUserGoals] = useState('');

  // Fetch n8n webhook URL from environment variables
  const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  if (!n8nWebhookUrl) {
    console.error('ERROR: VITE_N8N_WEBHOOK_URL is not defined in .env file');
  }
  
  const handleGoogleLogin = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/youtube.readonly email',
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setStatusMessage('Authenticating securely...');

      try {
        const accessToken = tokenResponse.access_token;

        const userInfoRes = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const userEmail = userInfoRes.data.email;

        setStatusMessage('AI is analyzing your YouTube diet against your goals...');

        // POST token, email, and user goals to n8n webhook
        await axios.post(n8nWebhookUrl, {
          accessToken: accessToken,
          userEmail: userEmail,
          userGoals: userGoals || 'No specific goals provided.'
        });

        setStatusMessage(`Report dispatched to ${userEmail}. Check your inbox!`);
      } catch (error) {
        console.error('Error triggering webhook:', error);
        setStatusMessage('Failed to trigger analysis. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      setStatusMessage('Authentication failed. Please grant required permissions.');
    },
  });

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>ABOVE_INFLUENCE</h1>
        </div>
        
        <p style={styles.description}>
          We spend countless hours watching YouTube, often unaware of how the creators we subscribe to subtly shape our mindset. Let's find out if your content diet actually supports your life goals.
        </p>

        <div style={styles.inputGroup}>
          <label style={styles.label}>What are your current primary goals?</label>
          <textarea 
            style={styles.textarea}
            value={userGoals}
            onChange={(e) => setUserGoals(e.target.value)}
            placeholder="e.g., I want to become a better software engineer, start a business, and improve my physical fitness."
            disabled={isLoading}
          />
        </div>

        <button 
          onClick={() => handleGoogleLogin()} 
          disabled={isLoading}
          style={isLoading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
        >
          {isLoading ? 'Processing Request...' : 'Connect YouTube & Analyze'}
        </button>

        {statusMessage && (
          <div style={styles.statusBox}>
            <p style={styles.statusText}>{statusMessage}</p>
          </div>
        )}

        <div style={styles.footer}>
          <p><strong>Secure & Private:</strong> We request read-only access. Your data is analyzed temporarily and is never stored on any database.</p>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff7ed',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '1rem',
    boxSizing: 'border-box',
    position: 'absolute',
    top: 0,
    left: 0
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '2.5rem 2rem',
    maxWidth: '480px',
    width: '100%',
    boxShadow: '0 20px 25px -5px rgba(234, 88, 12, 0.1), 0 8px 10px -6px rgba(234, 88, 12, 0.05)',
    textAlign: 'center',
    border: '1px solid #ffedd5',
  },
  header: {
    marginBottom: '1.5rem',
  },
  title: {
    margin: '0',
    color: '#ea580c',
    fontSize: '1.75rem',
    fontWeight: '700',
    letterSpacing: '-0.025em',
  },
  description: {
    color: '#475569',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    marginBottom: '1.5rem',
    textAlign: 'left',
  },
  inputGroup: {
    textAlign: 'left',
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
  },
  textarea: {
    width: '100%',
    height: '80px',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #fed7aa',
    backgroundColor: '#fff7ed',
    color: '#1e293b',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    resize: 'none',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    backgroundColor: '#f97316',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.875rem 1.5rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.2), 0 2px 4px -1px rgba(249, 115, 22, 0.1)',
  },
  buttonDisabled: {
    backgroundColor: '#fdba74',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  statusBox: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#fff7ed',
    borderRadius: '8px',
    border: '1px solid #fed7aa',
  },
  statusText: {
    margin: '0',
    color: '#9a3412',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  footer: {
    marginTop: '2rem',
    color: '#64748b',
    fontSize: '0.75rem',
    lineHeight: '1.4',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '1.5rem',
  }
};

export default InfluenceDashboard;