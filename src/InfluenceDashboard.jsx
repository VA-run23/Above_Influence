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
      setStatusMessage('⚠️ Service Unavailable: The free trial period has ended. This was a demo project built in 8 hours during a workshop. Check out the GitHub repository to learn how it was built and run it yourself!');
      return;

      // Original code (disabled)
      /*
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
      */
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
          <p style={styles.subtitle}>Namaste 🙏</p>
        </div>

        {/* Service Status Banner */}
        <div style={styles.statusBanner}>
          <h3 style={styles.statusBannerTitle}>🚧 Demo Project - Service Currently Offline</h3>
          <p style={styles.statusBannerText}>
            This application was built in <strong>8 hours</strong> as part of a one-week workshop to demonstrate rapid development using modern tools. The free trial period for the backend service (n8n) has ended, so the analysis feature is currently unavailable.
          </p>
          <p style={styles.statusBannerText}>
            <strong>Good news:</strong> You can still explore how it works and even run it yourself! Check out the workflow diagram below and visit our GitHub repository for the complete setup guide.
          </p>
        </div>
        
        <p style={styles.description}>
          We spend countless hours watching YouTube, often unaware of how the creators we subscribe to subtly shape our mindset, beliefs, and decisions. Are you consuming content that aligns with your goals, or are you being influenced without realizing it? This tool was designed to help you find out if your content diet actually supports your life goals.
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
          onClick={() => {
            setStatusMessage('⚠️ Service Unavailable: The free trial period has ended (March 12, 2026). This was a demo project built in 8 hours during a workshop. Check out the GitHub repository to learn how it was built and run it yourself!');
          }} 
          disabled={false}
          style={styles.button}
        >
          Connect YouTube & Analyze (Demo Only)
        </button>

        {statusMessage && (
          <div style={styles.statusBox}>
            <p style={styles.statusText}>{statusMessage}</p>
          </div>
        )}

        <div style={styles.infoSection}>
          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>🔧 How It Works - The Technology Behind It</h3>
            <p style={styles.infoText}>
              This app connects to your YouTube account, looks at what channels you follow and what videos you've liked, then uses AI to analyze whether your viewing habits match your personal goals. Think of it as a health check for your content diet!
            </p>
            <p style={styles.infoText}>
              <strong>The Process (in simple terms):</strong><br/>
              1️⃣ You tell us your goals (like "get fit" or "learn coding")<br/>
              2️⃣ We check your YouTube subscriptions and liked videos<br/>
              3️⃣ AI analyzes if the content helps or distracts from your goals<br/>
              4️⃣ You get a detailed report via email with recommendations
            </p>
            <div style={styles.workflowMainImageBox}>
              <h4 style={styles.workflowImageTitle}>Technical Workflow Diagram:</h4>
              <img 
                src="/WorkFlowDiagram1.jpg" 
                alt="n8n Workflow Architecture Diagram showing 13 connected nodes" 
                style={styles.workflowMainImage}
              />
              <p style={styles.imageCaption}>
                <strong>For developers:</strong> This workflow uses n8n automation with 13 nodes: Webhook → YouTube API calls → 3-tier AI fallback system (Gemini models) → Markdown formatting → Gmail delivery. The intelligent fallback ensures 99%+ success rate even with API rate limits.
              </p>
            </div>
            <div style={styles.githubCallout}>
              <p style={styles.githubCalloutText}>
                💡 <strong>Want to run this yourself or learn how it was built?</strong>
              </p>
              <a 
                href="https://github.com/VA-run23/Above_Influence" 
                target="_blank" 
                rel="noopener noreferrer"
                style={styles.githubCalloutButton}
              >
                📂 View Complete Guide on GitHub
              </a>
              <p style={styles.smallText}>
                Includes: Setup instructions, workflow JSON files, API configuration guide, and troubleshooting tips
              </p>
            </div>
          </div>

          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>🔒 Privacy & Security (Your Data is Safe)</h3>
            <p style={styles.infoText}>
              • <strong>Nothing is saved:</strong> Your data is never stored in any database<br/>
              • <strong>Real-time only:</strong> Analysis happens instantly and is immediately deleted<br/>
              • <strong>Email only:</strong> Report goes directly to your inbox<br/>
              • <strong>Read-only access:</strong> We can only view your subscriptions and likes, not modify anything<br/>
              • <strong>Transparency:</strong> Since reports are sent from our Gmail, we could technically see them in sent emails, but we respect your privacy and don't read them
            </p>
          </div>

          <div style={styles.warningBox}>
            <h3 style={styles.warningTitle}>⚠️ Current Status & Limitations</h3>
            <p style={styles.warningText}>
              • <strong>Service Offline:</strong> The free trial for n8n (the automation tool) expired on March 12, 2026<br/>
              • <strong>Demo Project:</strong> This was built in 8 hours during a workshop to show what's possible with modern tools<br/>
              • <strong>You Can Still Use It:</strong> Follow the GitHub guide to set up your own instance with your API keys<br/>
              • <strong>Learning Resource:</strong> Perfect for understanding how to build AI-powered apps quickly
            </p>
          </div>

          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>🎓 Project Background</h3>
            <p style={styles.infoText}>
              This project was created during a one-week skill development workshop (Feb 23-28, 2026). The idea had been sitting around for months because it seemed too complex - requiring weeks of coding, training AI models, and building infrastructure.
            </p>
            <p style={styles.infoText}>
              <strong>Then we discovered n8n</strong> (a no-code automation tool) and everything changed. What seemed impossible became reality in just 8 hours:
            </p>
            <p style={styles.infoText}>
              ✅ 4 hours: Initial build<br/>
              ✅ 4 hours: Improvements and refinements<br/>
              ✅ Zero prior n8n experience<br/>
              ✅ Production-ready with intelligent error handling
            </p>
            <p style={styles.infoText}>
              <strong>The lesson:</strong> Modern tools can turn months-old ideas into working products in hours. Don't let technical complexity kill good ideas!
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '1rem',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  workflowModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '1.5rem',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    border: '3px solid #ef4444',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    color: '#64748b',
    cursor: 'pointer',
    width: '2rem',
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    fontWeight: '400',
    lineHeight: '1',
  },
  skipButton: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 1.25rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    marginTop: '0.75rem',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
  },
  workflowModalTitle: {
    margin: '0 0 0.75rem 0',
    color: '#dc2626',
    fontSize: '1.3rem',
    fontWeight: '700',
    textAlign: 'center',
  },
  compactText: {
    color: '#475569',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    marginBottom: '0.75rem',
    textAlign: 'center',
  },
  compactTitle: {
    margin: '0 0 0.5rem 0',
    color: '#1e40af',
    fontSize: '0.95rem',
    fontWeight: '600',
  },
  compactInstructionBox: {
    backgroundColor: '#eff6ff',
    border: '1px solid #3b82f6',
    borderRadius: '6px',
    padding: '0.75rem',
    marginBottom: '0.75rem',
    textAlign: 'center',
  },
  compactGithubButton: {
    display: 'inline-block',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.875rem',
    marginTop: '0.5rem',
    transition: 'background-color 0.2s ease',
  },
  workflowImageBox: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '0.75rem',
    marginBottom: '0.75rem',
    textAlign: 'center',
  },
  workflowImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    marginTop: '0.5rem',
  },
  workflowMainImageBox: {
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    padding: '1rem',
    marginTop: '1rem',
    textAlign: 'center',
  },
  workflowImageTitle: {
    margin: '0 0 0.75rem 0',
    color: '#334155',
    fontSize: '1rem',
    fontWeight: '600',
  },
  workflowMainImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
  },
  imageCaption: {
    fontSize: '0.85rem',
    color: '#64748b',
    marginTop: '0.75rem',
    fontStyle: 'italic',
    lineHeight: '1.5',
    textAlign: 'left',
  },
  githubCallout: {
    backgroundColor: '#eff6ff',
    border: '2px solid #3b82f6',
    borderRadius: '8px',
    padding: '1.25rem',
    marginTop: '1.25rem',
    textAlign: 'center',
  },
  githubCalloutText: {
    margin: '0 0 1rem 0',
    color: '#1e40af',
    fontSize: '1rem',
    fontWeight: '600',
  },
  githubCalloutButton: {
    display: 'inline-block',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '0.875rem 1.75rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
  },
  githubButton: {
    display: 'inline-block',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    marginTop: '0.75rem',
    marginBottom: '0.75rem',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
  },
  smallText: {
    fontSize: '0.875rem',
    color: '#64748b',
    margin: '0.5rem 0 0 0',
    lineHeight: '1.5',
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
  statusBanner: {
    background: 'linear-gradient(135deg, #fef3c7 0%, #ffedd5 100%)',
    border: '2px solid #f59e0b',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    textAlign: 'left',
  },
  statusBannerTitle: {
    margin: '0 0 0.75rem 0',
    color: '#ea580c',
    fontSize: '1.15rem',
    fontWeight: '700',
  },
  statusBannerText: {
    margin: '0 0 0.75rem 0',
    color: '#475569',
    fontSize: '0.95rem',
    lineHeight: '1.7',
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
    backgroundColor: '#94a3b8',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '1rem 1.5rem',
    fontSize: '1.15rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(148, 163, 184, 0.3), 0 2px 4px -1px rgba(148, 163, 184, 0.2)',
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  statusBox: {
    marginTop: '1.5rem',
    padding: '1.25rem',
    background: 'linear-gradient(135deg, #fef3c7 0%, #ffedd5 100%)',
    borderRadius: '8px',
    border: '2px solid #f59e0b',
  },
  statusText: {
    margin: '0',
    color: '#ea580c',
    fontSize: '1rem',
    fontWeight: '600',
    lineHeight: '1.6',
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