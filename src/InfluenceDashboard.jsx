import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const InfluenceDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [userGoals, setUserGoals] = useState('');
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);

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
      {/* Welcome Popup Modal */}
      {showWelcomePopup && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>⚠️ Important: Google Sign-In Instructions</h2>
            <div style={styles.modalBody}>
              <p style={styles.modalText}>
                When you click "Connect YouTube & Analyze", you'll see a Google sign-in popup with a safety warning. 
                <strong> This is normal!</strong>
              </p>
              <div style={styles.instructionBox}>
                <h3 style={styles.instructionTitle}>Follow these steps:</h3>
                <ol style={styles.instructionList}>
                  <li>Google will show a warning screen saying the app is unverified</li>
                  <li>Look for the small <strong>"Advanced"</strong> link at the bottom</li>
                  <li>Click <strong>"Advanced"</strong></li>
                  <li>Click <strong>"Go to ABOVE_INFLUENCE (unsafe)"</strong></li>
                  <li>Grant the requested permissions (read-only YouTube access)</li>
                </ol>
              </div>
              <p style={styles.modalNote}>
                💡 <strong>Why this warning?</strong> The app is in development mode and not yet verified by Google. 
                Your data is safe - we only request read-only access and never store your information.
              </p>
            </div>
            <button 
              style={styles.modalButton}
              onClick={() => setShowWelcomePopup(false)}
            >
              Got it! Let's Start
            </button>
          </div>
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>ABOVE_INFLUENCE</h1>
          <p style={styles.subtitle}>Namaste 🙏</p>
        </div>
        
        <p style={styles.description}>
          We spend countless hours watching YouTube, often unaware of how the creators we subscribe to subtly shape our mindset, beliefs, and decisions. Are you consuming content that aligns with your goals, or are you being influenced without realizing it? Let's find out if your content diet actually supports your life goals.
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

        <div style={styles.infoSection}>
          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>🔒 Privacy & Security</h3>
            <p style={styles.infoText}>
              • Your data is <strong>never stored</strong> in any database<br/>
              • Analysis happens in real-time and is immediately discarded<br/>
              • Report is sent directly to <strong>your email only</strong><br/>
              • We only request <strong>read-only</strong> access to your YouTube data<br/>
              • <strong>Important:</strong> Since the report is sent from our Gmail account, we can technically access it through our sent emails. However, we respect your privacy and do not read individual reports.
            </p>
          </div>

          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>📋 How to Grant Access</h3>
            <p style={styles.infoText}>
              When the Google sign-in popup appears:<br/>
              1. You may see a warning screen<br/>
              2. Click the small <strong>"Advanced"</strong> button at the bottom<br/>
              3. Click <strong>"Go to ABOVE_INFLUENCE (unsafe)"</strong><br/>
              4. Grant the requested permissions<br/>
              <em style={styles.note}>This warning appears because the app is in development mode, not because it's actually unsafe.</em>
            </p>
          </div>

          <div style={styles.warningBox}>
            <h3 style={styles.warningTitle}>⚠️ Service Limitations</h3>
            <p style={styles.warningText}>
              • This service uses a <strong>free-tier n8n account</strong> (expires March 12, 2026)<br/>
              • Google Gemini AI has <strong>rate limits</strong> - usage is limited<br/>
              • If you don't receive a report immediately, please <strong>try again later</strong><br/>
              • Peak usage times may cause delays<br/>
              • <strong>Analysis Scope:</strong> The report analyzes your recent subscriptions and liked videos (latest 30 entries each). It may not capture your complete viewing history, but provides insights into your recent content consumption patterns and their relevance to your stated goals.
            </p>
          </div>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Built with the intention to help you become more conscious of your content consumption. 
            Take control of what influences your mind.
          </p>
          <p style={styles.githubLink}>
            <a href="https://github.com/VA-run23/Above_Influence" target="_blank" rel="noopener noreferrer" style={styles.link}>
              View on GitHub →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
    boxSizing: 'border-box',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '2rem',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    border: '2px solid #3b82f6',
  },
  modalTitle: {
    margin: '0 0 1.5rem 0',
    color: '#ea580c',
    fontSize: '1.5rem',
    fontWeight: '700',
    textAlign: 'center',
  },
  modalBody: {
    textAlign: 'left',
  },
  modalText: {
    color: '#475569',
    fontSize: '1rem',
    lineHeight: '1.7',
    marginBottom: '1.25rem',
  },
  instructionBox: {
    backgroundColor: '#eff6ff',
    border: '2px solid #3b82f6',
    borderRadius: '8px',
    padding: '1.25rem',
    marginBottom: '1.25rem',
  },
  instructionTitle: {
    margin: '0 0 1rem 0',
    color: '#1e40af',
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  instructionList: {
    margin: '0',
    paddingLeft: '1.5rem',
    color: '#334155',
    fontSize: '0.95rem',
    lineHeight: '1.8',
  },
  modalNote: {
    backgroundColor: '#fef3c7',
    border: '1px solid #fde047',
    borderRadius: '8px',
    padding: '1rem',
    color: '#475569',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    margin: '0',
  },
  modalButton: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    marginTop: '1.5rem',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
  },
  container: {
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff7ed',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '2rem 1rem',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '2.5rem 2rem',
    maxWidth: '720px',
    width: '100%',
    boxShadow: '0 20px 25px -5px rgba(249, 115, 22, 0.15), 0 8px 10px -6px rgba(59, 130, 246, 0.1)',
    textAlign: 'center',
    border: '1px solid #fed7aa',
    margin: '2rem auto',
  },
  header: {
    marginBottom: '1.5rem',
  },
  title: {
    margin: '0',
    color: '#3b82f6',
    fontSize: '2rem',
    fontWeight: '700',
    letterSpacing: '-0.025em',
  },
  subtitle: {
    margin: '0.5rem 0 0 0',
    color: '#ea580c',
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  description: {
    color: '#475569',
    fontSize: '1rem',
    lineHeight: '1.7',
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
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    height: '90px',
    padding: '0.875rem',
    borderRadius: '8px',
    border: '1px solid #fed7aa',
    backgroundColor: '#fff7ed',
    color: '#1e293b',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    resize: 'none',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '1rem 1.5rem',
    fontSize: '1.15rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3), 0 2px 4px -1px rgba(59, 130, 246, 0.2)',
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  statusBox: {
    marginTop: '1.5rem',
    padding: '1.125rem',
    background: 'linear-gradient(135deg, #fff7ed 0%, #eff6ff 100%)',
    borderRadius: '8px',
    border: '1px solid #fed7aa',
  },
  statusText: {
    margin: '0',
    color: '#ea580c',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  infoSection: {
    marginTop: '2rem',
    textAlign: 'left',
  },
  infoBox: {
    background: 'linear-gradient(135deg, #eff6ff 0%, #fff7ed 100%)',
    border: '1px solid #bfdbfe',
    borderRadius: '8px',
    padding: '1.25rem',
    marginBottom: '1rem',
  },
  warningBox: {
    background: 'linear-gradient(135deg, #fef3c7 0%, #ffedd5 100%)',
    border: '1px solid #fde047',
    borderRadius: '8px',
    padding: '1.25rem',
    marginBottom: '1rem',
  },
  infoTitle: {
    margin: '0 0 0.75rem 0',
    color: '#1e40af',
    fontSize: '1.05rem',
    fontWeight: '600',
  },
  warningTitle: {
    margin: '0 0 0.75rem 0',
    color: '#ea580c',
    fontSize: '1.05rem',
    fontWeight: '600',
  },
  infoText: {
    margin: '0',
    color: '#475569',
    fontSize: '0.925rem',
    lineHeight: '1.7',
  },
  warningText: {
    margin: '0',
    color: '#475569',
    fontSize: '0.925rem',
    lineHeight: '1.7',
  },
  note: {
    display: 'block',
    marginTop: '0.5rem',
    fontSize: '0.875rem',
    color: '#64748b',
    fontStyle: 'italic',
  },
  footer: {
    marginTop: '2rem',
    color: '#64748b',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '1.5rem',
  },
  footerText: {
    margin: '0 0 0.75rem 0',
    fontStyle: 'italic',
  },
  githubLink: {
    margin: '0',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s ease',
  }
};

export default InfluenceDashboard;